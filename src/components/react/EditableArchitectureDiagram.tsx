import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ARCH_NODE_H,
  ARCH_NODE_W,
  type ArchDiagramState,
  type ArchKind,
  type ArchNode,
  archDotColor,
  archNodeMap,
  archPath,
  decodeDiagramParam,
  defaultDiagramState,
  encodeDiagramParam,
} from '@/data/architecture';
import { site } from '@/data/site';

const KIND_LABELS: Record<ArchKind, string> = {
  edge: 'ingress',
  compute: 'compute',
  data: 'stateful',
};

export default function EditableArchitectureDiagram() {
  const [diagram, setDiagram] = useState<ArchDiagramState>(defaultDiagramState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const byId = useMemo(() => archNodeMap(diagram.nodes), [diagram.nodes]);
  const selected = selectedId ? byId[selectedId] : null;

  // Hydrate from ?arch= share param once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('arch');
    if (!encoded) return;
    const decoded = decodeDiagramParam(encoded);
    if (decoded) setDiagram(decoded);
  }, []);

  const updateNode = useCallback((id: string, patch: Partial<ArchNode>) => {
    setDiagram((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  }, []);

  const resetDiagram = () => {
    setDiagram(defaultDiagramState());
    setSelectedId(null);
  };

  const copyShareLink = async () => {
    const encoded = encodeDiagramParam(diagram);
    const url = `${window.location.origin}/?arch=${encoded}#approach`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
      window.setTimeout(() => setShareStatus('idle'), 2400);
    } catch {
      window.prompt('Copy this link to share your diagram:', url);
    }
  };

  const buildMailto = (visitorEmail: string, note: string, state: ArchDiagramState) => {
    const shareLink = `${window.location.origin}/?arch=${encodeDiagramParam(state)}#approach`;
    const nodes = state.nodes.map((n) => `- ${n.label} (${n.tag}) [${n.kind}]`).join('\n');
    const body = [
      `From: ${visitorEmail}`,
      '',
      note || '(no message)',
      '',
      'Diagram:',
      nodes,
      '',
      `Share link: ${shareLink}`,
    ].join('\n');

    const params = new URLSearchParams();
    params.set('subject', 'Architecture recommendation');
    params.set('body', body);
    return `mailto:${site.email}?${params.toString()}`;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    window.location.href = buildMailto(email.trim(), message.trim(), diagram);
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-panel-2 px-4 py-2.5 font-mono text-xs text-faint">
        <span>~/architecture — request lifecycle</span>
        <span className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            live data flow
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted">click a node to edit</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 820 410"
          className="block min-w-[680px]"
          role="img"
          aria-label="Editable distributed system diagram. Select a node to change its label and role."
        >
          {diagram.edges.map(([from, to], i) => {
            if (!byId[from] || !byId[to]) return null;
            const p = archPath(byId, from, to);
            return (
              <g key={`${from}-${to}`}>
                <path d={p.d} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                <path
                  d={p.d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 9"
                  opacity="0.85"
                  style={{
                    animation: 'var(--animate-flow)',
                    animationDelay: `-${i * 0.26}s`,
                  }}
                />
                <circle cx={p.x2} cy={p.y2} r="2.6" fill="var(--color-accent)" />
              </g>
            );
          })}

          {diagram.nodes.map((n) => {
            const isSelected = n.id === selectedId;
            return (
              <g
                key={n.id}
                className="arch-node cursor-pointer"
                style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
                onClick={() => setSelectedId(n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(n.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${n.label}, ${n.tag}. ${isSelected ? 'Selected' : 'Click to edit'}.`}
              >
                <rect
                  x={n.cx - ARCH_NODE_W / 2}
                  y={n.cy - ARCH_NODE_H / 2}
                  width={ARCH_NODE_W}
                  height={ARCH_NODE_H}
                  rx="9"
                  fill="var(--color-panel-2)"
                  stroke={isSelected ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
                <circle
                  cx={n.cx - ARCH_NODE_W / 2 + 13}
                  cy={n.cy - ARCH_NODE_H / 2 + 13}
                  r="3"
                  fill={archDotColor[n.kind]}
                />
                <text
                  x={n.cx}
                  y={n.cy - 2}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  fontFamily="var(--font-mono)"
                  fontSize="12.5"
                  fontWeight="500"
                >
                  {n.label}
                </text>
                <text
                  x={n.cx}
                  y={n.cy + 14}
                  textAnchor="middle"
                  fill="var(--color-faint)"
                  fontFamily="var(--font-mono)"
                  fontSize="8.5"
                  letterSpacing="0.04em"
                >
                  {n.tag}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div className="border-t border-line bg-panel-2/60 px-4 py-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            editing — {selected.id}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[11px] text-faint">label</span>
              <input
                type="text"
                value={selected.label}
                maxLength={40}
                onChange={(e) => updateNode(selected.id, { label: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-sm text-fg outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] text-faint">tag</span>
              <input
                type="text"
                value={selected.tag}
                maxLength={48}
                onChange={(e) => updateNode(selected.id, { tag: e.target.value })}
                className="mt-1 w-full rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-sm text-fg outline-none transition-colors focus:border-accent"
              />
            </label>
          </div>
          <div className="mt-3">
            <span className="font-mono text-[11px] text-faint">role</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {(Object.keys(KIND_LABELS) as ArchKind[]).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => updateNode(selected.id, { kind })}
                  className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                    selected.kind === kind
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line-strong text-muted hover:border-faint hover:text-fg'
                  }`}
                >
                  {KIND_LABELS[kind]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-line px-4 py-4"
      >
        <p className="font-mono text-sm text-muted">
          Tweak the diagram, then email your recommendation. Submit opens your mail app.
        </p>

        <label className="mt-4 block">
          <span className="font-mono text-[11px] text-faint">your recommendation</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="What would you change? Trade-offs, missing pieces, scaling concerns…"
            className="mt-1 w-full resize-y rounded-md border border-line-strong bg-panel px-3 py-2.5 font-mono text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="font-mono text-[11px] text-faint">email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-line-strong bg-panel px-3 py-2 font-mono text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
            />
          </label>

          <div className="flex flex-wrap gap-2 sm:pb-0.5">
            <button
              type="button"
              onClick={copyShareLink}
              className="rounded-md border border-line-strong px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-faint hover:text-fg"
            >
              {shareStatus === 'copied' ? 'link copied' : 'copy share link'}
            </button>
            <button
              type="button"
              onClick={resetDiagram}
              className="rounded-md border border-line-strong px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-faint hover:text-fg"
            >
              reset
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-medium text-base transition-opacity hover:opacity-90"
            >
              email me
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 font-mono text-[11px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-faint" />
          ingress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent" />
          compute
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warn" />
          stateful
        </span>
        <span className="ml-auto hidden sm:block">
          built to keep working when something downstream doesn&apos;t
        </span>
      </div>

      <style>{`
        .arch-node {
          transition: transform 0.3s var(--ease-out-expo);
        }
        .arch-node:hover {
          transform: scale(1.04);
        }
        .arch-node rect {
          transition: stroke 0.2s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .arch-node {
            transition: none;
          }
          .arch-node:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
