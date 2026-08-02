import { useState } from 'react';
import { curriculumModules, type CurriculumLevel } from '../../data/curriculum';
import { Link } from '../../lib/router';

const catalogs = [
  ['Classic systems', 'URL shortener · rate limiter · feed · chat · notifications · payments · ride sharing · file sync · search · video · scheduler · logging · API gateway · ticketing · multi-tenant SaaS'],
  ['Failure modes', 'Lost updates · duplicates · retry storms · cache stampedes · thundering herds · hot keys · hot partitions · split brain · poison messages · slow consumers · network partitions · partial and silent failures'],
  ['Architecture patterns', 'CQRS · event sourcing · saga · outbox/inbox · bulkhead · circuit breaker · exponential backoff and jitter · graceful degradation · state machine · token/leaky bucket'],
  ['Production AI', 'RAG · hybrid retrieval · reranking · agents · tool calling · model routing · judge models · semantic cache · prompt injection · evaluation · guardrails · human escalation'],
  ['Staff leadership', 'Technical strategy · RFCs · ADRs · build vs buy · migrations · platform thinking · cross-team influence · risk · capacity · cost · operational excellence'],
  ['Interview overlays', 'General Staff core · Amazon leadership principles · Atlassian-oriented systems · company-specific evidence mapping · mock scorecards · readiness gates'],
] as const;

export function CurriculumPage() {
  const [level, setLevel] = useState<'All' | CurriculumLevel>('All');
  return <div className="page curriculum-page"><div className="page-heading"><div><p className="eyebrow">AUTHORITATIVE COVERAGE MAP</p><h1>Basic → advanced → mastery</h1><p>The curriculum combines engineering depth, production judgment, business context, leadership, and interview execution.</p></div><div className="chapter-count"><strong>12</strong><span>weekly modules</span></div></div><div className="category-filters">{(['All', 'Basic', 'Advanced', 'Mastery'] as const).map((item) => <button className={level === item ? 'active' : ''} key={item} onClick={() => setLevel(item)}>{item}</button>)}</div><div className="curriculum-grid">{curriculumModules.filter((module) => level === 'All' || module.level === level).map((module) => <article key={module.week}><div><span>WEEK {module.week}</span><em>{module.level}</em></div><h2>{module.title}</h2><div className="topic-cloud">{module.topics.map((topic) => <span key={topic}>{topic}</span>)}</div><strong>Evidence output</strong><p>{module.output}</p></article>)}</div><section><div className="section-heading"><p className="eyebrow">PROBLEM AND DISCUSSION CATALOGS</p><h2>Breadth without random topic collecting</h2></div><div className="catalog-grid">{catalogs.map(([title, items]) => <article key={title}><h3>{title}</h3><p>{items}</p></article>)}</div></section><section className="coverage-callout"><div><p className="eyebrow">HOW TO USE THIS MAP</p><h2>Coverage is not readiness.</h2><p>Learn concepts in the encyclopedia, execute them in Practice Lab, record mistakes, then pass evidence-based readiness gates.</p></div><div className="button-row"><Link className="button primary" to="/encyclopedia">Open encyclopedia</Link><Link className="button" to="/practice">Start a scenario</Link></div></section></div>;
}
