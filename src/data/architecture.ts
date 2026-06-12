/**
 * Default distributed-system diagram — shared by the editable React island
 * and any server-side validation.
 */

export type ArchKind = 'edge' | 'compute' | 'data';

export interface ArchNode {
  id: string;
  cx: number;
  cy: number;
  label: string;
  tag: string;
  kind: ArchKind;
}

export type ArchEdge = [string, string];

export const ARCH_NODE_W = 120;
export const ARCH_NODE_H = 54;
export const ARCH_PORT = 60;

export const defaultArchNodes: ArchNode[] = [
  { id: 'clients', cx: 72, cy: 212, label: 'Clients', tag: 'web · mobile', kind: 'edge' },
  { id: 'edge', cx: 234, cy: 212, label: 'Edge / CDN', tag: 'cloudflare', kind: 'edge' },
  { id: 'api', cx: 400, cy: 212, label: 'API Gateway', tag: 'auth · routing', kind: 'compute' },
  { id: 'queue', cx: 582, cy: 96, label: 'Kafka', tag: 'event stream', kind: 'data' },
  { id: 'llm', cx: 582, cy: 212, label: 'Vector Search', tag: 'milvus · embeddings', kind: 'compute' },
  { id: 'db', cx: 582, cy: 328, label: 'MySQL', tag: 'primary store', kind: 'data' },
  { id: 'workers', cx: 744, cy: 96, label: 'Workers', tag: 'go services', kind: 'compute' },
  { id: 'cache', cx: 744, cy: 270, label: 'Redis', tag: 'cache · realtime', kind: 'data' },
];

export const defaultArchEdges: ArchEdge[] = [
  ['clients', 'edge'],
  ['edge', 'api'],
  ['api', 'queue'],
  ['api', 'llm'],
  ['api', 'db'],
  ['queue', 'workers'],
  ['llm', 'cache'],
  ['workers', 'db'],
  ['workers', 'cache'],
];

export const archDotColor: Record<ArchKind, string> = {
  edge: 'var(--color-faint)',
  compute: 'var(--color-accent)',
  data: 'var(--color-warn)',
};

export interface ArchDiagramState {
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export function cloneDiagramState(state: ArchDiagramState): ArchDiagramState {
  return {
    nodes: state.nodes.map((n) => ({ ...n })),
    edges: state.edges.map(([a, b]) => [a, b] as ArchEdge),
  };
}

export function defaultDiagramState(): ArchDiagramState {
  return cloneDiagramState({ nodes: defaultArchNodes, edges: defaultArchEdges });
}

export function archNodeMap(nodes: ArchNode[]): Record<string, ArchNode> {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

export function archPath(
  byId: Record<string, ArchNode>,
  aId: string,
  bId: string,
): { d: string; x1: number; y1: number; x2: number; y2: number } {
  const a = byId[aId];
  const b = byId[bId];
  const x1 = a.cx + ARCH_PORT;
  const y1 = a.cy;
  const x2 = b.cx - ARCH_PORT;
  const y2 = b.cy;
  const mx = (x1 + x2) / 2;
  return { d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 };
}

const ARCH_KINDS: ArchKind[] = ['edge', 'compute', 'data'];

function isArchKind(value: unknown): value is ArchKind {
  return typeof value === 'string' && ARCH_KINDS.includes(value as ArchKind);
}

function isArchNode(value: unknown): value is ArchNode {
  if (!value || typeof value !== 'object') return false;
  const n = value as ArchNode;
  return (
    typeof n.id === 'string' &&
    typeof n.cx === 'number' &&
    typeof n.cy === 'number' &&
    typeof n.label === 'string' &&
    typeof n.tag === 'string' &&
    isArchKind(n.kind)
  );
}

/** Parse a base64url-encoded diagram from a share link. */
export function decodeDiagramParam(encoded: string): ArchDiagramState | null {
  try {
    const json = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(json) as ArchDiagramState;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    if (!parsed.nodes.every(isArchNode)) return null;
    if (
      !parsed.edges.every(
        (e) =>
          Array.isArray(e) &&
          e.length === 2 &&
          typeof e[0] === 'string' &&
          typeof e[1] === 'string',
      )
    ) {
      return null;
    }
    return cloneDiagramState(parsed);
  } catch {
    return null;
  }
}

/** Encode diagram state for a shareable URL fragment. */
export function encodeDiagramParam(state: ArchDiagramState): string {
  const json = JSON.stringify(state);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
