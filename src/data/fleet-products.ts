type FleetProduct = {
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
    label: 'Core products',
    kicker: '// core products',
    intro:
      'The five products getting active product attention. Each organization is centered on its core product, with supporting repositories where they help.',
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
        url: 'https://posttrainllm.com',
        repo: repo('PostTrainLLM', 'posttrainllm'),
        description:
          'Post-training and model-learning workspace built around small local language models.',
        maturity: 'internal-first',
      },
      {
        name: 'Pace',
        url: 'https://heypace.app',
        repo: repo('HeyPace', 'pace'),
        description:
          'Local-only macOS menu-bar voice agent for screen-aware personal workflows.',
        maturity: 'internal-first',
      },
      {
        name: 'High Signal',
        url: 'https://highsignal.app',
        repo: repo('High-Signal-App', 'high-signal'),
        description:
          'Evidence-first signal log supported by focused research and ratings data.',
        maturity: 'public-ready',
      },
      {
        name: 'SaaS Maker',
        url: 'https://sassmaker.com',
        repo: repo('sass-maker', 'saas-maker'),
        description:
          'Product platform and operating layer supported by focused infrastructure tools.',
        maturity: 'internal-first',
      },
    ],
  },
  {
    label: 'Supporting projects',
    kicker: '// supporting projects',
    intro:
      'Repositories that directly support one of the core products. They are useful surfaces, not additional top-level brands.',
    products: [
      {
        name: 'Free AI',
        url: repo('sass-maker', 'free-ai'),
        description:
          'SaaS Maker support: OpenAI-compatible gateway across free-tier model providers.',
        maturity: 'maintained',
      },
      {
        name: 'Knowledge Base',
        url: repo('sass-maker', 'knowledge-base'),
        description:
          'SaaS Maker support: private agent search over project-scoped corpora.',
        maturity: 'maintained',
      },
      {
        name: 'Reel Pipeline',
        url: repo('sass-maker', 'reel-pipeline'),
        description:
          'SaaS Maker support: short-form media generation for product work.',
        maturity: 'maintained',
      },
      {
        name: 'Research Papers',
        url: repo('High-Signal-App', 'research-papers'),
        description:
          'High Signal support: academic research data and semantic paper discovery.',
        maturity: 'maintained',
      },
      {
        name: 'drank',
        url: repo('High-Signal-App', 'drank'),
        description: 'High Signal support: domain-rating research.',
        maturity: 'maintained',
      },
      {
        name: 'Starboard',
        url: repo('Codevetter', 'starboard'),
        description:
          'CodeVetter support: GitHub stars organization and semantic repository discovery.',
        maturity: 'maintained',
      },
      {
        name: 'EverythingRated',
        url: 'https://ratings.highsignal.app',
        repo: repo('High-Signal-App', 'everythingrated'),
        description:
          'High Signal support: structured ratings data for adoption decisions.',
        maturity: 'maintained',
      },
      {
        name: 'psi-swarm',
        url: 'https://performance.sassmaker.com',
        repo: repo('sass-maker', 'psi-swarm'),
        description:
          'SaaS Maker support: repeated Lighthouse performance distributions.',
        maturity: 'maintained',
      },
      {
        name: 'Companion Robot',
        url: repo('HeyPace', 'companion-robot'),
        description:
          'Future Pace support project for an embodied home companion.',
        maturity: 'internal-first',
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
        maturity: 'maintained',
      },
      {
        name: 'TrueHire',
        url: 'https://truehire.rolepatch.com',
        repo: repo('sarthakagrawal927', 'truehire'),
        description: 'Maintained hiring workspace in the RolePatch family.',
        maturity: 'maintained',
      },
      {
        name: 'AliveVille',
        url: 'https://aliveville.com',
        repo: repo('sarthakagrawal927', 'aliveville'),
        description:
          'Maintained multi-agent world experiment; no longer a focus product.',
        maturity: 'maintained',
      },
      {
        name: 'Karte',
        url: 'https://karte.cc',
        repo: repo('sarthakagrawal927', 'karte'),
        description:
          'AI link-in-bio with chat, profile, lead, and inbound assistant surfaces.',
        maturity: 'public-ready',
      },
      {
        name: 'Significant Hobbies',
        url: 'https://significanthobbies.com',
        repo: repo('Significant-Hobbies', 'significanthobbies'),
        description:
          'The core hobby-mapping project in a collection of independent tools I made for myself.',
        maturity: 'public-ready',
      },
      {
        name: 'Chess Coach',
        url: 'https://chess.significanthobbies.com',
        repo: repo('Significant-Hobbies', 'chess'),
        description: 'Personal Stockfish chess and AI coaching tool.',
        maturity: 'maintained',
      },
      {
        name: 'Materia',
        url: 'https://materia.significanthobbies.com',
        repo: repo('Significant-Hobbies', 'materia'),
        description: 'Personal anatomy and evidence-graded remedies reference.',
        maturity: 'maintained',
      },
      {
        name: 'Protein Index',
        url: 'https://protein.significanthobbies.com',
        repo: repo('Significant-Hobbies', 'protein-index'),
        description: 'Personal source-aware protein product intelligence tool.',
        maturity: 'maintained',
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
        url: 'https://anime.significanthobbies.com',
        repo: repo('Significant-Hobbies', 'anime-list'),
        description: 'Personal anime discovery and tracking surface.',
        maturity: 'maintained',
      },
      {
        name: 'Email Manager',
        url: 'https://mail.sassmaker.com',
        repo: repo('sarthakagrawal927', 'email-manager'),
        description:
          'Personal email operations workspace with local-first semantic search.',
        maturity: 'internal-first',
      },
    ],
  },
] as const;

export const fleetProjectCount = fleetProductGroups.reduce(
  (count, group) => count + group.products.length,
  0
);
