import { useState } from 'react';
import type { PreparationMode } from '../../domain/preparationModes';
import { PREPARATION_MODES, resolveModeConfig } from '../../domain/preparationModes';
import type { StaffPathState } from '../../domain/appState';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { loadDemoState } from '../../lib/demoSeed';
import { CompanyPackSelection } from './CompanyPackSelection';

export function isStaffPathBackup(value: unknown): value is StaffPathState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StaffPathState>;
  return candidate.version === 2
    && typeof candidate.profile === 'object' && candidate.profile !== null
    && Array.isArray(candidate.mistakes)
    && Array.isArray(candidate.mockInterviews)
    && Array.isArray(candidate.practiceAttempts)
    && Array.isArray(candidate.journal)
    && Array.isArray(candidate.behavioralStories)
    && typeof candidate.roadmap === 'object' && candidate.roadmap !== null;
}

export function SettingsPage() {
  const state = useStaffPathState();
  const [message, setMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<PreparationMode>(state.profile.preparationMode);
  const [customDays, setCustomDays] = useState(state.profile.customMode?.totalDays ?? 120);
  const [customMinutes, setCustomMinutes] = useState(state.profile.customMode?.dailyMinutes ?? 45);

  const modeConfig = resolveModeConfig(selectedMode, selectedMode === 'custom' ? { totalDays: customDays, dailyMinutes: customMinutes } : undefined);

  function exportBackup() { const url = URL.createObjectURL(new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `staffpath-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url); setMessage('Backup downloaded.'); }
  async function importBackup(file?: File) { if (!file) return; if (file.size > 5_000_000) { setMessage('Backup is larger than 5 MB and was not opened.'); return; } try { const parsed = JSON.parse(await file.text()); delete parsed.exportedAt; if (!isStaffPathBackup(parsed)) throw new Error('invalid'); appStore.replace(parsed); setMessage('Backup restored successfully.'); } catch { setMessage('This is not a valid StaffPath v2 backup. No data was changed.'); } }
  function reset() { if (!window.confirm('Reset all StaffPath v2 progress? Export a backup first if you may need it.')) return; appStore.reset(); setMessage('Local progress was reset.'); }
  function loadDemo() { if (!window.confirm('Replace your current data with a sample week-6 journey? Your real progress will be lost unless you export a backup first.')) return; loadDemoState(); setMessage('Demo data loaded — explore the app as a user at week 6.'); }

  function saveMode() {
    appStore.update((current) => ({
      ...current,
      profile: {
        ...current.profile,
        preparationMode: selectedMode,
        customMode: selectedMode === 'custom' ? { totalDays: customDays, dailyMinutes: customMinutes } : undefined,
      },
    }));
    setMessage(`Preparation mode updated to ${modeConfig.label}.`);
  }

  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div><p className="eyebrow">LOCAL-FIRST DATA</p><h1>Settings</h1><p>Manage your preparation pace, profile, and data backup.</p></div>
      </div>

      <CompanyPackSelection />

      <section className="settings-section">
        <div className="section-heading"><div><p className="eyebrow">FEATURE ACCESS</p><h2>Progressive disclosure</h2></div></div>
        <p>Features unlock as you build momentum. Power users can unlock everything immediately.</p>
        <label className="check-row unlock-all-toggle">
          <input
            type="checkbox"
            checked={state.profile.unlockAll}
            onChange={(event) => {
              appStore.update((current) => ({
                ...current,
                profile: { ...current.profile, unlockAll: event.target.checked },
              }));
              setMessage(event.target.checked ? 'All features unlocked.' : 'Progressive unlock restored.');
            }}
          />
          <span><strong>Unlock all features</strong>Skip progressive disclosure and access every section immediately.</span>
        </label>
      </section>

      <section className="settings-section">
        <div className="section-heading"><div><p className="eyebrow">PREPARATION MODE</p><h2>Your pace</h2></div></div>
        <div className="mode-cards settings-mode-cards">
          {(Object.values(PREPARATION_MODES) as typeof PREPARATION_MODES[keyof typeof PREPARATION_MODES][]).map((mode) => (
            <button key={mode.id} type="button" className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`} onClick={() => setSelectedMode(mode.id)}>
              <strong>{mode.label}</strong>
              <span>{mode.dailyMinutes} min/day · {mode.totalDays} days</span>
              <p>{mode.description}</p>
            </button>
          ))}
          <button type="button" className={`mode-card ${selectedMode === 'custom' ? 'selected' : ''}`} onClick={() => setSelectedMode('custom')}>
            <strong>Custom</strong>
            <span>Define your own pace</span>
          </button>
        </div>
        {selectedMode === 'custom' && (
          <div className="custom-mode-sliders">
            <label>Daily focus: {customMinutes} minutes<input aria-label="Daily minutes" type="range" min="15" max="120" step="5" value={customMinutes} onChange={(e) => setCustomMinutes(Number(e.target.value))} /></label>
            <label>Total duration: {customDays} days<input aria-label="Total days" type="range" min="60" max="365" step="5" value={customDays} onChange={(e) => setCustomDays(Number(e.target.value))} /></label>
          </div>
        )}
        <p className="mode-preview">Current plan: <strong>{modeConfig.dailyMinutes} min sessions · {modeConfig.totalDays}-day timeline</strong></p>
        <button className="button primary" onClick={saveMode}>Save preparation mode</button>
      </section>

      <div className="settings-grid">
        <article><span>01</span><h2>Export backup</h2><p>Download every assessment, session, attempt, story, mistake, and journal entry as JSON.</p><button className="button primary" onClick={exportBackup}>Download backup</button></article>
        <article><span>02</span><h2>Restore backup</h2><p>Choose a StaffPath v2 JSON file. Its structure is validated before replacing local data.</p><label className="button">Choose backup<input aria-label="Choose backup" hidden type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])} /></label></article>
        <article className="danger-card"><span>03</span><h2>Reset workspace</h2><p>Erase v2 progress in this browser. This cannot be undone without an exported backup.</p><button className="button" onClick={reset}>Reset local data</button></article>
        <article className="danger-card"><span>04</span><h2>Load demo data</h2><p>Replaces your current data with a sample week-6 journey. Your real progress will be lost.</p><button className="button" onClick={loadDemo}>Load demo data</button></article>
      </div>
      {message && <p className="settings-message" role="status">{message}</p>}
    </div>
  );
}
