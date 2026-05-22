// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// NOTE: update `site` to your final domain (custom domain or *.pages.dev).
// It is used for canonical URLs, the sitemap and Open Graph tags.
export default defineConfig({
  site: 'https://sarthakagrawal.dev',
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), mdx(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
