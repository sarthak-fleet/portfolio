import type { APIRoute } from 'astro';

import { getAgentSurfaces, markdownPathFor } from '../../data/agent-surfaces';
import { site } from '../../data/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const surfaces = await getAgentSurfaces();
  const catalog = {
    name: site.name,
    version: '1',
    url: site.url,
    llms: `${site.url}/llms.txt`,
    llmsFull: `${site.url}/llms-full.txt`,
    sitemap: `${site.url}/sitemap-index.xml`,
    markdown: { suffix: '.md', negotiation: false },
    surfaces: surfaces.map((surface) => ({
      id: surface.id,
      url: new URL(surface.path, site.url).toString(),
      md: new URL(markdownPathFor(surface.path), site.url).toString(),
      kind: surface.path.startsWith('/work/') || surface.path.startsWith('/blog/')
        ? 'content'
        : 'static',
      description: surface.description,
    })),
    auth: {
      public: true,
      notes: 'The portfolio is fully public and static. It has no authenticated user surface.',
    },
  };

  return new Response(`${JSON.stringify(catalog, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
