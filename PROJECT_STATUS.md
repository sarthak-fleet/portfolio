# sarthakagrawal — PROJECT STATUS

Last updated: 2026-07-16

## Why / What

sarthakagrawal.dev is a personal Astro portfolio site for Sarthak Agrawal. It is a static Cloudflare Pages site presenting AI infrastructure and product engineering work through an interactive terminal hero, architecture visuals, case studies, GitHub-sourced project archive, resume, about page, and future writing surface.

**Users:** Visitors browsing portfolio/case studies; Sarthak as content owner updating `src/data/` and MDX collections.

**Constraints:** Fully static — no backend, auth, or database. React islands hydrate selectively; most pages ship near-zero JS. Phone number intentionally absent from public web resume.

**IN scope:** Astro 5 static site, terminal hero, architecture diagram island, case studies, fleet products page, resume HTML + PDF workflow, command palette, sitemap/OG/llms.txt.

**OUT of scope:** Manual project archive maintenance (build-time GitHub fetch is intended path), broad marketing rewrites, `/blog` as active writing surface until first post lands.

## Dependencies

### External

- **GitHub API:** Build-time repo stats and project archive across `sarthakagrawal927` plus the six product organizations in `src/data/site.ts`. Optional `GITHUB_TOKEN` on Cloudflare Pages builds for API rate limits.
- **Cloudflare Pages:** Static hosting; project name `sarthakagrawal` (`pages_build_output_dir: dist`).
- **LaTeX GitHub Action:** Resume PDF generation on push (`.github/workflows/resume.yml`).

### Internal (fleet)

- **Fleet product data:** `src/data/fleet-products.ts` — curated shipped products on owned domains.

### Stack & commands

**Stack:** Astro 5 static · Tailwind v4 (`@tailwindcss/vite`) · Lightning CSS transformer/minifier · React 19 islands (`motion`, `cmdk`) · MDX collections (`work`, `blog`) · `@fontsource-variable/geist` · `@astrojs/sitemap`.

| Command | Purpose |
| --- | --- |
| `npm install` | Install deps |
| `npm run dev` | http://localhost:4321 |
| `npm run build` | static build → dist/ |
| `npm run preview` | serve production build locally |
| `npm run check` | astro check (types) |

Node pinned in `.nvmrc` (22). Deploy via Cloudflare Pages connected to repo or `wrangler pages deploy dist`.

**Env:** Optional `GITHUB_TOKEN` on Cloudflare Pages builds for API rate limits. Config: `wrangler.jsonc` · `astro.config.mjs` · `resume.tex`.

**Entrypoints:** `src/data/*.ts` · `src/content/work/*.mdx` · `src/content/blog/` · `src/lib/github.ts`.

Performance choices: inline all stylesheets (psi-swarm LCP fix); `build.format: 'file'` avoids trailing-slash 308 redirects on Pages; prefetch viewport strategy.

## Timeline

- **2026-07-17 — Focused homepage:** Reduced the landing page to one professional thesis, the five active core products, and selected production case studies. Moved repository breadth, architecture exploration, expertise detail, and career history off the homepage to their dedicated routes.
- **Perf pass:** Inline critical CSS (`inlineStylesheets: 'always'`) — psi-swarm LCP fix; Lightning CSS pipeline (fleet VoidZero standard).
- **Domain live:** `https://sarthakagrawal.dev` in config and site data.

## Products

| Surface | URL |
| --- | --- |
| Primary site | `https://sarthakagrawal.dev` |
| Canonical config | `astro.config.mjs` `site` + `src/data/site.ts` `url` |
| Sitemap | Generated via `@astrojs/sitemap` |
| LLM index | `public/llms.txt` |
| Resume PDF | `https://sarthakagrawal.dev/resume.pdf` (after GitHub Action runs) |

Cloudflare Pages project name: `sarthakagrawal` (`pages_build_output_dir: dist`).

## Features (shipped)

### Architecture

- Build time: Astro 5 static compiles `src/data/*.ts`, MDX case studies/blog, optional GitHub API fetch (`src/lib/github.ts`).
- Static `dist/` with `inlineStylesheets: always`, `format: file` → Cloudflare Pages (`pages_build_output_dir: dist`).
- Live site: `https://sarthakagrawal.dev` — no server runtime.
- React 19 islands hydrate selectively: terminal hero, command palette (`cmdk`), editable architecture diagram (`motion`).
- Resume PDF: `resume.tex` → GitHub Action → `public/resume.pdf`.
- OG/meta via `src/components/astro/Head.astro`; sitemap via `@astrojs/sitemap`.
- No auth, database, or dynamic API routes.

### Site shell & perf

- Astro 5 static site with Tailwind v4, React islands, MDX collections.
- Lightning CSS pipeline (fleet VoidZero standard).
- Inline critical CSS (`inlineStylesheets: 'always'`).
- Domain `https://sarthakagrawal.dev` in config and site data.
- Sitemap, OG/meta via `src/components/astro/Head.astro`.
- `public/llms.txt` for LLM crawlers.

### Pages & routes

- `/` — focused hero, five current core products, and selected production case studies.
- `/work/[slug]` — MDX engineering case studies (vector feeds, pipelines, RAG agents, durable workflows).
- `/projects` — curated fleet products on owned domains + GitHub archive link.
- `/about` — bio, experience timeline, education, toolbox.
- `/resume` — on-site HTML résumé + Download PDF button.
- `/blog` — placeholder until first `.mdx` post lands.
- `/privacy`, `/terms`, `/404`.

### Interactive features

- Terminal hero React island.
- ⌘K command palette (`cmdk`) wired to `navLinks`.
- Architecture diagram island with shareable URL state and mailto-based recommendation submission.

### Content & data

- Editable locations documented: `src/data/site.ts`, experience, resume, expertise, socials, fleet-products, case studies, blog.
- GitHub project stats and repositories fetched across the personal account and six active product organizations, with graceful fallback when no token is configured.

### Resume PDF

- `resume.tex` source; GitHub Action workflow documented.
- Local fallback path documented in README.

## Todo / Planned / Deferred / Blocked

### Planned

1. Push the resume workflow when ready so `public/resume.pdf` is generated by the GitHub Action.
2. Optionally convert `public/og.svg` to `public/og.png` and point social image metadata at the PNG for richer previews.
3. Add real blog posts before changing `/blog` from placeholder to a writing surface.
4. Keep public project stats resilient to GitHub API rate limits with optional `GITHUB_TOKEN` on Cloudflare Pages builds.

### Deferred

- Manual project archive maintenance; build-time GitHub fetch is the intended path.
- Phone number intentionally absent from public web resume unless a later content decision changes that.
- Broad marketing-site rewrites unless professional positioning changes.
- `public/resume.pdf` may not exist until the resume GitHub Action runs on push.
- `/blog` remains a placeholder with no published posts.
- OG image still SVG; richer social previews need PNG conversion.
- GitHub API rate limits can affect build-time project stats without `GITHUB_TOKEN`.

### Blocked

- (none)
