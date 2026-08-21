import { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { site } from '@/data/site';
import { socials } from '@/data/socials';
import {
  buildActionItems,
  buildNavItems,
  CommandFooter,
  CommandSearchBar,
  type Item,
} from './command-palette-items';

/**
 * ⌘K command palette — the primary navigation surface and the mobile menu.
 * Opens on ⌘K / Ctrl+K, on the `/` key, or via any [data-cmdk-trigger] button.
 * Mounted once in BaseLayout with transition:persist so it survives page nav.
 */

function useKeyboardShortcuts(open: boolean, setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
        return;
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
  }, [open, setOpen]);
}

function CommandItemRow({ item, onSelect }: CommandItemRowProps) {
  return (
    <Command.Item
      key={item.label}
      value={item.label}
      onSelect={onSelect}
      className="cmdk-item"
    >
      <span className="cmdk-icon">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.hint && (
        <span className="font-mono text-xs text-faint">{item.hint}</span>
      )}
    </Command.Item>
  );
}

type CommandItemRowProps = {
  item: Item;
  onSelect: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useKeyboardShortcuts(open, setOpen);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 60);
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(site.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  };

  const navItems = buildNavItems();
  const actionItems = buildActionItems(copied, copyEmail);

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
        <CommandSearchBar />

        <Command.List className="max-h-[min(60vh,22rem)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-faint">
            No matches found.
          </Command.Empty>

          <Command.Group heading="Navigate" className="cmdk-group">
            {navItems.map((item) => (
              <CommandItemRow
                key={item.label}
                item={{ ...item, label: `nav ${item.label}` }}
                onSelect={() => run(item.perform)}
              />
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="cmdk-group">
            {actionItems.map((item) => (
              <CommandItemRow
                key={item.label}
                item={{ ...item, label: `action ${item.label}` }}
                onSelect={() =>
                  item.label.startsWith('Copy')
                    ? item.perform()
                    : run(item.perform)
                }
              />
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

        <CommandFooter />
      </div>
    </Command.Dialog>
  );
}
