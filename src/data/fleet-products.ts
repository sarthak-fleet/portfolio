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
      'The products getting active product attention. Each organization is centered on its core product.',
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
] as const;

export const fleetProjectCount = fleetProductGroups.reduce(
  (count, group) => count + group.products.length,
  0
);
