export type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  archived: boolean;
  updated: string;
};

export type ResolvedGroup = {
  label: string;
  intro: string;
  repos: Repo[];
};

type CuratedGroup = {
  label: string;
  intro: string;
  projects: readonly { repo: string; summary: string }[];
};

export function normalizeRepo(raw: Record<string, unknown>): Repo | null {
  if (
    raw.fork ||
    typeof raw.name !== 'string' ||
    typeof raw.html_url !== 'string'
  ) {
    return null;
  }

  return {
    name: raw.name,
    description: typeof raw.description === 'string' ? raw.description : null,
    url: raw.html_url,
    homepage:
      typeof raw.homepage === 'string' && raw.homepage ? raw.homepage : null,
    language: typeof raw.language === 'string' ? raw.language : null,
    stars: typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
    forks: typeof raw.forks_count === 'number' ? raw.forks_count : 0,
    topics: Array.isArray(raw.topics)
      ? raw.topics.filter((topic): topic is string => typeof topic === 'string')
      : [],
    archived: Boolean(raw.archived),
    updated:
      typeof raw.pushed_at === 'string'
        ? raw.pushed_at
        : typeof raw.updated_at === 'string'
          ? raw.updated_at
          : '',
  };
}

export function mergeRepos(repos: readonly Repo[]): Repo[] {
  const unique = new Map<string, Repo>();
  for (const repo of repos) {
    const key = repo.url.toLowerCase();
    if (!unique.has(key)) unique.set(key, repo);
  }

  return [...unique.values()].sort(
    (a, b) =>
      b.stars - a.stars ||
      new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );
}

export function resolveProjectGroups(
  repos: readonly Repo[],
  groups: readonly CuratedGroup[]
): ResolvedGroup[] {
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  return groups
    .map((group) => ({
      label: group.label,
      intro: group.intro,
      repos: group.projects
        .map((project): Repo | null => {
          const live = byName.get(project.repo.toLowerCase());
          return live ? { ...live, description: project.summary } : null;
        })
        .filter((repo): repo is Repo => repo !== null),
    }))
    .filter((group) => group.repos.length > 0);
}
