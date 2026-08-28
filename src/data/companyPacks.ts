export type CompanyPackId = 'none' | 'google' | 'meta' | 'netflix' | 'startup' | 'amazon' | 'atlassian';

export interface CompanyPack {
  id: CompanyPackId;
  label: string;
  company: string;
  description: string;
  focus: string[];
  chapterAngles: Record<string, string>;
  practiceContext: string;
  behavioralQuestions: string[];
}

export const COMPANY_PACKS: Record<Exclude<CompanyPackId, 'none'>, CompanyPack> = {
  google: {
    id: 'google',
    label: 'Google Pack',
    company: 'Google',
    description: 'System design depth, distributed systems, and estimation at planetary scale.',
    focus: ['System design', 'Distributed systems', 'Capacity estimation'],
    chapterAngles: {
      'capacity-estimation': 'Google interviews expect back-of-envelope math with explicit uncertainty ranges and headroom assumptions.',
      'cap-pacelc-consistency': 'Be ready to discuss Spanner-style external consistency and when strong consistency is worth the latency cost.',
      'consensus-coordination': 'Chubby, Borg, and Colossus are fair reference points — explain trade-offs, not name-drops.',
      'load-balancing-rate-limits': 'Discuss global load balancing, hierarchical quotas, and protecting shared infrastructure from hot tenants.',
      'database-selection-sharding': 'Reference Spanner and Bigtable trade-offs — explain why Google built custom storage rather than adopting off-the-shelf systems for planetary scale.',
      'resilience-patterns': 'Discuss the DiRT (Disaster Recovery Testing) philosophy — resilience is validated by deliberately breaking production, not just designed on paper.',
      'slo-observability-incidents': 'This is Google SRE\'s home turf — speak fluently about error budgets, multi-window burn alerts, and the blameless postmortem culture from the SRE book.',
      'production-rag': 'Ground answers in retrieval quality at web scale — discuss how ranking, freshness, and groundedness trade off against latency for billions of queries.',
      'llm-router': 'Discuss routing across a model fleet (Gemini variants) by cost, latency, and quality — a genuinely Google-flavored system design problem.',
      'cache-stampede': 'Discuss caching at the scale of a global CDN — hot-key isolation and stampede protection are core to serving search and ads traffic.',
    },
    practiceContext: 'Frame answers with clear requirements, estimation, high-level design, deep dive, and trade-off summary.',
    behavioralQuestions: [
      'Tell me about a time you improved reliability for a system serving millions of users.',
      'Describe a technical decision where you had to balance latency against consistency.',
    ],
  },
  meta: {
    id: 'meta',
    label: 'Meta Pack',
    company: 'Meta',
    description: 'Product sense, cross-functional collaboration, and moving fast at scale.',
    focus: ['Product thinking', 'Cross-functional influence', 'Execution'],
    chapterAngles: {
      'requirements-quality-attributes': 'Meta values moving fast with measurable impact — tie quality attributes to product metrics, not engineering elegance alone.',
      'influence-conflict-feedback': 'Expect questions about influencing PM and design partners without authority.',
      'technical-strategy-decisions': 'Discuss how you aligned multiple teams on a technical direction with incomplete information.',
      'capacity-estimation': 'Frame estimation around engagement metrics (DAU, feed impressions) rather than raw infrastructure — connect scale to product impact.',
      'safe-delivery-migrations': 'Meta ships via feature flags and gradual rollout at massive scale — discuss dark launches and stop-gate metrics tied to user-facing A/B results.',
      'production-rag': 'Discuss grounding and evaluation for consumer-facing AI features — Meta AI and assistant products need answers that scale to billions of users without hallucination risk.',
      'agents-tool-calling': 'Frame around consumer product surfaces (Meta AI, WhatsApp assistant) — emphasize guardrails and user trust over raw capability.',
      'security-multitenancy': 'Discuss privacy-by-design at consumer scale — Meta\'s ad platform and messaging surfaces require strict data boundaries between advertisers, users, and internal teams.',
    },
    practiceContext: 'Include product impact, metrics, and how you would collaborate with PM and design.',
    behavioralQuestions: [
      'Describe a project where you influenced product direction through technical insight.',
      'How do you prioritize when engineering quality conflicts with speed to market?',
    ],
  },
  netflix: {
    id: 'netflix',
    label: 'Netflix Pack',
    company: 'Netflix',
    description: 'Culture of freedom and responsibility, high-trust leadership, and operational excellence.',
    focus: ['Culture fit', 'Judgment', 'Operational ownership'],
    chapterAngles: {
      'slo-observability-incidents': 'Netflix expects engineers to own their services end-to-end — discuss operational maturity and incident leadership.',
      'resilience-patterns': 'Chaos engineering and graceful degradation are cultural expectations, not optional nice-to-haves.',
      'influence-conflict-feedback': 'The culture deck emphasizes candid feedback — show you can give and receive direct, constructive input.',
      'cache-stampede': 'Reference Netflix\'s EVCache and open-connect CDN work — discuss caching at the edge for a mostly-read, latency-sensitive streaming catalog.',
      'load-balancing-rate-limits': 'Discuss Zuul-style API gateway routing and regional failover — Netflix\'s active-active multi-region design is a natural reference point.',
      'technical-strategy-decisions': 'Netflix favors "highly aligned, loosely coupled" teams — discuss how you set technical direction without heavyweight process or centralized control.',
      'security-multitenancy': 'Frame around content licensing boundaries and regional entitlement — a Netflix-specific multi-tenancy problem distinct from typical SaaS isolation.',
      'safe-delivery-migrations': 'Discuss canary analysis (Kayenta-style) and automated rollback based on real-time metrics rather than manual gates.',
    },
    practiceContext: 'Demonstrate ownership, judgment, and how you would operate with minimal process overhead.',
    behavioralQuestions: [
      'Give an example of exercising judgment without waiting for permission.',
      'Describe a time you gave difficult feedback to a peer or manager.',
    ],
  },
  startup: {
    id: 'startup',
    label: 'Startup Pack',
    company: 'Startup',
    description: 'Resource constraints, rapid iteration, and wearing multiple hats.',
    focus: ['Pragmatism', 'Speed', 'Breadth'],
    chapterAngles: {
      'safe-delivery-migrations': 'Startups need reversible decisions — emphasize incremental delivery and avoiding premature optimization.',
      'technical-strategy-decisions': 'Discuss how you made pragmatic architecture choices with limited headcount and runway.',
      'capacity-estimation': 'Estimate for 10x growth, not 1000x — show you right-size for stage while leaving escape hatches.',
      'database-selection-sharding': 'Default to the boring, well-understood database (managed Postgres) until a specific, measured pain justifies anything more exotic — sharding is a last resort, not a starting point.',
      'api-protocol-selection': 'REST over a managed API gateway beats gRPC or GraphQL for a small team — optimize for what one or two engineers can operate and debug at 2am.',
      'resilience-patterns': 'Discuss the minimum viable resilience: timeouts and a single retry with backoff, not a full circuit breaker library — match effort to actual failure frequency at your scale.',
      'security-multitenancy': 'Shared schema with a tenant_id column and disciplined query filtering is the right starting isolation tier — siloed infrastructure is premature at pre-PMF stage.',
      'production-rag': 'Discuss shipping a thin RAG wrapper over a hosted vector DB and managed LLM API rather than building retrieval infrastructure in-house — speed to validate the product idea matters more than owning the stack.',
    },
    practiceContext: 'Optimize for speed of learning, minimal viable architecture, and clear escalation when constraints bite.',
    behavioralQuestions: [
      'Tell me about a time you shipped something imperfect to learn faster.',
      'How do you decide what not to build?',
    ],
  },
  amazon: {
    id: 'amazon',
    label: 'Amazon Pack',
    company: 'Amazon',
    description: 'Leadership Principles, ownership at scale, and operational rigor across distributed systems.',
    focus: ['Leadership Principles', 'Ownership', 'Operational excellence'],
    chapterAngles: {
      'distributed-transactions': 'Tie saga and reconciliation to Ownership and Dive Deep — show how you closed ambiguous financial outcomes.',
      'idempotent-webhooks': 'Payment and fulfillment flows are a common bar-raiser topic; emphasize durable receipts and repair paths.',
      'slo-observability-incidents': 'Customer Obsession means user-centered SLIs; discuss error budgets and incident leadership with measurable recovery.',
      'influence-conflict-feedback': 'Use Earn Trust and Disagree and Commit — represent opposing views, then close with a decision owner.',
      'technical-strategy-decisions': 'Frame strategy with Think Big and Bias for Action, distinguishing one-way from two-way doors.',
      'capacity-estimation': 'Frugality means estimating with cost as a first-class constraint alongside latency and availability — justify every unit of headroom.',
      'database-selection-sharding': 'Reference DynamoDB\'s single-table design philosophy — discuss why Amazon favors purpose-built, horizontally-scalable stores over general-purpose relational defaults.',
      'load-balancing-rate-limits': 'Tie rate limiting to Customer Obsession — protecting shared infrastructure from one tenant\'s traffic burst is a direct commitment to every other customer.',
      'resilience-patterns': 'Amazon\'s cell-based architecture and bulkhead patterns exist specifically to contain blast radius — discuss Ownership of failure domains, not just retry logic.',
      'security-multitenancy': 'AWS IAM\'s least-privilege model is the reference architecture — discuss Are Right, A Lot judgment calls on isolation tier versus cost for enterprise tenants.',
      'safe-delivery-migrations': 'Bias for Action with reversibility — discuss two-way-door migrations you shipped fast, and where you slowed down deliberately because a decision was a one-way door.',
      'messaging-delivery-semantics': 'Ownership of a payment or fulfillment event pipeline requires answering precisely what "processed" means — discuss idempotency and dead-letter handling with Dive Deep specificity.',
      'production-rag': 'Frugality and Customer Obsession together — discuss cost-per-query trade-offs in enterprise RAG (Bedrock-style) without sacrificing groundedness.',
      'agents-tool-calling': 'Ownership extends to autonomous systems — discuss approval gates and audit trails as the mechanism for Earning Trust with an agent that can take real actions.',
      'api-protocol-selection': '"Working backwards" from the API contract is an Amazon-specific practice — discuss designing the interface and press release before the implementation.',
    },
    practiceContext: 'Structure answers with the situation, your ownership, the customer impact, trade-offs considered, and measurable results.',
    behavioralQuestions: [
      'Tell me about a time you took ownership beyond your formal scope to unblock a customer-impacting issue.',
      'Describe a decision where you had to Dive Deep into data before changing course.',
      'Give an example of disagreeing with a team and still committing to the outcome.',
    ],
  },
  atlassian: {
    id: 'atlassian',
    label: 'Atlassian Pack',
    company: 'Atlassian',
    description: 'Collaborative system design, platform thinking, and shipping durable products for teams.',
    focus: ['Collaboration', 'Platform APIs', 'Sustainable delivery'],
    chapterAngles: {
      'api-protocol-selection': 'Atlassian-scale products depend on stable public APIs — discuss versioning, compatibility, and developer experience.',
      'safe-delivery-migrations': 'Show how you shipped incrementally without breaking ecosystem consumers or internal teams.',
      'technical-strategy-decisions': 'Demonstrate cross-team alignment: diagnosis, guiding policy, and sequenced actions with clear owners.',
      'security-multitenancy': 'Multi-tenant SaaS isolation is central — connect tenant context, authorization, and blast-radius containment.',
      'influence-conflict-feedback': 'Play as a Team: show how you built trust across product, design, and engineering without status games.',
      'database-selection-sharding': 'Discuss the tenant-per-schema versus shared-schema trade-off directly — Jira and Confluence\'s data model decisions hinge on this exact question at scale.',
      'load-balancing-rate-limits': 'Discuss per-tenant fairness in a shared marketplace of apps and integrations — a noisy Forge app should not degrade the platform for every other tenant.',
      'resilience-patterns': 'Frame around protecting the platform from third-party app and integration failures — Atlassian\'s ecosystem model means resilience extends beyond your own code.',
      'messaging-delivery-semantics': 'Discuss webhook delivery guarantees for the Atlassian Marketplace — thousands of third-party apps depend on predictable at-least-once delivery semantics.',
      'production-rag': 'Frame around Rovo and enterprise knowledge search across Confluence/Jira — permission-aware retrieval is the central constraint given per-tenant, per-space access controls.',
    },
    practiceContext: 'Explain how your design supports many teams and customers, not only one service boundary.',
    behavioralQuestions: [
      'Describe a time you aligned multiple teams on a technical direction with incomplete information.',
      'Tell me about improving developer experience for internal or external API consumers.',
      'How have you balanced shipping quickly with maintaining long-term platform quality?',
    ],
  },
};

export function getActivePack(packId: CompanyPackId): CompanyPack | null {
  if (packId === 'none') return null;
  return COMPANY_PACKS[packId];
}

export function getChapterPackAngle(packId: CompanyPackId, chapterId: string): string | null {
  const pack = getActivePack(packId);
  return pack?.chapterAngles[chapterId] ?? null;
}
