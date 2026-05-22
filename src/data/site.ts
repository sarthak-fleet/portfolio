/**
 * Single source of truth for site-wide identity & copy.
 * Edit anything here and it propagates across every page.
 */

export const site = {
  name: 'Sarthak Agrawal',
  initials: 'SA',
  /** Headline role — what the whole site is positioned around. */
  role: 'AI Infrastructure Engineer',
  /** One-line hero statement. */
  tagline:
    'I build the backend and infrastructure that AI products actually run on.',
  /** Short blurb for SEO / meta description. */
  description:
    'Sarthak Agrawal — AI Infrastructure Engineer with deep backend expertise. Real-time data pipelines, vector-powered feeds, RAG systems, durable workflows and the distributed infrastructure underneath.',
  /** Used for canonical URLs & OG tags. Keep in sync with astro.config.mjs `site`. */
  url: 'https://sarthakagrawal.dev',
  email: 'sarthakagrawal927@gmail.com',
  location: 'India',
  /** The résumé page (on-site, HTML). */
  resumeUrl: '/resume',
  /** The downloadable PDF — produced by the LaTeX GitHub Action. */
  resumePdf: '/resume.pdf',
  /** GitHub username — drives build-time stats & the projects page. */
  githubUser: 'sarthakagrawal927',
  /** Availability badge in the nav. Set to null to hide. */
  availability: 'Open to AI infra & backend roles',
} as const;

/** Primary nav + command-palette destinations. */
export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Writing', href: '/blog' },
] as const;
