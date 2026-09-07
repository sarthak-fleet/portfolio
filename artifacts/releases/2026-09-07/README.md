# Personal site public selection release — 2026-09-07

## Source, checks and deployment

- Deployed source `568ab963f33917e2fd8f946851ed2f74bf62c7c0` changes only `src/data/fleet-public.json`, synchronized through the existing script from SaaS Maker's privacy-filtered public projection (parent revision `6508136d`). `npm run catalog:check-public` confirms all 21 entries match.
- `npm run test:contract` passed four tests. Full `npm run quality` passed format/lint/types, eight tests, 100% coverage of the existing GitHub-core target, static build, 13 agent/Markdown/sitemap surfaces and every repository health ratchet. Existing accepted dependency findings remain recorded by the repo gate; no packages changed.
- [Exact source CI 34130049244](https://github.com/sarthakagrawal927/portfolio/actions/runs/34130049244) passed before release.
- [Authorized manual deployment 34130129691](https://github.com/sarthakagrawal927/portfolio/actions/runs/34130129691) passed, including the actual Cloudflare Pages upload step. The missing-token skip step was skipped. No local fallback or credential change was needed.
- Provider confirmed production/main deployment `80d37be0-94f9-49da-b45d-b725f7fe08c5`, source `568ab96`: https://80d37be0.sarthakagrawal.pages.dev. Canonical public origin is https://sarthakagrawal.dev.

## Ordinary hosted guest acceptance

Fresh isolated Chromium at desktop 1440×1000 and mobile 390×844 verified:

- Homepage names CodeVetter and PostTrainLLM as the primary focus. The public spotlight contains only PostTrainLLM and SaaS Maker, with the working-experiment description and directory link. The former Pace flagship copy is absent from the current-focus section.
- Projects reports 21 shareable entries; every name matches the canonical public selection. Chess and Journal are absent from the page. CodeVetter, Anchor, DRank, Free AI, Knowledge Base, TrueHire, Karte and AliveVille are not promoted as project cards. CodeVetter's contextual primary-focus mention is deliberate and distinct from a public project link.
- Desktop primary navigation opens Projects and About. On mobile, the hydrated command menu opens both routes. Project cards expose the correct public links, including the newly qualified Mashup showcase.
- Document widths match both viewports; mobile homepage and project-card screenshots were visually inspected. No account actions, contact messages, provider-data writes or private-profile browsing occurred.

[Machine assertions](hosted-proof.json) · [Desktop homepage](home-1440.png) · [Mobile homepage](home-390.png) · [Desktop project cards](projects-1440.png) · [Mobile project cards](projects-390.png).

## Rollback and limits

The retained prior production deployment is `1b5416b8-260c-4190-84c4-5abc5fde4e9d`, source `1919ca6cb21a656270aae7087d6d9c83e9d42d9a`, at https://1b5416b8.sarthakagrawal.pages.dev. If needed, use Cloudflare Pages → sarthakagrawal → Deployments → that production row → Rollback to this deployment. No rollback was needed or performed.

This qualifies the current personal homepage, curated directory and guest navigation. Historical case-study outcome claims were not re-benchmarked; resume/PDF generation and IssuePages editorial publication were not part of this release. Existing editorial issues #28, #29, #30 and #33 remain untouched. Browser contexts closed and temporary screenshots were removed after retaining this evidence.
