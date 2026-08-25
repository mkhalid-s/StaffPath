import { Link } from '../../lib/router';
import { roadmapSessions, ROADMAP_SESSION_COUNT } from '../../data/roadmap';
import { resolveModeConfig } from '../../domain/preparationModes';
import { useStaffPathState } from '../../lib/appStore';

const lifecycle = [
  ['Learn', 'Build accurate mental models', '/encyclopedia'],
  ['Practice', 'Design, diagnose, and communicate', '/practice'],
  ['Reflect', 'Capture mistakes and evidence', '/journal'],
  ['Assess', 'Measure readiness and close gaps', '/skills'],
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
  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div><p className="eyebrow">STAFF ENGINEER WORKSPACE</p><h1>{greeting}</h1><p>Your complete preparation lifecycle in one focused system.</p></div>
        <div className="progress-orb"><strong>{progress}%</strong><span>{modeConfig.totalDays}-day {modeConfig.label.toLowerCase()} plan</span></div>
      </div>
      <section className="hero-panel">
        <div><span className="status-chip">DAY {next.id} · WEEK {next.week}</span><h2>{next.title}</h2><p>{next.description} Today’s hour ends with a communication rep and evidence for your handbook.</p><div className="button-row"><Link className="button primary" to="/roadmap">Start today’s session →</Link>{dueMistakes > 0 && <Link className="button" to="/interviews">Review {dueMistakes} due mistake{dueMistakes === 1 ? '' : 's'}</Link>}</div></div>
        <div className="hero-stats"><div><strong>{sessions}</strong><span>sessions</span></div><div><strong>{state.practiceAttempts.length}</strong><span>practice attempts</span></div><div><strong>{focusHours}h</strong><span>focus time</span></div><div><strong>{communication}</strong><span>communication reps</span></div></div>
      </section>
      <section><div className="section-heading"><div><p className="eyebrow">PREPARATION LOOP</p><h2>Learn → practice → reflect → assess</h2></div></div><div className="lifecycle-grid">{lifecycle.map(([title, copy, to], index) => <Link to={to} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><em>Open →</em></Link>)}</div></section>
    </div>
  );
}
