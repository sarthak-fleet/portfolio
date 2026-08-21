export type SpotlightProduct = {
  id: string;
  label: string;
  name: string;
  url: string;
  organizationUrl: string;
  repositoryUrl: string;
  description: string;
};

/** Synchronized with fleet-ops/config/spotlight-products.json. */
export const spotlightProducts: readonly SpotlightProduct[] = [
  {
    id: 'codevetter',
    label: 'CodeVetter',
    name: 'CodeVetter',
    url: 'https://codevetter.com',
    organizationUrl: 'https://github.com/Codevetter',
    repositoryUrl: 'https://github.com/Codevetter/codevetter',
    description: 'Local-first desktop AI code review for agent-generated code.',
  },
  {
    id: 'posttrainllm',
    label: 'PostTrainLLM',
    name: 'PostTrainLLM',
    url: 'https://posttrainllm.com',
    organizationUrl: 'https://github.com/PostTrainLLM',
    repositoryUrl: 'https://github.com/PostTrainLLM/posttrainllm',
    description:
      'A Mac-local LLM factory, runtime, and WebGPU learning playground.',
  },
  {
    id: 'heypace',
    label: 'HeyPace',
    name: 'Pace',
    url: 'https://heypace.app',
    organizationUrl: 'https://github.com/HeyPace',
    repositoryUrl: 'https://github.com/HeyPace/pace',
    description:
      'An on-device Mac voice agent with screen-aware local context.',
  },
  {
    id: 'hisignal',
    label: 'High Signal',
    name: 'High Signal',
    url: 'https://highsignal.app',
    organizationUrl: 'https://github.com/High-Signal-App',
    repositoryUrl: 'https://github.com/High-Signal-App/high-signal',
    description:
      'An evidence-first daily brief for technology, markets, and infrastructure.',
  },
  {
    id: 'saas-maker',
    label: 'SaaS Maker',
    name: 'SaaS Maker',
    url: 'https://sassmaker.com',
    organizationUrl: 'https://github.com/sass-maker',
    repositoryUrl: 'https://github.com/sass-maker/saas-maker',
    description:
      'The broader directory and operating layer for the full product fleet.',
  },
] as const;
