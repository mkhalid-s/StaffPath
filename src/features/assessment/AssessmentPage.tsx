import { useState } from 'react';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { AnalyticsPage } from '../analytics/AnalyticsPage';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { Link } from '../../lib/router';

const competencyToChapters: Record<string, string[]> = {
  'technical-foundations': ['cap-pacelc-consistency', 'consensus-coordination', 'distributed-transactions', 'messaging-delivery-semantics', 'stream-processing'],
  'system-design': ['requirements-quality-attributes', 'load-balancing-rate-limits', 'capacity-estimation', 'api-protocol-selection', 'consistent-hashing'],
  'production': ['slo-observability-incidents', 'resilience-patterns', 'cache-stampede', 'chaos-engineering', 'autoscaling-capacity'],
  'business': ['capacity-estimation', 'technical-strategy-decisions', 'cost-optimization-finops', 'dora-metrics-engineering'],
  'execution': ['safe-delivery-migrations', 'distributed-transactions', 'technical-debt-management', 'progressive-delivery'],
  'influence': ['technical-strategy-decisions', 'influence-conflict-feedback', 'platform-engineering'],
  'communication': ['influence-conflict-feedback', 'api-protocol-selection', 'technical-strategy-decisions'],
  'mentoring': ['mentoring-leverage', 'staff-archetypes', 'influence-conflict-feedback'],
};

const competencies = [
  ['technical-foundations', 'Technical foundations', 'Networking, data, distributed systems and engineering fundamentals'],
  ['system-design', 'System design', 'Requirements, estimation, architecture, trade-offs and evolution'],
  ['production', 'Production engineering', 'Reliability, security, observability, operations and cost'],
  ['business', 'Business and product', 'Customer outcomes, metrics, prioritization and commercial context'],
  ['execution', 'Cross-team execution', 'Planning, dependencies, migrations, risk and delivery'],
  ['influence', 'Influence and strategy', 'Alignment, decisions, technical direction and authority-free leadership'],
  ['communication', 'Communication', 'Listening, writing, speaking, facilitation and difficult conversations'],
  ['mentoring', 'Mentoring and leverage', 'Coaching, delegation, standards and growing organizational capability'],
] as const;

const levelName = (score: number) => score < 2 ? 'Starting' : score < 3 ? 'Basic' : score < 4 ? 'Working' : score < 4.7 ? 'Advanced' : 'Mastery evidence';

function AssessmentTab() {
  const state = useStaffPathState();
  const scores = competencies.map(([id]) => state.assessments[id]?.score || 1);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const evidenceCount = competencies.filter(([id]) => state.assessments[id]?.evidence.trim()).length;
  const openMistakes = state.mistakes.filter((item) => !item.resolved).length;
  const sessions = Object.values(state.roadmap).filter((record) => record.completedAt).length;
  const artifacts = Object.values(state.roadmap).filter((record) => record.artifact.trim()).length + state.journal.filter((entry) => entry.artifact).length;
  const gates = [
    ['Foundation ready', average >= 2 && sessions >= 7, 'Average ≥ 2 and at least seven core sessions'],
    ['Production ready', average >= 3 && state.practiceAttempts.length >= 2 && evidenceCount >= 3, 'Average ≥ 3, two labs, and evidence in three competencies'],
    ['Staff leadership ready', average >= 3.5 && evidenceCount >= 6 && artifacts >= 2 && state.behavioralStories.length >= 3, 'Average ≥ 3.5, broad evidence, three stories, and two workplace artifacts'],
    ['Interview ready', average >= 4 && state.mockInterviews.length >= 3 && openMistakes === 0, 'Average ≥ 4, three mocks, and no unresolved mistakes'],
  ] as const;

  const update = (id: string, field: 'score' | 'evidence', value: number | string) =>
    appStore.update((current) => ({
      ...current,
      assessments: {
        ...current.assessments,
        [id]: {
          score: field === 'score' ? Number(value) : current.assessments[id]?.score || 1,
          evidence: field === 'evidence' ? String(value) : current.assessments[id]?.evidence || '',
          updatedAt: new Date().toISOString(),
        },
      },
    }));

  return (
    <div className="assessment-layout">
      <section className="competency-list">
        {competencies.map(([id, title, description]) => {
          const item = state.assessments[id] || { score: 1, evidence: '' };
          return (
            <article key={id}>
              <div className="competency-head">
                <div><h2>{title}</h2><p>{description}</p></div>
                <span>{item.score}/5 · {levelName(item.score)}</span>
              </div>
              <input aria-label={`${title} score`} type="range" min="1" max="5" value={item.score} onChange={(event) => update(id, 'score', event.target.value)} />
              {item.score <= 3 && (() => {
                const chapterIds = competencyToChapters[id] ?? [];
                const recs = encyclopediaChapters.filter((c) => chapterIds.includes(c.id)).slice(0, 3);
                return recs.length > 0 ? (
                  <div className="competency-chapter-recs">
                    <span className="eyebrow">RECOMMENDED CHAPTERS</span>
                    {recs.map((c) => (
                      <Link key={c.id} to="/encyclopedia" className="chapter-rec-chip">
                        <span className="category-chip" data-cat={c.category}>{c.category}</span>
                        {c.title} →
                      </Link>
                    ))}
                  </div>
                ) : null;
              })()}
              <textarea aria-label={`${title} evidence`} value={item.evidence} onChange={(event) => update(id, 'evidence', event.target.value)} placeholder="Evidence: project, decision, result, feedback, or artifact…" />
            </article>
          );
        })}
      </section>
      <aside className="gate-panel">
        <p className="eyebrow">READINESS GATES</p>
        <h2>Demonstrated progression</h2>
        <p>These gates intentionally cannot be passed by moving sliders alone.</p>
        <div>
          {gates.map(([title, passed, requirement]) => (
            <article className={passed ? 'passed' : ''} key={title}>
              <span>{passed ? '✓' : '○'}</span>
              <div><strong>{title}</strong><small>{requirement}</small></div>
            </article>
          ))}
        </div>
        <footer>
          <span>{evidenceCount}/8 evidence areas</span>
          <span>{state.mockInterviews.length} mocks</span>
          <span>{openMistakes} open mistakes</span>
        </footer>
      </aside>
    </div>
  );
}

export function AssessmentPage() {
  const state = useStaffPathState();
  const [tab, setTab] = useState<'assessment' | 'analytics'>('assessment');
  const scores = competencies.map(([id]) => state.assessments[id]?.score || 1);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return (
    <div className="page assessment-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EVIDENCE-BASED READINESS</p>
          <h1>Know the next gap—not just the score.</h1>
          <p>Self-assessment guides practice. Readiness gates require demonstrated evidence.</p>
        </div>
        <div className="readiness-score"><strong>{average.toFixed(1)}</strong><span>{levelName(average)}</span></div>
      </div>

      <div className="interview-tabs" role="tablist" aria-label="Assessment sections">
        <button role="tab" aria-selected={tab === 'assessment'} className={tab === 'assessment' ? 'active' : ''} onClick={() => setTab('assessment')}>Assessment</button>
        <button role="tab" aria-selected={tab === 'analytics'} className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}>Analytics</button>
      </div>

      {tab === 'assessment' ? <AssessmentTab /> : <AnalyticsPage />}
    </div>
  );
}
