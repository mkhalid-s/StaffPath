import type { LegacyPreparationState, PreparationSummary } from '../domain/preparation';

const STORAGE_KEY = 'staffpath-state';

export function readPreparationSummary(): PreparationSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const state: LegacyPreparationState = raw ? JSON.parse(raw) : {};
    return {
      name: state.name || '',
      sessions: state.completed?.length || 0,
      communicationReps: state.communication?.length || 0,
      artifacts: (state.journal || []).filter((entry) => entry.artifact).length,
      practiceAttempts: state.practiceAttempts?.length || 0,
      focusHours: Math.round((Object.values(state.elapsed || {}).reduce((sum, value) => sum + value, 0) / 3600) * 10) / 10,
    };
  } catch {
    return { name: '', sessions: 0, communicationReps: 0, artifacts: 0, practiceAttempts: 0, focusHours: 0 };
  }
}
