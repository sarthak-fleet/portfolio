/**
 * Full résumé content — the canonical, complete version (mirrors resume.tex).
 * This is more detailed than `experience.ts`, which is trimmed for the
 * marketing pages. The /resume page renders from here.
 */

export const resumeExperience = [
  {
    role: 'Software Engineer',
    company: 'VaultWealth',
    note: 'Peak XV',
    period: 'Feb 2025 — Present',
    bullets: [
      'Created a Financial Planning Service (Go, MySQL) and wrote proprietary logic to calculate clients’ financial health score.',
      'Migrated multiple workflows to Temporal, eliminating 90% of unexpected failures and freeing engineering ~3 hrs/day.',
      'Transitioned the web app from MUI to Tailwind; built multiple responsive frontend components in React.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Front.Page',
    note: 'YC S’21',
    period: 'Jan 2022 — Jan 2025',
    bullets: [
      'Developed a real-time pipeline for stock data using Go, Kafka and Protocol Buffers — helped DAU grow from 15k to 200k in 14 weeks.',
      'Integrated vector-powered personalized feeds using BERT embeddings, GPT calls and Milvus as the vector DB — 40% more engagement on the home feed. Built a pipeline with real-time events from BigQuery for richer user vectors.',
      'Built multiple (support, learning, assistant) RAG-based chatbots using OpenAI APIs; the moderation bot reduced human intervention in support queries by 90%.',
      'Wrote a microservice in Node.js with MySQL (Prisma) for complete stock-fundamental data lifecycle management.',
      'Built hot news with read/unread and last-visit tracking — tripled average news scroll count in 3 weeks. Used ClickHouse as the data aggregator with RudderStack as the pipeline.',
      'Implemented O(1) space/time retrieval of a user’s unread news and global notification counts using Redis.',
      'Integrated the Razorpay payment gateway with Node.js — a new revenue source and a 50% increase in overall revenue.',
      'Implemented queue-based batching to improve database efficiency; optimized session handling with granular controls, reducing session-refresh DB calls by 92%.',
      'Improved SEO performance by cutting HTML build and load time from 600ms to 60ms via Redis caching.',
      'Incorporated FCM topic-based notifications, reducing delivery time by 90% and increasing delivery rate by 30%.',
      'Planned and integrated real-time stock ticks via Socket.io with three modes: room-based, in-memory, or Redis for subscription management.',
    ],
  },
];

export const resumeSkills = [
  { label: 'Languages', items: 'JavaScript / TypeScript, Golang, Python' },
  {
    label: 'Databases & Data Tools',
    items:
      'MySQL, PostgreSQL, Redis, Elasticsearch, Kafka, ClickHouse, Milvus, BigQuery',
  },
  {
    label: 'Cloud & DevOps',
    items: 'AWS, GCP, Docker, Kubernetes, Prometheus, Temporal, GenAI',
  },
];

export const resumeProjects = [
  {
    name: 'Stumble — Social App',
    stack:
      'Node.js, PostgreSQL (PostGIS), Redis, Docker, AWS, Flutter, Astro, Python',
    bullets: [
      'Launched a platform to help users connect with people nearby, encouraging meaningful in-person interactions.',
      'Supported real-time chat, location-based profile filtering, face recognition, Google auth and push notifications.',
    ],
  },
  {
    name: 'SignificantHobbies — Life Management App',
    stack: 'Next.js, Golang, PostgreSQL, Docker, AWS, Tailwind',
    bullets: [
      'Launched a personal productivity app to manage tasks, habits, food logs, journals and schedules.',
      'Designed custom form validation, preference-based schedule generation and efficient CRUD operations.',
    ],
  },
  {
    name: 'PlayWordle — CLI Puzzle Solver',
    stack: 'Golang',
    bullets: [
      'Devised a CLI application to solve New York Times Wordle puzzles with over a 97% success rate.',
    ],
  },
];

export const resumeEducation = {
  school: 'Manipal Institute of Technology',
  degree: 'B.Tech in Computer Science Engineering',
  period: 'Aug 2018 — Jul 2022',
  detail:
    'Coursework: Algorithms, Data Structures, DBMS, OOP, Operating Systems, Computer Networks. Built several internal college portals (recommendations, placement, fest, library management).',
};
