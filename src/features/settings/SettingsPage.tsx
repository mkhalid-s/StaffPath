import { useState } from 'react';
import type { StaffPathState } from '../../domain/appState';
import { appStore, useStaffPathState } from '../../lib/appStore';

export function isStaffPathBackup(value: unknown): value is StaffPathState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StaffPathState>;
  return candidate.version === 2 && Array.isArray(candidate.mistakes) && Array.isArray(candidate.mockInterviews) && Array.isArray(candidate.practiceAttempts) && Array.isArray(candidate.journal) && Array.isArray(candidate.behavioralStories) && typeof candidate.roadmap === 'object' && candidate.roadmap !== null;
}

export function SettingsPage() {
  const state = useStaffPathState(); const [message, setMessage] = useState('');
  function exportBackup() { const url = URL.createObjectURL(new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `staffpath-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url); setMessage('Backup downloaded.'); }
  async function importBackup(file?: File) { if (!file) return; if (file.size > 5_000_000) { setMessage('Backup is larger than 5 MB and was not opened.'); return; } try { const parsed = JSON.parse(await file.text()); delete parsed.exportedAt; if (!isStaffPathBackup(parsed)) throw new Error('invalid'); appStore.replace(parsed); setMessage('Backup restored successfully.'); } catch { setMessage('This is not a valid StaffPath v2 backup. No data was changed.'); } }
  function reset() { if (!window.confirm('Reset all StaffPath v2 progress? Export a backup first if you may need it.')) return; appStore.reset(); setMessage('Local progress was reset.'); }
  return <div className="page settings-page"><div className="page-heading"><div><p className="eyebrow">LOCAL-FIRST DATA</p><h1>Backup and recovery</h1><p>Your preparation data stays in this browser unless you explicitly export it.</p></div></div><div className="settings-grid"><article><span>01</span><h2>Export backup</h2><p>Download every assessment, session, attempt, story, mistake, and journal entry as JSON.</p><button className="button primary" onClick={exportBackup}>Download backup</button></article><article><span>02</span><h2>Restore backup</h2><p>Choose a StaffPath v2 JSON file. Its structure is validated before replacing local data.</p><label className="button">Choose backup<input aria-label="Choose backup" hidden type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])} /></label></article><article className="danger-card"><span>03</span><h2>Reset workspace</h2><p>Erase v2 progress in this browser. This cannot be undone without an exported backup.</p><button className="button" onClick={reset}>Reset local data</button></article></div>{message && <p className="settings-message" role="status">{message}</p>}</div>;
}
