import { useState } from 'react';
import type { PreparationMode } from '../../domain/preparationModes';
import { PREPARATION_MODES, resolveModeConfig } from '../../domain/preparationModes';
import { buildPersonalizedRecommendations, suggestedStartingWeek } from '../../lib/recommendations';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { SkillAssessment } from './SkillAssessment';

type OnboardingStep = 'welcome' | 'mode' | 'assessment' | 'recommendations';

export function OnboardingGuide() {
  const state = useStaffPathState();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState(state.profile.name);
  const [selectedMode, setSelectedMode] = useState<PreparationMode>(state.profile.preparationMode);
  const [customDays, setCustomDays] = useState(state.profile.customMode?.totalDays ?? 120);
  const [customMinutes, setCustomMinutes] = useState(state.profile.customMode?.dailyMinutes ?? 45);

  if (state.profile.onboardingComplete) return null;

  const customConfig = selectedMode === 'custom' ? { totalDays: customDays, dailyMinutes: customMinutes } : undefined;
  const modeConfig = resolveModeConfig(selectedMode, customConfig);
  const recommendations = buildPersonalizedRecommendations(state);
  const startingWeek = suggestedStartingWeek(state);

  function saveMode() {
    appStore.update((current) => ({
      ...current,
      profile: {
        ...current.profile,
        preparationMode: selectedMode,
        customMode: selectedMode === 'custom' ? { totalDays: customDays, dailyMinutes: customMinutes } : undefined,
      },
    }));
    setStep('assessment');
  }

  function finishOnboarding() {
    appStore.update((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name: name.trim() || 'Staff engineer',
        startDate: new Date().toISOString().slice(0, 10),
        onboardingComplete: true,
      },
    }));
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-backdrop" aria-hidden="true" />
      <div className="onboarding-panel">
        {step === 'welcome' && (
          <div className="onboarding-step">
            <p className="eyebrow">WELCOME TO STAFFPATH</p>
            <h2 id="onboarding-title">Build judgment. Create leverage.</h2>
            <p>StaffPath is your local-first preparation workspace for Staff-level engineering interviews and growth. Use <kbd>⌘ ?</kbd> anytime to see keyboard shortcuts. Let&apos;s personalize your plan in under two minutes.</p>
            <label>What should we call you?<input aria-label="Your name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
            <div className="button-row">
              <button className="button primary" onClick={() => { appStore.update((c) => ({ ...c, profile: { ...c.profile, name: name.trim() } })); setStep('mode'); }}>Choose your pace →</button>
            </div>
          </div>
        )}

        {step === 'mode' && (
          <div className="onboarding-step">
            <p className="eyebrow">STEP 1 · PREPARATION MODE</p>
            <h2>How much time can you commit?</h2>
            <p>Your mode adjusts session length, focus timer, and expected timeline. You can change this anytime in Settings.</p>
            <div className="mode-cards">
              {(Object.values(PREPARATION_MODES) as typeof PREPARATION_MODES[keyof typeof PREPARATION_MODES][]).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <strong>{mode.label}</strong>
                  <span>{mode.dailyMinutes} min/day · {mode.totalDays} days</span>
                  <p>{mode.description}</p>
                  <em>{mode.sessionsPerWeek}/week</em>
                </button>
              ))}
              <button
                type="button"
                className={`mode-card ${selectedMode === 'custom' ? 'selected' : ''}`}
                onClick={() => setSelectedMode('custom')}
              >
                <strong>Custom</strong>
                <span>Define your own pace</span>
                <p>Set daily minutes and total duration to match your schedule.</p>
              </button>
            </div>
            {selectedMode === 'custom' && (
              <div className="custom-mode-sliders">
                <label>Daily focus: {customMinutes} minutes<input aria-label="Daily minutes" type="range" min="15" max="120" step="5" value={customMinutes} onChange={(e) => setCustomMinutes(Number(e.target.value))} /></label>
                <label>Total duration: {customDays} days<input aria-label="Total days" type="range" min="60" max="365" step="5" value={customDays} onChange={(e) => setCustomDays(Number(e.target.value))} /></label>
              </div>
            )}
            <div className="mode-preview">
              <span>Your plan:</span>
              <strong>{modeConfig.dailyMinutes} min sessions · {modeConfig.totalDays}-day timeline · {modeConfig.sessionsPerWeek}/week</strong>
            </div>
            <div className="button-row">
              <button className="button" onClick={() => setStep('welcome')}>Back</button>
              <button className="button primary" onClick={saveMode}>Continue to assessment →</button>
            </div>
          </div>
        )}

        {step === 'assessment' && (
          <SkillAssessment onComplete={() => setStep('recommendations')} />
        )}

        {step === 'recommendations' && (
          <div className="onboarding-step">
            <p className="eyebrow">STEP 3 · YOUR PLAN</p>
            <h2>Personalized starting point</h2>
            <p>Based on your baseline, we recommend starting at <strong>Week {startingWeek}</strong> and focusing on these areas first.</p>
            <div className="recommendation-list">
              {recommendations.map((rec) => (
                <article key={rec.title}>
                  <strong>{rec.title}</strong>
                  <p>{rec.reason}</p>
                </article>
              ))}
            </div>
            <div className="button-row">
              <button className="button primary" onClick={finishOnboarding}>Start preparing →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
