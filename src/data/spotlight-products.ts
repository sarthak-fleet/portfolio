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
    description: 'Execution-backed verification of whether a coding agent completed its task correctly.',
  },
  {
    id: 'posttrainllm',
    label: 'PostTrainLLM',
    name: 'PostTrainLLM',
    url: 'https://posttrainllm.com',
    organizationUrl: 'https://github.com/PostTrainLLM',
    repositoryUrl: 'https://github.com/PostTrainLLM/posttrainllm',
    description:
      'A measured one-machine lab for bounded specialist language models and their evals.',
  },
  {
    id: 'heypace',
    label: 'HeyPace',
    name: 'Pace',
    url: 'https://heypace.app',
    organizationUrl: 'https://github.com/HeyPace',
    repositoryUrl: 'https://github.com/HeyPace/pace',
    description:
      'A private Mac assistant for fast voice-driven help grounded in what is on screen.',
  },
  {
    id: 'saas-maker',
    label: 'SaaS Maker',
    name: 'SaaS Maker',
    url: 'https://sassmaker.com',
    organizationUrl: 'https://github.com/sass-maker',
    repositoryUrl: 'https://github.com/sass-maker/saas-maker',
    description:
      'The public Fleet directory and reusable packages, skills, templates, and feedback workshop.',
  },
] as const;
