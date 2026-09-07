export type SpotlightProduct = {
  id: string;
  label: string;
  name: string;
  url: string;
  organizationUrl: string;
  repositoryUrl: string;
  description: string;
};

import publicCatalog from './fleet-public.json';

export const spotlightProducts: readonly SpotlightProduct[] =
  publicCatalog.products
    .filter((project) => project.spotlight || project.id === 'saas-maker')
    .map((project) => ({
      id: project.id,
      label: project.name,
      name: project.name,
      url: project.url,
      organizationUrl:
        project.repositoryUrl?.split('/').slice(0, 4).join('/') ?? project.url,
      repositoryUrl: project.repositoryUrl ?? project.url,
      description: project.description,
    }));
