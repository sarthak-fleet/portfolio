import { site } from '@/data/site';
import { projectGroups } from '@/data/featured-projects';

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

/* ----------------------------- stats ----------------------------- */

export type GithubStats = {
  repos: number;
  followers: number;
};

const STATS_FALLBACK: GithubStats = { repos: 115, followers: 30 };

let statsCache: Promise<GithubStats> | null = null;

export function getGithubStats(): Promise<GithubStats> {
  statsCache ??= (async () => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${site.githubUser}`,
        { headers: headers() },
      );
      if (!res.ok) return STATS_FALLBACK;
      const user = await res.json();
      return {
        repos:
          typeof user.public_repos === 'number'
            ? user.public_repos
            : STATS_FALLBACK.repos,
        followers:
          typeof user.followers === 'number'
            ? user.followers
            : STATS_FALLBACK.followers,
      };
    } catch {
      return STATS_FALLBACK;
    }
  })();
  return statsCache;
}

/* ----------------------------- repos ----------------------------- */

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

let reposCache: Promise<Repo[]> | null = null;

/**
 * Every owned, non-fork public repo — sorted best-first (stars, then
 * most-recently-pushed). Returns [] if the API is unreachable.
 */
export function getRepos(): Promise<Repo[]> {
  reposCache ??= (async () => {
    try {
      const all: Repo[] = [];
      for (let page = 1; page <= 5; page++) {
        const res = await fetch(
          `https://api.github.com/users/${site.githubUser}/repos?per_page=100&page=${page}&type=owner&sort=pushed`,
          { headers: headers() },
        );
        if (!res.ok) break;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) break;
        for (const r of data) {
          if (r.fork) continue;
          all.push({
            name: r.name,
            description: r.description ?? null,
            url: r.html_url,
            homepage: r.homepage || null,
            language: r.language ?? null,
            stars: r.stargazers_count ?? 0,
            forks: r.forks_count ?? 0,
            topics: Array.isArray(r.topics) ? r.topics : [],
            archived: Boolean(r.archived),
            updated: r.pushed_at ?? r.updated_at ?? '',
          });
        }
        if (data.length < 100) break;
      }
      all.sort(
        (a, b) =>
          b.stars - a.stars ||
          new Date(b.updated).getTime() - new Date(a.updated).getTime(),
      );
      return all;
    } catch {
      return [];
    }
  })();
  return reposCache;
}

/* --------------------------- curated --------------------------- */

export type ResolvedGroup = {
  label: string;
  intro: string;
  repos: Repo[];
};

/**
 * The hand-curated project groups, enriched with live GitHub data and
 * with curated display order preserved. The curated `summary` overrides the
 * GitHub description (most of these repos don't have one).
 */
export async function getProjectGroups(): Promise<ResolvedGroup[]> {
  const all = await getRepos();
  const byName = new Map(all.map((r) => [r.name.toLowerCase(), r]));
  return projectGroups
    .map((g) => ({
      label: g.label,
      intro: g.intro,
      repos: g.projects
        .map((p): Repo | null => {
          const live = byName.get(p.repo.toLowerCase());
          return live ? { ...live, description: p.summary } : null;
        })
        .filter((r): r is Repo => r !== null),
    }))
    .filter((g) => g.repos.length > 0);
}

/** Flat curated repo list (live data), in curated order — for the home teaser. */
export async function getFeaturedRepos(): Promise<Repo[]> {
  const groups = await getProjectGroups();
  return groups.flatMap((g) => g.repos);
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
