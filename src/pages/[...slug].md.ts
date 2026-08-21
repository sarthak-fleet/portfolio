import type { APIRoute, GetStaticPaths } from 'astro';

import { getAgentSurfaces, markdownPathFor } from '../data/agent-surfaces';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const surfaces = await getAgentSurfaces();

  return surfaces.map((surface) => ({
    params: { slug: markdownPathFor(surface.path).slice(1, -3) },
    props: { surface },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const surface = props.surface as Awaited<
    ReturnType<typeof getAgentSurfaces>
  >[number];

  return new Response(surface.markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
