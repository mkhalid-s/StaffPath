import { useState } from 'react';
import type { PreparationMode } from '../../domain/preparationModes';
import type { CompanyPackId } from '../../data/companyPacks';
import { COMPANY_PACKS } from '../../data/companyPacks';
import { PREPARATION_MODES, resolveModeConfig } from '../../domain/preparationModes';
import { buildPersonalizedRecommendations, suggestedStartingWeek } from '../../lib/recommendations';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { localDayKey } from '../../lib/dates';
import { Link, navigate } from '../../lib/router';
import { SkillAssessment } from './SkillAssessment';

type OnboardingStep = 'welcome' | 'mode' | 'assessment' | 'company' | 'recommendations';

const PACK_OPTIONS: { id: CompanyPackId; label: string; hint: string }[] = [
  { id: 'none', label: 'No company yet', hint: 'Study the Staff core first. Add a company overlay when you have a target loop.' },
  { id: 'google', label: 'Google', hint: 'System design depth, estimation, distributed systems.' },
  { id: 'meta', label: 'Meta', hint: 'Product sense, scale, and cross-functional influence.' },
  { id: 'amazon', label: 'Amazon', hint: 'Operational excellence, bar-raiser narratives, leadership principles.' },
  { id: 'netflix', label: 'Netflix', hint: 'High autonomy, judgment, and culture-fit storytelling.' },
  { id: 'startup', label: 'Startup', hint: 'Breadth, pragmatism, and shipping under constraints.' },
  { id: 'atlassian', label: 'Atlassian', hint: 'Platform thinking, collaboration products, and team play.' },
];

export function OnboardingGuide() {
  const state = useStaffPathState();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState(state.profile.name);
  const [selectedMode, setSelectedMode] = useState<PreparationMode>(state.profile.preparationMode);
  const [customDays, setCustomDays] = useState(state.profile.customMode?.totalDays ?? 120);
  const [customMinutes, setCustomMinutes] = useState(state.profile.customMode?.dailyMinutes ?? 45);
  const [selectedPack, setSelectedPack] = useState<CompanyPackId>(state.profile.selectedCompanyPack);

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

  function saveCompanyPack() {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, selectedCompanyPack: selectedPack },
    }));
    setStep('recommendations');
  }

  function finishOnboarding() {
    const week = startingWeek;
    appStore.update((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name: name.trim() || 'Staff engineer',
        startDate: localDayKey(),
        onboardingComplete: true,
        studyWeek: week,
        guidedHelpDismissed: false,
        selectedCompanyPack: selectedPack,
      },
    }));
    navigate(`/curriculum?week=${week}`);
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-backdrop" aria-hidden="true" />
      <div className="onboarding-panel">
        {step === 'welcome' && (
          <div className="onboarding-step">
            <p className="eyebrow">WELCOME TO STAFFPATH</p>
            <h2 id="onboarding-title">Build judgment. Create leverage.</h2>
            <p>StaffPath is your local-first preparation workspace for Staff-level engineering interviews and growth. You will get a weekly study path — read, practice, apply — not a pile of disconnected pages. Use <kbd>⌘ ?</kbd> anytime to see keyboard shortcuts.</p>
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
          <SkillAssessment onComplete={() => setStep('company')} />
        )}

        {step === 'company' && (
          <div className="onboarding-step">
            <p className="eyebrow">STEP 3 · COMPANY (OPTIONAL)</p>
            <h2>Interviewing somewhere specific?</h2>
            <p>Company packs overlay chapter angles and practice scenarios. Skip this if you are still exploring — the core Staff map works without one.</p>
            <div className="mode-cards pack-pick-cards">
              {PACK_OPTIONS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  className={`mode-card ${selectedPack === pack.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPack(pack.id)}
                >
                  <strong>{pack.label}</strong>
                  <p>{pack.hint}</p>
                  {pack.id !== 'none' && COMPANY_PACKS[pack.id] && (
                    <em>{COMPANY_PACKS[pack.id].interviewFormat}</em>
                  )}
                </button>
              ))}
            </div>
            <div className="button-row">
              <button className="button" onClick={() => setStep('assessment')}>Back</button>
              <button className="button primary" onClick={saveCompanyPack}>Continue to your plan →</button>
            </div>
          </div>
        )}

        {step === 'recommendations' && (
          <div className="onboarding-step">
            <p className="eyebrow">STEP 4 · YOUR PLAN</p>
            <h2>Week {startingWeek} is your starting map</h2>
            <p>Based on your baseline, start with curriculum week <strong>{startingWeek}</strong>. Each week follows <strong>read → practice → apply</strong>. Your first gaps to close:</p>
            <div className="recommendation-list">
              {recommendations.map((rec) => (
                <Link key={rec.title} to={rec.to} className="recommendation-card">
                  <strong>{rec.title}</strong>
                  <p>{rec.reason}</p>
                  <em>Open →</em>
                </Link>
              ))}
            </div>
            {selectedPack !== 'none' && (
              <p className="onboarding-pack-note">
                {PACK_OPTIONS.find((pack) => pack.id === selectedPack)?.label} overlay will highlight company-specific angles on the same chapters.
              </p>
            )}
            <div className="button-row">
              <button className="button primary" onClick={finishOnboarding}>Start week {startingWeek} →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
