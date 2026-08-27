import { useState } from 'react';
import { COMPETENCIES } from '../../lib/recommendations';
import { appStore, useStaffPathState } from '../../lib/appStore';

const levelName = (score: number) => score < 2 ? 'Starting' : score < 3 ? 'Basic' : score < 4 ? 'Working' : score < 4.7 ? 'Advanced' : 'Mastery evidence';

interface SkillAssessmentProps {
  onComplete: () => void;
}

export function SkillAssessment({ onComplete }: SkillAssessmentProps) {
  const state = useStaffPathState();
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(COMPETENCIES.map((comp) => [comp.id, state.assessments[comp.id]?.score ?? 3])),
  );
  const [evidence, setEvidence] = useState<Record<string, string>>(() =>
    Object.fromEntries(COMPETENCIES.map((comp) => [comp.id, state.assessments[comp.id]?.evidence ?? ''])),
  );

  function saveAssessment() {
    const now = new Date().toISOString();
    appStore.update((current) => ({
      ...current,
      assessments: {
        ...current.assessments,
        ...Object.fromEntries(COMPETENCIES.map((comp) => [
          comp.id,
          { score: scores[comp.id] ?? 3, evidence: evidence[comp.id] ?? '', updatedAt: now },
        ])),
      },
      profile: { ...current.profile, skillAssessmentComplete: true },
    }));
    onComplete();
  }

  const average = COMPETENCIES.reduce((sum, comp) => sum + (scores[comp.id] ?? 3), 0) / COMPETENCIES.length;

  return (
    <div className="onboarding-step skill-assessment">
      <p className="eyebrow">STEP 2 · SKILL BASELINE</p>
      <h2>Where are you today?</h2>
      <p>Rate each competency honestly. This shapes your starting point and recommendations—not a final verdict.</p>
      <div className="assessment-summary">
        <strong>{average.toFixed(1)}</strong>
        <span>{levelName(average)} · {COMPETENCIES.length} competencies</span>
      </div>
      <div className="skill-assessment-grid">
        {COMPETENCIES.map((comp) => (
          <article key={comp.id}>
            <div className="competency-head">
              <div>
                <h3>{comp.title}</h3>
                <p>{comp.description}</p>
              </div>
              <span>{scores[comp.id]}/5 · {levelName(scores[comp.id] ?? 3)}</span>
            </div>
            <input
              aria-label={`${comp.title} score`}
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={scores[comp.id]}
              onChange={(event) => setScores((prev) => ({ ...prev, [comp.id]: Number(event.target.value) }))}
            />
            <textarea
              aria-label={`${comp.title} evidence`}
              value={evidence[comp.id]}
              onChange={(event) => setEvidence((prev) => ({ ...prev, [comp.id]: event.target.value }))}
              placeholder={comp.evidencePrompt}
            />
          </article>
        ))}
      </div>
      <div className="button-row">
        <button className="button primary" onClick={saveAssessment}>Save baseline and continue →</button>
      </div>
    </div>
  );
}
