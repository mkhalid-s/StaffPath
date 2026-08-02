const planWeeks = [
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

const communicationReps = [
  ["Explain it simply", "Record a two-minute explanation of today's idea without jargon."],
  ["Lead with the outcome", "State the recommendation first, then give only the context needed."],
  ["Practice active listening", "Summarize another viewpoint fairly before responding."],
  ["Tell a concise story", "Use context, tension, action, and result in under three minutes."],
  ["Handle an objection", "Name the concern, test your understanding, then address the trade-off."],
  ["Ask a stronger question", "Write one open question that would reveal a hidden assumption."],
  ["Teach back", "Present this week's insight, pause deliberately, and invite questions."]
];

const weekResources = [
  ["Staff Engineer archetypes", "https://staffeng.com/guides/staff-archetypes/", "GUIDE"],
  ["Work on what matters", "https://staffeng.com/guides/work-on-what-matters/", "GUIDE"],
  ["Azure Architecture Center", "https://learn.microsoft.com/en-us/azure/architecture/", "REFERENCE"],
  ["Cloud design patterns", "https://learn.microsoft.com/en-us/azure/architecture/patterns/", "REFERENCE"],
  ["Choosing a data store", "https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-overview", "GUIDE"],
  ["Performance efficiency", "https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html", "FRAMEWORK"],
  ["Google SRE books", "https://sre.google/books/", "FREE BOOK"],
  ["OWASP Developer Guide", "https://owasp.org/www-project-developer-guide/", "GUIDE"],
  ["Architecture decision records", "https://adr.github.io/", "REFERENCE"],
  ["Release engineering", "https://sre.google/sre-book/release-engineering/", "CHAPTER"],
  ["Writing engineering strategy", "https://staffeng.com/guides/writing-engineering-strategy/", "GUIDE"],
  ["Google engineering practices", "https://google.github.io/eng-practices/review/reviewer/", "GUIDE"],
  ["Promotion packets", "https://staffeng.com/guides/promo-packets/", "GUIDE"]
];

const labCatalog = {
  design: [
    ["Design a URL shortener", "Build a service that creates compact links and redirects users with low latency.", ["Start at 10,000 users, then explain the path to 100 million users.", "Support global redirects with regional failure.", "Add abuse prevention, custom aliases, and link expiration."], ["Clarify read/write ratio and redirect latency.", "Estimate traffic, storage, and identifier space.", "Address hot links, caching, and analytics consistency."]],
    ["Design a distributed rate limiter", "Protect APIs while supporting multiple policies, tenants, and regions.", ["Enforce 100 million requests per day across three regions.", "Support per-user, per-tenant, and global limits.", "Keep working safely when the coordination store fails."], ["Compare token bucket, leaky bucket, and sliding window.", "Define the consistency actually required.", "Explain client feedback and degraded behavior."]],
    ["Design a notification platform", "Deliver email, SMS, push, and in-app notifications from many product teams.", ["Handle bursty campaigns without delaying transactional messages.", "Guarantee user preferences and regulatory opt-outs.", "Operate across regions with provider failures."], ["Separate ingestion, preference, routing, and delivery.", "Discuss retries, idempotency, DLQs, and observability.", "Define ownership of templates and event schemas."]],
    ["Design a social feed", "Generate a personalized feed with posts, follows, ranking, and pagination.", ["Optimize for celebrity accounts with millions of followers.", "Add ranking while preserving freshness.", "Support deletion and privacy changes quickly."], ["Compare fan-out on write and fan-out on read.", "Model feed storage and cache invalidation.", "Discuss correctness versus availability."]],
    ["Design a messaging system", "Support durable one-to-one and group chat with presence and delivery status.", ["Serve 50 million concurrently connected users.", "Add multi-device ordering and offline delivery.", "Provide regional data residency and account deletion."], ["Separate connection and message storage concerns.", "Define ordering scope and delivery semantics.", "Plan reconnect, replay, and backpressure."]],
    ["Design a payment ledger", "Process payments while preserving an auditable, reconcilable financial record.", ["Handle provider timeouts without double charging.", "Support multiple currencies and regional processors.", "Migrate from an existing mutable transaction table."], ["Define money invariants before components.", "Use idempotency and double-entry thinking.", "Cover reconciliation, audit, and operational repair."]],
    ["Design a ride-matching platform", "Match riders and drivers using fresh location data and changing supply.", ["Handle a stadium-scale demand spike.", "Continue when a region or map provider is degraded.", "Add scheduled rides and marketplace pricing."], ["Separate location updates from durable trip state.", "Discuss geospatial partitioning and matching latency.", "Identify consistency boundaries and abuse cases."]],
    ["Design a file sync service", "Store and synchronize large files across devices with sharing and version history.", ["Support resumable multi-gigabyte uploads.", "Add collaborative sharing and malware quarantine.", "Provide cross-region durability at controlled cost."], ["Separate metadata from blob storage.", "Address chunking, deduplication, and conflict resolution.", "Define deletion, retention, and recovery."]],
    ["Design search and autocomplete", "Index changing content and return relevant results under tight latency targets.", ["Support typo tolerance and trending queries.", "Enforce document-level permissions in every result.", "Reindex the corpus without an outage."], ["Define freshness and relevance metrics.", "Design ingestion, indexing, serving, and caching.", "Cover hot queries and index versioning."]],
    ["Design a distributed job scheduler", "Run delayed, recurring, and dependency-based work reliably at scale.", ["Execute ten million jobs per hour.", "Survive scheduler leader failure without duplicate side effects.", "Support tenant quotas, priorities, and cancellation."], ["Separate control plane and workers.", "Discuss leasing, fencing, retries, and heartbeats.", "Define job state and recovery behavior."]],
    ["Design an observability platform", "Collect, store, query, and alert on logs, metrics, and traces.", ["Absorb a ten-times incident traffic spike.", "Offer multi-tenant retention and cost controls.", "Preserve essential signals during partial failure."], ["Define ingestion backpressure and sampling.", "Choose storage by signal and query pattern.", "Address cardinality, retention, and noisy neighbors."]],
    ["Design a multi-tenant SaaS platform", "Serve enterprise tenants with configurable isolation and shared platform capabilities.", ["Support data residency and regulated tenants.", "Move a large tenant between isolation tiers live.", "Allocate cost and prevent noisy neighbors."], ["Compare shared, partitioned, and siloed models.", "Design tenant identity propagation.", "Cover provisioning, migration, and containment."]],
    ["Design a video streaming platform", "Ingest, process, distribute, and play video globally.", ["Support a globally popular live event.", "Optimize playback for unreliable mobile networks.", "Control transcoding and CDN cost."], ["Separate ingest, processing, metadata, and delivery.", "Discuss adaptive bitrate and CDN hierarchy.", "Plan regional failure and content rights."]],
    ["Design an enterprise RAG platform", "Answer questions over private documents with citations and access control.", ["Guarantee permission-aware retrieval across many tenants.", "Keep answers fresh as documents change.", "Route between models to balance quality, latency, and cost."], ["Design ingestion, chunking, retrieval, reranking, and generation.", "Define offline and online evaluation.", "Cover prompt injection, audit, and human escalation."]],
    ["Design an AI coding assistant", "Provide context-aware code help across large private repositories.", ["Support interactive completion under a strict latency budget.", "Prevent secrets and unauthorized code from entering context.", "Measure usefulness without trusting model confidence."], ["Separate indexing, context selection, inference, and tools.", "Define permissions and sandboxed execution.", "Cover evaluation, fallback, and spend limits."]]
  ],
  problem: [
    ["The invisible latency regression", "P95 latency doubled after several unrelated releases, while averages and error rates look normal.", ["Begin with a timeline and user segmentation.", "List at least three competing hypotheses before choosing tools.", "Propose the cheapest test that could disprove each hypothesis."], ["What evidence would change your mind?", "How will you limit user harm during investigation?", "What will you communicate and to whom?"]],
    ["Duplicate payment reports", "A small number of customers report duplicate charges, but application logs show one request per purchase.", ["Establish financial and customer impact first.", "Trace identity across retries, queues, processors, and webhooks.", "Separate containment from root-cause work."], ["Which invariants should always hold?", "Where can ambiguous outcomes occur?", "How will reconciliation repair existing damage?"]],
    ["Database cost increased 300%", "Database spend tripled over six weeks without a corresponding traffic increase.", ["Build a cost decomposition before optimizing.", "Correlate cost with queries, storage, replication, and configuration changes.", "Consider product behavior and retention policies."], ["What are facts versus assumptions?", "Which measurement gives the highest information value?", "How will you prove savings without shifting risk?"]],
    ["Events are occasionally missing", "A downstream analytics team sees missing orders, but the source database contains them.", ["Define what 'missing' means and the time boundary.", "Trace production, transport, consumption, and sink acknowledgment.", "Test loss, delay, filtering, and observability gaps separately."], ["What identifiers allow end-to-end reconciliation?", "How do replay and idempotency interact?", "What service-level promise is realistic?"]],
    ["The overloaded platform team", "A platform team owns 19 services, receives constant interruptions, and has missed every roadmap commitment.", ["Measure demand, toil, ownership, and avoidable contacts.", "Distinguish staffing, product, interface, and reliability problems.", "Design an incremental intervention with team consent."], ["What should the team stop doing?", "Which self-service path would remove demand?", "How will you avoid imposing a platform nobody wants?"]],
    ["Three incompatible proposals", "Three senior engineers recommend different storage technologies for a strategic product.", ["Extract decision drivers before comparing products.", "Make uncertainty and reversibility explicit.", "Design a time-boxed validation when evidence is weak."], ["Which concerns are facts, preferences, or identity?", "Who owns the decision?", "When will the decision be revisited?"]],
    ["A migration is six months late", "Several teams depend on a legacy platform migration that has stopped making visible progress.", ["Reconstruct outcomes, dependencies, incentives, and bottlenecks.", "Find the smallest independently valuable milestone.", "Reset governance without blaming the delivery teams."], ["Is the target architecture still justified?", "What can be removed from scope?", "Which migration metric predicts completion?"]],
    ["A launch missed its business goal", "The system performed reliably, but customer adoption is far below forecast.", ["Do not treat technical success as product success.", "Inspect the hypothesis, discovery evidence, funnel, and feedback.", "Recommend a learning plan rather than defending sunk cost."], ["What outcome was expected?", "What qualitative evidence is missing?", "What would justify iteration, pivot, or retirement?"]],
    ["Critical dependency is being retired", "A vendor will retire a core API in six months; no team has budgeted for migration.", ["Quantify exposure and immovable dates.", "Compare replace, wrap, renegotiate, and retire options.", "Build urgency through evidence and choices."], ["Who can authorize reprioritization?", "How will you validate compatibility early?", "What is the contingency if the preferred plan slips?"]],
    ["Production incident with no owner", "Multiple services are failing, each team believes another team owns the initiating fault.", ["Establish incident command and user impact immediately.", "Coordinate mitigation without waiting for causal certainty.", "Separate incident roles from service ownership debate."], ["What is the first reversible mitigation?", "How frequently will you update stakeholders?", "What systemic ownership gap must the review address?"]]
  ],
  people: [
    ["Negotiate an impossible deadline", "Product expects a six-week launch; engineering estimates twelve weeks and security has unresolved concerns.", ["Align on the shared outcome before debating dates.", "Present scope, quality, and time as explicit options.", "End with a decision owner and next checkpoint."], ["Can you summarize each stakeholder's concern fairly?", "What evidence supports the estimate?", "What safe experiment could reduce uncertainty?"]],
    ["Disagree with a respected principal engineer", "A highly influential engineer publicly rejects your proposal and calls it unnecessary complexity.", ["Separate the idea, relationship, and decision process.", "Invite their strongest technical concern.", "Move the group toward evidence rather than status."], ["How will you avoid becoming defensive?", "Which parts of their objection may be valid?", "How will the final decision be documented?"]],
    ["Give difficult feedback", "A senior engineer produces strong code but repeatedly dismisses junior colleagues in design reviews.", ["Use specific observed behavior and its impact.", "Invite their perspective without diluting the issue.", "Agree on observable change and follow-up."], ["Is the feedback timely and private?", "What support can you offer?", "How will you protect psychological safety now?"]],
    ["Influence without ownership", "Another team must change its roadmap for your reliability initiative to succeed.", ["Understand their goals and costs first.", "Connect the change to shared organizational outcomes.", "Offer contribution, sequencing, and alternatives."], ["Why should this matter to them?", "What authority actually owns the priority?", "Can you reduce their implementation burden?"]],
    ["Delegate a critical project", "You can deliver a visible project faster yourself, but a senior engineer needs the growth opportunity.", ["Delegate an outcome with meaningful authority.", "Define guardrails and check-ins without taking work back.", "Make sponsorship and recognition explicit."], ["What decisions can they make alone?", "How will you respond to a different approach?", "What would trigger intervention?"]],
    ["Facilitate a stuck decision", "A design meeting has repeated the same arguments three times and no decision has emerged.", ["Restate the decision, drivers, options, and owner.", "Surface missing information and time-box validation.", "Record dissent and close the loop."], ["Does consensus actually matter here?", "Is the decision reversible?", "What is the cost of waiting?"]],
    ["Communicate an incident to executives", "A high-severity incident is ongoing and the cause is unknown.", ["Lead with impact, mitigation, and next update.", "Separate confirmed facts from investigation.", "Avoid low-level detail and speculative timelines."], ["What decision or support do you need?", "Can a non-engineer understand the customer impact?", "When is the next update even if nothing changes?"]],
    ["Challenge roadmap priorities", "Leadership prioritizes three visible features while foundational risk continues to grow.", ["Quantify the risk in business language.", "Offer choices rather than a technical ultimatum.", "Propose staged investment with measurable outcomes."], ["What event would make the risk real?", "Are you explaining opportunity cost?", "What is the minimum responsible investment?"]],
    ["Repair trust after a failed initiative", "A cross-team project you led missed its outcome and partners are reluctant to work with you again.", ["Own your contribution without overgeneralizing blame.", "Listen to impact before explaining context.", "Make repair concrete through changed behavior."], ["What would accountability sound like?", "What did partners experience?", "How will they observe that something changed?"]],
    ["Coach instead of solving", "An engineer asks you to provide the solution to an ambiguous architecture problem.", ["Ask questions that expose goals and constraints.", "Offer a framework and feedback, not your finished design.", "Let them retain authorship and present the decision."], ["What question unlocks their next step?", "When does coaching become unsafe?", "How will you give them visible credit?"]]
  ],
  sdlc: [
    ["Turn a request into a problem statement", "A stakeholder asks the team to build a configurable reporting dashboard.", ["Discover the user, decision, and current workaround.", "Define measurable outcomes before features.", "List assumptions requiring validation."], ["What happens if nothing is built?", "Who is the actual user?", "Which smallest experiment tests value?"]],
    ["Write testable requirements", "Convert an ambiguous real-time notification request into functional and quality requirements.", ["Separate behavior from implementation.", "Include latency, delivery, accessibility, and failure expectations.", "Define acceptance evidence."], ["Which terms are not measurable?", "What edge cases change scope?", "Who accepts the outcome?"]],
    ["Plan architecture and threat modeling", "Prepare a design review for a new externally accessible API.", ["Map boundaries, data, dependencies, and threats.", "Prioritize quality attributes and abuse cases.", "Record decisions and unresolved risks."], ["What is the trust boundary?", "Which decision is hard to reverse?", "What must be validated before build?"]],
    ["Design the testing strategy", "A service has unit tests but repeated integration and production regressions.", ["Use a risk-based test portfolio.", "Cover contracts, migrations, resilience, and production verification.", "Keep feedback fast and ownership clear."], ["Which failure costs the most?", "What should not be tested end-to-end?", "How will you control test data?"]],
    ["Review the CI pipeline", "Builds take 45 minutes and fail intermittently, causing large batches and delayed feedback.", ["Measure queue, execution, and failure causes.", "Improve determinism before adding capacity.", "Sequence changes with baseline metrics."], ["Where is feedback first useful?", "Which tests can run in parallel?", "How will you prevent flaky-test normalization?"]],
    ["Choose a deployment strategy", "Release a high-risk schema and application change with no planned downtime.", ["Use expand-and-contract compatibility phases.", "Select canary, blue-green, or rolling deployment intentionally.", "Define observation and rollback gates."], ["Can old and new versions coexist?", "What cannot be rolled back?", "Who can stop the rollout?"]],
    ["Run a production-readiness review", "A new service is approaching launch and will join the on-call rotation.", ["Review SLOs, capacity, dependencies, dashboards, alerts, and runbooks.", "Test failure and recovery paths.", "Make acceptance and risk ownership explicit."], ["What will wake someone at night?", "Has restore actually been tested?", "Which dependency lacks a contract?"]],
    ["Manage an incident", "A deployment correlates with elevated errors, but rolling back may corrupt in-flight work.", ["Assign command, operations, and communication roles.", "Choose mitigation based on evidence and reversibility.", "Preserve a timeline for learning."], ["What is user impact right now?", "Which action reduces harm fastest?", "When will you communicate again?"]],
    ["Conduct a blameless review", "A configuration error caused a two-hour outage despite review and automated tests.", ["Study conditions and defenses, not personal fault.", "Write specific, owned, prioritized actions.", "Share learning beyond the affected team."], ["Why did the action make sense at the time?", "Which safeguard failed or was absent?", "Will actions reduce recurrence or only document it?"]],
    ["Evolve an API safely", "A widely used API model must change, but consumers deploy independently.", ["Inventory consumers and compatibility requirements.", "Design versioning, migration telemetry, and deprecation.", "Provide a paved path and escalation policy."], ["How will you find unknown consumers?", "What is the support window?", "Who pays migration cost?"]],
    ["Manage technical debt", "A subsystem slows feature delivery, but a complete rewrite has no business sponsor.", ["Measure the debt's operational and delivery cost.", "Prefer incremental replacement around valuable work.", "Define success beyond lines rewritten."], ["Is this debt or an aesthetic preference?", "What is the smallest valuable boundary?", "How will you stop new debt accumulation?"]],
    ["Retire a system", "A legacy service has few known users but high security and maintenance cost.", ["Discover consumers using data and communication.", "Define archival, compliance, rollback, and final ownership.", "Measure traffic to zero before deletion."], ["What data must be retained?", "How will unknown users surface?", "Who authorizes final shutdown?"]]
  ]
};

const labRubrics = {
  design: ["Clarified requirements", "Estimated scale", "Defined APIs and data", "Explained trade-offs", "Covered failure and operations", "Addressed security and cost"],
  problem: ["Framed the real problem", "Separated facts and assumptions", "Generated competing hypotheses", "Used evidence deliberately", "Contained immediate risk", "Defined verification and follow-up"],
  people: ["Identified the shared outcome", "Represented other views fairly", "Used evidence over authority", "Offered options and consequences", "Made a clear recommendation", "Closed with owner and next step"],
  sdlc: ["Connected work to user value", "Defined measurable quality", "Considered risk early", "Created fast feedback", "Covered rollout and recovery", "Assigned ownership through operation"]
};

const curriculumModules = [
  ["System design foundations", ["Requirements", "Scalability", "Availability", "Latency", "Estimation", "Diagramming"], "URL shortener + estimation sheet"],
  ["Networking, APIs & traffic", ["DNS", "TCP/UDP", "HTTP/1–3", "REST/gRPC/GraphQL", "Load balancing", "CDN", "Rate limits"], "API gateway + protocol comparison"],
  ["Databases & modeling", ["SQL", "ACID", "Isolation", "Indexes", "Replication", "Sharding", "NoSQL", "Consistent hashing"], "Payment ledger + database rubric"],
  ["Caching & messaging", ["Cache patterns", "Invalidation", "Kafka", "Queues", "Ordering", "DLQs", "Idempotency", "CQRS"], "Notification platform + failure checklist"],
  ["Distributed systems", ["CAP/PACELC", "Consensus", "Raft", "Locks", "Clocks", "Gossip", "Service discovery"], "Job scheduler + failure scenarios"],
  ["Reliability & observability", ["Retries", "Circuit breakers", "SLOs", "Error budgets", "Telemetry", "Incidents", "RPO/RTO"], "SLO worksheet + incident kit"],
  ["Cloud, security & tenancy", ["Containers", "Kubernetes", "IAM", "OAuth/OIDC", "Encryption", "Threat modeling", "Tenant isolation"], "Multi-tenant SaaS + threat model"],
  ["Staff architecture", ["RFCs", "ADRs", "Strategy", "Platform engineering", "Build vs buy", "Migrations", "Influence"], "Modernization strategy + roadmap"],
  ["AI & LLM foundations", ["Transformers", "Tokens", "Embeddings", "Inference", "Prompting", "Model selection", "Evaluation"], "AI document assistant + cost model"],
  ["Production RAG & agents", ["Ingestion", "Hybrid retrieval", "Reranking", "Tool calling", "Guardrails", "AI observability"], "Enterprise RAG + evaluation plan"],
  ["Behavioral leadership", ["Customer impact", "Ownership", "Failure", "Conflict", "Ambiguity", "Mentoring", "Cross-team delivery"], "Twelve adaptable Staff stories"],
  ["Mock interviews & revision", ["System design", "AI design", "Behavioral", "Technical leadership", "Selected coding", "Mistake review"], "Interview records + final gap plan"]
];

const handbookTemplates = [
  ["System design", "Problem and users\nFunctional requirements\nQuality attributes and scale\nAPI and data model\nHigh-level design\nCritical deep dives\nFailure, security, observability, cost\nAlternatives and evolution\nRecommendation"],
  ["Architecture decision record", "Title and status\nContext and problem\nDecision drivers\nOptions considered\nDecision\nConsequences and risks\nValidation and revisit date"],
  ["Technical proposal", "Outcome requested\nCurrent state and evidence\nConstraints\nOptions and trade-offs\nRecommendation\nDelivery and migration plan\nRisks and mitigations\nMeasures of success"],
  ["Incident update", "Customer impact\nCurrent status\nMitigation underway\nConfirmed facts\nUnknowns under investigation\nHelp or decision needed\nNext update time"],
  ["STAR leadership story", "Situation and stakes\nTask and your responsibility\nActions and judgment\nInfluence and collaborators\nMeasured result\nTrade-offs and lessons\nWhat you would change"],
  ["Weekly reflection", "What I learned\nWhat I applied\nWhere I struggled\nFeedback received\nEvidence created\nWhat to revisit\nNext week's deliberate practice"]
];

const flatPlan = planWeeks.flatMap((week, wi) => week.days.map((day, di) => ({
  id: wi * 7 + di + 1, week: wi + 1, weekTitle: week.title, outcome: week.outcome,
  title: day[0], description: day[1], category: day[2], tags: day[3], dayOfWeek: di
})));

const defaultState = { name: "", startDate: new Date().toISOString().slice(0,10), completed: [], communication: [], elapsed: {}, journal: [], confidence: {}, selectedDay: null, practiceAttempts: [], labIndex: {design:0,problem:0,people:0,sdlc:0} };
let state = loadState();
let timerInterval = null;
let timerDay = null;
let quality = 3;
let activeLab = "design";
let activeHandbook = "evidence";

function blankState(){ return JSON.parse(JSON.stringify(defaultState)); }
function loadState(){ try { const stored=JSON.parse(localStorage.getItem("staffpath-state"))||{};return {...blankState(),...stored,labIndex:{...defaultState.labIndex,...(stored.labIndex||{})}}; } catch { return blankState(); } }
function saveState(){ localStorage.setItem("staffpath-state", JSON.stringify(state)); updateAll(); }
function currentIndex(){ const firstOpen = flatPlan.findIndex(d => !state.completed.includes(d.id)); return firstOpen < 0 ? 89 : firstOpen; }
function selectedIndex(){ return state.selectedDay ? Math.max(0, state.selectedDay - 1) : currentIndex(); }
function formatDate(date = new Date()){ return new Intl.DateTimeFormat("en", {weekday:"long", month:"long", day:"numeric"}).format(date); }
function esc(s=""){ const d=document.createElement("div"); d.textContent=s; return d.innerHTML; }
function toast(message){ const t=document.querySelector("#toast"); t.textContent=message; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }

function updateToday(){
  const day = flatPlan[selectedIndex()]; if(!day) return;
  document.querySelector("#todayDate").textContent = formatDate().toUpperCase();
  document.querySelector("#greeting").textContent = state.name ? `Keep moving, ${state.name}.` : "Build your Staff-level impact.";
  document.querySelector("#daySubtitle").textContent = `Day ${day.id} of 90 · One focused hour. One concrete artifact.`;
  document.querySelector("#weekChip").textContent = `WEEK ${day.week}`;
  document.querySelector("#taskTitle").textContent = day.title;
  document.querySelector("#taskDescription").textContent = day.description;
  document.querySelector("#skillTags").innerHTML = day.tags.map(t=>`<span class="skill-tag">${esc(t)}</span>`).join("");
  const resource=weekResources[day.week-1]; document.querySelector("#resourceLink").textContent=`${resource[0]} ↗`; document.querySelector("#resourceLink").href=resource[1]; document.querySelector("#resourceType").textContent=resource[2];
  document.querySelector("#learnPrompt").textContent = `Study ${day.tags[0].toLowerCase()}`;
  document.querySelector("#applyPrompt").textContent = `Build toward: ${day.outcome}`;
  document.querySelector("#weekTitle").textContent = day.weekTitle;
  const rep=communicationReps[day.dayOfWeek]; document.querySelector("#communicationTitle").textContent=rep[0]; document.querySelector("#communicationPrompt").textContent=rep[1];
  document.querySelector("#communicationCheck").checked=state.communication.includes(day.id);
  document.querySelector("#completeSession").textContent=state.completed.includes(day.id)?"Completed ✓":"Mark complete";
  document.querySelector("#completeSession").disabled=state.completed.includes(day.id);
  timerDay=day.id; renderTimer();
  const week=flatPlan.filter(d=>d.week===day.week);
  document.querySelector("#weekStrip").innerHTML=week.map(d=>`<div class="day-cell ${d.id===day.id?'current':''} ${state.completed.includes(d.id)?'done':''}" data-day="${d.id}"><div class="day-meta"><span>DAY ${d.id}</span><span class="done-mark">${state.completed.includes(d.id)?'✓':''}</span></div><strong>${esc(d.title)}</strong></div>`).join("");
}

function renderTimer(){
  const elapsed=Math.min(3600,state.elapsed[timerDay]||0), remaining=3600-elapsed;
  document.querySelector("#timerDisplay").textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
  const phase=elapsed<600?"Recall":elapsed<2100?"Learn":elapsed<3300?"Apply":elapsed<3600?"Reflect":"Session finished";
  document.querySelector("#timerPhase").textContent=elapsed?phase:"Ready to begin";
  document.querySelector("#timerRing").style.setProperty("--progress",`${elapsed/3600*360}deg`);
  document.querySelector("#timerToggle").textContent=timerInterval?"❚❚":"▶";
}

function updateProgress(){
  const n=state.completed.length,p=Math.round(n/90*100);
  document.querySelector("#sidePercent").textContent=`${p}%`; document.querySelector("#sideProgress").style.width=`${p}%`; document.querySelector("#sideDays").textContent=`${n} of 90 sessions complete`;
  document.querySelector("#profileName").textContent=state.name||"Your journey"; document.querySelector("#avatar").textContent=(state.name||"Y")[0].toUpperCase();
  document.querySelector("#streakCount").textContent=calculateStreak();
}
function calculateStreak(){ if(!state.completed.length)return 0; const sorted=[...state.completed].sort((a,b)=>a-b); let streak=1; for(let i=sorted.length-1;i>0;i--){if(sorted[i]-sorted[i-1]===1)streak++;else break;} return streak; }

function renderRoadmap(filter="all"){
  const root=document.querySelector("#roadmap"); root.innerHTML=planWeeks.map((w,wi)=>{
    const days=flatPlan.filter(d=>d.week===wi+1 && (filter==="all"||d.category===filter)); if(!days.length)return "";
    return `<section class="roadmap-week" id="week-${wi+1}"><div class="roadmap-week-info"><span>WEEK ${wi+1}</span><h3>${esc(w.title)}</h3><p>Output: ${esc(w.outcome)}</p></div><div class="roadmap-days">${days.map(d=>`<div class="roadmap-day ${state.completed.includes(d.id)?'done':''} ${d.id===flatPlan[currentIndex()].id?'current':''}" data-day="${d.id}"><span class="number">${d.id}</span><div><strong>${esc(d.title)}</strong><br><small>${esc(d.description)}</small></div><span class="category-dot ${d.category}" title="${d.category}"></span></div>`).join("")}</div></section>`
  }).join("");
}

function renderSkills(){
  const completed=flatPlan.filter(d=>state.completed.includes(d.id));
  document.querySelector("#sessionsStat").textContent=completed.length; document.querySelector("#timeStat").textContent=`${Math.round(Object.values(state.elapsed).reduce((a,b)=>a+b,0)/360)/10}h`; document.querySelector("#commsStat").textContent=state.communication.length; document.querySelector("#artifactStat").textContent=state.journal.filter(j=>j.artifact).length+state.practiceAttempts.length;
  const groups=[['Architecture','Architecture'],['Systems & reliability','Reliability'],['Business & strategy','Strategy'],['Leadership & influence','Influence'],['Communication','Speaking'],['Mentoring & leverage','Mentoring']];
  document.querySelector("#skillBars").innerHTML=groups.map(([label,tag])=>{const total=flatPlan.filter(d=>d.tags.some(t=>t.includes(tag))).length||1,done=completed.filter(d=>d.tags.some(t=>t.includes(tag))).length,p=Math.round(done/total*100);return `<div><div class="skill-bar-head"><span>${label}</span><strong>${p}%</strong></div><div class="skill-bar-track"><span style="width:${p}%"></span></div></div>`}).join("");
  document.querySelector("#confidenceSliders").innerHTML=['Technical judgment','Execution','Business alignment','Influence','Communication','Mentoring'].map(s=>`<div class="confidence-item"><label><span>${s}</span><strong>${state.confidence[s]||3}/5</strong></label><input type="range" min="1" max="5" value="${state.confidence[s]||3}" data-skill="${s}"></div>`).join("");
}

function renderJournal(){
  const root=document.querySelector("#journalEntries"); if(!state.journal.length){root.innerHTML='<div class="empty-state">No reflections yet.<br>Complete a session and capture what changed in your thinking.</div>';return;}
  root.innerHTML=[...state.journal].reverse().map(j=>`<article class="entry-card"><div class="entry-head"><span>DAY ${j.day} · ${esc(j.date)}</span><span>QUALITY ${j.quality}/5</span></div><h3>${esc(j.learning)}</h3><p>${esc(j.application)}</p>${j.artifact?`<span class="entry-artifact">Artifact · ${esc(j.artifact)}</span>`:''}</article>`).join("");
}

function currentChallenge(){
  const items=labCatalog[activeLab],raw=state.labIndex[activeLab]||0,item=items[raw%items.length];
  return {item,variation:item[2][Math.floor(raw/items.length)%item[2].length]};
}
function renderPractice(){
  const {item,variation}=currentChallenge(),labels={design:["SYSTEM DESIGN","Architecture and trade-offs"],problem:["PROBLEM SOLVING","Investigation and recommendation"],people:["PEOPLE SKILLS","What would you say and do?"],sdlc:["SDLC PRACTICE","Lifecycle plan and decisions"]};
  document.querySelector("#labAttemptCount").textContent=state.practiceAttempts.length;
  document.querySelector("#labType").textContent=labels[activeLab][0];document.querySelector("#labTitle").textContent=item[0];document.querySelector("#labPrompt").textContent=item[1];document.querySelector("#labVariation").textContent=variation;document.querySelector("#labResponseLabel").firstChild.textContent=labels[activeLab][1];
  document.querySelector("#coachPrompts").classList.remove("open");document.querySelector("#coachPrompts").innerHTML=`<ul>${item[3].map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;document.querySelector("#revealCoach").textContent="Reveal coaching prompts";
  document.querySelector("#labRubric").innerHTML=labRubrics[activeLab].map((x,i)=>`<label><input type="checkbox" value="${i}">${esc(x)}</label>`).join("");
  document.querySelectorAll("#labTabs button").forEach(b=>b.classList.toggle("active",b.dataset.lab===activeLab));
}

function renderHandbook(){
  const attempts=state.practiceAttempts||[],artifacts=state.journal.filter(j=>j.artifact);
  document.querySelector("#handbookAttempts").textContent=attempts.length;document.querySelector("#handbookArtifacts").textContent=artifacts.length;document.querySelector("#handbookCoverage").textContent=`${Math.round(state.completed.length/90*100)}%`;
  document.querySelectorAll("#handbookTabs button").forEach(b=>b.classList.toggle("active",b.dataset.handbook===activeHandbook));
  const root=document.querySelector("#handbookContent");
  if(activeHandbook==="curriculum"){
    root.innerHTML=`<div class="curriculum-grid">${curriculumModules.map((m,i)=>`<article class="curriculum-card"><span class="week-chip">WEEK ${i+1}</span><h3>${esc(m[0])}</h3><div class="topic-cloud">${m[1].map(t=>`<span>${esc(t)}</span>`).join("")}</div><div class="curriculum-output">OUTPUT · ${esc(m[2])}</div></article>`).join("")}</div>`;return;
  }
  if(activeHandbook==="templates"){
    root.innerHTML=`<div class="template-grid">${handbookTemplates.map((t,i)=>`<article class="template-card"><h3>${esc(t[0])}</h3><p class="template-preview">${esc(t[1])}</p><button class="secondary-button" data-template="${i}">Copy template</button></article>`).join("")}</div>`;return;
  }
  const attemptCards=[...attempts].reverse().map(a=>`<article class="evidence-card"><div class="entry-head"><span>${esc(a.type.toUpperCase())} · ${esc(a.date)}</span><span>${a.score}/${a.maxScore}</span></div><h3>${esc(a.title)}</h3><p>${esc(a.response)}</p><div class="evidence-score">Self-review <strong>${Math.round(a.score/a.maxScore*100)}%</strong></div></article>`);
  const artifactCards=[...artifacts].reverse().map(a=>`<article class="evidence-card"><div class="entry-head"><span>WORK ARTIFACT · DAY ${a.day}</span><span>JOURNAL</span></div><h3>${esc(a.artifact)}</h3><p>${esc(a.learning)}</p></article>`);
  root.innerHTML=`<div class="evidence-grid">${[...attemptCards,...artifactCards].join("")||'<div class="handbook-empty">Complete a Practice Lab or record a journal artifact.<br>Your evidence will collect here automatically.</div>'}</div>`;
}

function downloadText(name,text,type="text/plain"){
  const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
function handbookMarkdown(){
  const attempts=state.practiceAttempts||[];
  return `# ${state.name?`${state.name}'s `:""}Staff Engineer Handbook\n\nGenerated ${new Date().toISOString().slice(0,10)}\n\n## Progress\n\n- Core sessions: ${state.completed.length}/90\n- Communication reps: ${state.communication.length}\n- Practice attempts: ${attempts.length}\n\n## Practice evidence\n\n${attempts.map(a=>`### ${a.title}\n\n**Track:** ${a.type}  \n**Date:** ${a.date}  \n**Self-review:** ${a.score}/${a.maxScore}\n\n${a.response}\n\n**Reflection:** ${a.reflection||"Not recorded."}`).join("\n\n")||"No practice evidence recorded yet."}\n\n## Learning journal\n\n${state.journal.map(j=>`### Day ${j.day}: ${j.learning}\n\n${j.application}${j.artifact?`\n\n**Artifact:** ${j.artifact}`:""}`).join("\n\n")||"No journal entries recorded yet."}`;
}

function updateAll(){ updateToday();updateProgress();renderRoadmap(document.querySelector("#roadmapFilters .active")?.dataset.filter||"all");renderSkills();renderJournal();renderPractice();renderHandbook(); }

function showView(name){ document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelector(`#${name}View`).classList.add("active");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===name));document.querySelector(".sidebar").classList.remove("open");window.scrollTo(0,0); }
function selectDay(id){ state.selectedDay=Number(id); saveState(); showView("today"); }

document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
document.querySelector("#mobileMenu").addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));
document.addEventListener("click",e=>{ const target=e.target.closest("[data-day]");if(target)selectDay(target.dataset.day); });
document.querySelector("#startSession").addEventListener("click",()=>{if(!timerInterval)document.querySelector("#timerToggle").click();document.querySelector("#timerCard").scrollIntoView({behavior:"smooth",block:"center"});});
document.querySelector("#timerToggle").addEventListener("click",()=>{if(timerInterval){clearInterval(timerInterval);timerInterval=null;saveState();return;}timerInterval=setInterval(()=>{state.elapsed[timerDay]=(state.elapsed[timerDay]||0)+1;if(state.elapsed[timerDay]>=3600){clearInterval(timerInterval);timerInterval=null;toast("Focused hour complete — excellent work.");}if(state.elapsed[timerDay]%10===0)localStorage.setItem("staffpath-state",JSON.stringify(state));renderTimer();},1000);renderTimer();});
document.querySelector("#resetTimer").addEventListener("click",()=>{clearInterval(timerInterval);timerInterval=null;state.elapsed[timerDay]=0;saveState();});
document.querySelector("#completeSession").addEventListener("click",()=>{if(!state.completed.includes(timerDay)){state.completed.push(timerDay);state.selectedDay=null;saveState();toast("Session complete. Your next practice is ready.");}});
document.querySelector("#communicationCheck").addEventListener("change",e=>{state.communication=e.target.checked?[...new Set([...state.communication,timerDay])]:state.communication.filter(x=>x!==timerDay);saveState();toast(e.target.checked?"Communication rep logged.":"Communication rep reopened.");});
document.querySelector("#roadmapFilters").addEventListener("click",e=>{if(!e.target.dataset.filter)return;document.querySelectorAll("#roadmapFilters button").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");renderRoadmap(e.target.dataset.filter);});
document.querySelector("#jumpToday").addEventListener("click",()=>document.querySelector(`#week-${flatPlan[currentIndex()].week}`)?.scrollIntoView({behavior:"smooth"}));
document.querySelector("#skillBars").addEventListener("click",()=>{});
document.querySelector("#confidenceSliders").addEventListener("input",e=>{if(!e.target.dataset.skill)return;state.confidence[e.target.dataset.skill]=Number(e.target.value);saveState();});
document.querySelector("#labTabs").addEventListener("click",e=>{const button=e.target.closest("[data-lab]");if(!button)return;activeLab=button.dataset.lab;document.querySelector("#labForm").reset();renderPractice();});
document.querySelector("#revealCoach").addEventListener("click",()=>{const box=document.querySelector("#coachPrompts"),open=box.classList.toggle("open");document.querySelector("#revealCoach").textContent=open?"Hide coaching prompts":"Reveal coaching prompts";});
document.querySelector("#nextChallenge").addEventListener("click",()=>{state.labIndex[activeLab]=(state.labIndex[activeLab]||0)+1;document.querySelector("#labForm").reset();saveState();});
document.querySelector("#previousChallenge").addEventListener("click",()=>{state.labIndex[activeLab]=Math.max(0,(state.labIndex[activeLab]||0)-1);document.querySelector("#labForm").reset();saveState();});
document.querySelector("#labForm").addEventListener("submit",e=>{
  e.preventDefault();const response=document.querySelector("#labResponse").value.trim();if(!response){toast("Work through the scenario before saving.");return;}
  const {item,variation}=currentChallenge(),checked=[...document.querySelectorAll("#labRubric input:checked")];
  state.practiceAttempts.push({id:Date.now(),type:activeLab,title:item[0],variation,response,reflection:document.querySelector("#labReflection").value.trim(),score:checked.length,maxScore:labRubrics[activeLab].length,date:new Date().toISOString().slice(0,10)});
  state.labIndex[activeLab]=(state.labIndex[activeLab]||0)+1;e.target.reset();saveState();toast("Attempt saved to your Staff handbook.");
});
document.querySelector("#handbookTabs").addEventListener("click",e=>{if(!e.target.dataset.handbook)return;activeHandbook=e.target.dataset.handbook;renderHandbook();});
document.querySelector("#handbookContent").addEventListener("click",async e=>{const button=e.target.closest("[data-template]");if(!button)return;const text=handbookTemplates[Number(button.dataset.template)][1];try{await navigator.clipboard.writeText(text);}catch{const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove();}toast("Template copied.");});
document.querySelector("#exportHandbook").addEventListener("click",()=>{downloadText(`staff-handbook-${new Date().toISOString().slice(0,10)}.md`,handbookMarkdown(),"text/markdown");toast("Handbook exported as Markdown.");});
document.querySelector("#qualityPicker").addEventListener("click",e=>{if(!e.target.dataset.quality)return;quality=Number(e.target.dataset.quality);document.querySelectorAll("#qualityPicker button").forEach(b=>b.classList.toggle("active",Number(b.dataset.quality)===quality));});
document.querySelector("#journalForm").addEventListener("submit",e=>{e.preventDefault();const learning=document.querySelector("#journalLearning").value.trim();if(!learning){toast("Add your main learning first.");return;}state.journal.push({day:timerDay,date:formatDate(),learning,application:document.querySelector("#journalApplication").value.trim(),artifact:document.querySelector("#journalArtifact").value.trim(),quality});e.target.reset();quality=3;saveState();toast("Reflection saved.");});
document.querySelector("#newEntry").addEventListener("click",()=>document.querySelector("#journalLearning").focus());
const dialog=document.querySelector("#setupDialog");document.querySelector("#settingsButton").addEventListener("click",()=>{document.querySelector("#nameInput").value=state.name;document.querySelector("#startDateInput").value=state.startDate;dialog.showModal();});
document.querySelector("#setupForm").addEventListener("submit",()=>{state.name=document.querySelector("#nameInput").value.trim();state.startDate=document.querySelector("#startDateInput").value||state.startDate;saveState();toast("Journey settings saved.");});
document.querySelector("#exportData").addEventListener("click",()=>{
  downloadText(`staffpath-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),"application/json");toast("Progress backup exported.");
});
document.querySelector("#importData").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try { const incoming=JSON.parse(await file.text());if(!Array.isArray(incoming.completed)||!Array.isArray(incoming.journal))throw new Error("Invalid backup");state={...blankState(),...incoming,labIndex:{...defaultState.labIndex,...(incoming.labIndex||{})}};delete state.exportedAt;saveState();dialog.close();toast("Progress restored from backup."); }
  catch { toast("That file is not a valid StaffPath backup."); }
  e.target.value="";
});
document.querySelector("#clearData").addEventListener("click",()=>{if(confirm("Reset all StaffPath progress and reflections?")){localStorage.removeItem("staffpath-state");state=blankState();dialog.close();saveState();}});

updateAll();
if(!state.name)setTimeout(()=>dialog.showModal(),400);
