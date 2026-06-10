// CF Pages Functions middleware — wraps every request with caches.default
// so HTML responses are cached at the CF Edge without zone-level Cache
// Rules. Fleet pattern; matches the Workers worker.mjs wrapper in spirit
// but uses the Pages Functions API instead.
//
// Without this, Pages returns `cf-cache-status: DYNAMIC` on HTML
// regardless of the Cache-Control headers in _headers — the edge
// refuses to cache HTML by default.

interface Env {
  ASSETS?: { fetch: (req: Request) => Promise<Response> };
}

// Minimal local typings for the Pages Functions runtime so `astro check`
// passes without pulling in @cloudflare/workers-types.
interface PagesContext<E> {
  request: Request;
  env: E;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}
type PagesFunction<E> = (context: PagesContext<E>) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;

  if (request.method !== "GET") {
    return context.next();
  }

  const url = new URL(request.url);
  // Only cache HTML routes. Skip assets, API, etc.
  if (
    url.pathname.startsWith("/_astro/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".")
  ) {
    // Asset paths — let Pages handle directly (already cached).
    return context.next();
  }

  // Workers runtime exposes `caches.default`; lib.dom's CacheStorage doesn't.
  const cache = (caches as unknown as { default: Cache }).default;
  // Bypass + evict the cache entry when the client explicitly asks for a
  // fresh copy (Cache-Control: no-cache or Pragma: no-cache). Lets us
  // invalidate stale worker-cache entries after deploys without waiting
  // for s-maxage to expire — `purge_cache` on the zone only clears the
  // CDN layer, not `caches.default`.
  const cc = request.headers.get("cache-control") ?? "";
  const pragma = request.headers.get("pragma") ?? "";
  const wantsFresh =
    cc.includes("no-cache") || cc.includes("no-store") || pragma.includes("no-cache");

  if (!wantsFresh) {
    const cached = await cache.match(request);
    if (cached) {
      const hit = new Response(cached.body, cached);
      hit.headers.set("x-edge-cache", "HIT");
      return hit;
    }
  } else {
    // Best-effort eviction — failures are non-fatal.
    context.waitUntil(cache.delete(request).catch(() => {}));
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status !== 200 || !contentType.includes("text/html")) {
    return response;
  }

  const body = await response.arrayBuffer();
  const headers = new Headers(response.headers);
  headers.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  );

  const cacheable = new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
  context.waitUntil(cache.put(request, cacheable.clone()));

  const clientResponse = new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
  clientResponse.headers.set("x-edge-cache", "MISS");
  return clientResponse;
};
