import type { EncyclopediaChapter } from '../domain/encyclopedia';

export const requirementsQualityAttributesChapter: EncyclopediaChapter = {
  id: 'requirements-quality-attributes',
  title: 'Requirements and quality attributes',
  category: 'Architecture',
  summary: 'Turn an ambiguous product prompt into measurable behavior, scale, reliability, security, and cost constraints that drive architecture.',
  problemStatement: 'Teams choose components before agreeing on users, outcomes, and measurable quality targets, producing designs that are either over-engineered or fail under real load.',
  interviewQuestion: 'How do you begin a Staff-level system design interview?',
  coreTension: 'Discovery consumes the very time the design needs, yet designing before the drivers are explicit produces confident guesses — the discipline is deciding how much remaining ambiguity could actually change the architecture.',
  levelExpectations: {
    mid: 'Restates the problem, asks for scale numbers, and jumps to components. Treats quality attributes as a checklist to recite rather than constraints that eliminate design options.',
    senior: 'Quantifies scale, latency, availability, consistency, and cost, isolates the two or three architecture drivers, and states explicit non-goals and assumptions. Ties each driver to a validation plan before drawing the design.',
    staff: 'Treats requirement discovery as risk negotiation with product and business stakeholders — deciding which uncertainties matter enough to resolve, publishing assumptions with revisit triggers, and using drivers to kill options early so the organization stops re-litigating settled scope.',
  },
  coreConcepts: [
    'Functional requirements',
    'Quality attributes',
    'Architecture drivers',
    'Constraints and assumptions',
    'Non-goals',
    'Success metrics',
    'Scope boundaries',
  ],
  architectureDiagram:
    'flowchart TD\n  P[Product prompt] --> U[Users and journeys]\n  U --> F[Functional scope]\n  U --> Q[Quality attributes]\n  F --> D[Architecture drivers]\n  Q --> D\n  C[Constraints] --> D\n  D --> O[Options]\n  O --> V[Validation plan]',
  solutionApproach: [
    'Clarify users, primary journeys, and the business outcome',
    'List functional behaviors and rank the top three that matter most',
    'Quantify quality attributes: scale, latency, availability, consistency, security, cost',
    'State explicit non-goals, assumptions, and compliance constraints',
    'Identify architecture drivers—the qualities that will eliminate design options',
    'Define how you will validate the design before and after launch',
  ],
  designPatterns: [
    'Quality attribute scenarios',
    'Architecture decision record',
    'Risk-first discovery',
    'Walking skeleton',
    'MVP with explicit quality envelope',
  ],
  tradeoffs: [
    'Breadth versus depth in the interview window',
    'Time-to-market versus reliability investment',
    'Flexibility versus operational simplicity',
    'Precision versus speed when information is incomplete',
  ],
  failureScenarios: [
    'Solving the wrong problem because users were never named',
    'Unmeasurable requirements like “fast” or “scalable”',
    'Hidden compliance or residency constraint discovered late',
    'Optimizing for a quality attribute the product does not need',
    'Scope creep from missing non-goals',
  ],
  productionConsiderations: [
    'Trace each quality attribute to SLIs, SLOs, and acceptance tests',
    'Revisit assumptions quarterly using production telemetry',
    'Assign an owner for each architecture driver',
    'Publish non-goals so future teams do not re-litigate settled trade-offs',
  ],
  staffDiscussion: [
    'Connect every major design choice to a business outcome, not personal preference',
    'Manage ambiguity by stating assumptions and revisit triggers instead of false certainty',
    'Make non-goals as explicit as goals to protect delivery focus',
    'Teach interviewers and teams to reward structured discovery over premature diagrams',
  ],
  relatedTopics: ['Capacity estimation', 'API design', 'SLOs', 'Threat modeling', 'Cost optimization'],
  realWorldSystems: ['Platform RFCs', 'Product launch reviews', 'System design interviews', 'Enterprise procurement'],
  followUpQuestions: [
    'Which quality attribute would you relax first if the deadline moved up?',
    'What evidence would change your top architecture driver?',
    'How do you keep functional scope from expanding during design?',
  ],
  cheatSheet: [
    'Start with users, journeys, and outcomes—not boxes',
    'Quantify scale, latency, availability, consistency, security, and cost',
    'Name non-goals and assumptions explicitly',
    'Pick 2–3 architecture drivers that eliminate options',
  ],
  flashcards: [
    {
      question: 'What is an architecture driver?',
      answer: 'A quality attribute or constraint so important that it eliminates or strongly favors certain design options.',
    },
    {
      question: 'Why state non-goals in a design?',
      answer: 'They prevent scope creep and make trade-offs auditable when priorities shift later.',
    },
  ],
  oneMinuteAnswer:
    'I start by clarifying users, the core journey, and the business outcome. I list functional behaviors, then quantify quality attributes—scale, latency, availability, consistency, security, and cost—and identify the two or three architecture drivers that will shape the design. I state assumptions, constraints, and explicit non-goals so the team knows what we are not optimizing for. Before drawing components, I define how we will validate the design: load envelope, failure modes, security boundaries, and success metrics tied to user outcomes.',
};

export const capPacelcConsistencyChapter: EncyclopediaChapter = {
  id: 'cap-pacelc-consistency',
  title: 'CAP, PACELC, and consistency',
  category: 'Systems',
  summary: 'Choose consistency from user-visible invariants during normal operation and during network partitions—not from slogans.',
  problemStatement:
    'Teams treat CAP as a one-time pick between consistency and availability, but real systems need different guarantees per dataset, and PACELC reminds us latency matters even when the network is healthy.',
  interviewQuestion: 'Explain the consistency model for a multi-region shopping cart and payment ledger.',
  coreTension: 'Users experience consistency as product behavior, but every strengthening of it buys latency or availability somewhere in the world — the real decision is which invariants each journey can feel, not which slogan the database advertises.',
  levelExpectations: {
    mid: 'Recites CAP and picks "eventual consistency" globally. Can configure quorum reads and writes but cannot say what staleness a user actually experiences or what happens to checkout during a partition.',
    senior: 'Chooses consistency per dataset, uses PACELC to separate partition behavior from normal-path latency, adds session guarantees where journeys need read-your-writes, and documents staleness bounds and conflict behavior at the API level.',
    staff: 'Translates consistency choices into user-visible semantics and business risk — negotiating them with product and compliance as SLA decisions, designing the observability that proves declared guarantees hold, and owning the repair tooling for when conflicts surface anyway.',
  },
  coreConcepts: [
    'CAP theorem',
    'PACELC extension',
    'Linearizability',
    'Sequential consistency',
    'Eventual consistency',
    'Read-your-writes',
    'Causal consistency',
    'Quorum reads and writes',
    'Session guarantees',
  ],
  architectureDiagram:
    'flowchart TD\n  I[User invariant] --> N{Normal path PACELC}\n  N --> L[Latency vs consistency]\n  I --> P{Partition path CAP}\n  P --> C[Consistency choice]\n  P --> A[Availability choice]\n  L --> M[Declared model]\n  C --> M\n  A --> M\n  M --> API[Documented API semantics]',
  solutionApproach: [
    'Name the user-visible invariant for each dataset separately',
    'Classify reads and writes by whether stale or conflicting data is acceptable',
    'Choose normal-path trade-offs using PACELC: latency versus consistency when the network is fine',
    'Define partition behavior explicitly: fail, degrade, or queue',
    'Select session guarantees such as read-your-writes or monotonic reads where needed',
    'Expose staleness bounds, conflict behavior, and repair in APIs and UX',
  ],
  designPatterns: [
    'Leader-based replication',
    'Quorum read/write',
    'Read replicas with session stickiness',
    'Conflict-free replicated data types',
    'Version vectors and last-write-wins with caution',
    'Sticky routing for session guarantees',
  ],
  tradeoffs: [
    'Consistency versus availability during partitions',
    'Latency versus coordination on the normal path',
    'Simple global semantics versus regional throughput',
    'Automatic merge versus operator or user conflict resolution',
  ],
  failureScenarios: [
    'Network partition causes split-brain writes',
    'Stale read after a write because session routing was lost',
    'Authorization decision made on expired replica state',
    'Conflicting merges silently drop business-critical updates',
    'Users see different cart contents in different regions',
  ],
  productionConsiderations: [
    'Measure replication lag, conflict rate, and read routing',
    'Chaos-test partition and slow-network behavior regularly',
    'Document guarantees per API field, not only per storage engine',
    'Provide repair tooling and support playbooks for conflicts',
  ],
  staffDiscussion: [
    'Translate CAP and PACELC into product consequences users can feel',
    'Use different consistency models for cart, catalog, and ledger—not one global choice',
    'Make degraded semantics visible instead of pretending strong guarantees',
    'Challenge “we need strong consistency everywhere” with cost and latency evidence',
  ],
  relatedTopics: ['Consensus', 'Replication', 'Distributed transactions', 'Data residency', 'Caching'],
  realWorldSystems: ['Shopping cart', 'Global user profile', 'Financial ledger', 'Social feed ranking'],
  followUpQuestions: [
    'Why is PACELC more useful than CAP alone in interviews?',
    'How do you provide read-your-writes across regions without global linearizability?',
    'What happens to checkout if the inventory region is partitioned?',
  ],
  cheatSheet: [
    'CAP applies during partitions; PACELC applies on the normal path — most systems spend 99.9% of time on the normal path',
    'Pick consistency per dataset and user journey — not one model for the whole system',
    'Session guarantees (read-your-writes, monotonic reads) often matter more than global linearizability',
    'Document conflict and staleness behavior in APIs — clients need to know what they can rely on',
    'DB positioning: DynamoDB (AP, EL — high A, lower C); Spanner (CP, PC — strong C, higher L); Cassandra (AP, EL — tunable); CockroachDB (CP, PC — serializable, distributed); MongoDB (CP w/ tunable reads); Postgres (CP — local)',
  ],
  flashcards: [
    {
      question: 'What does PACELC add to CAP?',
      answer: 'Even without a partition, systems trade latency against consistency; PACELC makes that normal-path choice explicit.',
    },
    {
      question: 'When is eventual consistency acceptable?',
      answer: 'When business invariants tolerate temporary divergence and you can bound staleness or repair conflicts safely.',
    },
  ],
  oneMinuteAnswer:
    'I separate the question by dataset and user journey. For a shopping cart I may accept eventual consistency with session stickiness so users see their own writes, while a payment ledger needs strong invariants and likely leader-based or quorum writes. CAP tells me what happens during a partition; PACELC reminds me that on the normal path I still choose latency versus consistency. I document API semantics, staleness bounds, conflict handling, and degraded behavior, then validate with replication-lag metrics and partition tests—not slogans.',
};

export const consensusCoordinationChapter: EncyclopediaChapter = {
  id: 'consensus-coordination',
  title: 'Consensus and distributed coordination',
  category: 'Systems',
  summary: 'Coordinate leadership, membership, and replicated decisions using proven algorithms while respecting leases, fencing, and failure detection.',
  problemStatement:
    'Multiple nodes must agree on a single ordering of configuration or leadership changes; ad-hoc locking and home-grown election fail under crashes, clock skew, and network delays.',
  interviewQuestion: 'Design leader election and safe task execution for a distributed scheduler.',
  coreTension: 'Consensus is the only proven way to agree under failure, yet it is expensive, operationally fragile, and contagious — the craft lies in shrinking where it must run while refusing to improvise in the places it must.',
  levelExpectations: {
    mid: 'Knows Raft elects leaders and can describe quorum voting. Reaches for a lock service but treats a granted lock as safety, missing fencing tokens and the stale-leader window after a partition heals.',
    senior: 'Uses proven consensus (etcd, ZooKeeper) for control-plane state only, issues monotonic fencing tokens with every leadership grant, requires the data plane to reject stale leaders, and exercises membership changes and quorum loss before production.',
    staff: 'Minimizes the coordination surface itself — sharding ownership, designing idempotent leaderless data planes, and separating control from data plane — while treating the consensus layer as a critical dependency with backup, disaster recovery, and change-management rigor.',
  },
  coreConcepts: [
    'Raft',
    'Paxos',
    'Replicated log',
    'Leader election',
    'Terms and epochs',
    'Quorum',
    'Leases',
    'Fencing tokens',
    'Membership changes',
    'etcd and ZooKeeper',
  ],
  architectureDiagram:
    'flowchart LR\n  C1[Candidate] --> V{Vote quorum}\n  C2[Candidate] --> V\n  C3[Candidate] --> V\n  V --> L[Leader with term]\n  L --> R[Replicated log]\n  R --> F[Fencing token]\n  F --> W[Workers / storage]',
  solutionApproach: [
    'Decide whether coordination is truly required or can be avoided with partitioning',
    'Use a proven consensus layer such as Raft via etcd or ZooKeeper for control-plane state',
    'Replicate configuration and leadership decisions through an append-only log',
    'Issue monotonically increasing fencing tokens with every leadership grant',
    'Require workers and storage to reject stale leaders even if their lease has not expired locally',
    'Plan safe membership changes, snapshots, and disaster recovery',
  ],
  designPatterns: [
    'Replicated state machine',
    'Lease with fencing token',
    'Single elected writer',
    'Control plane versus data plane separation',
    'Watch-based configuration distribution',
  ],
  tradeoffs: [
    'Safety versus availability when quorum is lost',
    'Lease duration versus recovery time after leader failure',
    'Central coordination versus autonomous shards',
    'Operational complexity of running consensus versus managed service',
  ],
  failureScenarios: [
    'Stale leader continues writing after partition heals',
    'Split brain when fencing is missing on the data plane',
    'Lost quorum makes the control plane unavailable',
    'Unsafe lock expiry during long garbage-collection pause',
    'Membership change misconfigured and loses quorum permanently',
  ],
  productionConsiderations: [
    'Monitor quorum health, election churn, and log commit latency',
    'Exercise rolling restarts and member add/remove in staging',
    'Never rely on lock ownership alone—always fence downstream resources',
    'Keep consensus payloads small; do not run application data through the log',
  ],
  staffDiscussion: [
    'Avoid building consensus casually; buy or adopt etcd, ZooKeeper, or cloud equivalents',
    'Reduce coordination scope by sharding ownership and using idempotent workers',
    'Account for operator complexity and backup of consensus state',
    'Distinguish interview knowledge of Paxos from production choice of Raft ergonomics',
  ],
  relatedTopics: ['Distributed locks', 'Job schedulers', 'Service discovery', 'Split brain', 'Distributed transactions'],
  realWorldSystems: ['Kubernetes control plane', 'Kafka controller', 'Distributed cron', 'Configuration service'],
  followUpQuestions: [
    'Why are fencing tokens required if the lock service is correct?',
    'How does Raft handle a partitioned minority leader?',
    'When would you shard schedulers instead of electing one global leader?',
  ],
  cheatSheet: [
    'Use proven consensus for control-plane metadata only',
    'Leadership grants must include monotonic fencing tokens',
    'Data plane must reject stale leaders',
    'Quorum loss is an availability event, not a silent success',
  ],
  flashcards: [
    {
      question: 'What problem does Raft solve?',
      answer: 'It replicates a log and elects a leader so all nodes agree on the same ordered sequence of configuration changes.',
    },
    {
      question: 'Why are fencing tokens necessary?',
      answer: 'A former leader can be delayed and still attempt writes after a new leader is elected; fencing lets storage reject those stale operations.',
    },
  ],
  oneMinuteAnswer:
    'I first ask whether we need global coordination or can partition work by tenant or shard. For the control plane I use a proven consensus system like Raft through etcd, replicating leadership and configuration in a small replicated log. Every leadership grant includes a monotonically increasing fencing token, and workers or storage reject operations from outdated tokens even if a stale leader still believes it is active. I separate control and data planes, monitor quorum and election churn, and practice membership changes. I do not implement Paxos from scratch in production—I adopt a battle-tested layer and keep its payload small.',
};

export const distributedTransactionsChapter: EncyclopediaChapter = {
  id: 'distributed-transactions',
  title: 'Distributed transactions',
  category: 'Data',
  summary: 'Maintain business invariants across multiple services or databases using 2PC, sagas, outbox, and reconciliation—with eyes open about failure modes.',
  problemStatement:
    'A single user action must update inventory, payment, and fulfillment, but no single database transaction can span independent services; naive dual writes create duplicate charges, lost orders, or inconsistent state.',
  interviewQuestion: 'Design checkout so inventory, payment, and order state stay consistent across microservices.',
  coreTension: 'Business invariants span services that share no transaction, so atomicity must be reconstructed from local commits, retries, and compensations — the design question is which intermediate states users and auditors can tolerate, not how to fake global atomicity.',
  levelExpectations: {
    mid: 'Chains synchronous service calls and applies 2PC because it looks like ACID. Dual-writes to a database and a broker and loses events on crash. Cannot articulate what happens when a compensation itself fails.',
    senior: 'Designs sagas with explicit state machines, persists intent through a transactional outbox, makes every step idempotent with business keys, and reconciles against external systems of record with operator tooling for stuck transitions.',
    staff: 'Treats consistency boundaries as organizational decisions — collapsing services where invariants genuinely demand it, negotiating which compensations the business legally allows, and owning the evidence trail that makes eventual consistency accountable to auditors and support.',
  },
  coreConcepts: [
    'ACID versus BASE',
    'Two-phase commit',
    'Saga orchestration',
    'Choreography',
    'Compensating transaction',
    'Transactional outbox',
    'Inbox pattern',
    'Idempotency keys',
    'Eventual consistency and reconciliation',
  ],
  architectureDiagram:
    'flowchart TD\n  U[Checkout request] --> O[Order service]\n  O --> X[(Outbox)]\n  X --> B[Broker]\n  B --> I[Inventory service]\n  B --> P[Payment service]\n  I --> S[(Saga state)]\n  P --> S\n  S -->|failure| C[Compensation]\n  R[Reconciliation job] --> O\n  R --> P',
  solutionApproach: [
    'Define business invariants and which steps are reversible',
    'Prefer a saga with explicit states over distributed 2PC across heterogeneous stores',
    'Persist intent locally, then publish through a transactional outbox',
    'Make every step idempotent with business keys and deduplication tables',
    'Model forward actions and compensations in a visible state machine',
    'Add periodic reconciliation against external systems of record',
  ],
  designPatterns: [
    'Saga orchestration',
    'Saga choreography',
    'Transactional outbox',
    'Inbox deduplication',
    'Idempotent consumer',
    'Process manager',
    'Dead-letter queue with repair',
  ],
  tradeoffs: [
    'Strong atomicity versus availability and autonomy',
    'Orchestration visibility versus choreography decoupling',
    'Compensation complexity versus simpler local transactions',
    'Synchronous user experience versus asynchronous completion',
  ],
  failureScenarios: [
    'Payment succeeds but inventory reservation message is lost',
    'Duplicate delivery applies the same transition twice',
    'Compensation fails and leaves partial state',
    '2PC coordinator crash blocks resources indefinitely',
    'Out-of-order events violate assumed state transitions',
  ],
  productionConsiderations: [
    'Persist before acknowledging external callbacks',
    'Expose saga state and stuck transitions to operators',
    'Test crash points between every local commit and publish',
    'Reconcile payment provider truth against internal ledger daily',
    'Use timeouts, retries with bounds, and human repair queues',
  ],
  staffDiscussion: [
    'Say effectively-once business outcomes, not impossible global exactly-once transports',
    'Choose orchestration when visibility and policy matter; choreography when teams are autonomous',
    'Design repair paths on day one—some failures will always need operators',
    'Question whether a monolith boundary or owned aggregate reduces distributed need',
  ],
  relatedTopics: ['Messaging semantics', 'Idempotency', 'Event sourcing', 'Financial ledger', 'CAP and consistency'],
  realWorldSystems: ['E-commerce checkout', 'Travel booking', 'Subscription billing', 'Bank transfers'],
  followUpQuestions: [
    'When is 2PC appropriate versus a saga?',
    'How do you compensate after payment capture?',
    'Where should the idempotency boundary live?',
  ],
  cheatSheet: [
    'Local transaction + outbox for reliable publish',
    'Saga state machine with idempotent steps',
    'Compensate only where business rules allow reversal',
    'Reconciliation catches what online flows miss',
  ],
  flashcards: [
    {
      question: 'Why avoid 2PC across microservices?',
      answer: 'It couples availability, blocks resources on failure, and is fragile across heterogeneous systems and teams.',
    },
    {
      question: 'What does the outbox pattern solve?',
      answer: 'It atomically records domain changes and outbound events so you never commit business state without a durable message to publish.',
    },
  ],
  oneMinuteAnswer:
    'I define the business invariants first—what must never double-charge or oversell. Across services I avoid classic 2PC and use a saga with an explicit state machine: each step is a local transaction, idempotent, and recorded in durable saga state. I publish events through a transactional outbox and deduplicate consumption with an inbox. Forward steps reserve inventory and authorize payment; compensations release inventory or void authorization when later steps fail. Because some failures remain ambiguous, I add reconciliation against the payment provider and operator tooling for stuck sagas. The user may see asynchronous completion, but the system remains repairable and auditable.',
};

export const messagingDeliverySemanticsChapter: EncyclopediaChapter = {
  id: 'messaging-delivery-semantics',
  title: 'Messaging and delivery semantics',
  category: 'Data',
  summary: 'Design reliable message pipelines by choosing the right delivery guarantee, making consumers idempotent, and handling duplicate, reordered, and poison messages without data loss.',
  problemStatement: 'Distributed systems fail mid-send. Retrying produces duplicates; not retrying causes loss. Without a deliberate delivery contract and idempotent consumers, any transient failure corrupts state.',
  interviewQuestion: 'How would you design a payment event pipeline that guarantees exactly-once processing despite broker and consumer failures?',
  coreTension: 'Failure between producer, broker, and consumer makes duplication and loss the default, and eliminating either costs throughput or complexity — the deliverable is not a guarantee but a published contract for how much of each the business absorbs, plus the operational proof it holds.',
  levelExpectations: {
    mid: 'Picks a delivery mode from broker documentation and adds retries blindly. Cannot trace what happens to a message when the consumer dies after processing but before committing its offset.',
    senior: 'Publishes an explicit delivery contract per topic, deduplicates with idempotency keys and bounded windows, partitions for per-entity ordering, and runs the dead-letter queue with a drain SLA and lag-based alerting.',
    staff: 'Derives the guarantee from the business cost of a duplicate versus a loss, rejects broker-only exactly-once claims as architectural theater, and owns end-to-end proof — rebalance chaos tests, dedup-window sizing against real traffic, and named ownership for the moment the contract breaks.',
  },
  coreConcepts: [
    'At-most-once delivery',
    'At-least-once delivery',
    'Effectively-once (idempotent consumer)',
    'Exactly-once semantics (transactional producers)',
    'Message ordering and partitioning',
    'Consumer groups and competing consumers',
    'Dead-letter queues',
    'Idempotency keys',
    'Sequence numbers and deduplication windows',
    'Backpressure and flow control',
  ],
  architectureDiagram:
    'flowchart LR\n  P[Producer] -->|idempotent write| B[(Broker)]\n  B -->|at-least-once| C[Consumer]\n  C --> I{Seen key?}\n  I -->|yes| D[Discard]\n  I -->|no| W[Write + record key]\n  W --> A[Ack]\n  C -->|unprocessable| DL[Dead-letter queue]\n  DL --> OPS[Operator review]',
  solutionApproach: [
    'Choose the weakest guarantee that the business can accept — at-most-once for analytics, at-least-once with idempotent consumers for most systems, transactional exactly-once only when broker support justifies the cost',
    'Make every consumer operation idempotent: natural idempotency (set operations, upserts) is cheaper than synthetic deduplication',
    'When natural idempotency is impossible, deduplicate on an idempotency key with a bounded deduplication window backed by a fast store',
    'Use transactional outbox to atomically commit business state and an event record in the same database transaction before publishing',
    'Partition by a stable entity key (user ID, order ID) to preserve per-entity ordering without requiring global order',
    'Design consumer groups so each partition is consumed by exactly one instance; rebalancing protocols must be fencing-safe',
    'Route unprocessable messages to a dead-letter queue with full context; define SLA for DLQ draining',
    'Apply backpressure at the consumer: bound in-flight messages and expose lag metrics to the autoscaler',
  ],
  designPatterns: [
    'Transactional outbox',
    'Idempotent consumer',
    'Competing consumers',
    'Dead-letter queue',
    'Inbox for deduplication',
    'Saga step as idempotent message handler',
    'Sequence number fencing',
  ],
  tradeoffs: [
    'Exactly-once transactional semantics versus throughput: transactional producers add coordination overhead; most systems get better ROI from idempotent consumers',
    'Deduplication window size versus memory: a long window catches more duplicates but requires more storage and lookup latency',
    'Global ordering versus scalability: total order requires a single partition and is rarely worth the throughput ceiling',
    'Synchronous versus asynchronous processing: acking before processing loses messages on crash; acking after adds redelivery risk without idempotency',
  ],
  failureScenarios: [
    'Producer retries after a network timeout: the broker received the original but the producer did not get the ack, so the same message arrives twice',
    'Consumer crashes after processing but before committing offset: on restart it reprocesses the last batch',
    'Rebalance during processing: a different consumer picks up the partition mid-flight, running the handler concurrently',
    'Slow consumer causes unbounded lag: upstream buffer fills, producer backpressure kicks in, or older messages expire',
    'Poison message loops: a malformed message crashes the consumer, is requeued, and crashes it again indefinitely',
    'Deduplication window expiry: a duplicate arrives after the window, is treated as new, and causes double processing',
  ],
  productionConsiderations: [
    'Instrument consumer lag per partition and alert before it threatens SLAs — lag is the leading indicator of pipeline health',
    'Set explicit retention and max-delivery-count on the DLQ; an uncapped DLQ masks persistent bugs',
    'Load-test rebalance behavior: partition reassignment under load often reveals locking bugs and double-processing windows',
    'Use sequence numbers or logical clocks to detect and reject out-of-order messages where order matters',
    'Separate the deduplication store from the main datastore: a Redis sorted set with TTL gives O(1) lookups without locking business tables',
    'Document the delivery guarantee and idempotency contract for each topic — treat it as a schema-level API',
  ],
  staffDiscussion: [
    'Start with the business invariant: what is the cost of a duplicate versus a loss? The answer determines the minimum viable guarantee',
    'Exactly-once is a property of the full producer-broker-consumer loop, not just the broker — claiming it from the broker while ignoring consumer failures is architectural theater',
    'Idempotency is usually the right abstraction: it composes with retries, rollbacks, and multi-region failover in ways transactional semantics cannot',
    'At Staff level the question is not "which guarantee does Kafka support" but "what contract does this pipeline publish, how is it enforced, and who owns the DLQ SLA"',
    'Backpressure and flow control belong in the design from the start; retrofitting them into a system that has grown to rely on unbounded queues is a multi-quarter project',
  ],
  relatedTopics: ['Distributed transactions', 'Idempotency', 'Outbox pattern', 'Event sourcing', 'Saga'],
  realWorldSystems: ['Payment event streams', 'Order fulfillment pipelines', 'Activity feeds', 'Audit log ingestion', 'Notification delivery'],
  followUpQuestions: [
    'How does your deduplication strategy change when the idempotency key must be inferred from message content rather than set by the producer?',
    'What happens to your exactly-once guarantee during a broker leader election or a consumer group rebalance?',
    'How would you drain a DLQ that has accumulated millions of messages without overwhelming downstream systems?',
  ],
  cheatSheet: [
    'At-least-once + idempotent consumer = effectively once for most systems',
    'Idempotency key → deduplication window in fast store → discard duplicates before business logic',
    'Transactional outbox: commit event record with business state in same DB transaction, publish after commit',
    'Partition by entity key for per-entity order; never assume global order across partitions',
    'Dead-letter queue with SLA — a DLQ without drainage is a hidden data loss incident',
  ],
  flashcards: [
    {
      question: 'Why is "exactly-once" misleading when applied only to the broker?',
      answer: 'The consumer can still crash after processing but before committing its offset, causing redelivery. True exactly-once requires both transactional producer semantics at the broker and idempotent processing at the consumer.',
    },
    {
      question: 'What is the cheapest form of idempotency and when should you use it?',
      answer: 'Natural idempotency — operations that produce the same result when repeated (upserts, set membership). Use it by designing state mutations as "set X to Y" rather than "increment X by 1", eliminating the need for a separate deduplication store.',
    },
  ],
  oneMinuteAnswer:
    'I start by naming the business cost of a duplicate versus a loss — that determines the minimum viable guarantee. For most pipelines, at-least-once delivery with an idempotent consumer is the right answer: the broker retries safely, and the consumer deduplicates on an idempotency key using an upsert or a fast deduplication store with a bounded TTL. I use a transactional outbox to publish events atomically with the business state change, preventing the lost-event class of bug entirely. Partitioning by entity key (user ID, order ID) gives per-entity ordering without the scalability ceiling of a global-ordered log. Any message that fails reprocessing after N attempts goes to a dead-letter queue with an SLA for operator review — an uncapped DLQ is a hidden data loss incident. I instrument consumer lag per partition and treat a rising lag as a pipeline health signal, not just a performance metric.',
};

export const detailedFoundationChapters: EncyclopediaChapter[] = [
  requirementsQualityAttributesChapter,
  capPacelcConsistencyChapter,
  consensusCoordinationChapter,
  distributedTransactionsChapter,
  messagingDeliverySemanticsChapter,
];

export const REPLACED_FOUNDATION_IDS = new Set([
  'requirements-quality-attributes',
  'cap-pacelc-consistency',
  'consensus-coordination',
]);
