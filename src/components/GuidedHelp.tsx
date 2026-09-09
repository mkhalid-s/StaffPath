import { Link } from '../lib/router';
import { appStore, useStaffPathState } from '../lib/appStore';
import { buildStudyWeekPlan } from '../lib/studyWeek';

export function GuidedHelp() {
  const state = useStaffPathState();
  const plan = buildStudyWeekPlan(state);

  if (!state.profile.onboardingComplete || state.profile.guidedHelpDismissed || !plan) {
    return null;
  }

  function dismiss() {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, guidedHelpDismissed: true },
    }));
  }

  return (
    <section className="guided-help" aria-label="How to use StaffPath">
      <div className="guided-help-header">
        <div>
          <p className="eyebrow">GUIDED START</p>
          <h2>Follow one week at a time</h2>
          <p>StaffPath is not a pile of tabs. Each curriculum week is a loop: read chapters, practice one scenario, then complete the matching roadmap sessions.</p>
        </div>
        <button type="button" className="button" onClick={dismiss} aria-label="Dismiss guided help">
          Got it
        </button>
      </div>
      <div className="guided-help-steps">
        <article>
          <span>01</span>
          <h3>Curriculum is the map</h3>
          <p>Week {plan.week} focuses on {plan.module.title.toLowerCase()}. Open the map when you need the full chapter list.</p>
          <Link to={`/curriculum?week=${plan.week}`}>Open week {plan.week} →</Link>
        </article>
        <article>
          <span>02</span>
          <h3>Encyclopedia is the depth</h3>
          <p>Each chapter has a one-minute answer, diagram, and Staff discussion bar. Mark complete only when you could teach it.</p>
          {plan.nextChapterId && (
            <Link to={`/encyclopedia?chapter=${encodeURIComponent(plan.nextChapterId)}`}>Start reading →</Link>
          )}
        </article>
        <article>
          <span>03</span>
          <h3>Roadmap is the daily hour</h3>
          <p>Timed sessions with reflection and artifacts. Roadmap week {plan.roadmapWeek} applies what you read this week.</p>
          <Link to={plan.roadmapLink}>Open roadmap week {plan.roadmapWeek} →</Link>
        </article>
      </div>
      <p className="guided-help-footnote">
        Company path is optional — overlay Google, Meta, and others only when you have a target loop. <Link to="/pack">Choose later →</Link>
      </p>
    </section>
  );
}
