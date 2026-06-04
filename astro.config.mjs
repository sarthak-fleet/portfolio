// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// NOTE: update `site` to your final domain (custom domain or *.pages.dev).
// It is used for canonical URLs, the sitemap and Open Graph tags.
export default defineConfig({
  site: 'https://sarthakagrawal.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  // Emit `about.html` rather than `about/index.html` so URLs have no
  // trailing slash on Cloudflare Pages (no 308 redirect on every link).
  // Inline ALL stylesheets so we never block render on an external CSS
  // request — psi-swarm flagged about.CGDoxez0.css (9 KB) as the LCP-blocker
  // on mobile-slow (6.4s render delay). Reference: psi-swarm run.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [react(), mdx(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
