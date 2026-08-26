import { CompetencyRadar } from '../../components/charts/CompetencyRadar';
import { TimeHeatmap } from '../../components/charts/TimeHeatmap';
import {
  analyzeLearningPatterns,
  computeMilestones,
  getActivityHeatmap,
  identifyFocusAreas,
} from '../../lib/intelligence';
import { useStaffPathState } from '../../lib/appStore';

export function AnalyticsPage() {
  const state = useStaffPathState();
  const patterns = analyzeLearningPatterns(state);
  const heatmap = getActivityHeatmap(state);
  const milestones = computeMilestones(state);
  const focusAreas = identifyFocusAreas(state, 4);
  const achieved = milestones.filter((m) => m.achieved).length;
  const totalFocus = Object.values(patterns.timeByCategory).reduce((sum, v) => sum + v, 0);

  return (
    <div className="analytics-page">
      <div className="analytics-stats">
        <article>
          <strong>{patterns.streak}</strong>
          <span>day streak</span>
        </article>
        <article>
          <strong>{patterns.sessionsThisWeek}</strong>
          <span>sessions this week</span>
        </article>
        <article>
          <strong>{achieved}/{milestones.length}</strong>
          <span>milestones</span>
        </article>
        <article>
          <strong className={`velocity-${patterns.velocity}`}>{patterns.velocity}</strong>
          <span>learning velocity</span>
        </article>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <p className="eyebrow">SKILL PROFILE</p>
          <h3>Competency radar</h3>
          <CompetencyRadar state={state} />
        </section>

        <section className="analytics-card">
          <p className="eyebrow">ACTIVITY</p>
          <h3>28-day heatmap</h3>
          <TimeHeatmap data={heatmap} />
        </section>

        <section className="analytics-card">
          <p className="eyebrow">TIME DISTRIBUTION</p>
          <h3>Focus by category</h3>
          <div className="category-bars">
            {Object.entries(patterns.timeByCategory).map(([category, minutes]) => (
              <div key={category}>
                <div className="category-bar-head">
                  <span>{category}</span>
                  <strong>{Math.round(minutes)}m</strong>
                </div>
                <div className="unlock-progress-bar">
                  <div
                    className="unlock-progress-fill"
                    style={{ width: `${totalFocus ? (minutes / totalFocus) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="schedule-hint">{patterns.scheduleSuggestion}</p>
        </section>

        <section className="analytics-card">
          <p className="eyebrow">GAMIFICATION</p>
          <h3>Milestones</h3>
          <div className="milestone-list">
            {milestones.map((milestone) => (
              <article key={milestone.id} className={milestone.achieved ? 'achieved' : ''}>
                <span>{milestone.achieved ? '✓' : '○'}</span>
                <div>
                  <strong>{milestone.label}</strong>
                  <div className="unlock-progress-bar">
                    <div
                      className="unlock-progress-fill"
                      style={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {focusAreas.length > 0 && (
          <section className="analytics-card full">
            <p className="eyebrow">WEAKNESS IDENTIFICATION</p>
            <h3>Priority focus areas</h3>
            <div className="weakness-cards">
              {focusAreas.map((area) => (
                <article key={area.competencyId}>
                  <strong>{area.title}</strong>
                  <span>{area.score}/5</span>
                  <p>{area.reason}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
