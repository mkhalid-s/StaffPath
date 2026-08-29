import { useMemo, useState } from 'react';
import { curriculumModules, type CurriculumLevel } from '../../data/curriculum';
import { roadmapSessions } from '../../data/roadmap';
import { useStaffPathState } from '../../lib/appStore';
import { Link } from '../../lib/router';

const catalogs = [
  ['Classic systems', 'URL shortener · rate limiter · feed · chat · notifications · payments · ride sharing · file sync · search · video · scheduler · logging · API gateway · ticketing · multi-tenant SaaS'],
  ['Failure modes', 'Lost updates · duplicates · retry storms · cache stampedes · thundering herds · hot keys · hot partitions · split brain · poison messages · slow consumers · network partitions · partial and silent failures'],
  ['Architecture patterns', 'CQRS · event sourcing · saga · outbox/inbox · bulkhead · circuit breaker · exponential backoff and jitter · graceful degradation · state machine · token/leaky bucket'],
  ['Production AI', 'RAG · hybrid retrieval · reranking · agents · tool calling · model routing · judge models · semantic cache · prompt injection · evaluation · guardrails · human escalation'],
  ['Staff leadership', 'Technical strategy · RFCs · ADRs · build vs buy · migrations · platform thinking · cross-team influence · risk · capacity · cost · operational excellence'],
  ['Interview overlays', 'General Staff core · Amazon leadership principles · Atlassian-oriented systems · company-specific evidence mapping · mock scorecards · readiness gates'],
] as const;

function useWeekProgress(week: number, roadmap: Record<string, { completedAt?: string }>) {
  const sessions = roadmapSessions.filter((s) => s.week === week);
  const completed = sessions.filter((s) => roadmap[String(s.id)]?.completedAt).length;
  return { completed, total: sessions.length };
}

function WeekProgress({ week, roadmap }: { week: number; roadmap: Record<string, { completedAt?: string }> }) {
  const { completed, total } = useWeekProgress(week, roadmap);
  if (total === 0) return null;
  const pct = Math.round((completed / total) * 100);
  const done = completed === total;
  return (
    <div className="curriculum-progress">
      <div className="curriculum-progress-bar">
        <div className="curriculum-progress-fill" style={{ width: `${pct}%` }} data-done={done} />
      </div>
      <span className="curriculum-progress-label">{completed}/{total} sessions</span>
    </div>
  );
}

export function CurriculumPage() {
  const state = useStaffPathState();
  const [level, setLevel] = useState<'All' | CurriculumLevel>('All');

  const completedWeeks = useMemo(() => {
    return curriculumModules.filter((m) => {
      const sessions = roadmapSessions.filter((s) => s.week === m.week);
      return sessions.length > 0 && sessions.every((s) => state.roadmap[String(s.id)]?.completedAt);
    }).length;
  }, [state.roadmap]);

  return (
    <div className="page curriculum-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WHAT YOU NEED TO KNOW</p>
          <h1>Basic → advanced → mastery</h1>
          <p>The curriculum combines engineering depth, production judgment, business context, leadership, and interview execution.</p>
        </div>
        <div className="chapter-count">
          <strong>{completedWeeks}/12</strong>
          <span>weeks complete</span>
        </div>
      </div>

      <div className="category-filters">
        {(['All', 'Basic', 'Advanced', 'Mastery'] as const).map((item) => (
          <button className={level === item ? 'active' : ''} key={item} onClick={() => setLevel(item)}>{item}</button>
        ))}
      </div>

      <div className="curriculum-grid">
        {curriculumModules
          .filter((module) => level === 'All' || module.level === level)
          .map((module) => {
            const { completed, total } = { completed: roadmapSessions.filter((s) => s.week === module.week && state.roadmap[String(s.id)]?.completedAt).length, total: roadmapSessions.filter((s) => s.week === module.week).length };
            const done = total > 0 && completed === total;
            return (
              <article key={module.week} data-done={done || undefined}>
                <div>
                  <span>WEEK {module.week}</span>
                  <em>{module.level}</em>
                  {done && <span className="week-badge">✓ Done</span>}
                </div>
                <h2>{module.title}</h2>
                <div className="topic-cloud">
                  {module.topics.map((topic) => <span key={topic}>{topic}</span>)}
                </div>
                <WeekProgress week={module.week} roadmap={state.roadmap} />
                <strong>Evidence output</strong>
                <p>{module.output}</p>
                <Link className="button" to="/roadmap">Open roadmap →</Link>
              </article>
            );
          })}
      </div>

      <section>
        <div className="section-heading">
          <p className="eyebrow">PROBLEM AND DISCUSSION CATALOGS</p>
          <h2>Breadth without random topic collecting</h2>
        </div>
        <div className="catalog-grid">
          {catalogs.map(([title, items]) => (
            <article key={title}><h3>{title}</h3><p>{items}</p></article>
          ))}
        </div>
      </section>

      <section className="coverage-callout">
        <div>
          <p className="eyebrow">HOW TO USE THIS MAP</p>
          <h2>Coverage is not readiness.</h2>
          <p>Learn concepts in the encyclopedia, execute them in Practice Lab, record mistakes, then pass evidence-based readiness gates.</p>
        </div>
        <div className="button-row">
          <Link className="button primary" to="/encyclopedia">Open encyclopedia</Link>
          <Link className="button" to="/practice">Start a scenario</Link>
        </div>
      </section>
    </div>
  );
}
