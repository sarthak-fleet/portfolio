import { fleetCatalog } from './fleet-catalog';

/** Canonical ten root brands from fleet root-brands.json — hub for SEO equity. */
export type RootDomain = {
  domain: string;
  name: string;
  url: string;
  blurb: string;
  tier: 'p0' | 'p1' | 'p2';
};

export const rootDomains: readonly RootDomain[] = fleetCatalog
  .filter((project) => project.domains[0] && project.domains[0].split('.').length === 2)
  .map((project) => ({ domain: project.domains[0], name: project.name, url: project.url, blurb: project.description, tier: project.tier === 'focus' ? 'p0' : 'p1' }));
