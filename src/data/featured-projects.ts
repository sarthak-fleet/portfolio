import { fleetCatalog } from './fleet-catalog';

type FeaturedRepo = { repo: string; summary: string };
export type ProjectGroup = {
  label: string;
  intro: string;
  projects: FeaturedRepo[];
};

// Repository cards use the same qualified selection as product cards.
export const projectGroups: ProjectGroup[] = [
  {
    label: 'Source behind the experiments',
    intro:
      'Public repositories for the working demonstrations above. Qualification applies to the described surface.',
    projects: fleetCatalog.flatMap((project) => {
      const repo = project.repo?.replace(/\/$/, '').split('/').at(-1);
      return repo ? [{ repo, summary: project.description }] : [];
    }),
  },
];
