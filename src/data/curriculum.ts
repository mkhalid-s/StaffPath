const rawModules = [
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



export type CurriculumLevel = 'Basic' | 'Advanced' | 'Mastery';
export interface CurriculumModule { week: number; title: string; topics: string[]; output: string; level: CurriculumLevel }
export const curriculumModules: CurriculumModule[] = rawModules.map((module, index) => ({
  week: index + 1,
  title: module[0] as string,
  topics: module[1] as string[],
  output: module[2] as string,
  level: index < 4 ? 'Basic' : index < 8 ? 'Advanced' : 'Mastery',
}));

