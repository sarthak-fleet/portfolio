import type { APIRoute } from 'astro';

import { getAgentSurfaces } from '../data/agent-surfaces';
import { site } from '../data/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const surfaces = await getAgentSurfaces();
  const body = [
    `# ${site.name} — full public corpus`,
    '',
    `Canonical identity: ${site.personId}`,
    `Website: ${site.url}`,
    '',
    ...surfaces.flatMap((surface) => [
      '---',
      '',
      `Source page: ${new URL(surface.path, site.url)}`,
      '',
      surface.markdown.trim(),
      '',
    ]),
  ].join('\n');

  return new Response(`${body.trim()}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
