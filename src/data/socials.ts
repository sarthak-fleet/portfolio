/** External links — surfaced in the footer, contact section & ⌘K palette. */

import { site } from './site';

export type Social = {
  label: string;
  /** Short handle shown in the UI. */
  handle: string;
  href: string;
  /** Inline SVG path data (24x24 viewBox). */
  icon: string;
};

export const socials: Social[] = [
  {
    label: 'GitHub',
    handle: 'sarthakagrawal927',
    href: site.profiles.github,
    icon: 'M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.57v-2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.8 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.12-3.13 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.66 1.63.25 2.83.12 3.13.77.82 1.24 1.87 1.24 3.15 0 4.51-2.81 5.5-5.49 5.79.43.36.81 1.08.81 2.18v3.23c0 .32.22.69.83.57A12.04 12.04 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z',
  },
  {
    label: 'LinkedIn',
    handle: 'sarthakagrawal927',
    href: site.profiles.linkedin,
    icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  },
  {
    label: 'X / Twitter',
    handle: '@sarthakcodes',
    href: site.profiles.x,
    icon: 'M18.9 1.6h3.7l-8.1 9.2L24 22.4h-7.4l-5.9-7.6-6.7 7.6H.3l8.6-9.8L0 1.6h7.6l5.3 7 6-7Zm-1.3 18.6h2L6.5 3.7H4.3l13.3 16.5Z',
  },
  {
    label: 'Email',
    handle: 'sarthakagrawal927@gmail.com',
    href: 'mailto:sarthakagrawal927@gmail.com',
    icon: 'M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm10 7L2.5 5.5h19L12 11Zm0 2.2L2 6.8V18h20V6.8l-10 6.4Z',
  },
];
