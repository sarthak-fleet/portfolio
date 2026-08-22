---
title: 'How I run 23 products on Cloudflare without Argo'
description: >-
  A personal fleet on Workers and Pages had fast *.workers.dev URLs and slow custom
  domains. Here is the perf push that closed desktop LCP p75 under 500 ms — measured
  with distributional Lighthouse runs, not a single PageSpeed score.
date: 2026-06-10
tags: [performance, cloudflare, astro, web-vitals]
---

I ship a lot of small products — 23 live sites on Cloudflare Workers and Pages, mostly solo. The fleet had a split personality: `*.workers.dev` and `*.pages.dev` URLs were fast, but custom domains sat on a **400–1000 ms TTFB floor**. PageSpeed Insights gave me one number per URL. That number lied often enough that I built [psi-swarm](https://github.com/sass-maker/psi-swarm) to run Lighthouse many times and report **p50/p75/p90/p99** instead.

This post is the narrative version. The structured case study with baseline, tactics, and results lives on [SaaS Maker](https://sassmaker.com).

## The constraint

No Argo Smart Routing. No Vercel migration. Goal: **desktop LCP p75 under 500 ms** across the inventory.

That sounds like a CDN problem until you look at the breakdown. On several Worker homepages, TTFB on a custom domain was 2–3× the same route on `*.workers.dev`. Cloudflare's free tier routing is real; fighting it with more JavaScript is not.

## What actually moved LCP

**1. Astro static overlays for marketing `/` routes**

Several apps are Next.js or React on Workers. The app shell is fine for logged-in flows; the landing page does not need SSR on every request. I added thin Astro sites that serve static HTML at `/` and link into the app. Same product behind the URL, but the LCP element is plain HTML at the edge — not a hydration waterfall.

**2. Self-hosted fonts**

Google Fonts CSS is render-blocking and adds DNS + connection setup. Moving to `@fontsource` (self-hosted, subsetted) removed a recurring 200–400 ms delay on mobile-slow presets.

**3. Killed opacity-0 hero animations**

This one hurt to admit. Framer Motion fade-ins on above-the-fold heroes were **40–70% of LCP render delay** on multiple sites. The hero image loaded; the browser waited to paint it because opacity was zero until JS ran. Removing or deferring those animations was often a bigger win than image compression.

**4. Edge cache for semi-dynamic Worker homepages**

For routes that cannot go fully static, `Cache-Control` headers plus `caches.default` in a thin worker wrapper let repeat visitors hit cached HTML. Not a substitute for static where static fits — but it trimmed TTFB on homepages that still need a Worker.

**5. Distributional measurement**

Single Lighthouse runs are noisy. psi-swarm runs the same URL across realistic device/network presets, stores history in SQLite, and surfaces regressions in a `/projects` dashboard. I stopped optimizing for one green PSI score and started watching **p75 LCP** week over week.

## Results

Five sites closed under 500 ms desktop LCP p75 in the first push. The remaining gap is app-level TTFB on custom domains — a known Workers floor without paid routing. The wins were front-end and architecture choices I could ship in a week, not magic CDN settings.

## Try the tooling

- **[psi-swarm](https://github.com/sass-maker/psi-swarm)** — CLI + local UI; runs stay on your machine
- **[SaaS Maker](https://sassmaker.com)** — the broader fleet directory
- **[Fleet products hub](https://sarthakagrawal.dev/projects)** — all ten root domains in one place

If you are running a personal product fleet on Cloudflare, the highest-leverage move is usually: **static HTML at `/`, measure p75 not p50, and delete the hero fade-in.** Everything else is incremental.
