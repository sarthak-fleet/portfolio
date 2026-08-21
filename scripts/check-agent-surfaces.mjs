import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://sarthakagrawal.dev';

const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const url = new URL(match[1]);
  return url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
});
const catalog = JSON.parse(
  await readFile(path.join(DIST, 'api', 'ai'), 'utf8')
);

assert.equal(catalog.name, 'Sarthak Agrawal');
assert.equal(catalog.url, ORIGIN);
assert.equal(catalog.llms, `${ORIGIN}/llms.txt`);
assert.equal(catalog.llmsFull, `${ORIGIN}/llms-full.txt`);
assert.equal(catalog.surfaces.length, routes.length);

const catalogRoutes = new Set(
  catalog.surfaces.map((surface) => new URL(surface.url).pathname)
);
for (const route of routes) {
  const normalizedRoute = route === '/' ? '/' : route;
  assert.ok(
    catalogRoutes.has(normalizedRoute),
    `${route} is missing from /api/ai`
  );

  const markdownPath = route === '/' ? 'index.md' : `${route.slice(1)}.md`;
  await access(path.join(DIST, markdownPath));
}

const fullCorpus = await readFile(path.join(DIST, 'llms-full.txt'), 'utf8');
for (const surface of catalog.surfaces) {
  assert.match(
    fullCorpus,
    new RegExp(`Source page: ${escapeRegex(surface.url)}`)
  );
}

console.log(
  `agent surfaces verified: ${routes.length} sitemap routes, ${catalog.surfaces.length} catalog entries, ${routes.length} Markdown counterparts`
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
