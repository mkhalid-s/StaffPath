import { Link } from '../../lib/router';
import { buildWhatsNextActions, identifyFocusAreas, analyzeLearningPatterns } from '../../lib/intelligence';
import { useStaffPathState } from '../../lib/appStore';

const categoryIcon: Record<string, string> = {
  roadmap: '□', practice: '△', mistake: '◉', assessment: '◇', communication: '◌', chapter: '⌕', journal: '≡',
};

export function IntelligentRecommendations() {
  const state = useStaffPathState();
  const actions = buildWhatsNextActions(state);
  const focusAreas = identifyFocusAreas(state, 3);
  const patterns = analyzeLearningPatterns(state);

  if (!actions.length) return null;

  return (
    <section className="intelligence-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WHAT&apos;S NEXT</p>
          <h2>Intelligent recommendations</h2>
        </div>
        <div className="intelligence-meta">
          {patterns.streak > 0 && <span className="streak-badge">{patterns.streak}-day streak</span>}
          <span className={`velocity-chip velocity-${patterns.velocity}`}>{patterns.velocity}</span>
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="intelligence-actions">
          {actions.map((action, index) => (
            <Link to={action.to} key={action.title} className="intelligence-action">
              <span className="action-rank">0{index + 1}</span>
              <div>
                <strong>{categoryIcon[action.category] ?? '✦'} {action.title}</strong>
                <p>{action.reason}</p>
                <em>{action.insight}</em>
              </div>
              <span className="action-arrow">→</span>
            </Link>
          ))}
        </div>

        {focusAreas.length > 0 && (
          <aside className="focus-areas-panel">
            <p className="eyebrow">RECOMMENDED FOCUS</p>
            <h3>Gap areas</h3>
            {focusAreas.map((area) => (
              <article key={area.competencyId}>
                <div className="focus-area-head">
                  <strong>{area.title}</strong>
                  <span>{area.score}/5</span>
                </div>
                <p>{area.reason}</p>
              </article>
            ))}
            <p className="schedule-hint">{patterns.scheduleSuggestion}</p>
          </aside>
        )}
      </div>
    </section>
  );
}
