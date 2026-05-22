/**
 * Capability matrix — drives the "Expertise" section on the home page.
 * Four domains, each a panel. Reorder `items` to control emphasis.
 */

export type Domain = {
  id: string;
  /** Two-digit index shown as a mono label, e.g. "01". */
  index: string;
  title: string;
  blurb: string;
  items: string[];
};

export const domains: Domain[] = [
  {
    id: 'backend',
    index: '01',
    title: 'Backend & APIs',
    blurb:
      'Getting the service right comes before getting it fast. I care about clean contracts and knowing how things break before they do.',
    items: ['Go', 'Node.js / TypeScript', 'Python', 'Protocol Buffers', 'REST APIs', 'Microservices'],
  },
  {
    id: 'distributed',
    index: '02',
    title: 'Distributed Systems & Reliability',
    blurb:
      'Streaming pipelines, durable workflows, real-time delivery — the parts that decide whether a product survives getting popular.',
    items: [
      'Apache Kafka',
      'Temporal',
      'Socket.io',
      'Queue-based batching',
      'Docker & Kubernetes',
      'Prometheus',
    ],
  },
  {
    id: 'ai-infra',
    index: '03',
    title: 'AI / LLM Infrastructure',
    blurb:
      'Personalized feeds, retrieval pipelines, agents. The goal is AI that holds up in production, not just in a demo.',
    items: [
      'RAG pipelines',
      'OpenAI APIs',
      'BERT embeddings',
      'Milvus vector DB',
      'GPT-powered features',
      'Real-time vector enrichment',
    ],
  },
  {
    id: 'data',
    index: '04',
    title: 'Data & Storage',
    blurb:
      'Pick storage for how the data actually gets read and written. Then cache the slow paths until they stop being slow.',
    items: ['MySQL', 'PostgreSQL', 'Redis', 'ClickHouse', 'Elasticsearch', 'BigQuery'],
  },
];
