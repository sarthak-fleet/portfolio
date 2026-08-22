import type { ReactNode } from 'react';
import { Command } from 'cmdk';
import { navLinks, site } from '@/data/site';

export type Item = {
  label: string;
  hint?: string;
  icon: ReactNode;
  perform: () => void;
};

const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const DocIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  </svg>
);

const go = (href: string) => () => {
  window.location.assign(href);
};

export function buildNavItems(): Item[] {
  return [
    { label: 'Home', icon: ArrowIcon, perform: go('/') },
    ...navLinks.map((l) => ({
      label: l.label,
      icon: ArrowIcon,
      perform: go(l.href),
    })),
    { label: 'Contact', icon: ArrowIcon, perform: go('/#contact') },
  ];
}

export function buildActionItems(
  copied: boolean,
  copyEmail: () => void
): Item[] {
  return [
    {
      label: copied ? 'Email copied to clipboard' : 'Copy email address',
      hint: site.email,
      icon: CopyIcon,
      perform: copyEmail,
    },
    {
      label: 'Download résumé',
      icon: DocIcon,
      perform: go(site.resumeUrl),
    },
  ];
}

export function CommandSearchBar() {
  return (
    <div className="flex items-center gap-2.5 border-b border-line px-4">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <Command.Input
        placeholder="Jump to a section, copy contact, open a profile…"
        className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-faint"
      />
      <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
        ESC
      </kbd>
    </div>
  );
}

export function CommandFooter() {
  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-faint">
      <span className="flex items-center gap-3">
        <span>
          <kbd>↑↓</kbd> navigate
        </span>
        <span>
          <kbd>↵</kbd> select
        </span>
      </span>
      <span>{site.name}</span>
    </div>
  );
}
