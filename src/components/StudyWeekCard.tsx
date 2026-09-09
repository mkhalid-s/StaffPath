import { Link } from '../lib/router';
import { buildStudyWeekPlan } from '../lib/studyWeek';
import { useStaffPathState } from '../lib/appStore';
import { getActivePack } from '../data/companyPacks';

interface StudyWeekCardProps {
  compact?: boolean;
}

export function StudyWeekCard({ compact = false }: StudyWeekCardProps) {
  const state = useStaffPathState();
  const plan = buildStudyWeekPlan(state);
  const pack = getActivePack(state.profile.selectedCompanyPack);

  if (!plan) return null;

  const chapterPct = plan.chapterProgress.total
    ? Math.round((plan.chapterProgress.completed / plan.chapterProgress.total) * 100)
    : 0;
  const roadmapPct = plan.roadmapProgress.total
    ? Math.round((plan.roadmapProgress.completed / plan.roadmapProgress.total) * 100)
    : 0;

  return (
    <section className={`study-week-card ${compact ? 'compact' : ''}`} aria-label={`Study week ${plan.week}`}>
      <div className="study-week-header">
        <div>
          <p className="eyebrow">THIS WEEK · CURRICULUM {plan.week}</p>
          <h2>{plan.module.title}</h2>
          {!compact && <p>{plan.module.intent}</p>}
        </div>
        <Link className="text-link" to={`/curriculum?week=${plan.week}`}>Full week map →</Link>
      </div>

      <div className="study-week-progress">
        <div>
          <span>Read</span>
          <div className="study-week-bar" role="progressbar" aria-valuenow={chapterPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="study-week-fill" style={{ width: `${chapterPct}%` }} />
          </div>
          <em>{plan.chapterProgress.completed}/{plan.chapterProgress.total} chapters</em>
        </div>
        <div>
          <span>Apply</span>
          <div className="study-week-bar" role="progressbar" aria-valuenow={roadmapPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="study-week-fill" style={{ width: `${roadmapPct}%` }} />
          </div>
          <em>Roadmap week {plan.roadmapWeek} · {plan.roadmapProgress.completed}/{plan.roadmapProgress.total} sessions</em>
        </div>
      </div>

      <ol className="study-week-steps">
        <li>
          <strong>1 · Read</strong>
          {plan.nextChapterId
            ? <Link to={`/encyclopedia?chapter=${encodeURIComponent(plan.nextChapterId)}`}>
                {plan.chapters.find((chapter) => chapter.id === plan.nextChapterId)?.title ?? 'Next chapter'} →
              </Link>
            : <span>All chapters evidenced</span>}
        </li>
        <li>
          <strong>2 · Practice</strong>
          <Link to={plan.practiceLink}>Run a {plan.practiceTrack} scenario →</Link>
        </li>
        <li>
          <strong>3 · Apply</strong>
          {plan.nextRoadmapSession
            ? <Link to={plan.roadmapLink}>Day {plan.nextRoadmapSession.id}: {plan.nextRoadmapSession.title} →</Link>
            : <Link to={plan.roadmapLink}>Open roadmap week {plan.roadmapWeek} →</Link>}
        </li>
      </ol>

      {pack && !compact && (
        <p className="study-week-pack-note">
          {pack.company} overlay is on — <Link to="/pack">company angles and scenarios →</Link>
        </p>
      )}

      {!compact && (
        <div className="button-row">
          {plan.nextChapterId && (
            <Link className="button primary" to={`/encyclopedia?chapter=${encodeURIComponent(plan.nextChapterId)}`}>
              Continue reading →
            </Link>
          )}
          <Link className="button" to="/coach">Coach recommendations</Link>
        </div>
      )}
    </section>
  );
}
