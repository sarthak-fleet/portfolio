/**
 * Hand-curated project list — every entry was vetted by reading the actual
 * repo code, not just its name or GitHub description.
 *
 * Out of 100+ public repos, these 26 genuinely show AI/ML, backend, systems,
 * tooling or shipped-product engineering. Course solutions, learning repos,
 * boilerplate (e.g. `backpropagate` — an unmodified starter template) and
 * abandoned stubs are deliberately left out; they stay reachable via the
 * "browse all on GitHub" link on the projects page.
 *
 * `summary` is written from what the code does (most repos have no GitHub
 * description). `repo` must match the GitHub repo name; live data — stars,
 * language, last-updated — is merged in at build time.
 */

export type FeaturedRepo = {
  repo: string;
  summary: string;
};

export type ProjectGroup = {
  label: string;
  intro: string;
  projects: FeaturedRepo[];
};

export const projectGroups: ProjectGroup[] = [
  {
    label: 'AI & Machine Learning',
    intro: 'LLM gateways, a couple of agents, and a GPT built from the ground up.',
    projects: [
      {
        repo: 'free-ai',
        summary:
          'An OpenAI-compatible API that spreads calls across free LLM providers and routes around whichever ones are down.',
      },
      {
        repo: 'high-signal',
        summary:
          'Pulls from SEC filings, news and Reddit, then runs an NLP pipeline to score what is actually worth knowing.',
      },
      {
        repo: 'tinygpt',
        summary:
          'A GPT written from scratch, LoRA fine-tuning and all, that runs in the browser on WASM and WebGPU kernels.',
      },
      {
        repo: 'open-historia',
        summary:
          'A strategy game where you describe your nation’s moves in plain English and an LLM plays referee.',
      },
      {
        repo: 'reel-maker',
        summary:
          'Hand it a topic and it writes the script, makes the images, records a voiceover and renders the video.',
      },
      {
        repo: 'stitch',
        summary:
          'Stitches a few video feeds into one panorama using SIFT feature matching and homography.',
      },
    ],
  },
  {
    label: 'Backend & Systems',
    intro: 'APIs, services, and a benchmark or two run to settle an argument.',
    projects: [
      {
        repo: 'saas-maker',
        summary:
          'The backend every SaaS ends up rebuilding — feedback, waitlists, analytics — packaged as drop-in APIs.',
      },
      {
        repo: 'click_vs_elastic',
        summary:
          'I loaded 10M rows into ClickHouse and Elasticsearch three ways each, just to see what’s actually faster.',
      },
      {
        repo: 'truehire',
        summary:
          'Rates a candidate from their real GitHub history instead of taking a polished resume at face value.',
      },
      {
        repo: 'agentMode',
        summary:
          'Caches a subreddit and gives you AI summaries of it, with links back to the posts they came from.',
      },
      {
        repo: 'status-pulse-backend',
        summary:
          'A status-page API built for multiple tenants — roles, auth, and live updates over websockets.',
      },
      {
        repo: 'stumble-backend',
        summary:
          'The backend for a dating app: matching, chat, notifications and cron jobs, on Redis and Prisma.',
      },
      {
        repo: 'productivity-backend',
        summary:
          'A Go API for tracking habits — streaks, frequency targets, and a bit of performance logging.',
      },
    ],
  },
  {
    label: 'Developer Tools',
    intro: 'Small tools I built mostly because the friction was bugging me.',
    projects: [
      {
        repo: 'port-whisperer',
        summary:
          'A port scanner in Rust that also figures out what framework is running and notices Docker.',
      },
      {
        repo: 'CodeVetter',
        summary:
          'A desktop app for reviewing AI-generated code offline, using your own API keys.',
      },
      {
        repo: 'starboard',
        summary:
          'Makes your GitHub stars usable again — auto-categorized, embedded, and properly searchable.',
      },
      {
        repo: 'agent-resume',
        summary:
          'Chains AI coding agents so when one hits a rate limit, the next one quietly takes over.',
      },
      {
        repo: 'sql-table-viewer',
        summary:
          'A SQL scratchpad in the browser — Monaco editor, and tables that stay smooth past 50k rows.',
      },
      {
        repo: 'local-ai',
        summary:
          'Puts local coding agents — Claude Code, Codex, Gemini — behind one streaming chat API.',
      },
    ],
  },
  {
    label: 'Products & Apps',
    intro: 'Things I shipped and actually use.',
    projects: [
      {
        repo: 'anime-list',
        summary:
          'Browse 14,000+ anime with a ranking I actually trust, plus watchlists to keep track.',
      },
      {
        repo: 'reader',
        summary:
          'Save articles and PDFs for later, mark them up, and ask an AI about anything you’ve saved.',
      },
      {
        repo: 'karte',
        summary:
          'A link-in-bio page that can also chat, roast you, or lay itself out like a small newspaper.',
      },
      {
        repo: 'today-little-log',
        summary:
          'A small daily journal — habits, tasks, a plan for the day — that works offline as a PWA.',
      },
      {
        repo: 'email-manager',
        summary:
          'A Gmail client that searches with on-device embeddings and clears out junk in bulk.',
      },
      {
        repo: 'looptv',
        summary:
          'YouTube as a TV — pick a channel and lean back. Videos get tagged with an NER model.',
      },
      {
        repo: 'chess',
        summary:
          'A chess app that coaches you mid-game. Runs on the edge.',
      },
    ],
  },
];

/** Flat list of curated repo names, in display order. */
export const featuredRepoNames = projectGroups.flatMap((g) =>
  g.projects.map((p) => p.repo),
);
