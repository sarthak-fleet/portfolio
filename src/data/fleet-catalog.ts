/**
 * Full fleet catalog for LLM-readable surfaces only (llms.txt, llms-full.txt,
 * /api/ai). The human-facing /projects page uses the trimmed `fleet-products.ts`
 * with just core products. This file carries the complete live fleet — 49
 * maintained projects across focus, active, secondary, and parked tiers — so
 * agents get the full picture without cluttering the HTML.
 *
 * Mirrored from site-health/apps/backend/config/projects.json (2026-08-22).
 * Exclude out-of-fleet, archived, deleted, and undeployed projects.
 */

export type CatalogEntry = {
  id: string;
  name: string;
  tier: 'focus' | 'active' | 'secondary' | 'parked';
  priority: 'P1' | 'P2' | 'P4';
  kind: 'product' | 'platform' | 'experiment';
  family: string;
  url: string;
  domains: string[];
  repo?: string;
  description: string;
};

export type CatalogGroup = {
  tier: CatalogEntry['tier'];
  label: string;
  intro: string;
  entries: CatalogEntry[];
};

export const fleetCatalog: readonly CatalogEntry[] = [
  // --- Focus (P1 core products) ---
  {
    id: 'codevetter',
    name: 'CodeVetter',
    tier: 'focus',
    priority: 'P1',
    kind: 'product',
    family: 'codevetter',
    url: 'https://codevetter.com',
    domains: ['codevetter.com'],
    repo: 'https://github.com/Codevetter/codevetter',
    description:
      'AI code review platform — desktop-first, works offline. Local SQLite, Tauri shell, evidence-backed review loops for agent-generated code.',
  },
  {
    id: 'pace',
    name: 'Pace',
    tier: 'focus',
    priority: 'P1',
    kind: 'product',
    family: 'pace',
    url: 'https://heypace.app',
    domains: ['heypace.app'],
    repo: 'https://github.com/HeyPace/pace',
    description:
      'Local-only macOS voice agent that can understand what is on your screen.',
  },
  {
    id: 'posttrainllm',
    name: 'PostTrainLLM',
    tier: 'focus',
    priority: 'P1',
    kind: 'product',
    family: 'posttrainllm',
    url: 'https://posttrainllm.com',
    domains: ['posttrainllm.com'],
    repo: 'https://github.com/PostTrainLLM/posttrainllm',
    description:
      'A local factory for training, evaluating, and running specialist language models.',
  },

  // --- Active (P1–P2, getting regular work) ---
  {
    id: 'agent-office',
    name: 'Office OS',
    tier: 'active',
    priority: 'P1',
    kind: 'product',
    family: 'agent-office',
    url: 'https://office-os.sassmaker.com',
    domains: ['office-os.sassmaker.com'],
    description:
      'A local-first Mac workplace where named AI employees have bounded responsibilities and collaborate on tasks.',
  },
  {
    id: 'saas-maker',
    name: 'SaaS Maker',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'saas-maker',
    url: 'https://sassmaker.com',
    domains: ['sassmaker.com'],
    repo: 'https://github.com/sass-maker/saas-maker',
    description:
      'Software as a specialized service: a living studio of focused products built for particular problems.',
  },
  {
    id: 'high-signal',
    name: 'High Signal',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'high-signal',
    url: 'https://highsignal.app',
    domains: ['highsignal.app'],
    repo: 'https://github.com/High-Signal-App/high-signal',
    description:
      'Evidence-backed daily intelligence across technology, startups, finance, and public policy.',
  },
  {
    id: 'site-health',
    name: 'Site Health',
    tier: 'active',
    priority: 'P2',
    kind: 'platform',
    family: 'site-health',
    url: 'https://github.com/sass-maker/site-health',
    domains: [],
    repo: 'https://github.com/sass-maker/site-health',
    description:
      'Fleet-wide observability and project catalog — the canonical private infrastructure inventory.',
  },
  {
    id: 'workflows-and-skills',
    name: 'Workflows and Skills',
    tier: 'active',
    priority: 'P2',
    kind: 'platform',
    family: 'workflows-and-skills',
    url: 'https://github.com/sass-maker/workflows-and-skills',
    domains: [],
    repo: 'https://github.com/sass-maker/workflows-and-skills',
    description: 'Reusable agent workflows and skills shared across the fleet.',
  },
  {
    id: 'chatgpt-connections',
    name: 'ChatGPT Connections',
    tier: 'active',
    priority: 'P2',
    kind: 'platform',
    family: 'chatgpt-connections',
    url: 'https://github.com/sass-maker/chatgpt-connections',
    domains: [],
    repo: 'https://github.com/sass-maker/chatgpt-connections',
    description:
      'Public gateway for ChatGPT connection and memory data exports.',
  },
  {
    id: 'reel-pipeline',
    name: 'Reel Pipeline',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'reel-pipeline',
    url: 'https://github.com/sass-maker/reel-pipeline',
    domains: [],
    repo: 'https://github.com/sass-maker/reel-pipeline',
    description: 'Short-form media generation pipeline for product work.',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    tier: 'active',
    priority: 'P2',
    kind: 'platform',
    family: 'knowledge-base',
    url: 'https://knowledgebase.sassmaker.com',
    domains: ['knowledgebase.sassmaker.com', 'search.sassmaker.com'],
    repo: 'https://github.com/sass-maker/knowledge-base',
    description:
      'Private agent search over specialized corpora with ranked citations, provenance, and project-scoped retrieval.',
  },
  {
    id: 'app-health',
    name: 'App Health',
    tier: 'active',
    priority: 'P2',
    kind: 'platform',
    family: 'app-health',
    url: 'https://health.sassmaker.com',
    domains: ['health.sassmaker.com', 'ingest.sassmaker.com'],
    description:
      'Privacy-first endpoint health for Node, Go, and OpenTelemetry services.',
  },
  {
    id: 'motion',
    name: 'Motion',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'motion',
    url: 'https://motion.significanthobbies.com',
    domains: ['motion.significanthobbies.com'],
    description:
      'Use your body as the controller for an iPhone-hosted game that can mirror to a larger screen.',
  },
  {
    id: 'indulge',
    name: 'Habits',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'indulge',
    url: 'https://habits.significanthobbies.com',
    domains: [
      'habits.significanthobbies.com',
      'indulge.significanthobbies.com',
    ],
    description:
      'A private habit practice for noticing patterns, making intentional trades, and building streaks.',
  },
  {
    id: 'local-ai-video-studio',
    name: 'Local AI Video Studio',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'local-ai-video-studio',
    url: 'https://local-ai-video-studio.sassmaker.com',
    domains: ['local-ai-video-studio.sassmaker.com'],
    description:
      'A local-first Mac studio for comparing reproducible video-effect variants before committing to a render.',
  },
  {
    id: 'anchor',
    name: 'Anchor',
    tier: 'active',
    priority: 'P2',
    kind: 'product',
    family: 'anchor',
    url: 'https://anchor.significanthobbies.com',
    domains: ['anchor.significanthobbies.com'],
    description:
      'A local-first focus timer for Mac, iPhone and Apple Watch that parks distractions and tracks deep-work sessions.',
  },
  {
    id: 'drank',
    name: 'Drank',
    tier: 'active',
    priority: 'P4',
    kind: 'product',
    family: 'drank',
    url: 'https://domains.sassmaker.com',
    domains: ['domains.sassmaker.com'],
    repo: 'https://github.com/sass-maker/drank',
    description:
      'Domain Rating intelligence for product, SEO, and market research.',
  },
  {
    id: 'email-manager',
    name: 'Email Manager',
    tier: 'active',
    priority: 'P4',
    kind: 'product',
    family: 'email-manager',
    url: 'https://mail.significanthobbies.com',
    domains: ['mail.significanthobbies.com'],
    description:
      'A private Gmail workspace for local semantic search, sender insights, and explicit unsubscribe workflows.',
  },
  {
    id: 'free-ai',
    name: 'Free AI',
    tier: 'active',
    priority: 'P4',
    kind: 'platform',
    family: 'free-ai',
    url: 'https://ai-gateway.sassmaker.com',
    domains: ['ai-gateway.sassmaker.com'],
    repo: 'https://github.com/sass-maker/free-ai',
    description: 'OpenAI-compatible gateway across free-tier model providers.',
  },
  {
    id: 'psi-swarm',
    name: 'PSI Swarm',
    tier: 'active',
    priority: 'P4',
    kind: 'platform',
    family: 'psi-swarm',
    url: 'https://performance.sassmaker.com',
    domains: ['performance.sassmaker.com'],
    repo: 'https://github.com/sass-maker/psi-swarm',
    description:
      'Repeated Lighthouse distributions for honest website performance tracking.',
  },
  {
    id: 'materia',
    name: 'Materia',
    tier: 'active',
    priority: 'P4',
    kind: 'product',
    family: 'materia',
    url: 'https://materia.significanthobbies.com',
    domains: ['materia.significanthobbies.com'],
    description: 'Evidence-graded remedy reference organized by body system.',
  },
  {
    id: 'reddit-insights',
    name: 'Reddit Insights',
    tier: 'active',
    priority: 'P4',
    kind: 'product',
    family: 'reddit-insights',
    url: 'https://reddit-insights.highsignal.app',
    domains: ['reddit-insights.highsignal.app'],
    description:
      'Structured Reddit research and signal extraction for product and market intelligence.',
  },

  // --- Secondary (maintained, less active investment) ---
  {
    id: 'gitstat',
    name: 'GitStat',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'gitstat',
    url: 'https://git.significanthobbies.com',
    domains: ['git.significanthobbies.com'],
    repo: 'https://github.com/sass-maker/gitstat',
    description:
      'A GitHub analytics dashboard for contribution history, code churn, collaboration, and AI-assisted work breakdowns.',
  },
  {
    id: 'chatgpt-memory-insights',
    name: 'Memory Map',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'chatgpt-memory-insights',
    url: 'https://chatgpt.significanthobbies.com',
    domains: ['chatgpt.significanthobbies.com'],
    description:
      'Turn a ChatGPT export into a private, browser-computed map of recurring themes, facts, and conversation patterns.',
  },
  {
    id: 'everythingrated',
    name: 'EverythingRated',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'everythingrated',
    url: 'https://ratings.highsignal.app',
    domains: ['ratings.highsignal.app'],
    repo: 'https://github.com/High-Signal-App/everythingrated',
    description: 'A general-purpose rating and comparison experiment.',
  },
  {
    id: 'research-papers',
    name: 'Research Papers',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'research-papers',
    url: 'https://papers.highsignal.app',
    domains: ['papers.highsignal.app'],
    repo: 'https://github.com/High-Signal-App/research-papers',
    description:
      'Academic paper discovery and a structured research data asset.',
  },
  {
    id: 'significanthobbies',
    name: 'Significant Hobbies',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'significanthobbies',
    url: 'https://significanthobbies.com',
    domains: ['significanthobbies.com', 'live.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/significanthobbies',
    description:
      'A simple directory for Live, Journal, Habits, Calorie, Setline, Kith, and Anchor — the personal-use product family.',
  },
  {
    id: 'india-standards',
    name: 'India Standards',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'india-standards',
    url: 'https://india-standards.significanthobbies.com',
    domains: [
      'india-standards.significanthobbies.com',
      'india-numbers.significanthobbies.com',
    ],
    description:
      'A transparent India demographic standards calculator using aggregate PLFS data.',
  },
  {
    id: 'anime-list',
    name: 'Anime List',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'anime-list',
    url: 'https://anime.significanthobbies.com',
    domains: ['anime.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/anime-list',
    description:
      'Anime and manga discovery with multi-axis filtering and personal watchlists.',
  },
  {
    id: 'chess',
    name: 'Chess',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'chess',
    url: 'https://chess.significanthobbies.com',
    domains: ['chess.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/chess',
    description:
      'Browser chess against Stockfish with optional AI move coaching.',
  },
  {
    id: 'looptv',
    name: 'LoopTV',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'looptv',
    url: 'https://tv.significanthobbies.com',
    domains: ['tv.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/looptv',
    description:
      'A lean-back, TV-style random video player for curated channels.',
  },
  {
    id: 'reader',
    name: 'Reader',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'reader',
    url: 'https://read.significanthobbies.com',
    domains: ['read.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/reader',
    description: 'Capture, annotate, revisit, and discuss saved reading.',
  },
  {
    id: 'swe-interview-prep',
    name: 'SWE Interview Prep',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'swe-interview-prep',
    url: 'https://learn.significanthobbies.com',
    domains: ['learn.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/swe-interview-prep',
    description: 'A learning OS for software-engineering interview practice.',
  },
  {
    id: 'calorie',
    name: 'Calorie',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'calorie',
    url: 'https://calorie.significanthobbies.com',
    domains: ['calorie.significanthobbies.com'],
    description:
      'A private, local-first food, water, and weight journal with transparent timing guidance.',
  },
  {
    id: 'setline',
    name: 'Setline',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'setline',
    url: 'https://setline.significanthobbies.com',
    domains: ['setline.significanthobbies.com'],
    description:
      'An iOS-native training tracker that runs a written strength, cardio and mobility program.',
  },
  {
    id: 'kith',
    name: 'Kith',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'kith',
    url: 'https://kith.significanthobbies.com',
    domains: ['kith.significanthobbies.com'],
    description:
      'A private iPhone app for the people you actually want to stay close to — closeness scores, reminders, and notes.',
  },
  {
    id: 'ios-landings',
    name: 'iOS Landings',
    tier: 'secondary',
    priority: 'P2',
    kind: 'platform',
    family: 'ios-landings',
    url: 'https://journal.significanthobbies.com',
    domains: ['journal.significanthobbies.com'],
    description:
      'Shared Astro factory that builds separate static sites for Significant Hobbies iOS apps.',
  },
  {
    id: 'rolepatch',
    name: 'RolePatch',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'rolepatch',
    url: 'https://rolepatch.com',
    domains: ['rolepatch.com'],
    repo: 'https://github.com/sarthakagrawal927/rolepatch',
    description:
      'AI-assisted resume tailoring, role research, and interview preparation.',
  },
  {
    id: 'karte',
    name: 'Karte',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'karte',
    url: 'https://karte.cc',
    domains: ['karte.cc'],
    repo: 'https://github.com/sarthakagrawal927/karte',
    description: 'An AI link-in-bio that turns a profile into a conversation.',
  },
  {
    id: 'starboard',
    name: 'Starboard',
    tier: 'secondary',
    priority: 'P2',
    kind: 'product',
    family: 'starboard',
    url: 'https://starboard.codevetter.com',
    domains: ['starboard.codevetter.com'],
    repo: 'https://github.com/Codevetter/starboard',
    description: 'Organize and semantically search your GitHub stars.',
  },
  {
    id: 'saas-ideas',
    name: 'SaaS Ideas',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'saas-ideas',
    url: 'https://ideas.sassmaker.com',
    domains: ['ideas.sassmaker.com'],
    description:
      'A curated directory of SaaS product ideas with market analysis.',
  },
  {
    id: 'what-it-takes-to-win',
    name: 'What It Takes to Win',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'what-it-takes-to-win',
    url: 'https://paths.significanthobbies.com',
    domains: ['paths.significanthobbies.com'],
    description:
      'Explore 2,585 documented early-breakthrough paths without pretending success follows a formula.',
  },
  {
    id: 'sarthakagrawal-personal',
    name: 'Sarthak Agrawal',
    tier: 'secondary',
    priority: 'P4',
    kind: 'product',
    family: 'sarthakagrawal-personal',
    url: 'https://sarthakagrawal.dev',
    domains: ['sarthakagrawal.dev'],
    description:
      'Personal portfolio of Sarthak Agrawal — AI infrastructure and product engineer.',
  },

  // --- Parked (live but no active investment) ---
  {
    id: 'ai-game',
    name: 'AliveVille',
    tier: 'parked',
    priority: 'P4',
    kind: 'experiment',
    family: 'ai-game',
    url: 'https://aliveville.com',
    domains: ['aliveville.com'],
    description: 'Persistent AI world and multi-agent simulation experiments.',
  },
  {
    id: 'protein-index',
    name: 'Protein Index',
    tier: 'parked',
    priority: 'P4',
    kind: 'product',
    family: 'protein-index',
    url: 'https://protein.significanthobbies.com',
    domains: ['protein.significanthobbies.com'],
    repo: 'https://github.com/Significant-Hobbies/protein-index',
    description: 'Searchable protein and nutrition reference.',
  },
  {
    id: 'open-historia',
    name: 'Open Historia',
    tier: 'parked',
    priority: 'P4',
    kind: 'experiment',
    family: 'open-historia',
    url: 'https://historia.aliveville.com',
    domains: ['historia.aliveville.com'],
    description: 'Interactive historical storytelling and world simulation.',
  },
  {
    id: 'mobile-dev-cockpit',
    name: 'Mobile Dev Cockpit',
    tier: 'parked',
    priority: 'P4',
    kind: 'product',
    family: 'mobile-dev-cockpit',
    url: 'https://github.com/sarthakagrawal927/mobile-dev-cockpit',
    domains: [],
    repo: 'https://github.com/sarthakagrawal927/mobile-dev-cockpit',
    description: 'Mobile development dashboard — parked, no active investment.',
  },
] as const;

export const catalogGroups: readonly CatalogGroup[] = [
  {
    tier: 'focus',
    label: 'Focus products',
    intro:
      'The three P1 products getting active product attention. Each has its own organization.',
    entries: fleetCatalog.filter((e) => e.tier === 'focus'),
  },
  {
    tier: 'active',
    label: 'Active products and platforms',
    intro:
      'Products and platforms getting regular development. Includes P1 agent infrastructure and P2 products across the SaaS Maker and Significant Hobbies families.',
    entries: fleetCatalog.filter((e) => e.tier === 'active'),
  },
  {
    tier: 'secondary',
    label: 'Secondary products',
    intro:
      'Maintained products with less active investment. Many are personal-use tools under the Significant Hobbies umbrella.',
    entries: fleetCatalog.filter((e) => e.tier === 'secondary'),
  },
  {
    tier: 'parked',
    label: 'Parked experiments',
    intro:
      'Live but no longer receiving active development. Kept running for reference or experimentation.',
    entries: fleetCatalog.filter((e) => e.tier === 'parked'),
  },
];
