# sarthakagrawal.dev

Personal site & portfolio for **Sarthak Agrawal — AI Infrastructure & Product
Engineer**. *I build AI infrastructure — and the products that run on it.*

A dark, "systems" aesthetic built to make one thing obvious: this person builds
AI infrastructure and ships the products that use it. Interactive terminal hero,
an animated distributed-architecture diagram, a ⌘K command palette, engineering
case studies framed as systems, and a live GitHub-sourced projects archive.

> This site is managed by AI agents.

## Stack

- **[Astro 5](https://astro.build)** — static output, ships ~zero JS by default
- **Tailwind CSS v4** — via the `@tailwindcss/vite` plugin; tokens in `src/styles/global.css`
- **React 19 islands** — only the command palette & terminal hero hydrate
- **MDX content collections** — case studies (`work`) and writing (`blog`)
- **`motion` + `cmdk`** — animation primitives & the command menu
- Deployed on **Cloudflare Pages**

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static build → dist/
npm run preview  # serve the production build
npm run check    # type-check
```

Node version is pinned in `.nvmrc` (22).

## Pages

| Route | What |
|---|---|
| `/` | Hero, stats, architecture diagram, case studies, open-source teaser, expertise, timeline |
| `/work/[slug]` | Engineering case studies (real work — vector feeds, real-time pipeline, RAG agents, durable workflows) |
| `/projects` | Every public repo, auto-synced from GitHub at build, ranked by stars |
| `/about` | Bio, full experience timeline, education, toolbox |
| `/resume` | On-site résumé + "Download PDF" |
| `/blog` | "Coming soon" — flips to a post list when the first `.mdx` lands |

## Editing content

Everything you'd want to change lives in a few files:

| What | Where |
|---|---|
| Name, role, tagline, email, availability | `src/data/site.ts` |
| Work history / timeline | `src/data/experience.ts` |
| Full résumé content | `src/data/resume.ts` |
| Expertise panels | `src/data/expertise.ts` |
| Social links | `src/data/socials.ts` |
| Case studies | `src/content/work/*.mdx` |
| About-page toolbox | `src/pages/about.astro` |
| Blog posts | drop `.mdx` into `src/content/blog/` |

The `/projects` page and home stats pull from the GitHub API at build time
(`src/lib/github.ts`) — no manual upkeep.

## Résumé → PDF

`resume.tex` is the source of truth. A GitHub Action
(`.github/workflows/resume.yml`) compiles it to `public/resume.pdf` on every
push that touches it — no local LaTeX install needed. The `/resume` page shows
a "Download PDF" button once that file exists (after the first push to GitHub).

To preview the PDF locally before pushing, compile `resume.tex` any way you like
(e.g. [Overleaf](https://overleaf.com)) and drop the result at
`public/resume.pdf`.

> Note: the phone number is in the PDF but intentionally **not** on the public
> `/resume` web page. Add it in `src/pages/resume.astro` if you want it shown.

## Before going live

- [ ] Set the real domain in `astro.config.mjs` (`site`) and `src/data/site.ts` (`url`)
- [ ] Push to GitHub so the résumé Action generates `public/resume.pdf`
- [ ] Optional: convert `public/og.svg` → `og.png` for the richest social
      previews — `npx svgexport public/og.svg public/og.png 1200:630`, then
      point `image` in `src/components/astro/Head.astro` at `/og.png`

## Deploy — Cloudflare Pages

Static site (`output: 'static'`) — deployment is just static assets.

**Dashboard:** create a Pages project from the Git repo with:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22` (auto-detected from `.nvmrc`)

**CLI:** `npx wrangler pages deploy dist` (config is in `wrangler.jsonc`).

Optional: set a `GITHUB_TOKEN` build env var to raise the GitHub API rate limit
used by the build-time stats & projects list (it falls back gracefully without
one).
