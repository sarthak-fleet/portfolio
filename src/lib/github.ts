import { site } from '@/data/site';
import { projectGroups } from '@/data/featured-projects';
import {
  mergeRepos,
  normalizeRepo,
  resolveProjectGroups,
  type Repo,
  type ResolvedGroup,
} from './github-core';

export type { Repo, ResolvedGroup } from './github-core';

/**
 * Build-time GitHub data. Runs inside Astro frontmatter, so numbers and
 * repos are real but every page stays fully static.
 *
 * Unauthenticated requests are limited to 60/hour — plenty for builds.
 * Set a `GITHUB_TOKEN` env var to raise the limit if needed. Results are
 * memoised so the API is hit at most once per build.
 */

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': `${site.githubUser}-portfolio`,
  };
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function fetchReposFrom(url: string): Promise<Repo[]> {
  try {
    const all: Repo[] = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`${url}&page=${page}`, { headers: headers() });
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      for (const raw of data) {
        const repo = normalizeRepo(raw as Record<string, unknown>);
        if (repo) all.push(repo);
      }
      if (data.length < 100) break;
    }
    return all;
  } catch {
    return [];
  }
}

/* ----------------------------- repos ----------------------------- */

let reposCache: Promise<Repo[]> | null = null;

/**
 * Every owned, non-fork public repo — sorted best-first (stars, then
 * most-recently-pushed). Returns [] if the API is unreachable.
 */
export function getRepos(): Promise<Repo[]> {
  reposCache ??= (async () => {
    try {
      const [userRepos, orgRepos] = await Promise.all([
        fetchReposFrom(
          `https://api.github.com/users/${site.githubUser}/repos?per_page=100&type=owner&sort=pushed`,
        ),
        Promise.all(
          site.githubOrgs.map((org) =>
            fetchReposFrom(
              `https://api.github.com/orgs/${org}/repos?per_page=100&type=owner&sort=pushed`,
            ),
          ),
        ),
      ]);

      return mergeRepos([...userRepos, ...orgRepos.flat()]);
    } catch {
      return [];
    }
  })();
  return reposCache;
}

/* --------------------------- curated --------------------------- */

/**
 * The hand-curated project groups, enriched with live GitHub data and
 * with curated display order preserved. The curated `summary` overrides the
 * GitHub description (most of these repos don't have one).
 */
export async function getProjectGroups(): Promise<ResolvedGroup[]> {
  const all = await getRepos();
  return resolveProjectGroups(all, projectGroups);
}

/** Approximate GitHub language colours for the small language dot. */
export const langColor: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00add8',
  Python: '#3572a5',
  Rust: '#dea584',
  Elixir: '#6e4a7e',
  Dart: '#00b4ab',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  Ruby: '#701516',
  Astro: '#ff5a03',
  Svelte: '#ff3e00',
  Vue: '#41b883',
  Jupyter: '#da5b0b',
  Makefile: '#427819',
};
