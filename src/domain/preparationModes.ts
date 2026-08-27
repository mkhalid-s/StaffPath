export type PreparationMode = 'intensive' | 'moderate' | 'casual' | 'custom';

export interface CustomModeConfig {
  totalDays: number;
  dailyMinutes: number;
}

export interface PreparationModeConfig {
  id: PreparationMode;
  label: string;
  description: string;
  totalDays: number;
  dailyMinutes: number;
  focusSeconds: number;
  sessionsPerWeek: string;
}

export const PREPARATION_MODES: Record<Exclude<PreparationMode, 'custom'>, PreparationModeConfig> = {
  intensive: {
    id: 'intensive',
    label: 'Intensive',
    description: 'Full-time preparation with daily deep focus.',
    totalDays: 90,
    dailyMinutes: 60,
    focusSeconds: 3600,
    sessionsPerWeek: '7 sessions',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate',
    description: 'Balanced pace alongside your current role.',
    totalDays: 120,
    dailyMinutes: 45,
    focusSeconds: 2700,
    sessionsPerWeek: '5–6 sessions',
  },
  casual: {
    id: 'casual',
    label: 'Casual',
    description: 'Steady progress with lighter daily commitment.',
    totalDays: 180,
    dailyMinutes: 30,
    focusSeconds: 1800,
    sessionsPerWeek: '3–4 sessions',
  },
};

export const ROADMAP_TOTAL_SESSIONS = 90;

export function resolveModeConfig(
  mode: PreparationMode,
  custom?: CustomModeConfig,
): PreparationModeConfig {
  if (mode === 'custom' && custom) {
    const dailyMinutes = Math.max(15, Math.min(120, custom.dailyMinutes));
    const totalDays = Math.max(60, Math.min(365, custom.totalDays));
    return {
      id: 'custom',
      label: 'Custom',
      description: `${dailyMinutes} minutes daily over ${totalDays} days.`,
      totalDays,
      dailyMinutes,
      focusSeconds: dailyMinutes * 60,
      sessionsPerWeek: `${Math.round((ROADMAP_TOTAL_SESSIONS / totalDays) * 7)} sessions`,
    };
  }
  return PREPARATION_MODES[mode === 'custom' ? 'moderate' : mode];
}
