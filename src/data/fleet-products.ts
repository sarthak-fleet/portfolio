export type FleetProduct = {
  name: string;
  url: string;
  repo?: string;
  description: string;
  maturity: 'public-ready' | 'internal-first' | 'maintained';
};

export type FleetProductGroup = {
  label: string;
  kicker: string;
  intro: string;
  products: FleetProduct[];
};

const repo = (owner: string, name: string) =>
  `https://github.com/${owner}/${name}`;

/** Current fleet taxonomy mirrored from the SaaS Maker registry. */
export const fleetProductGroups: FleetProductGroup[] = [
  {
    label: 'Focus',
    kicker: '// focus',
    intro:
      'The products getting the most active product attention: code review, local voice, and post-training.',
    products: [
      {
        name: 'CodeVetter',
        url: 'https://codevetter.com',
        repo: repo('Codevetter', 'codevetter'),
        description:
          'Desktop-first AI code review workbench. Local SQLite, Tauri shell, evidence-backed review loops for agent-generated code.',
        maturity: 'public-ready',
      },
      {
        name: 'PostTrainLLM',
        url: repo('PostTrainLLM', 'posttrainllm'),
        description: 'Post-training and model-learning workspace built around small local language models.',
        maturity: 'internal-first',
      },
      {
        name: 'Pace',
        url: repo('HeyPace', 'pace'),
        description: 'Local-only macOS menu-bar voice agent for screen-aware personal workflows.',
        maturity: 'internal-first',
      },
    ],
  },
  {
    label: 'Support/platform',
    kicker: '// support/platform',
    intro:
      'Shared platform pieces and small public surfaces that make the rest of the fleet easier to run.',
    products: [
      {
        name: 'SaaS Maker / Foundry',
        url: 'https://sassmaker.com',
        repo: repo('sass-maker', 'saas-maker'),
        description:
          'Personal fleet operating layer: registry, audits, tasks, widgets, and the cockpit for running the full product set.',
        maturity: 'internal-first',
      },
      {
        name: 'High Signal',
        url: 'https://highsignal.app',
        repo: repo('High-Signal-App', 'high-signal'),
        description:
          'Public signal log for AI infrastructure, semiconductors, markets, and domain intelligence.',
        maturity: 'public-ready',
      },
      {
        name: 'AliveVille',
        url: 'https://aliveville.com',
        repo: repo('sarthakagrawal927', 'aliveville'),
        description: 'Persistent AI world simulator and browser-playable multi-agent game experiment.',
        maturity: 'internal-first',
      },
      {
        name: 'Free AI',
        url: repo('sass-maker', 'free-ai'),
        description: 'OpenAI-compatible gateway that routes across free-tier model providers.',
        maturity: 'maintained',
      },
      {
        name: 'Knowledge Base',
        url: repo('sass-maker', 'knowledge-base'),
        description: 'Private Agent Search over project-scoped corpora.',
        maturity: 'maintained',
      },
      {
        name: 'Reel Pipeline',
        url: repo('sass-maker', 'reel-pipeline'),
        description: 'AI short-form video generation pipeline for fleet marketing assets.',
        maturity: 'maintained',
      },
      {
        name: 'Research Papers',
        url: repo('High-Signal-App', 'research-papers'),
        description: 'Academic paper platform and data asset for research workflows.',
        maturity: 'maintained',
      },
      {
        name: 'drank',
        url: repo('High-Signal-App', 'drank'),
        description: 'Domain Rating tracker that supports High Signal and domain research.',
        maturity: 'maintained',
      },
      {
        name: 'Starboard',
        url: repo('Codevetter', 'starboard'),
        description: 'GitHub stars organizer and semantic search surface under CodeVetter.',
        maturity: 'maintained',
      },
    ],
  },
  {
    label: 'Personal use',
    kicker: '// personal use',
    intro:
      'Projects I keep alive for my own workflows. They stay maintained, but they get less product investment.',
    products: [
      {
        name: 'RolePatch',
        url: 'https://rolepatch.com',
        repo: repo('sarthakagrawal927', 'rolepatch'),
        description: 'AI resume tailoring and job-application assistant.',
        maturity: 'public-ready',
      },
      {
        name: 'Karte',
        url: 'https://karte.cc',
        repo: repo('sarthakagrawal927', 'karte'),
        description: 'AI link-in-bio with chat, profile, lead, and inbound assistant surfaces.',
        maturity: 'public-ready',
      },
      {
        name: 'Significant Hobbies',
        url: 'https://significanthobbies.com',
        repo: repo('Significant-Hobbies', 'significanthobbies'),
        description: 'Personal hobby mapping and journey visualization.',
        maturity: 'public-ready',
      },
      {
        name: 'Reader',
        url: repo('Significant-Hobbies', 'reader'),
        description: 'Personal reading and saved-article workflow.',
        maturity: 'maintained',
      },
      {
        name: 'SWE Interview Prep',
        url: repo('Significant-Hobbies', 'swe-interview-prep'),
        description: 'Personal interview practice workspace.',
        maturity: 'maintained',
      },
      {
        name: 'LoopTV',
        url: repo('Significant-Hobbies', 'looptv'),
        description: 'Ambient video and anime companion.',
        maturity: 'maintained',
      },
      {
        name: 'Anime List',
        url: 'https://anime-list-9lk.pages.dev',
        repo: repo('Significant-Hobbies', 'anime-list'),
        description: 'Personal anime discovery and tracking surface.',
        maturity: 'maintained',
      },
      {
        name: 'Email Manager',
        url: 'https://email-manager.sarthakagrawal927.workers.dev',
        repo: repo('sarthakagrawal927', 'email-manager'),
        description: 'Personal email operations workspace with local-first semantic search.',
        maturity: 'internal-first',
      },
    ],
  },
] as const;

export const fleetProjectCount = fleetProductGroups.reduce(
  (count, group) => count + group.products.length,
  0,
);

export const focusProjects = fleetProductGroups[0].products;
