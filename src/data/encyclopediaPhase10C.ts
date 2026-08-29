import type { EncyclopediaChapter } from '../domain/encyclopedia';

const replicationProtocolsChapter: EncyclopediaChapter = {
  id: 'replication-protocols',
  title: 'Replication protocols: Paxos, Raft, and Viewstamped Replication',
  category: 'Systems',
  summary: 'Understand the protocol internals behind replicated logs — leader election timing, quorum math, log matching, and the specific failure modes that separate textbook consensus from production-safe replication.',
  problemStatement:
    'Engineers treat "we use Raft" or "we use Paxos" as an interchangeable checkbox, but the protocols differ in election behavior, read-path guarantees, and operational failure modes. A team that cannot reason about quorum math or stale-leader risk will misdiagnose real incidents as "the database is just flaky."',
  interviewQuestion:
    'Your distributed database cluster has a 5-node Raft group. Two nodes fail simultaneously. Walk me through exactly what happens to reads and writes, and what a client experiences.',
  coreConcepts: [
    'Multi-Paxos: prepare/promise/accept/commit phases with a stable leader',
    'Raft leader election: randomized timeouts and monotonic term numbers',
    'Raft log replication and the commit index',
    'Log matching property: identical logs up to a given index imply identical preceding entries',
    'Quorum math: majority = f+1 of 2f+1 nodes tolerates f failures',
    'Leader stickiness and split votes under contention',
    'Pre-vote extension: preventing disruptive elections from a rejoining node',
    'Joint consensus for safe membership changes',
    'Log compaction and snapshotting to bound log growth',
    'Read linearizability: read index versus lease reads',
    'Viewstamped Replication and its historical relationship to Paxos',
    'Byzantine fault tolerance versus crash-fault tolerance',
  ],
  architectureDiagram:
    'flowchart TD\n  T[Election timeout fires] --> C[Node becomes candidate]\n  C --> PV{Pre-vote: log competitive?}\n  PV -->|no| F[Stay follower]\n  PV -->|yes| RV[Request votes, term+1]\n  RV --> Q{Quorum granted?}\n  Q -->|no| F\n  Q -->|yes| L[Becomes leader]\n  L --> AE[AppendEntries to followers]\n  AE --> M{Matched on majority?}\n  M -->|yes| CI[Advance commit index]\n  CI --> APP[Apply to state machine]\n  M -->|no| RETRY[Retry with earlier index]',
  solutionApproach: [
    'Identify whether you need a replicated log (ordered, durable, linearizable writes) or whether simple leader-follower replication with async apply suffices — consensus is expensive and often unnecessary for read replicas',
    'For a new control-plane component, default to an existing Raft implementation (etcd, a Raft library) rather than implementing consensus from scratch — the edge cases in log compaction and membership change are notoriously easy to get subtly wrong',
    'Size the cluster as 2f+1 nodes to tolerate f failures — 3 nodes tolerate 1 failure, 5 nodes tolerate 2, and even numbers waste a node without adding fault tolerance',
    'For write-heavy workloads with a stable network, favor Multi-Paxos with leader leases (Chubby/Spanner-style) to avoid the periodic election overhead that pure Raft incurs on any leader hiccup',
    'For teams building or auditing the system, favor Raft for its explicit leader-based model — the log matching property and explicit term numbers make failure diagnosis tractable during an incident',
    'Implement pre-vote before deploying at scale: without it, a partitioned node that rejoins with a higher term forces an unnecessary re-election and briefly stalls the cluster',
    'Choose the read path deliberately: read-index reads (confirm leadership with a quorum round-trip before serving) are always safe but add latency; lease reads (trust a time-bounded leader lease) are faster but require synchronized clocks and a conservative lease duration',
    'Test membership changes (adding/removing nodes) explicitly in staging using joint consensus — a naive single-step reconfiguration can create two disjoint majorities that both believe they are the quorum',
  ],
  designPatterns: [
    'Replicated state machine — apply the same log of commands to every replica in the same order',
    'Leader lease — a time-bounded grant that lets a leader serve reads without a quorum round-trip',
    'Log compaction via snapshotting — replace an unbounded log prefix with a point-in-time snapshot',
    'Joint consensus — a two-phase membership change spanning old and new configurations to prevent split quorums',
    'Read index — a lightweight heartbeat quorum check to serve linearizable reads without appending to the log',
  ],
  tradeoffs: [
    'Understandability versus performance: Raft is explicit and far easier to reason about during an incident, but Multi-Paxos with leader leases can avoid unnecessary re-elections and is still preferred in systems (Spanner, Chubby) where election overhead is measurable at scale',
    'Read latency versus staleness risk: lease reads are fast but risk serving stale data if clocks drift beyond the lease bound; read-index reads are always safe but add a network round-trip to every read',
    'Cluster size versus fault tolerance: a larger cluster tolerates more failures but increases the quorum size needed for every write, raising write latency and network chatter',
    'Crash-fault tolerance versus Byzantine-fault tolerance: Raft and Paxos assume nodes fail by stopping, not by sending false data; Byzantine-tolerant protocols (used in blockchain and some multi-party systems) cost far more messages per decision and are unnecessary overhead inside a single trust domain',
    'Snapshot frequency versus recovery time: frequent snapshots bound log replay time on restart but add periodic I/O and CPU load; infrequent snapshots keep steady-state overhead low but slow down recovery of a lagging or restarted node',
  ],
  failureScenarios: [
    'A leader partitioned from the majority continues to believe it is leader and serves stale lease reads to clients on its side of the partition, until the lease expires or the partition heals',
    'A node with a stale, incomplete log rejoins after a long outage, times out waiting for the current leader\'s heartbeat, and starts an election with a higher term — without pre-vote, this forces an unnecessary leadership change and a brief write stall even though the rejoining node cannot win',
    'A naive single-step membership change (adding 2 nodes to a 3-node cluster in one step) creates a window where the old 3-node majority (2 nodes) and the new 5-node majority (3 nodes) can both be satisfied by different, non-overlapping node sets, producing two leaders that both believe they hold quorum',
    'Log compaction runs during a period of high write load, and the snapshot process contends for the same I/O bandwidth as log replication, causing latency spikes that look like a network problem but are actually a resource contention problem',
    'A follower that has been offline for an extended period returns and the leader must replay a very long log tail because no snapshot was taken recently — replication throughput to that follower collapses, and if it happens to enough followers simultaneously, the effective quorum size shrinks',
    'Clock skew beyond the configured lease duration in a Paxos-style lease-lock system allows a new leader to be elected while the old leader still believes its lease is valid, and both serve conflicting reads or writes until the skew is corrected',
  ],
  productionConsiderations: [
    'Monitor election frequency as a first-class signal — a cluster that is re-electing leaders more than a handful of times per day almost always indicates network flakiness or misconfigured timeouts, not application load',
    'Alert on log replication lag per follower, not just cluster-wide health — a single consistently lagging follower is an early warning of a resource or network problem on that specific node before it causes an incident',
    'Exercise rolling node replacement and membership changes routinely in a non-production environment; the first time you add or remove a node should never be during an actual incident',
    'Tune election timeout randomization ranges based on your actual network RTT distribution — timeouts copied from a tutorial that assumes sub-millisecond LAN latency will cause spurious elections in a real multi-AZ or multi-region deployment',
    'Track snapshot duration and size growth over time; an ever-growing snapshot with flat traffic often indicates a state machine bug that is accumulating stale or orphaned entries',
  ],
  staffDiscussion: [
    'Raft won on understandability, not performance — its explicit leader-based model and term-numbered log make failures diagnosable under incident pressure, which is why most modern systems choose it over Paxos despite Paxos having a longer production track record',
    'The quorum math is the entire safety argument: any two majorities in a 2f+1-node cluster must intersect in at least one node, guaranteeing that a new leader\'s election set always includes at least one node with the latest committed entry — internalizing this is what lets you reason correctly about arbitrary failure combinations instead of memorizing scenarios',
    'The most dangerous class of Raft bug in the wild is not in the core algorithm but in the surrounding operational machinery — membership changes, snapshot installation, and log truncation are where teams that "roll their own" consensus implementation introduce split-brain bugs that the core paper does not cover in detail',
    'At Staff level, the decision is almost never "which consensus algorithm" — it is "do we need consensus at all, or can this be solved by sharding ownership so each shard has a single writer with no cross-shard coordination," since avoiding consensus entirely is usually cheaper and safer than implementing it correctly',
    'Choosing a managed or well-audited implementation (etcd, a mature Raft library) over an in-house implementation is itself a Staff-level judgment call — the cost of a subtle correctness bug in home-grown consensus code is existential for the data it protects, and the engineering hours saved rarely justify the risk',
  ],
  relatedTopics: ['Consensus and distributed coordination', 'CAP, PACELC, and consistency', 'Distributed transactions', 'Database selection and sharding', 'Multi-region active-active architecture'],
  realWorldSystems: ['etcd (Raft)', 'CockroachDB (Raft per range)', 'Kafka KRaft mode (Raft for metadata)', 'Google Chubby and Spanner (Paxos)', 'Apache ZooKeeper (ZAB, a Paxos variant)', 'MongoDB replica sets (Raft-inspired)'],
  followUpQuestions: [
    'How would you detect and diagnose split votes happening repeatedly in production, and what configuration change would you make first?',
    'A follower has been disconnected for six hours and just reconnected. Walk me through exactly how it catches up, and what happens if no snapshot exists.',
    'Why is a Byzantine-fault-tolerant protocol almost never the right choice inside a single company\'s trust domain, even though it tolerates more failure modes than Raft?',
  ],
  cheatSheet: [
    '2f+1 nodes tolerate f failures — size clusters as 3, 5, or 7, never an even number',
    'Any two majorities in a quorum-based system intersect in at least one node — this is the entire safety argument',
    'Pre-vote prevents a rejoining stale node from forcing an unnecessary election',
    'Read-index reads are always safe; lease reads are faster but depend on bounded clock skew',
    'Prefer sharding to avoid consensus entirely over implementing consensus correctly for a use case that does not need it',
  ],
  flashcards: [
    {
      question: 'Why does a 5-node cluster tolerate 2 failures but a 4-node cluster still only tolerates 1?',
      answer: 'Fault tolerance requires a majority of the remaining nodes to still form a quorum. A 5-node cluster needs 3 nodes for majority, so it can lose 2 and still have 3 remaining. A 4-node cluster needs 3 for majority (since 2 is not a majority of 4), so it can also only lose 1 — the same tolerance as a 3-node cluster, but with an extra node providing no additional safety, only extra write latency.',
    },
    {
      question: 'What problem does the pre-vote extension solve in Raft?',
      answer: 'Without pre-vote, a node that has been partitioned or offline increments its term repeatedly while isolated (since it never hears from a leader) and rejoins with a much higher term number. This forces the real, functioning leader to step down and triggers an unnecessary election, even though the rejoining node cannot actually win (its log is stale). Pre-vote requires a candidate to first confirm, without incrementing its term, that a majority would vote for it based on log competitiveness — preventing this disruption.',
    },
  ],
  oneMinuteAnswer:
    'When 2 of 5 nodes fail simultaneously, the remaining 3 nodes still form a majority (3 of 5), so the cluster continues operating normally as long as those 3 include the current leader or can elect a new one. If the leader was among the failed nodes, the remaining followers detect the missing heartbeat after their randomized election timeout, one becomes a candidate, requests votes with an incremented term, and — since it can secure a majority (itself plus at least one other surviving node) — becomes the new leader within one election round. Writes pause for that brief election window but resume immediately after. Clients seeing timeouts during the election should retry; clients reading via read-index will see a short latency spike as the new leader confirms its leadership with a quorum heartbeat before serving. If instead 3 of 5 nodes failed, the cluster would lose quorum entirely — no majority exists, so no leader can be elected and no writes can commit until enough nodes recover, though existing data remains safe since nothing was lost, only unavailable.',
};

const progressiveDeliveryChapter: EncyclopediaChapter = {
  id: 'progressive-delivery',
  title: 'Progressive delivery and automated canary analysis',
  category: 'Architecture',
  summary: 'Move beyond simple feature flags to deployment strategies and automated canary analysis that let you validate a release against real production traffic with statistically sound, automatically triggered rollback.',
  problemStatement:
    'Teams flip a feature flag to 1% of traffic, glance at a dashboard for ten minutes, and call it validated — but an underpowered sample and an untested rollback procedure mean the "canary" caught nothing, and the real incident begins at 100% rollout.',
  interviewQuestion:
    'Design a progressive delivery system that can safely roll out a pricing change to a payment service at 0.1%, 1%, 10%, and 100% of traffic with automated rollback if revenue metrics degrade.',
  coreConcepts: [
    'Blue-green deployment: two full environments with an instant traffic switchover',
    'Rolling deployment with per-instance readiness gates',
    'Canary deployment: incremental traffic splitting by percentage',
    'Shadow (mirror) traffic: replaying real requests to a new path with no user-facing effect',
    'Automated canary analysis: statistical comparison of baseline versus canary metrics (Kayenta-style)',
    'Automated rollback triggers: error rate, latency percentile, and business metric regression',
    'Deployment pipeline stages: dev to staging to canary to full production',
    'Sample size and duration requirements for statistically valid canary analysis',
    'Progressive delivery for ML models: canary with accuracy and business-metric gates',
    'Feature flag and deployment coupling: gating a deployment stage on flag state',
    'Traffic shaping at the service mesh or load balancer layer',
    'Observability requirements for canary analysis: structured metrics and consistent trace sampling across baseline and canary',
  ],
  architectureDiagram:
    'flowchart LR\n  D[Deploy canary] --> T[Traffic split: 1%]\n  T --> M[Metrics: baseline vs canary]\n  M --> S{Statistically significant regression?}\n  S -->|yes| RB[Automated rollback]\n  S -->|no, insufficient data| W[Wait / extend window]\n  S -->|no, passes| P[Promote: increase % ]\n  P --> T\n  P -->|100%| DONE[Full rollout]\n  RB --> ALERT[Page + incident record]',
  solutionApproach: [
    'Define the deployment strategy per risk tier: blue-green for services where instant full switchover and rollback matter more than gradual validation, rolling for stateless services with fungible instances, canary for anything where a subtle regression must be caught before it reaches all users',
    'Start high-risk changes (pricing, payment logic, anything touching money or compliance) with shadow traffic first — mirror real production requests to the new code path, compare outputs, and fix discrepancies with zero user impact before any real traffic is shifted',
    'Set the canary traffic percentage and duration based on the service\'s actual traffic volume, not a fixed default — a service handling 10 requests per second needs a much longer or larger canary window than one handling 100,000 requests per second to reach the same statistical confidence',
    'Automate the canary analysis as a statistical comparison, not a human eyeballing two dashboards: compare canary metrics against a live baseline (not last week\'s numbers) using a defined significance test, and require the comparison to run for a minimum duration regardless of how good the early numbers look',
    'Define rollback triggers before the rollout starts, tied to concrete SLOs and business metrics (error rate, p99 latency, and for a pricing change, revenue per transaction or conversion rate) — deciding the abort criteria after seeing early data introduces bias toward ignoring bad signals',
    'Test the rollback path itself as part of every deployment pipeline, not only the forward path — an untested rollback is the single most dangerous thing to discover does not work during an active incident',
    'Couple feature flags to deployment stages so the flag, not just the binary, controls exposure — this lets you separate "is the new code deployed" from "is the new behavior visible," and gives you an instant kill switch that does not require a redeploy',
    'For ML model rollouts, gate promotion on both operational metrics (latency, error rate) and model-quality metrics (prediction accuracy, business KPI impact) — a model can be operationally healthy while silently degrading the metric it exists to improve',
  ],
  designPatterns: [
    'Canary release with automated statistical gating — traffic increases only after a defined confidence threshold is met',
    'Shadow / mirror traffic — validate a new path against real requests with zero user-facing risk',
    'Blue-green deployment — maintain two complete environments and switch traffic atomically',
    'Feature flag as deployment gate — decouple code deployment from behavior exposure',
    'Automated rollback on SLO violation — a deployment pipeline that reverts itself without waiting for a human',
  ],
  tradeoffs: [
    'Canary duration versus deployment velocity: a longer, larger canary window catches subtler regressions but slows every release; the right duration depends on traffic volume and the cost of a missed regression, not a fixed policy',
    'Automated rollback versus false-positive risk: an aggressive automatic rollback threshold catches real regressions fast but can also trigger on transient noise, eroding trust in the automation until teams start ignoring or disabling it',
    'Shadow traffic fidelity versus operational cost: mirroring 100% of production traffic gives the highest-fidelity validation but doubles compute cost for the duration of the shadow period; sampling a subset reduces cost but also reduces the chance of catching a rare-path bug',
    'Statistical rigor versus release speed: a proper significance test with adequate sample size is the only way to trust a canary result, but teams under delivery pressure are tempted to shortcut duration or sample size, producing canaries that pass by chance rather than by evidence',
    'Fine-grained progressive stages versus pipeline complexity: more traffic-percentage steps (0.1%, 1%, 5%, 25%, 100%) give finer-grained safety but add pipeline stages, wait time, and operational surface that must itself be maintained and tested',
  ],
  failureScenarios: [
    'A canary runs at 1% traffic for 10 minutes on a service handling 50 requests per second; the sample size is too small to detect anything but a catastrophic regression, and a real but subtle error-rate increase passes undetected into full rollout',
    'The automated rollback trigger is configured against an absolute error count rather than a rate, so it never fires proportionally as traffic scales up through the canary stages, and a regression that would have tripped the threshold at 1% traffic goes unnoticed until 100%',
    'The rollback procedure has never been executed outside of design review; when it finally triggers automatically during a real regression, a missed database migration rollback step leaves the system in a half-reverted, inconsistent state that is worse than either the old or new version',
    'Shadow traffic mirrors requests but not the side effects of those requests (writes, external API calls), so the shadow path silently double-processes payments or sends duplicate notifications to real users during the "safe" validation phase',
    'A canary analysis compares live canary metrics against a cached baseline from before an unrelated traffic pattern change (a marketing campaign, a time-of-day effect), so the comparison is confounded and either falsely passes a bad release or falsely blocks a good one',
    'An ML model canary is gated only on latency and error rate; the new model is operationally perfect but subtly reduces recommendation click-through rate, and because no business-metric gate exists, the regression is only discovered a week later in a quarterly metrics review',
  ],
  productionConsiderations: [
    'Instrument canary and baseline with identical metric definitions and trace sampling rates — any asymmetry in how the two are measured invalidates the statistical comparison before it even begins',
    'Store canary analysis results as an auditable artifact per deployment, not just a pass/fail Slack message — post-incident reviews need to see exactly what data justified a promotion decision',
    'Run rollback drills on a schedule, treating an untested rollback path the same as an untested backup restore — both are silent liabilities until the moment they are needed',
    'Separate the traffic-splitting mechanism (load balancer, service mesh, or client-side routing) from the analysis mechanism, so a bug in the statistical engine cannot also break the ability to route traffic away from a bad canary',
    'Track and report canary escape rate — the fraction of regressions that reached full rollout despite passing canary analysis — as a first-class metric for the deployment platform\'s own health, not just individual service health',
  ],
  staffDiscussion: [
    'Canary analysis is fundamentally a statistics problem, and treating it as an engineering checkbox rather than a measurement problem is the root cause of most canary failures — insufficient sample size and duration produce a confident-looking pass that is actually an underpowered non-result',
    'An untested rollback is not a smaller risk than an untested forward deployment; at Staff level you are expected to insist that rollback paths receive the same rigor and rehearsal as the deployment itself, especially for anything touching schema or state',
    'Shadow traffic is underused relative to its safety value because it requires more upfront engineering (isolating side effects, comparing outputs) than a simple canary — but for genuinely high-risk changes, it is the only strategy that validates correctness with zero user exposure',
    'The choice between blue-green, rolling, and canary is a risk-tiering decision that should be made deliberately per service class, not defaulted to whatever the platform team\'s tooling makes easiest — a payment service and a stateless internal API do not deserve the same deployment rigor',
    'Progressive delivery for ML models requires business-metric gates in addition to operational gates, because a model can be perfectly healthy by every infrastructure measure while quietly failing at the one thing it was built to do — Staff engineers working with ML-adjacent systems are expected to insist on this distinction',
  ],
  relatedTopics: ['Safe delivery and migrations', 'SLOs, observability, and incidents', 'Platform engineering and developer experience', 'Resilience patterns', 'A/B testing platform'],
  realWorldSystems: ['Netflix Kayenta (automated canary analysis)', 'Spinnaker (progressive delivery pipelines)', 'Argo Rollouts', 'Flagger (Kubernetes progressive delivery)', 'LaunchDarkly with CI/CD deployment gates', 'Harness continuous delivery'],
  followUpQuestions: [
    'How would you determine the minimum canary duration and traffic percentage needed for a service with highly variable, bursty traffic patterns?',
    'Your automated rollback just triggered during a real incident, but the rollback left the database in a partially migrated state. How do you redesign the pipeline to prevent this?',
    'How would you design canary analysis for a change where the regression you care about (revenue impact) only becomes statistically visible after several days, not minutes?',
  ],
  cheatSheet: [
    'Shadow traffic first for high-risk changes — validate correctness with zero user impact before any real exposure',
    'Size canary duration and traffic percentage from actual traffic volume, not a fixed default',
    'Compare against a live baseline, not a stale one — confounded comparisons produce false passes and false blocks',
    'Test the rollback path with the same rigor as the forward deployment — an untested rollback is a hidden incident multiplier',
    'Gate ML model rollouts on business metrics, not only operational health — a model can be "up" while failing its purpose',
  ],
  flashcards: [
    {
      question: 'Why is a 1% canary run for 10 minutes often statistically meaningless?',
      answer: 'Canary analysis requires enough samples to distinguish a real regression from normal metric noise. A low-traffic service running a tiny percentage for a short window may only accumulate a handful of requests — nowhere near enough to detect anything but a catastrophic, obvious failure. The canary "passes" not because the release is safe, but because the test had no statistical power to fail it.',
    },
    {
      question: 'What is the key difference between shadow traffic and a canary deployment?',
      answer: 'A canary deployment routes a percentage of real user traffic to the new version, so users on the canary path are exposed to any regression. Shadow (mirror) traffic duplicates real requests to the new version in parallel with the old version serving the actual response — the new version\'s output is compared but never returned to the user, so there is zero user-facing risk during validation, at the cost of needing to isolate or de-duplicate any side effects the shadowed requests would trigger.',
    },
  ],
  oneMinuteAnswer:
    'I would tier the rollout by risk: given this touches payments, I start with shadow traffic, mirroring real production requests to the new pricing logic and comparing computed outputs against the current system with zero user exposure, specifically isolating any side effects like charge creation so shadowed requests never actually move money. Once shadow comparison is clean, I move to a real canary starting at 0.1%, sized and timed based on the service\'s actual transaction volume so the sample is large enough to be statistically meaningful, not a fixed ten-minute default. At each stage — 0.1%, 1%, 10%, 100% — an automated analysis compares canary metrics against a live baseline, not a cached one, checking both operational SLOs (error rate, latency) and the business metric that actually matters here: revenue per transaction. Rollback triggers are defined before the rollout starts, tied to statistically significant regression in either dimension, and the rollback path itself has been rehearsed and tested as part of the deployment pipeline, including any schema or state reversal, so that if it fires automatically during a real incident it does not leave the system half-migrated. Every promotion decision and its supporting metrics are stored as an auditable artifact for post-incident review.',
};

export const phase10CChapters: EncyclopediaChapter[] = [replicationProtocolsChapter, progressiveDeliveryChapter];
