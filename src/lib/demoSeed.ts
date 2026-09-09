import { appStore } from './appStore';
import type { StaffPathState } from '../domain/appState';
import { communicationLessons } from '../data/communicationLessons';

function daysAgo(days: number): string {
  const d = new Date('2026-08-15');
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function buildDemoState(): StaffPathState {
  const roadmap: StaffPathState['roadmap'] = {};
  for (let id = 1; id <= 42; id++) {
    roadmap[String(id)] = {
      completedAt: daysAgo(90 - Math.round((id / 42) * 60)),
      focusedSeconds: 2400 + (id % 5) * 300,
      communicationComplete: id % 3 === 0,
      reflection: id % 4 === 0 ? 'Solid grasp of the core trade-off; need more practice defending it under follow-up pressure.' : '',
      artifact: id % 5 === 0 ? 'Diagram + estimation sheet saved to notes.' : '',
    };
  }

  const practiceAttempts: StaffPathState['practiceAttempts'] = [
    { id: 'demo-1', challengeId: 'design-1', track: 'design', title: 'Design a URL shortener', variation: 'Start at 10,000 users, then explain the path to 100 million users.', response: 'Covered hashing scheme, read-heavy cache, and regional redirect failover.', reflection: 'Missed discussing custom alias abuse prevention until prompted.', score: 4, maxScore: 6, date: daysAgo(58) },
    { id: 'demo-2', challengeId: 'design-6', track: 'design', title: 'Design a payment ledger', variation: 'Handle provider timeouts without double charging.', response: 'Used idempotency keys and a durable event log with reconciliation.', reflection: 'Good grasp of double-entry thinking; need sharper reconciliation cadence.', score: 5, maxScore: 6, date: daysAgo(52) },
    { id: 'demo-3', challengeId: 'design-4', track: 'design', title: 'Design a social feed', variation: 'Optimize for celebrity accounts with millions of followers.', response: 'Hybrid fan-out on write/read with celebrity threshold.', reflection: 'Solid, but ranking freshness trade-off was shallow.', score: 4, maxScore: 6, date: daysAgo(47) },
    { id: 'demo-4', challengeId: 'problem-1', track: 'problem', title: 'The overloaded platform team', variation: 'Measure demand, toil, ownership, and avoidable contacts.', response: 'Proposed a self-service path and toil audit.', reflection: 'Should have asked about team morale data first.', score: 4, maxScore: 6, date: daysAgo(44) },
    { id: 'demo-5', challengeId: 'problem-2', track: 'problem', title: 'Diagnose a production incident', variation: '', response: 'Walked through hypothesis-driven debugging with rollback criteria.', reflection: 'Confident structure; timeline was a little rushed.', score: 5, maxScore: 6, date: daysAgo(40) },
    { id: 'demo-6', challengeId: 'people-1', track: 'people', title: 'Give difficult feedback', variation: '', response: 'Used SBI model with a specific design-review example.', reflection: 'Need to practice staying concise under time pressure.', score: 4, maxScore: 6, date: daysAgo(38) },
    { id: 'demo-7', challengeId: 'people-2', track: 'people', title: 'Facilitate a stuck decision', variation: '', response: 'Restated decision owner and time-boxed the debate.', reflection: 'Good facilitation instinct.', score: 5, maxScore: 6, date: daysAgo(33) },
    { id: 'demo-8', challengeId: 'people-3', track: 'people', title: 'Coach instead of solving', variation: '', response: 'Asked clarifying questions instead of handing over the design.', reflection: 'Sometimes still jump to the answer too fast.', score: 3, maxScore: 6, date: daysAgo(29) },
    { id: 'demo-9', challengeId: 'sdlc-1', track: 'sdlc', title: 'Turn a request into a problem statement', variation: '', response: 'Identified the real user and measurable outcome before scoping.', reflection: 'Strong translation from ask to problem statement.', score: 5, maxScore: 6, date: daysAgo(24) },
    { id: 'demo-10', challengeId: 'design-5', track: 'design', title: 'Design a messaging system', variation: 'Serve 50 million concurrently connected users.', response: 'Separated connection layer from durable message store.', reflection: 'Ordering guarantees discussion needs more depth.', score: 4, maxScore: 6, date: daysAgo(18) },
    { id: 'demo-11', challengeId: 'problem-3', track: 'problem', title: 'Diagnose a data inconsistency', variation: '', response: 'Traced the discrepancy to a missing idempotency key.', reflection: 'Fast root-causing this time.', score: 5, maxScore: 6, date: daysAgo(12) },
    { id: 'demo-12', challengeId: 'design-11', track: 'design', title: 'Design a distributed cache service', variation: 'Isolate one tenant\'s celebrity key from starving every other tenant\'s traffic.', response: 'Proposed per-tenant hot-key isolation with local in-process cache.', reflection: 'Best design session yet — confident on trade-offs.', score: 5, maxScore: 6, date: daysAgo(6) },
  ];

  const mistakes: StaffPathState['mistakes'] = [
    { id: 'demo-m1', prompt: 'How do you prevent double charging on a payment retry?', missed: 'Forgot to mention idempotency key scope (per-request vs per-intent).', correction: 'Idempotency keys should be scoped to the business intent, not the HTTP request.', nextReview: daysAgo(-2), reviewCount: 2, resolved: true },
    { id: 'demo-m2', prompt: 'What happens during a network partition in a Raft cluster?', missed: 'Confused leader election timeout with heartbeat interval.', correction: 'Election timeout must be significantly larger than heartbeat interval to avoid unnecessary elections.', nextReview: daysAgo(-5), reviewCount: 1, resolved: true },
    { id: 'demo-m3', prompt: 'Why choose gRPC over REST for internal services?', missed: 'Only mentioned performance, missed the typed contract benefit.', correction: 'gRPC\'s generated client stubs eliminate a whole class of integration bugs beyond raw performance.', nextReview: daysAgo(1), reviewCount: 1, resolved: false },
    { id: 'demo-m4', prompt: 'What is your error budget policy when it is nearly exhausted?', missed: 'Said "slow down releases" without a concrete gating mechanism.', correction: 'Error budget policy needs an explicit gate: freeze non-critical deploys until budget recovers above threshold.', nextReview: daysAgo(3), reviewCount: 0, resolved: false },
    { id: 'demo-m5', prompt: 'How do you enforce tenant isolation in a shared-schema multi-tenant system?', missed: 'Assumed row-level security was automatically applied everywhere.', correction: 'Every query path needs an explicit tenant_id filter — RLS is a backstop, not the primary control.', nextReview: daysAgo(-8), reviewCount: 2, resolved: true },
    { id: 'demo-m6', prompt: 'What is the difference between at-least-once and exactly-once delivery?', missed: 'Claimed exactly-once was achievable at the broker level alone.', correction: 'Exactly-once requires both transactional broker semantics AND idempotent consumer processing.', nextReview: daysAgo(0), reviewCount: 1, resolved: false },
    { id: 'demo-m7', prompt: 'How would you migrate a schema on a 500M row table without downtime?', missed: 'Suggested a direct ALTER TABLE without mentioning online migration tools.', correction: 'Use gh-ost or pt-online-schema-change for large tables; a blocking ALTER TABLE is a production incident.', nextReview: daysAgo(-10), reviewCount: 3, resolved: true },
    { id: 'demo-m8', prompt: 'What signals indicate a noisy neighbor in a multi-tenant database?', missed: 'Only mentioned CPU; did not mention IOPS or lock contention.', correction: 'Track query latency percentiles per tenant and lock wait time — CPU alone misses IO and contention-bound noisy neighbors.', nextReview: daysAgo(4), reviewCount: 0, resolved: false },
  ];

  const journal: StaffPathState['journal'] = [
    { id: 'demo-j1', date: daysAgo(55), learning: 'Understood the real cost of synchronous cross-service calls under load.', application: 'Redesigned a hypothetical checkout flow to use async confirmation.', artifact: 'Sequence diagram comparing sync vs async checkout.', quality: 4, tags: ['distributed-systems', 'reliability'] },
    { id: 'demo-j2', date: daysAgo(42), learning: 'Learned to separate fare estimation from fare commitment in pricing systems.', application: 'Applied the pattern to a ride-sharing design exercise.', artifact: 'Pricing snapshot schema sketch.', quality: 5, tags: ['case-study', 'data-modeling'] },
    { id: 'demo-j3', date: daysAgo(30), learning: 'Practiced giving feedback using the SBI model in a mock scenario.', application: 'Used it in a real 1:1 this week — noticeably less defensive reaction.', artifact: 'Feedback script notes.', quality: 4, tags: ['leadership', 'communication'] },
    { id: 'demo-j4', date: daysAgo(20), learning: 'Realized my system design answers lack explicit non-goals.', application: 'Added a "what we are NOT solving for" section to every design template.', artifact: 'Updated design template.', quality: 4, tags: ['system-design', 'process'] },
    { id: 'demo-j5', date: daysAgo(7), learning: 'Hot-key isolation strategies for multi-tenant caches — local in-process cache as first line of defense.', application: 'Reused this in the distributed cache service practice scenario.', artifact: 'Cache architecture notes with tiering diagram.', quality: 5, tags: ['caching', 'reliability'] },
  ];

  const mockInterviews: StaffPathState['mockInterviews'] = [
    { id: 'demo-mock1', type: 'system-design', score: 3.5, date: daysAgo(45), feedback: 'Good structure, estimation was rushed. Practice pausing for math.', prompt: 'Design a distributed rate limiter.', durationMinutes: 42, criteria: { Requirements: 4, Estimation: 3, Architecture: 4, 'Technical depth': 3, 'Trade-offs': 3, 'Failure handling': 4, 'Staff-level judgment': 3, Communication: 4 } },
    { id: 'demo-mock2', type: 'behavioral', score: 4.0, date: daysAgo(30), feedback: 'Strong ownership story. Needs a sharper metric in the result.', prompt: 'Tell me about a time you influenced a decision without authority.', durationMinutes: 35, criteria: { Requirements: 4, Estimation: 4, Architecture: 4, 'Technical depth': 4, 'Trade-offs': 4, 'Failure handling': 4, 'Staff-level judgment': 4, Communication: 4 } },
    { id: 'demo-mock3', type: 'ai-design', score: 3.8, date: daysAgo(15), feedback: 'Good grounding and citation discussion, weak on cost/latency joint optimization.', prompt: 'Design an enterprise RAG platform with citations and permissions.', durationMinutes: 44, criteria: { Requirements: 4, Estimation: 3, Architecture: 4, 'Technical depth': 4, 'Trade-offs': 3, 'Failure handling': 4, 'Staff-level judgment': 4, Communication: 4 } },
    { id: 'demo-mock4', type: 'system-design', score: 4.2, date: daysAgo(4), feedback: 'Best mock yet — confident trade-off defense under interruption.', prompt: 'Design a distributed cache service.', durationMinutes: 47, criteria: { Requirements: 5, Estimation: 4, Architecture: 4, 'Technical depth': 4, 'Trade-offs': 4, 'Failure handling': 4, 'Staff-level judgment': 4, Communication: 5 } },
  ];

  const communicationRecords: StaffPathState['communicationLessons'] = {};
  const lessonIds = communicationLessons.slice(0, 8).map((l) => l.id);
  lessonIds.forEach((id, index) => {
    communicationRecords[id] = {
      completedAt: daysAgo(50 - index * 5),
      practiceNote: 'Recorded a practice rep and reviewed against the drill checklist.',
      confidence: 3 + (index % 3),
    };
  });

  return {
    version: 2,
    profile: {
      name: 'Demo User',
      startDate: daysAgo(60),
      onboardingComplete: true,
      preparationMode: 'moderate',
      skillAssessmentComplete: true,
      unlockAll: false,
      celebratedUnlocks: ['coach', 'curriculum', 'practice', 'resources', 'communication'],
      selectedCompanyPack: 'amazon',
      studyWeek: 4,
      guidedHelpDismissed: true,
    },
    assessments: {
      'technical-foundations': { score: 4, evidence: 'Comfortable with core distributed systems concepts.', updatedAt: daysAgo(58) },
      'system-design': { score: 4, evidence: '12 practice scenarios completed with consistent trade-off depth.', updatedAt: daysAgo(6) },
      production: { score: 3, evidence: 'Growing but still building production incident experience.', updatedAt: daysAgo(45) },
      business: { score: 3, evidence: 'Some exposure to business framing in design exercises.', updatedAt: daysAgo(40) },
      execution: { score: 4, evidence: 'Delivered several structured problem-solving exercises.', updatedAt: daysAgo(30) },
      influence: { score: 3, evidence: 'Practiced facilitation and feedback scenarios.', updatedAt: daysAgo(29) },
      communication: { score: 4, evidence: '8 communication lessons complete with practice reps.', updatedAt: daysAgo(20) },
      mentoring: { score: 2, evidence: 'Limited practice so far — flagged as a focus area.', updatedAt: daysAgo(50) },
    },
    completedChapters: ['capacity-estimation', 'cache-stampede', 'requirements-quality-attributes', 'resilience-patterns'],
    mistakes,
    mockInterviews,
    roadmap,
    practiceAttempts,
    practiceCursor: { design: 12, problem: 3, people: 3, sdlc: 1 },
    communicationLessons: communicationRecords,
    journal,
    behavioralStories: [],
    diagrams: [],
  };
}

export function loadDemoState(): void {
  appStore.replace(buildDemoState());
}
