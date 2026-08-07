/** Canonical ten root brands from fleet root-brands.json — hub for SEO equity. */
export type RootDomain = {
  domain: string;
  name: string;
  url: string;
  blurb: string;
  tier: 'p0' | 'p1' | 'p2';
};

export const rootDomains: readonly RootDomain[] = [
  {
    domain: 'codevetter.com',
    name: 'CodeVetter',
    url: 'https://codevetter.com',
    blurb: 'Private desktop AI code review for agent-written code.',
    tier: 'p0',
  },
  {
    domain: 'posttrainllm.com',
    name: 'PostTrainLLM',
    url: 'https://posttrainllm.com',
    blurb: 'Train and evaluate specialist LLMs on one Mac.',
    tier: 'p0',
  },
  {
    domain: 'heypace.app',
    name: 'Pace',
    url: 'https://heypace.app',
    blurb: 'On-device Mac voice agent that can see the screen.',
    tier: 'p0',
  },
  {
    domain: 'rolepatch.com',
    name: 'RolePatch',
    url: 'https://rolepatch.com',
    blurb: 'Resume tailoring and job-application agent with review.',
    tier: 'p1',
  },
  {
    domain: 'sassmaker.com',
    name: 'SaaS Maker',
    url: 'https://sassmaker.com',
    blurb: 'Directory and operating layer for the product fleet.',
    tier: 'p1',
  },
  {
    domain: 'highsignal.app',
    name: 'High Signal',
    url: 'https://highsignal.app',
    blurb: 'Evidence-first daily brief for tech, startups, and finance.',
    tier: 'p2',
  },
  {
    domain: 'significanthobbies.com',
    name: 'Significant Hobbies',
    url: 'https://significanthobbies.com',
    blurb: 'Map your hobby history and rekindle what lasted.',
    tier: 'p2',
  },
  {
    domain: 'aliveville.com',
    name: 'Aliveville',
    url: 'https://aliveville.com',
    blurb: 'Browser-playable AI world simulator.',
    tier: 'p2',
  },
  {
    domain: 'karte.cc',
    name: 'Karte',
    url: 'https://karte.cc',
    blurb: 'Personal page as a public inbound agent.',
    tier: 'p2',
  },
  {
    domain: 'sarthakagrawal.dev',
    name: 'Sarthak Agrawal',
    url: 'https://sarthakagrawal.dev',
    blurb: 'This site — AI infrastructure and product engineering.',
    tier: 'p1',
  },
] as const;
