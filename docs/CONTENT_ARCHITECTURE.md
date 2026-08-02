# StaffPath Content Architecture

This document consolidates the requirements gathered throughout the planning conversation. It is the content source of truth for implementation and review.

## Learning levels

Every competency can be developed through three levels:

- **Basic:** explain vocabulary, purpose, and common choices.
- **Advanced:** apply concepts to ambiguous designs, failures, migrations, and organizational constraints.
- **Mastery:** establish strategy, guide multiple teams, evaluate second-order effects, teach others, and produce durable organizational leverage.

Completion is evidence-based. Reading a chapter does not demonstrate mastery.

## Technical domains

### System foundations

- Requirements and quality attributes
- Back-of-the-envelope estimation
- Networking: DNS, TCP, UDP, TLS, HTTP/1.1–3, WebSockets
- Interfaces: REST, gRPC, GraphQL, events, versioning, compatibility
- Traffic: CDN, proxy, gateway, L4/L7 balancing, rate limiting, admission control
- Scale: horizontal/vertical, stateless/stateful, partitioning, sharding, consistent hashing

### Data and distributed systems

- SQL, ACID, transactions, isolation, indexing, query planning
- Key-value, document, wide-column, search, time-series, vector stores
- Replication, read replicas, data ownership, schema evolution, reconciliation
- CAP, PACELC, consistency, consensus, Raft, leader election, logical time
- Service discovery, distributed coordination, locks, leases, fencing tokens

### Caching and messaging

- Cache-aside, read-through, write-through, write-back, eviction, invalidation
- Hot keys, cache stampede, thundering herd, semantic and vector caching
- Queues, streams, pub/sub, consumer groups, ordering, replay and backpressure
- At-most-once, at-least-once, effectively-once outcomes, DLQ and repair
- Kafka-, RabbitMQ-, and managed-queue capabilities as examples, not memorization targets

### Architecture and production patterns

- CQRS, event sourcing, saga, outbox, inbox and state machines
- Retry with bounded exponential backoff and jitter
- Circuit breaker, bulkhead, graceful degradation, load shedding
- Strangler migration, expand-contract, canary, blue-green, feature flags
- Monolith, modular monolith, microservices, event-driven and hexagonal architecture
- Domain boundaries, platform engineering, multi-tenancy and multi-region systems

### Reliability, security and operations

- SLIs, SLOs, SLAs, error budgets and capacity planning
- Logs, metrics, traces, OpenTelemetry concepts, alert quality
- Incident command, status communication, post-incident learning
- RTO, RPO, backup, restore, disaster recovery and game days
- Threat modeling, trust boundaries, identity, authorization and tenant isolation
- Encryption, secrets, supply chain, abuse prevention and auditability
- Operational excellence, cost, sustainability and production readiness

### AI engineering

- Tokens, context, embeddings, inference, prompting and model selection
- RAG ingestion, chunking, metadata, hybrid retrieval, reranking and citations
- Tools, agents, workflows, memory and human escalation
- Model router, AI gateway, fallback, judge/verification layers
- Semantic cache, freshness, policy-aware reuse and personalization
- Evaluation datasets, groundedness, retrieval precision, answer quality and safety
- Prompt injection, privacy, access control, latency, spend and observability

## Nontechnical and Staff competencies

### Presence and speaking

- Intentional first impressions
- Credible voice, pace, pause, tone and concise language
- Confidence under pressure and speaking up in senior rooms
- Body language and remote-meeting presence
- Thirty-second, two-minute and five-minute explanation formats
- Technical storytelling, presentations and executive summaries

### Listening and relationships

- Active listening and accurate summarization
- Reading group signals without pretending body language is certainty
- High-information questions and productive small talk
- Stakeholder mapping, networks, sponsorship and trust

### Difficult conversations

- Specific, timely feedback
- Saying no while protecting the shared outcome
- Entering and interrupting conversations constructively
- Conflict de-escalation and disagreement without status games
- Negotiation, competing priorities and decision closure

### Staff leadership

- Choosing high-leverage work and aligning with business outcomes
- Technical strategy, vision, roadmaps, RFCs and ADRs
- Architecture governance and technical quality
- Influence without authority and cross-team facilitation
- Mentoring, coaching, delegation and creating space for others
- Build-versus-buy, modernization, migrations, risk and cost
- Promotion evidence, organizational impact and measurable outcomes

## Practice catalogs

### Classic systems

URL shortener, rate limiter, notification, feed, chat/messaging, file sync, search, payment/ledger, ride matching, video streaming, API gateway, job scheduler, logging/monitoring, analytics, ticketing and multi-tenant SaaS.

### AI systems

Chat assistant, enterprise RAG, coding assistant, model router, semantic cache, AI gateway, judge service, AI search, support agent and tool-using workflow.

### Deep production cases

- Ride-marketplace immutable pricing snapshots
- Idempotent payment webhook processing and reconciliation
- High-demand ticket booking and virtual waiting rooms
- Permission-aware semantic caching
- Risk-, quality-, latency- and cost-aware LLM routing

Company names are used only when an authoritative public source supports the description. Otherwise cases remain neutral.

### Failure injector

Lost update, duplicate processing, retry storm, cache stampede, hot key/partition, split brain, poison message, slow consumer, network partition, race, partial failure, silent corruption, dependency brownout and regional failure.

### People and SDLC scenarios

Negotiation, conflict, feedback, delegation, coaching, stuck decisions, executive incident updates, roadmap risk, trust repair, discovery, requirements, architecture review, testing, CI, release, readiness, incident, API evolution, debt and retirement.

## Interview system

- Baseline gap assessment and target-role profile
- General Staff interview framework
- Timed classic and AI system design
- Coding/problem-solving only to the depth required by target roles
- Technical leadership and behavioral interviews
- Adaptable STAR story bank with evidence and follow-up depth
- Optional verified company packs, including Amazon and Atlassian
- Interview scorecards, feedback log and recording metadata
- Mistake journal with 2-, 7-, 14- and 30-day review scheduling
- Readiness gates: foundations, production, Staff leadership and interview performance
- Final revision queue based on weakness and recency

## Handbook artifacts

Readiness assessment, system context, architecture diagram, design solution, estimation sheet, comparison table, ADR, RFC, threat model, SLO, runbook, postmortem, migration plan, strategy, executive brief, STAR story, mock record, mistake entry and promotion evidence.

## Encyclopedia chapter contract

Every complete chapter contains:

1. Problem statement
2. Interview question
3. Core concepts
4. Architecture diagram
5. Worked solution
6. Design patterns
7. Trade-offs
8. Failure scenarios
9. Production considerations
10. Staff Engineer discussion
11. Related topics
12. Real-world systems
13. Follow-up interview questions
14. Cheat sheet
15. Flashcards
16. One-minute interview answer

Every claim derived from an external post is rewritten, checked against authoritative material where possible, and linked to its source. Unverified company internals must not be presented as fact.
