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
