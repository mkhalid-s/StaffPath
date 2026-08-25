type RawSession = [string, string, 'technical' | 'leadership' | 'communication', string[]];
type RawWeek = { title: string; outcome: string; days: RawSession[] };

const rawPlan: RawWeek[] = [
  { title: "Understand the Staff role", outcome: "Readiness assessment", days: [
    ["Define your Staff motivation", "Write why you want Staff scope and which work gives you energy.", "leadership", ["Career clarity", "Self-awareness"]],
    ["Choose your Staff archetype", "Compare Tech Lead, Architect, Solver, and Right Hand; select your likely path.", "leadership", ["Role clarity", "Judgment"]],
    ["Decode the career ladder", "Compare Senior and Staff expectations at your company or a target company.", "leadership", ["Scope", "Impact"]],
    ["Score your current skills", "Rate your technical judgment, execution, influence, communication, mentoring, and business sense.", "leadership", ["Self-awareness", "Planning"]],
    ["Collect honest feedback", "Ask two trusted people what would stop them from considering you Staff-ready.", "communication", ["Feedback", "Listening"]],
    ["Choose a capstone system", "Pick one real system you will use throughout this journey and capture its purpose.", "technical", ["Systems thinking", "Product"]],
    ["Teach back: What Staff means", "Give a five-minute explanation of Staff engineering in your organization.", "communication", ["Speaking", "Synthesis"]]
  ]},
  { title: "Business & product thinking", outcome: "Business brief", days: [
    ["Name the customer problem", "Describe the users, their problem, and why it matters.", "leadership", ["Customer empathy", "Product"]],
    ["Map value delivery", "Trace the business process from customer request to outcome.", "leadership", ["Business", "Systems thinking"]],
    ["Find the value drivers", "Identify revenue, cost, risk, retention, or productivity drivers.", "leadership", ["Business", "Prioritization"]],
    ["Map your stakeholders", "Record what success, risk, and influence mean to each stakeholder.", "communication", ["Stakeholders", "Empathy"]],
    ["Write a business hypothesis", "Translate one technical improvement into a measurable business hypothesis.", "leadership", ["Strategy", "Impact"]],
    ["Choose meaningful metrics", "Define leading and lagging measures of success.", "technical", ["Metrics", "Product"]],
    ["Present the business context", "Explain how the system creates value and where technology constrains it.", "communication", ["Speaking", "Business"]]
  ]},
  { title: "Architecture fundamentals", outcome: "Architecture map", days: [
    ["Draw the system context", "Map users, external systems, dependencies, and ownership boundaries.", "technical", ["Architecture", "Visualization"]],
    ["Map services and containers", "Show deployable units, data stores, and their responsibilities.", "technical", ["Architecture", "Boundaries"]],
    ["Trace a critical request", "Follow one important request from entry to final outcome.", "technical", ["Systems thinking", "Debugging"]],
    ["Assess coupling and cohesion", "Find unclear ownership, inappropriate coupling, and leaky abstractions.", "technical", ["Design", "Maintainability"]],
    ["Define quality attributes", "Prioritize scalability, reliability, security, cost, and maintainability.", "technical", ["Trade-offs", "Requirements"]],
    ["Create a technical risk register", "Identify the five largest architecture risks, impact, and mitigations.", "leadership", ["Risk", "Prioritization"]],
    ["Run an architecture walkthrough", "Present your diagrams and invite questions before proposing changes.", "communication", ["Facilitation", "Speaking"]]
  ]},
  { title: "Distributed systems", outcome: "Failure analysis", days: [
    ["Reason about partial failure", "Study latency, timeouts, unreliable networks, and ambiguous outcomes.", "technical", ["Distributed systems", "Reliability"]],
    ["Choose consistency trade-offs", "Compare strong and eventual consistency against product requirements.", "technical", ["Data", "Trade-offs"]],
    ["Design safe retries", "Apply idempotency, bounded retries, jitter, and deduplication.", "technical", ["Reliability", "APIs"]],
    ["Use messaging deliberately", "Compare queues, pub/sub, ordering, and delivery guarantees.", "technical", ["Messaging", "Architecture"]],
    ["Model distributed workflows", "Compare orchestration, choreography, and saga compensation.", "technical", ["Workflows", "Consistency"]],
    ["Run three failure scenarios", "Predict system behavior when dependencies slow, fail, or duplicate work.", "technical", ["Failure modes", "Resilience"]],
    ["Explain failure handling", "Teach one distributed workflow using simple, precise language.", "communication", ["Speaking", "Clarity"]]
  ]},
  { title: "Data architecture", outcome: "Data decision record", days: [
    ["Match stores to workloads", "Compare relational, document, key-value, graph, and search databases.", "technical", ["Data", "Judgment"]],
    ["Model ownership and access", "Define entities, ownership boundaries, reads, writes, and growth.", "technical", ["Data modeling", "Boundaries"]],
    ["Understand query performance", "Review indexes, query plans, pagination, and hot keys.", "technical", ["Performance", "Databases"]],
    ["Design caching deliberately", "Define cache policy, invalidation, TTLs, and acceptable staleness.", "technical", ["Caching", "Trade-offs"]],
    ["Select transaction semantics", "Choose isolation, optimistic locking, or eventual consistency by workflow.", "technical", ["Transactions", "Correctness"]],
    ["Plan the data lifecycle", "Cover backups, restores, retention, deletion, and schema migration.", "technical", ["Operations", "Compliance"]],
    ["Defend your data choices", "Run a mock review focused on alternatives and consequences.", "communication", ["Influence", "Reasoning"]]
  ]},
  { title: "Scale, performance & cost", outcome: "Capacity model", days: [
    ["Estimate system demand", "Calculate average and peak traffic, storage, and bandwidth.", "technical", ["Capacity", "Estimation"]],
    ["Build a latency budget", "Allocate end-to-end latency across the request path.", "technical", ["Performance", "SLIs"]],
    ["Find bottlenecks with data", "Identify what to measure before choosing optimizations.", "technical", ["Profiling", "Judgment"]],
    ["Control overload", "Apply scaling, load shedding, rate limits, and backpressure.", "technical", ["Scale", "Resilience"]],
    ["Define scaling thresholds", "Connect capacity signals to safe scaling actions.", "technical", ["Operations", "Automation"]],
    ["Model engineering cost", "Estimate infrastructure spend and its largest growth drivers.", "leadership", ["Cost", "Business"]],
    ["Present a capacity plan", "Explain assumptions, uncertainty, risks, and trigger points.", "communication", ["Speaking", "Executive clarity"]]
  ]},
  { title: "Reliability & operations", outcome: "SLO and incident kit", days: [
    ["Define useful SLIs", "Measure availability, latency, correctness, and freshness from the user view.", "technical", ["SRE", "Metrics"]],
    ["Choose realistic SLOs", "Connect reliability targets to user need and engineering cost.", "technical", ["SRE", "Trade-offs"]],
    ["Create an error-budget policy", "Define when to invest in reliability versus features.", "leadership", ["Policy", "Prioritization"]],
    ["Design observability", "Choose logs, metrics, traces, dashboards, and actionable alerts.", "technical", ["Observability", "Operations"]],
    ["Write an incident runbook", "Document roles, escalation, mitigation, and communication.", "leadership", ["Incidents", "Coordination"]],
    ["Write a blameless postmortem", "Analyze contributing conditions and durable follow-up actions.", "communication", ["Writing", "Learning culture"]],
    ["Run an incident tabletop", "Facilitate a simulated outage and practice concise status updates.", "communication", ["Facilitation", "Calmness"]]
  ]},
  { title: "Security & resilience", outcome: "Threat model", days: [
    ["Map assets and trust boundaries", "Identify actors, sensitive assets, entry points, and boundaries.", "technical", ["Security", "Architecture"]],
    ["Build a threat model", "List plausible threats, likelihood, impact, and controls.", "technical", ["Threat modeling", "Risk"]],
    ["Review identity and access", "Assess authentication, authorization, least privilege, and isolation.", "technical", ["Security", "Identity"]],
    ["Protect sensitive data", "Review classification, encryption, secrets, and audit trails.", "technical", ["Data security", "Compliance"]],
    ["Assess the supply chain", "Review dependencies, builds, artifacts, and deployment integrity.", "technical", ["DevSecOps", "Risk"]],
    ["Design disaster recovery", "Define RTO, RPO, recovery procedures, and validation tests.", "technical", ["Recovery", "Reliability"]],
    ["Brief leadership on risk", "Present top risks, options, cost, and a recommended response.", "communication", ["Executive communication", "Risk"]]
  ]},
  { title: "Technical decisions & strategy", outcome: "Technical strategy", days: [
    ["Learn effective ADRs", "Capture context, drivers, options, decision, consequences, and revisit date.", "technical", ["ADRs", "Writing"]],
    ["Document a reversible choice", "Write a concise ADR for a low-cost-to-change decision.", "technical", ["Judgment", "Documentation"]],
    ["Document a one-way-door choice", "Analyze an expensive decision with deeper validation.", "technical", ["Risk", "Architecture"]],
    ["Make build-buy-adopt choices", "Compare differentiation, capability, cost, lock-in, and time.", "leadership", ["Strategy", "Business"]],
    ["Write a technical vision", "Describe the desired state and connect it to business outcomes.", "leadership", ["Vision", "Alignment"]],
    ["Sequence strategic bets", "Turn the vision into initiatives, dependencies, and checkpoints.", "leadership", ["Roadmapping", "Execution"]],
    ["Run a strategy review", "Invite disagreement, surface assumptions, and drive a clear decision.", "communication", ["Facilitation", "Influence"]]
  ]},
  { title: "Cross-team execution", outcome: "Execution plan", days: [
    ["Turn strategy into milestones", "Define outcomes, owners, dependencies, and acceptance signals.", "leadership", ["Planning", "Ownership"]],
    ["Map the critical path", "Find cross-team dependencies and integration risks.", "leadership", ["Execution", "Coordination"]],
    ["Make risk ownership explicit", "Assign probability, impact, owner, mitigation, and trigger.", "leadership", ["Risk", "Accountability"]],
    ["Design lightweight reporting", "Create decision-focused progress updates without status theater.", "communication", ["Writing", "Transparency"]],
    ["Plan a safe migration", "Sequence compatibility, rollout, observation, and rollback phases.", "technical", ["Migration", "Safety"]],
    ["Run a pre-mortem", "Assume the initiative failed and uncover preventable causes.", "leadership", ["Foresight", "Risk"]],
    ["Facilitate a project kickoff", "Align product, engineering, and operations on outcomes and roles.", "communication", ["Facilitation", "Alignment"]]
  ]},
  { title: "Influence & communication", outcome: "Influence toolkit", days: [
    ["Map your influence network", "Identify decision-makers, experts, supporters, and skeptics.", "communication", ["Influence", "Relationships"]],
    ["Write for executives", "Reduce a technical proposal to outcome, risk, options, and ask.", "communication", ["Executive writing", "Business"]],
    ["Write for implementers", "Make constraints, decisions, interfaces, and ownership precise.", "communication", ["Technical writing", "Clarity"]],
    ["Disagree constructively", "Separate facts, assumptions, constraints, values, and preferences.", "communication", ["Conflict", "Listening"]],
    ["Facilitate a hard decision", "Help reasonable people evaluate trade-offs and converge.", "communication", ["Facilitation", "Decision making"]],
    ["Close the communication loop", "Record the decision, rationale, owner, and follow-up date.", "communication", ["Alignment", "Accountability"]],
    ["Pitch and invite critique", "Deliver a ten-minute proposal and ask for the strongest objection.", "communication", ["Speaking", "Feedback"]]
  ]},
  { title: "Engineering leadership", outcome: "Leverage plan", days: [
    ["Review code for team health", "Balance correctness, design, tests, maintainability, teaching, and flow.", "technical", ["Code review", "Mentoring"]],
    ["Create a mentoring plan", "Set one engineer's goal, practice opportunities, and feedback loop.", "leadership", ["Mentoring", "Growth"]],
    ["Delegate for leverage", "Identify meaningful work others should own and how you will support them.", "leadership", ["Delegation", "Trust"]],
    ["Design a paved road", "Propose a reusable standard, library, or process that lowers cognitive load.", "technical", ["Platform thinking", "Leverage"]],
    ["Remove recurring toil", "Measure one repeated burden and propose durable elimination.", "leadership", ["Productivity", "Prioritization"]],
    ["Measure engineering health", "Choose balanced signals for flow, quality, reliability, and learning.", "leadership", ["Metrics", "Culture"]],
    ["Teach the multiplier mindset", "Explain how Staff engineers grow collective rather than personal output.", "communication", ["Teaching", "Leadership"]]
  ]},
  { title: "Evidence & interview readiness", outcome: "Staff portfolio", days: [
    ["Build an evidence inventory", "Capture situation, action, result, scope, and collaborators for key work.", "leadership", ["Career", "Evidence"]],
    ["Write six leadership stories", "Cover ambiguity, influence, failure, conflict, mentorship, and delivery.", "communication", ["Storytelling", "Interviews"]],
    ["Practice system design", "Run a 45-minute design and spend 15 minutes critiquing your trade-offs.", "technical", ["System design", "Interview"]],
    ["Practice Staff behaviors", "Answer questions with scope, judgment, influence, and measurable impact.", "communication", ["Interview", "Speaking"]],
    ["Assemble your portfolio", "Connect claims to artifacts, feedback, and outcomes; find evidence gaps.", "leadership", ["Career", "Writing"]],
    ["Present your capstone", "Give a structured architecture and strategy review to a real audience.", "communication", ["Presentation", "Influence"]]
  ]}
];


export type SessionCategory = 'technical' | 'leadership' | 'communication';

export interface RoadmapSession {
  id: number;
  week: number;
  dayOfWeek: number;
  weekTitle: string;
  outcome: string;
  title: string;
  description: string;
  category: SessionCategory;
  tags: string[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  outcome: string;
  sessions: RoadmapSession[];
}

export const roadmapWeeks: RoadmapWeek[] = rawPlan.map((entry, weekIndex) => ({
  week: weekIndex + 1,
  title: entry.title,
  outcome: entry.outcome,
  sessions: entry.days.map((day, dayIndex) => ({
    id: weekIndex * 7 + dayIndex + 1,
    week: weekIndex + 1,
    dayOfWeek: dayIndex,
    weekTitle: entry.title,
    outcome: entry.outcome,
    title: day[0],
    description: day[1],
    category: day[2] as SessionCategory,
    tags: [...day[3]],
  })),
}));

export const roadmapSessions = roadmapWeeks.flatMap((week) => week.sessions);

export const ROADMAP_SESSION_COUNT = roadmapSessions.length;

/** Sessions per week at the chosen pace (90 sessions spread across totalDays). */
export function sessionsPerWeek(totalDays: number): number {
  return Math.round((ROADMAP_SESSION_COUNT / totalDays) * 7 * 10) / 10;
}

/** Expected calendar day when a session should be completed at this pace. */
export function expectedDayForSession(sessionId: number, totalDays: number): number {
  return Math.ceil((sessionId / ROADMAP_SESSION_COUNT) * totalDays);
}
