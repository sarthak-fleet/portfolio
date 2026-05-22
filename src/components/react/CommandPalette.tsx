import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Command } from 'cmdk';
import { navLinks, site } from '@/data/site';
import { socials } from '@/data/socials';

/**
 * ⌘K command palette — the primary navigation surface and the mobile menu.
 * Opens on ⌘K / Ctrl+K, on the `/` key, or via any [data-cmdk-trigger] button.
 * Mounted once in BaseLayout with transition:persist so it survives page nav.
 */

type Item = {
  label: string;
  hint?: string;
  icon: ReactNode;
  perform: () => void;
};

const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
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

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement)?.closest('[data-cmdk-trigger]');
      if (trigger) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', onOpen);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', onOpen);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    // let the dialog close-animation finish before navigating
    setTimeout(fn, 60);
  }, []);

  const go = (href: string) => () => {
    window.location.assign(href);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(site.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  };

  const navItems: Item[] = [
    { label: 'Home', icon: ArrowIcon, perform: go('/') },
    ...navLinks.map((l) => ({
      label: l.label,
      icon: ArrowIcon,
      perform: go(l.href),
    })),
    { label: 'Contact', icon: ArrowIcon, perform: go('/#contact') },
  ];

  const actionItems: Item[] = [
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

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      shouldFilter
      className="cmdk-panel"
      overlayClassName="cmdk-overlay"
      contentClassName="cmdk-content"
    >
      <div>
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

        <Command.List className="max-h-[min(60vh,22rem)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-faint">
            No matches found.
          </Command.Empty>

          <Command.Group heading="Navigate" className="cmdk-group">
            {navItems.map((item) => (
              <Command.Item
                key={item.label}
                value={`nav ${item.label}`}
                onSelect={() => run(item.perform)}
                className="cmdk-item"
              >
                <span className="cmdk-icon">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="cmdk-group">
            {actionItems.map((item) => (
              <Command.Item
                key={item.label}
                value={`action ${item.label}`}
                onSelect={() => (item.label.startsWith('Copy') ? item.perform() : run(item.perform))}
                className="cmdk-item"
              >
                <span className="cmdk-icon">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.hint && (
                  <span className="font-mono text-xs text-faint">{item.hint}</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Connect" className="cmdk-group">
            {socials.map((s) => (
              <Command.Item
                key={s.label}
                value={`connect ${s.label} ${s.handle}`}
                onSelect={() =>
                  run(() => window.open(s.href, '_blank', 'noopener'))
                }
                className="cmdk-item"
              >
                <span className="cmdk-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </span>
                <span className="flex-1">{s.label}</span>
                <span className="font-mono text-xs text-faint">{s.handle}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-faint">
          <span className="flex items-center gap-3">
            <span><kbd>↑↓</kbd> navigate</span>
            <span><kbd>↵</kbd> select</span>
          </span>
          <span>{site.name}</span>
        </div>
      </div>
    </Command.Dialog>
  );
}
