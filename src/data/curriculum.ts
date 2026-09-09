export type CurriculumLevel = 'Basic' | 'Advanced' | 'Mastery';
export type PracticeTrackHint = 'design' | 'problem' | 'people' | 'sdlc';

export interface CurriculumModule {
  week: number;
  title: string;
  topics: string[];
  output: string;
  level: CurriculumLevel;
  /** Why this week exists in a Staff interview loop. */
  intent: string;
  /** Encyclopedia chapters to study, in recommended order. */
  chapterIds: string[];
  /** Matching 90-day roadmap week (1–12). */
  roadmapWeek: number;
  practiceTrack: PracticeTrackHint;
}

export const curriculumModules: CurriculumModule[] = [
  {
    week: 1,
    title: 'System design foundations',
    topics: ['Requirements', 'Scalability', 'Availability', 'Latency', 'Estimation', 'Diagramming'],
    output: 'URL shortener + estimation sheet',
    level: 'Basic',
    intent: 'Staff interviews start with problem framing, not boxes. Learn to turn product scale into constraints before you draw.',
    chapterIds: ['requirements-quality-attributes', 'capacity-estimation', 'virtual-waiting-room'],
    roadmapWeek: 3,
    practiceTrack: 'design',
  },
  {
    week: 2,
    title: 'Networking, APIs & traffic',
    topics: ['DNS', 'HTTP', 'REST/gRPC', 'Load balancing', 'CDN', 'Rate limits', 'API gateways'],
    output: 'API gateway + protocol comparison',
    level: 'Basic',
    intent: 'Every design has an entry path. Be fluent in how traffic is routed, limited, and failed closed.',
    chapterIds: ['dns-cdn-networking', 'api-protocol-selection', 'load-balancing-rate-limits', 'api-gateway-patterns'],
    roadmapWeek: 3,
    practiceTrack: 'design',
  },
  {
    week: 3,
    title: 'Databases & modeling',
    topics: ['SQL', 'Sharding', 'Replication', 'Indexes', 'Consistent hashing', 'Idempotency'],
    output: 'Payment ledger + database rubric',
    level: 'Basic',
    intent: 'Data choices are rarely reversible. Practice stating the access pattern, then the store, then the failure mode.',
    chapterIds: ['database-selection-sharding', 'idempotent-webhooks', 'replication-protocols', 'consistent-hashing', 'key-value-store-internals'],
    roadmapWeek: 5,
    practiceTrack: 'design',
  },
  {
    week: 4,
    title: 'Caching & messaging',
    topics: ['Cache stampede', 'Invalidation', 'Queues', 'Delivery semantics', 'CQRS', 'CDC'],
    output: 'Notification platform + failure checklist',
    level: 'Basic',
    intent: 'Caches and queues hide correctness bugs until production. Learn stampede, staleness, and at-least-once as first-class design.',
    chapterIds: ['cache-stampede', 'messaging-delivery-semantics', 'event-driven-architecture', 'cqrs-event-sourcing', 'change-data-capture'],
    roadmapWeek: 5,
    practiceTrack: 'design',
  },
  {
    week: 5,
    title: 'Distributed systems',
    topics: ['CAP/PACELC', 'Consensus', 'Clocks', 'Locks', 'Sagas', 'Multi-region'],
    output: 'Job scheduler + failure scenarios',
    level: 'Advanced',
    intent: 'Staff answers name partial failure. Walk consistency, coordination, and what the user sees during a partition.',
    chapterIds: ['cap-pacelc-consistency', 'consensus-coordination', 'time-and-clocks', 'distributed-transactions', 'distributed-locks-leader-election', 'multi-region-active-active'],
    roadmapWeek: 4,
    practiceTrack: 'design',
  },
  {
    week: 6,
    title: 'Reliability & observability',
    topics: ['Retries', 'SLOs', 'Error budgets', 'Alerting', 'Chaos', 'Autoscaling'],
    output: 'SLO worksheet + incident kit',
    level: 'Advanced',
    intent: 'Reliability is a product decision. Connect user-facing SLIs to error budgets, load shedding, and incident practice.',
    chapterIds: ['resilience-patterns', 'slo-observability-incidents', 'metrics-monitoring-alerting', 'chaos-engineering', 'autoscaling-capacity'],
    roadmapWeek: 7,
    practiceTrack: 'problem',
  },
  {
    week: 7,
    title: 'Cloud, security & tenancy',
    topics: ['Kubernetes', 'IAM', 'Zero trust', 'Encryption', 'Multi-tenant isolation'],
    output: 'Multi-tenant SaaS + threat model',
    level: 'Advanced',
    intent: 'Staff designs assume hostile tenants and leaked credentials. Isolation and identity are architecture, not a checklist.',
    chapterIds: ['kubernetes-for-engineers', 'security-multitenancy', 'zero-trust-networking', 'cryptography-primitives', 'infrastructure-as-code'],
    roadmapWeek: 8,
    practiceTrack: 'sdlc',
  },
  {
    week: 8,
    title: 'Staff architecture',
    topics: ['RFCs', 'ADRs', 'Platform', 'Migrations', 'Archetypes', 'Tech debt'],
    output: 'Modernization strategy + roadmap',
    level: 'Advanced',
    intent: 'This is the job: diagnose, decide, write it down, and migrate without heroics.',
    chapterIds: ['staff-archetypes', 'technical-strategy-decisions', 'platform-engineering', 'safe-delivery-migrations', 'technical-debt-management', 'domain-driven-design'],
    roadmapWeek: 9,
    practiceTrack: 'sdlc',
  },
  {
    week: 9,
    title: 'AI & LLM foundations',
    topics: ['Prompting', 'Embeddings', 'Serving', 'Routing', 'Evaluation'],
    output: 'AI document assistant + cost model',
    level: 'Mastery',
    intent: 'Treat models as unreliable dependencies. Route, cache, evaluate, and budget like any other production system.',
    chapterIds: ['prompt-engineering', 'vector-databases-embeddings', 'ml-serving-infrastructure', 'llm-router', 'semantic-cache', 'ai-evaluation-testing'],
    roadmapWeek: 6,
    practiceTrack: 'design',
  },
  {
    week: 10,
    title: 'Production RAG & agents',
    topics: ['Retrieval', 'Permissions', 'Tool calling', 'Guardrails', 'Human escalation'],
    output: 'Enterprise RAG + evaluation plan',
    level: 'Mastery',
    intent: 'Demo RAG is not production RAG. Permissions, answerability, and bounded tools are the Staff bar.',
    chapterIds: ['production-rag', 'agents-tool-calling'],
    roadmapWeek: 9,
    practiceTrack: 'design',
  },
  {
    week: 11,
    title: 'Behavioral leadership',
    topics: ['Influence', 'Conflict', 'Mentoring', 'Ambiguity', 'Cross-team delivery'],
    output: 'Twelve adaptable Staff stories',
    level: 'Mastery',
    intent: 'Behavioral rounds fail on vague stories. Build evidence of influence without authority.',
    chapterIds: ['influence-conflict-feedback', 'mentoring-leverage', 'staff-archetypes'],
    roadmapWeek: 10,
    practiceTrack: 'people',
  },
  {
    week: 12,
    title: 'Mock interviews & revision',
    topics: ['System design', 'AI design', 'Behavioral', 'Mistake review'],
    output: 'Interview records + final gap plan',
    level: 'Mastery',
    intent: 'Close the loop: timed mocks, flashcards, and the mistakes you keep repeating.',
    chapterIds: ['requirements-quality-attributes', 'capacity-estimation', 'staff-archetypes'],
    roadmapWeek: 12,
    practiceTrack: 'design',
  },
];
