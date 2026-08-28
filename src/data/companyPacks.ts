export type CompanyPackId = 'none' | 'google' | 'meta' | 'netflix' | 'startup' | 'amazon' | 'atlassian';

export interface CompanyPackScenario {
  track: 'design' | 'problem' | 'people' | 'sdlc';
  title: string;
  prompt: string;
  variations: string[];
  coachingPrompts: string[];
}

export interface CompanyPack {
  id: CompanyPackId;
  label: string;
  company: string;
  description: string;
  focus: string[];
  chapterAngles: Record<string, string>;
  practiceContext: string;
  behavioralQuestions: string[];
  interviewFormat: string;
  keySignals: string[];
  commonMistakes: string[];
  practiceScenarios: CompanyPackScenario[];
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
      'Tell me about a time you influenced a decision without formal authority over the team.',
      'Describe a technical bet you made that paid off — how did you know it was worth the risk?',
      'Tell me about a failure you owned. What specifically changed in how you work afterward?',
      'Describe a time you had to align multiple teams on a technical direction with incomplete information.',
      'Tell me about a time you helped grow another engineer\'s scope or technical judgment.',
      'Describe a time you simplified a system or process that had become unnecessarily complex.',
    ],
    interviewFormat: 'Google interviews are structured: coding (2 rounds), system design (2 rounds), behavioral Googleyness and leadership, and a hiring committee review. System design rounds are 45 minutes and expect a full design with estimation, deep dive, and trade-offs. Behavioral rounds use the STAR format but probe for the scale and ambiguity of the situation.',
    keySignals: [
      'Structured design process with explicit estimation before any component is drawn',
      'Trade-off articulation between consistency, latency, and cost — stated, not implied',
      'Comfort with planetary-scale numbers and back-of-envelope math under time pressure',
      'Ability to deep dive on any part of the design when the interviewer probes',
      'Googleyness — collaborative, humble, and data-driven rather than dogmatic',
    ],
    commonMistakes: [
      'Skipping estimation and jumping straight to components and boxes',
      'Name-dropping Google systems (Spanner, Bigtable) without explaining the trade-off that motivated them',
      'Solving for 1000x scale when the stated requirements only justify 10x',
      'Treating the behavioral round as a formality — Google wants impact stories with the same rigor as technical ones',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design a distributed cron service',
        prompt: 'Design a system that schedules and executes millions of cron jobs across a global fleet, with at-least-once execution guarantees and no single point of failure.',
        variations: ['Support jobs with second-level precision at 10 million jobs/day.', 'Handle a datacenter-wide outage without missing or duplicating job runs.', 'Add per-job execution history and retry policy configuration.'],
        coachingPrompts: ['How do you shard job ownership across scheduler instances?', 'What happens when a scheduler crashes mid-dispatch?', 'How do you estimate the write throughput on the job store?'],
      },
      {
        track: 'design',
        title: 'Design a globally consistent rate limiter for a cloud API platform',
        prompt: 'Design rate limiting for a multi-region API platform where quotas must be enforced consistently across regions without a single global choke point.',
        variations: ['Support per-project, per-API, and per-region quota tiers.', 'Keep enforcing limits correctly during a cross-region network partition.', 'Add real-time quota usage visibility for platform customers.'],
        coachingPrompts: ['Where does eventual consistency in quota counting become unacceptable?', 'How do you bound the blast radius of a quota store outage in one region?', 'What is the cost of stronger consistency here, and is it worth paying?'],
      },
      {
        track: 'design',
        title: 'Estimate and design the storage layer for a mapping service',
        prompt: 'Estimate storage and design the data layer for a service storing road network, imagery tile, and points-of-interest data for global map coverage.',
        variations: ['Support real-time traffic overlay updates every 30 seconds.', 'Estimate storage growth over 5 years as imagery resolution improves.', 'Design for regional data residency requirements.'],
        coachingPrompts: ['What is the dominant cost driver: tiles, vector data, or POI metadata?', 'How would you validate your estimate against a real system if you had access to one?', 'Where would you intentionally under-invest at launch and expand later?'],
      },
      {
        track: 'problem',
        title: 'Diagnose a service that passes all synthetic health checks but users report failures',
        prompt: 'A backend service shows 100% synthetic uptime, but real user reports show a 2% failure rate concentrated on a specific request type.',
        variations: ['The gap only appears during regional peak traffic hours.', 'The gap correlates with a specific client library version.', 'The gap started after a dependency was migrated to a new region.'],
        coachingPrompts: ['Why would synthetic checks miss what real traffic reveals?', 'What telemetry would close the gap between synthetic and real signal?', 'How do you prioritize this against other in-flight work given the low aggregate percentage?'],
      },
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
      'Tell me about your most impactful project and how you measured that impact.',
      'Describe an initiative that failed. What did you learn and what did you do differently next time?',
      'Tell me about feedback you gave that changed how someone approached their work.',
      'Describe a time you moved fast on a decision and it worked out — how did you manage the risk?',
      'Tell me about a time you had to align engineering, product, and design without a shared manager.',
      'Describe a time you decided not to build something the team was excited about.',
    ],
    interviewFormat: 'Meta interviews include a system design round (often product-focused — design the news feed, design a Stories feature), a behavioral round emphasizing Meta\'s values (Move Fast, Be Direct, Build Social Value), and coding rounds focused on arrays, graphs, and dynamic programming. Expect the interviewer to push on product decisions alongside technical ones — why this feature, what metric, what trade-off.',
    keySignals: [
      'Product intuition expressed alongside technical depth, not instead of it',
      'Metric-driven trade-offs — every design choice tied to a measurable outcome',
      'Execution at scale under time pressure without sacrificing correctness',
      'Direct, confident communication that states a position clearly',
      'Cross-functional influence stories involving PM and design, not just engineering peers',
    ],
    commonMistakes: [
      'Designing a technically perfect system that is never connected back to a product metric',
      'Not knowing Meta\'s actual scale (billions of daily active users, billions of daily messages)',
      'Giving vague behavioral stories without a concrete, measurable outcome',
      'Failing to discuss what was deliberately left out of scope and why',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design a notification system for a billion-user social app',
        prompt: 'Design the notification delivery pipeline for a social app with 2 billion users, supporting push, in-app, and email channels with user-configurable preferences.',
        variations: ['Prevent notification fatigue by batching and ranking during high-activity periods.', 'Support real-time delivery for time-sensitive notifications (mentions, live events).', 'Add A/B experiment support for notification copy and timing.'],
        coachingPrompts: ['How would you measure whether this system is actually improving engagement, not just delivery rate?', 'What is the cost of over-notifying versus under-notifying a user?', 'How do preference changes propagate without a full re-index?'],
      },
      {
        track: 'design',
        title: 'Design an ad ranking pipeline for a consumer feed',
        prompt: 'Design the real-time ad auction and ranking pipeline that selects which ad to show in a social feed, balancing advertiser bid, relevance, and user experience.',
        variations: ['Ensure the pipeline degrades gracefully under a 10x traffic spike during a major event.', 'Add a mechanism to detect and demote low-quality or misleading ads in real time.', 'Support advertiser-side experimentation without leaking data across advertisers.'],
        coachingPrompts: ['How do you balance advertiser revenue against user engagement in the ranking function?', 'What is the latency budget for the auction and where does it get spent?', 'How would you detect that ranking quality has silently regressed?'],
      },
      {
        track: 'design',
        title: 'Design a cross-app Stories feature',
        prompt: 'Design a Stories feature that works consistently across two separate consumer apps sharing the same backend infrastructure, with independent release cycles.',
        variations: ['Support cross-posting a Story to both apps with app-specific formatting.', 'Handle one app team wanting to ship a Stories feature change the other app team is not ready for.', 'Keep media storage costs bounded as Stories content grows.'],
        coachingPrompts: ['How do you version an API contract two independently-shipping teams both depend on?', 'What does "shared infrastructure, independent roadmaps" cost you architecturally?', 'How would you decide whether a feature belongs in shared infra or per-app code?'],
      },
      {
        track: 'sdlc',
        title: 'Double a team\'s delivery velocity without adding headcount',
        prompt: 'Your team\'s velocity has been flat for two quarters. Leadership asks you to double delivery output without adding engineers. Walk through your approach.',
        variations: ['The team is already working long hours — headcount is the only lever leadership will not pull.', 'Half the velocity loss is attributable to an under-invested internal tool.', 'The team disagrees among themselves about the root cause.'],
        coachingPrompts: ['How do you distinguish a real velocity problem from a measurement problem?', 'What would you stop doing before you start doing more?', 'How do you know the change worked, and by when?'],
      },
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
      'Tell me about a service you owned end-to-end through a production incident.',
      'Describe a time you disagreed with a decision and committed to executing it anyway.',
      'Tell me about a decision you made that others on your team thought was too risky.',
      'How have you handled a teammate whose work was not meeting the bar the team needed?',
      'Describe a time you simplified a system that had become operationally unmanageable.',
      'What does operational excellence mean to you, in a specific situation rather than in the abstract?',
    ],
    interviewFormat: 'Netflix interviews are values-heavy. Every round assesses culture fit alongside technical ability — interviewers are looking for the Netflix culture deck in action: highly aligned, loosely coupled, freedom and responsibility. System design rounds expect you to demonstrate operational ownership, not just "how would you build it" but "how would you run it at 3am." Behavioral rounds probe judgment, candor, and ownership directly.',
    keySignals: [
      'Demonstrated end-to-end service ownership, including the operational and on-call parts',
      'Judgment exercised without waiting for permission, with a clear account of the reasoning',
      'Ability to give and receive candid, direct feedback without softening it into vagueness',
      'Operational maturity under real incident conditions, not just design-time resilience',
      'Comfort with ambiguity and high autonomy — Netflix does not want to be asked for permission',
    ],
    commonMistakes: [
      'Waiting for permission in behavioral stories when Netflix is testing for initiative',
      'Describing a system\'s design without discussing how you would actually operate and on-call for it',
      'Giving diplomatic, softened feedback stories instead of direct, candid ones',
      'Not knowing Netflix\'s own engineering culture and tooling (Chaos Monkey, EVCache, Zuul, Kayenta)',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design a playback session state service',
        prompt: 'Design the service that tracks playback position, quality, and device state for a streaming session — focus as much on how you would run it as how you would build it.',
        variations: ['Support resuming playback seamlessly across devices mid-session.', 'Handle a regional outage without losing in-progress session state.', 'Add real-time quality-of-experience telemetry without adding playback latency.'],
        coachingPrompts: ['What does your on-call rotation look like for this service specifically?', 'What is your plan the first time this service pages you at 3am?', 'How do you validate this design survives a real regional failover, not just a tabletop exercise?'],
      },
      {
        track: 'design',
        title: 'Design a chaos engineering platform',
        prompt: 'Design a platform that injects controlled failures into production services to validate resilience, without causing real customer-facing impact.',
        variations: ['Support scheduling automated chaos experiments during business hours with safety guarantees.', 'Add a kill switch that any on-call engineer can trigger within seconds.', 'Track and report which services have never been chaos-tested.'],
        coachingPrompts: ['How do you bound the blast radius of an experiment that goes wrong?', 'What convinces a service owner to opt in rather than opt out?', 'How would you know this platform is actually improving resilience, not just generating incident reports?'],
      },
      {
        track: 'problem',
        title: 'Lead an incident response for a 40-minute outage',
        prompt: 'A microservice you own has been down for 40 minutes, affecting playback for a subset of users. Walk me through your incident response from the first alert to the postmortem.',
        variations: ['The root cause is not obvious after the first 15 minutes.', 'A dependent team\'s service is also affected and their on-call is unresponsive.', 'The fix requires a risky rollback of a migration in progress.'],
        coachingPrompts: ['At what point do you escalate versus continue investigating alone?', 'How do you communicate status to stakeholders without slowing down the fix?', 'What makes this postmortem blameless while still being genuinely useful?'],
      },
      {
        track: 'people',
        title: 'Handle a teammate who is not meeting the bar',
        prompt: 'A teammate\'s recent work has repeatedly missed quality expectations, and it is starting to affect the team\'s delivery. How do you handle this directly?',
        variations: ['The teammate is well-liked and other team members are reluctant to raise it.', 'You do not manage this person — you are a peer.', 'The teammate pushes back hard when you raise it.'],
        coachingPrompts: ['How do you deliver this feedback with full candor without being needlessly harsh?', 'What is the difference between raising this once and raising it as a pattern?', 'How do you know if this is a skill gap, a motivation gap, or a fit gap?'],
      },
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
      'Describe a time you owned an outcome that went beyond your formal engineering role.',
      'Tell me about working with minimal process — what process did you add, and why that and nothing more?',
      'Describe a technical bet that failed fast — how did you know to stop, and how quickly did you stop?',
      'Tell me about a time you had to navigate ambiguity with no clear owner for the decision.',
      'Describe how you have grown another engineer\'s scope outside of a formal mentorship structure.',
      'Why a startup, and what are you specifically optimizing for at this stage of your career?',
    ],
    interviewFormat: 'Startup interviews vary but typically cover a system design problem at 10x (not 1000x) current scale, a behavioral round about ambiguity, ownership, and shipping speed, and a technical problem-solving round. Expect founders or senior ICs to interview you directly. The conversation is often more bilateral — they want to know how you think about product and business, not just engineering. No committee; faster decisions.',
    keySignals: [
      'Comfort with ambiguity and incomplete information without stalling on it',
      'Ability to scope a problem quickly and ship the simplest thing that actually works',
      'Pragmatic trade-offs between speed, correctness, and cost, stated explicitly',
      'Ownership beyond engineering scope — product sense and customer empathy',
      'Evidence you can do the job today and grow into 2x the job within 18 months',
    ],
    commonMistakes: [
      'Over-engineering the design for a scale the company will not reach for years',
      'Not connecting technical choices back to a business outcome the founders actually care about',
      'Long stories about team process rather than concrete individual impact',
      'Missing the "why this company" signal — startup interviewers read culture fit fast',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design the payment system for a 6-week launch',
        prompt: 'You are the only Staff engineer at a 40-person startup. Design the payment system for a product launch in 6 weeks, knowing the team cannot build everything from scratch.',
        variations: ['Compliance requires PCI scope to stay minimal — what do you outsource entirely?', 'The product needs to support both one-time and subscription payments at launch.', 'A key payment provider integration slips by 2 weeks — what is your fallback?'],
        coachingPrompts: ['What would you build versus what would you buy, and why at this specific stage?', 'What is the minimum reconciliation process you actually need on day one?', 'How do you keep this simple system upgradeable once the company has PMF?'],
      },
      {
        track: 'design',
        title: 'Reduce infrastructure cost by 40% without hurting UX',
        prompt: 'The CTO asks you to reduce infrastructure costs by 40% without impacting user experience. Where do you start and how do you sequence the work?',
        variations: ['Most of the cost is concentrated in a single over-provisioned database tier.', 'The team has no cost attribution by feature or team, so nothing is measured yet.', 'One proposed cut would improve cost but add meaningful latency for a subset of users.'],
        coachingPrompts: ['How do you find the highest-leverage cut first without a full audit taking a month?', 'What is the risk of cutting before you have cost attribution in place?', 'How do you validate "no UX impact" before shipping the change, not after?'],
      },
      {
        track: 'design',
        title: 'Design a multi-tenant SaaS MVP that can evolve to per-tenant isolation',
        prompt: 'Design a multi-tenant SaaS backend using a shared database and schema that can evolve toward per-tenant isolation as specific enterprise customers require it.',
        variations: ['One early customer requires data residency in a specific region before others do.', 'A tenant\'s usage pattern is degrading query performance for every other tenant.', 'Sales signs a large customer that requires audit logging you have not built yet.'],
        coachingPrompts: ['What is the cheapest change today that keeps the door open for isolation later?', 'How would you contain one noisy tenant without a full re-architecture?', 'At what signal would you actually invest in per-tenant isolation rather than defer it again?'],
      },
      {
        track: 'sdlc',
        title: 'Inherit three undocumented systems after a founding engineer leaves',
        prompt: 'A founding engineer leaves suddenly. You inherit three production systems with no documentation and unclear ownership. What do you do in the first week?',
        variations: ['One of the three systems is customer-facing and currently stable.', 'You discover one system has no tests and a history of silent failures.', 'The rest of the team is heads-down on a launch and cannot help you ramp up.'],
        coachingPrompts: ['How do you triage which system needs attention first?', 'What is the fastest way to build a mental model of an undocumented system safely?', 'What would you document first, and for whom?'],
      },
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
      'Tell me about a time you advocated for the customer over internal stakeholder pressure.',
      'Describe a decision you made with incomplete data that you would still make the same way today.',
      'Tell me about a time you had to rebuild trust with a team or stakeholder after a failure.',
      'Describe a long-term technical bet you made that took real conviction to see through.',
      'Tell me about a project where the plan changed significantly but you still delivered the outcome.',
    ],
    interviewFormat: 'Amazon interviews are structured around the Leadership Principles — every behavioral question maps to one or more LPs. System design rounds are technical but a bar raiser interviewer specifically tests for LP demonstrations in how you approach and communicate the design. Expect a loop of 4-6 interviews: system design, coding (x2), behavioral LP deep-dives (x2-3), and a bar raiser. Prepare roughly a dozen STAR stories that each demonstrate a different LP.',
    keySignals: [
      'Leadership Principles demonstrated through specific, measurable stories — shown, not claimed',
      'Dive Deep — genuine curiosity about root causes and second-order effects, not surface answers',
      'Ownership — taking responsibility for outcomes beyond your literal job description',
      'Bias for Action paired with correct judgment about reversibility (one-way versus two-way doors)',
      'Customer Obsession — every technical decision explicitly connected back to customer impact',
    ],
    commonMistakes: [
      'Vague behavioral answers without metrics — Amazon interviewers probe hard for numbers',
      'Claiming a Leadership Principle without a concrete example behind it',
      'Missing the bar raiser\'s LP focus in the system design round — they evaluate your thinking process and collaboration as much as the design itself',
      'Over-relying on team stories — Amazon specifically wants to hear "I," not just "we"',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design an order fulfillment state machine',
        prompt: 'Design the order fulfillment pipeline for an e-commerce platform — every step must be idempotent and recoverable from a partial failure at any point.',
        variations: ['An order spans multiple warehouses that must coordinate partial shipments.', 'A payment authorization succeeds but the fulfillment step fails hours later.', 'Support cancellation and refund at any point in the pipeline without corrupting state.'],
        coachingPrompts: ['What does "processed" mean precisely at each stage of this pipeline?', 'How do you guarantee no order is silently lost during a service restart?', 'Where would a bar raiser expect you to Dive Deep on this design?'],
      },
      {
        track: 'design',
        title: 'Design a payment reconciliation system',
        prompt: 'Design a system that detects and repairs discrepancies between your internal payment ledger and external bank settlement records.',
        variations: ['Discrepancies must be resolved within a strict same-day SLA for a subset of transaction types.', 'The bank settlement feed arrives in a batch file with occasional duplicate records.', 'A discrepancy could indicate a real financial loss, not just a timing difference.'],
        coachingPrompts: ['How do you distinguish a timing discrepancy from an actual financial error?', 'What does Ownership look like when a discrepancy has no obvious owner across two systems?', 'How would you Dive Deep to find a systemic root cause instead of patching individual discrepancies?'],
      },
      {
        track: 'problem',
        title: 'Diagnose a critical payment service with a low but costly error rate',
        prompt: 'You own a critical payment service that processes $1B/day and has a 0.01% error rate causing real customer impact. How do you diagnose, prioritize, and drive the fix?',
        variations: ['The error rate has been stable for months and was previously accepted as "normal."', 'Fixing the root cause requires a migration that will take a full quarter.', 'A customer escalation brings executive attention to this specific issue today.'],
        coachingPrompts: ['Why does 0.01% deserve urgent attention at this specific scale?', 'How do you Dive Deep to find whether this is one root cause or several compounding issues?', 'What would you tell a VP about the trade-off between a quick mitigation and the real fix?'],
      },
      {
        track: 'design',
        title: 'Design a cross-region active-active inventory system',
        prompt: 'Design an inventory system that operates active-active across regions and prevents overselling during a high-demand event like a flash sale.',
        variations: ['Network partition between regions during peak demand must not cause overselling.', 'A specific high-demand SKU sees 100x normal request volume in a 10-minute window.', 'Support real-time inventory visibility to sellers without exposing internal system details.'],
        coachingPrompts: ['Where do you accept eventual consistency, and where must you enforce strong consistency?', 'What is the customer cost of overselling versus the cost of under-selling available inventory?', 'How would Bias for Action and Are Right A Lot pull you in different directions here?'],
      },
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
      'Describe an API contract you owned and evolved without breaking existing consumers.',
      'Tell me about a difficult situation where transparent, direct communication was the right call.',
      'Describe a multi-tenant isolation problem you diagnosed and solved.',
      'Tell me about a developer experience improvement that measurably increased adoption.',
      'Describe a disagreement you resolved through documentation and evidence rather than a meeting.',
    ],
    interviewFormat: 'Atlassian interviews follow a values-based hiring process: every round evaluates the Atlassian values (Open Company No Bullshit, Build with Heart and Balance, Don\'t #@!% the Customer, Play as a Team, Be the Change You Seek). System design rounds often involve platform and API problems — think Jira, Confluence, or Bitbucket. Behavioral rounds probe collaboration, transparency, and how you operate in a flat, autonomous team structure. Expect a take-home or live coding component.',
    keySignals: [
      'API and platform thinking — stable contracts, deliberate versioning, developer experience as a first-class concern',
      'Collaborative decision-making that is transparent and documented, not made behind closed doors',
      'Multi-tenant correctness — Atlassian serves enterprises with strict isolation and compliance requirements',
      'End-to-end delivery ownership achieved without heavy process overhead',
      'Customer empathy that connects engineering decisions to outcomes for the teams using the product',
    ],
    commonMistakes: [
      'Designing APIs without a versioning and backward-compatibility strategy — Atlassian integrations are long-lived',
      'Not connecting a design back to the developer experience for teams building on top of the platform',
      'Missing the collaboration signal — Atlassian wants to see you build consensus, not win an argument',
      'Not knowing how Atlassian\'s own product suite (Jira, Confluence, Bitbucket, Forge) actually integrates',
    ],
    practiceScenarios: [
      {
        track: 'design',
        title: 'Design a webhook delivery system for a marketplace platform',
        prompt: 'Design Jira\'s webhook delivery system — millions of events per day fanning out to thousands of third-party integrations with at-least-once delivery guarantees.',
        variations: ['A specific third-party consumer is slow and its backlog is growing unbounded.', 'Support consumers subscribing to a filtered subset of event types at scale.', 'Add delivery status visibility for marketplace app developers debugging their integration.'],
        coachingPrompts: ['How do you isolate one slow consumer from affecting delivery to all others?', 'What does "at-least-once" cost the consumer, and how do you make deduplication easy for them?', 'How would you design the developer-facing debugging experience for this system?'],
      },
      {
        track: 'design',
        title: 'Design a hierarchical permission model for an enterprise wiki',
        prompt: 'Design the permission model for a Confluence-like product — supporting organization hierarchy, space, page, and block-level permissions without performance degradation at scale.',
        variations: ['A permission change at the organization level must propagate correctly without a full re-index.', 'Support a page inheriting permissions from its space by default but allowing overrides.', 'Keep permission checks fast enough for a real-time collaborative editing experience.'],
        coachingPrompts: ['Where do you cache permission decisions, and how do you invalidate that cache correctly?', 'How do you test that a permission override does not leak access unintentionally?', 'What is the performance budget for a permission check in a hot read path?'],
      },
      {
        track: 'design',
        title: 'Design a multi-tenant indexing pipeline for enterprise AI search',
        prompt: 'Design an indexing pipeline for an AI-powered enterprise search feature that must keep results fresh without exposing any cross-tenant data.',
        variations: ['A single large enterprise customer generates 10x the indexing volume of a typical tenant.', 'Per-tenant, per-space, and per-page permissions must all be respected at query time, not just index time.', 'A tenant deletes a document — it must disappear from search results within a defined SLA.'],
        coachingPrompts: ['Where exactly does permission enforcement happen — index time, query time, or both, and why?', 'How do you prevent one large tenant\'s indexing load from delaying freshness for everyone else?', 'What would a security review specifically ask you to prove about this design?'],
      },
      {
        track: 'sdlc',
        title: 'Design a public API intended to stay stable for 5 years',
        prompt: 'You are asked to design a public API for a new product that must stay stable for external developers for at least 5 years. Walk through your design and versioning strategy.',
        variations: ['A partner team wants a breaking change six months after launch.', 'You discover a design flaw in the API only after external developers have built on it.', 'Usage data shows one endpoint is rarely used but expensive to maintain.'],
        coachingPrompts: ['What do you get right at design time that is hardest to change later?', 'How do you deprecate a rarely-used but already-adopted endpoint responsibly?', 'What does your API changelog and communication process look like for external developers?'],
      },
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
