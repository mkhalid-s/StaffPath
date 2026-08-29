import { Link } from '../../lib/router';
import { roadmapSessions, ROADMAP_SESSION_COUNT } from '../../data/roadmap';
import { resolveModeConfig } from '../../domain/preparationModes';
import { buildWhatsNextActions } from '../../lib/intelligence';
import { FEATURES, getNextUnlock, getUnlockProgress, isFeatureUnlocked } from '../../lib/featureUnlocks';
import { useStaffPathState } from '../../lib/appStore';
import { IntelligentRecommendations } from './IntelligentRecommendations';

const lifecycle = [
  ['Learn', 'Build accurate mental models', '/encyclopedia', 'encyclopedia'],
  ['Practice', 'Design, diagnose, and communicate', '/practice', 'practice'],
  ['Reflect', 'Capture mistakes and evidence', '/journal', 'journal'],
  ['Assess', 'Measure readiness and close gaps', '/skills', 'skills'],
] as const;

export function DashboardPage() {
  const state = useStaffPathState();
  const modeConfig = resolveModeConfig(state.profile.preparationMode, state.profile.customMode);
  const sessions = Object.values(state.roadmap).filter((record) => record.completedAt).length;
  const focusHours = Math.round(Object.values(state.roadmap).reduce((sum, record) => sum + record.focusedSeconds, 0) / 360) / 10;
  const communication = Object.values(state.roadmap).filter((record) => record.communicationComplete).length + Object.values(state.communicationLessons).filter((record) => record.completedAt).length;
  const progress = Math.round((sessions / ROADMAP_SESSION_COUNT) * 100);
  const next = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt) || roadmapSessions[ROADMAP_SESSION_COUNT - 1];
  const dueMistakes = state.mistakes.filter((item) => !item.resolved && item.nextReview <= new Date().toISOString().slice(0, 10)).length;
  const greeting = state.profile.name ? `Welcome back, ${state.profile.name}.` : 'Build judgment. Create leverage.';
  const nextUnlock = getNextUnlock(state);
  const lockedFeatures = FEATURES.filter((feature) => !isFeatureUnlocked(state, feature.id) && feature.id !== 'settings');
  const unlockedCount = FEATURES.filter((feature) => isFeatureUnlocked(state, feature.id)).length;
  const topAction = buildWhatsNextActions(state)[0];
  const daysLeft = (() => {
    if (!state.profile.startDate) return null;
    const start = new Date(state.profile.startDate);
    const target = new Date(start);
    target.setDate(target.getDate() + modeConfig.totalDays);
    const diffDays = Math.ceil((target.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return diffDays > 0 ? diffDays : 0;
  })();

  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div><p className="eyebrow">STAFF ENGINEER WORKSPACE</p><h1>{greeting}</h1><p>Ready when you are. Every tool, every day.</p></div>
        <div className="progress-orb">
          <strong>{progress}%</strong><span>{modeConfig.totalDays}-day {modeConfig.label.toLowerCase()} plan</span>
          {daysLeft !== null && (daysLeft > 0
            ? <><strong style={{marginTop:'4px'}}>{daysLeft}</strong><span>days remaining</span></>
            : <><strong style={{marginTop:'4px'}}>Interview day</strong><span>make it count</span></>
          )}
        </div>
      </div>

      <section className="hero-panel">
        <div>
          <span className="status-chip">DAY {next.id} · WEEK {next.week}</span>
          <h2>{topAction ? topAction.title : next.title}</h2>
          <p>{topAction ? `${topAction.reason} ${topAction.insight}` : `${next.description} Today's hour ends with a communication rep and evidence for your handbook.`}</p>
          <div className="button-row">
            <Link className="button primary" to={topAction?.to ?? '/roadmap'}>
              {topAction ? 'Do this next →' : "Start today's session →"}
            </Link>
            {dueMistakes > 0 && <Link className="button" to="/interviews">Review {dueMistakes} due mistake{dueMistakes === 1 ? '' : 's'}</Link>}
          </div>
        </div>
        <div className="hero-stats">
          <div><strong>{sessions}</strong><span>sessions</span></div>
          <div><strong>{state.practiceAttempts.length}</strong><span>practice attempts</span></div>
          <div><strong>{focusHours}h</strong><span>focus time</span></div>
          <div><strong>{communication}</strong><span>communication reps</span></div>
        </div>
      </section>

      <IntelligentRecommendations />

      {nextUnlock && !state.profile.unlockAll && (
        <section className="unlock-progress-section">
          <div className="section-heading">
            <div><p className="eyebrow">PROGRESSIVE DISCLOSURE</p><h2>Next unlock: {nextUnlock.label}</h2></div>
            <span className="unlock-count">{unlockedCount}/{FEATURES.length} features</span>
          </div>
          <div className="unlock-next-card">
            <div>
              <strong>{nextUnlock.icon} {nextUnlock.label}</strong>
              <p>{nextUnlock.requirement}</p>
            </div>
            {(() => {
              const unlockProgress = getUnlockProgress(state, nextUnlock.id);
              return (
                <>
                  <div className="unlock-progress-bar" role="progressbar" aria-valuenow={unlockProgress.percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="unlock-progress-fill" style={{ width: `${unlockProgress.percent}%` }} />
                  </div>
                  <span className="unlock-progress-label">{unlockProgress.current}/{unlockProgress.target}</span>
                </>
              );
            })()}
          </div>
          {lockedFeatures.length > 1 && (
            <div className="unlock-upcoming">
              <p className="eyebrow">COMING SOON</p>
              <div className="unlock-upcoming-list">
                {lockedFeatures.slice(0, 4).map((feature) => {
                  const featureProgress = getUnlockProgress(state, feature.id);
                  return (
                    <span key={feature.id} title={feature.requirement}>
                      {feature.icon} {feature.label} · {featureProgress.current}/{featureProgress.target}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <div className="section-heading"><div><p className="eyebrow">PREPARATION LOOP</p><h2>Learn → practice → reflect → assess</h2></div></div>
        <div className="lifecycle-grid">
          {lifecycle.map(([title, copy, to, featureId], index) => {
            const unlocked = isFeatureUnlocked(state, featureId);
            if (!unlocked) {
              const feature = FEATURES.find((item) => item.id === featureId);
              const featureProgress = getUnlockProgress(state, featureId);
              return (
                <div className="lifecycle-locked" key={title} title={feature?.requirement}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>🔒 {feature?.requirement}</p>
                  <em>{featureProgress.current}/{featureProgress.target}</em>
                </div>
              );
            }
            return <Link to={to} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><em>Open →</em></Link>;
          })}
        </div>
      </section>
    </div>
  );
}
