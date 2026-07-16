import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';

/**
 * Interactive terminal — the hero centrepiece.
 * Plays a short boot sequence on load, then accepts real commands.
 * Try: help · whoami · stack · work · contact · resume · goto · clear
 */

type Kind = 'cmd' | 'out' | 'ok' | 'dim' | 'accent' | 'err';
type Line = { kind: Kind; text: string; href?: string; external?: boolean };

type WorkItem = { slug: string; title: string };
type ProjectItem = { name: string; url: string };

const PROMPT = 'guest@sarthak';

const BOOT: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'sarthak agrawal — ai infrastructure & product engineer' },
  { kind: 'cmd', text: 'cat focus.txt' },
  { kind: 'accent', text: 'codevetter · posttrainllm · pace' },
  { kind: 'dim', text: "type 'help' for commands — or press ⌘K to navigate" },
];

const HELP: Line[] = [
  { kind: 'dim', text: 'available commands' },
  { kind: 'out', text: '  whoami     who I am and what I do' },
  { kind: 'out', text: '  stack      languages & infrastructure I work with' },
  { kind: 'out', text: '  work       production systems I have built' },
  { kind: 'out', text: '  projects   open-source repositories' },
  { kind: 'out', text: '  open       open a project / case study by name' },
  { kind: 'out', text: '  contact    how to reach me' },
  { kind: 'out', text: '  resume     view my résumé' },
  { kind: 'out', text: '  goto       jump to: about · work · projects · writing' },
  { kind: 'out', text: '  clear      reset the terminal' },
];

/** Rotating prompt hints — keeps the terminal feeling live & invites a real command. */
const HINTS = [
  "try 'help'",
  "try 'work'",
  "try 'goto projects'",
  "try 'whoami'",
  "try 'contact'",
];

const lineClass: Record<Kind, string> = {
  cmd: 'text-fg',
  out: 'text-muted',
  ok: 'text-accent',
  dim: 'text-faint',
  accent: 'text-fg',
  err: 'text-[#f5736b]',
};

export default function TerminalHero({
  work = [],
  projects = [],
}: {
  work?: WorkItem[];
  projects?: ProjectItem[];
}) {
  // Terminal is fully populated from the first render — server-side too — so it
  // never flashes empty and there is no boot animation to "go away".
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [hint, setHint] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the view pinned to the latest output.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  // Rotate the idle hint so the prompt stays visibly interactive.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const print = (out: Line[]) => setLines((prev) => [...prev, ...out]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print([{ kind: 'cmd', text: cmd || '' }]);
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistIdx(-1);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (name) {
      case 'help':
        print(HELP);
        break;
      case 'whoami':
      case 'about':
        print([
          { kind: 'out', text: `${site.name.toLowerCase()} · ${site.role.toLowerCase()}` },
          { kind: 'out', text: 'I build AI infrastructure — and the products that run on it.' },
          { kind: 'out', text: 'serving, orchestration, reliability — and full-stack apps on top.' },
          { kind: 'dim', text: '↳ run: goto about' },
        ]);
        break;
      case 'stack':
      case 'ls':
        print([
          { kind: 'accent', text: 'languages   go · typescript · python · rust' },
          { kind: 'accent', text: 'data        mysql · postgres · redis · clickhouse · milvus · elasticsearch · bigquery' },
          { kind: 'accent', text: 'systems     kafka · temporal · kubernetes · docker · prometheus' },
          { kind: 'accent', text: 'cloud       aws · gcp · cloudflare workers' },
          { kind: 'accent', text: 'ai          rag · embeddings · openai apis · bert' },
        ]);
        break;
      case 'work': {
        if (!work.length) {
          print([{ kind: 'dim', text: '↳ run: goto work' }]);
          break;
        }
        print([
          { kind: 'out', text: 'selected work — click one, or run: open <name>' },
          ...work.map((w): Line => ({
            kind: 'out',
            text: `  → ${w.title}`,
            href: `/work/${w.slug}`,
          })),
        ]);
        break;
      }
      case 'projects':
      case 'repos': {
        if (!projects.length) {
          print([{ kind: 'dim', text: '↳ run: goto projects' }]);
          break;
        }
        print([
          { kind: 'out', text: 'open source — top picks (click, or: open <name>):' },
          ...projects.slice(0, 5).map((p): Line => ({
            kind: 'out',
            text: `  → ${p.name}`,
            href: p.url,
            external: true,
          })),
          { kind: 'dim', text: '↳ all 26 curated — run: goto projects' },
        ]);
        break;
      }
      case 'open': {
        const q = args.join(' ').replace(/['"]/g, '').trim();
        if (!q) {
          print([{ kind: 'err', text: 'open: needs a name — e.g. open vector-feeds' }]);
          break;
        }
        const w = work.find(
          (x) =>
            x.slug.toLowerCase().includes(q) || x.title.toLowerCase().includes(q),
        );
        if (w) {
          print([{ kind: 'ok', text: `→ opening ${w.title}` }]);
          setTimeout(() => window.location.assign(`/work/${w.slug}`), 220);
          break;
        }
        const p = projects.find((x) => x.name.toLowerCase().includes(q));
        if (p) {
          print([{ kind: 'ok', text: `→ opening ${p.name} on github` }]);
          window.open(p.url, '_blank', 'noopener');
          break;
        }
        print([{ kind: 'err', text: `open: nothing matches '${q}'` }]);
        break;
      }
      case 'contact':
        print([
          { kind: 'accent', text: site.email, href: `mailto:${site.email}` },
          {
            kind: 'out',
            text: '→ github.com/sarthakagrawal927',
            href: 'https://github.com/sarthakagrawal927',
            external: true,
          },
          {
            kind: 'out',
            text: '→ x.com/sarthakcodes',
            href: 'https://x.com/sarthakcodes',
            external: true,
          },
        ]);
        break;
      case 'resume':
      case 'cv':
        print([{ kind: 'ok', text: '→ /resume' }]);
        setTimeout(() => window.location.assign(site.resumeUrl), 220);
        break;
      case 'goto':
      case 'cd': {
        const map: Record<string, string> = {
          about: '/about',
          work: '/#work',
          projects: '/projects',
          resume: '/resume',
          writing: '/blog',
          blog: '/blog',
          contact: '/#contact',
          home: '/',
        };
        const dest = map[args[0]];
        if (dest) {
          print([{ kind: 'ok', text: `→ ${dest}` }]);
          setTimeout(() => window.location.assign(dest), 220);
        } else {
          print([{ kind: 'err', text: `goto: unknown target '${args[0] ?? ''}'` }]);
        }
        break;
      }
      case 'cmdk':
      case 'menu':
        window.dispatchEvent(new CustomEvent('cmdk:open'));
        break;
      case 'clear':
        setLines([]);
        break;
      case 'sudo':
        print([{ kind: 'err', text: 'permission denied — nice try :)' }]);
        break;
      case 'echo':
        print([{ kind: 'out', text: args.join(' ') }]);
        break;
      default:
        print([{ kind: 'err', text: `command not found: ${name} — type 'help'` }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="panel overflow-hidden font-mono text-[13px] shadow-2xl shadow-black/40"
      onClick={() => inputRef.current?.focus()}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-panel-2 px-3.5 py-2.5">
        <span className="chrome-dot bg-[#ff5f57]" />
        <span className="chrome-dot bg-[#febc2e]" />
        <span className="chrome-dot bg-[#28c840]" />
        <span className="ml-2 text-xs text-faint">sarthak@infra — zsh — 80×24</span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        className="h-72 space-y-1 overflow-y-auto px-4 py-3.5 leading-relaxed sm:h-80"
      >
        {lines.map((line, idx) => (
          <div key={idx} className={lineClass[line.kind]}>
            {line.kind === 'cmd' ? (
              <>
                <span className="text-accent">{PROMPT}</span>
                <span className="text-faint">:~$</span>{' '}
                <span>{line.text}</span>
              </>
            ) : line.href ? (
              <a
                href={line.href}
                {...(line.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                onClick={(e) => e.stopPropagation()}
                className="whitespace-pre-wrap underline-offset-2 transition-colors hover:text-accent hover:underline"
              >
                {line.text}
              </a>
            ) : (
              <span className="whitespace-pre-wrap">{line.text}</span>
            )}
          </div>
        ))}

        <div className="flex items-center text-fg">
          <span className="text-accent">{PROMPT}</span>
          <span className="text-faint">:~$</span>
          <span className="ml-2 whitespace-pre">{input}</span>
          <span className="ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-accent [animation:var(--animate-blink)]" />
          {!input && (
            <span className="ml-2 select-none text-faint/60">{HINTS[hint]}</span>
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal command input"
            className="absolute h-px w-px opacity-0"
          />
        </div>
      </div>
    </div>
  );
}
