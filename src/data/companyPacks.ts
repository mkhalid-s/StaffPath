export type CompanyPackId = 'none' | 'google' | 'meta' | 'netflix' | 'startup';

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
};

export function getActivePack(packId: CompanyPackId): CompanyPack | null {
  if (packId === 'none') return null;
  return COMPANY_PACKS[packId];
}

export function getChapterPackAngle(packId: CompanyPackId, chapterId: string): string | null {
  const pack = getActivePack(packId);
  return pack?.chapterAngles[chapterId] ?? null;
}
