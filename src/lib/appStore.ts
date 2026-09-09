import { useSyncExternalStore } from 'react';
import type { StaffPathState, UserProfile } from '../domain/appState';
import { FEATURES } from './featureUnlocks';
import { localDayKey } from './dates';

const KEY = 'staffpath-v2';
const listeners = new Set<() => void>();

function legacyName(): string {
  try {
    const value = JSON.parse(localStorage.getItem('staffpath-state') || 'null');
    return typeof value?.name === 'string' ? value.name.trim() : '';
  } catch { return ''; }
}

const defaultProfile = (): UserProfile => ({
  name: legacyName(),
  startDate: localDayKey(),
  onboardingComplete: Boolean(legacyName()),
  preparationMode: 'moderate',
  skillAssessmentComplete: false,
  unlockAll: false,
  celebratedUnlocks: [],
  selectedCompanyPack: 'none',
  studyWeek: 1,
  guidedHelpDismissed: false,
});

const blankState = (): StaffPathState => ({
  version: 2,
  profile: defaultProfile(),
  assessments: {},
  completedChapters: [],
  mistakes: [],
  mockInterviews: [],
  roadmap: {},
  practiceAttempts: [],
  practiceCursor: { design: 0, problem: 0, people: 0, sdlc: 0 },
  communicationLessons: {},
  journal: [],
  behavioralStories: [],
  diagrams: [],
});

const normalizeState = (value: Partial<StaffPathState>): StaffPathState => ({
  ...blankState(),
  ...value,
  version: 2,
  profile: { ...defaultProfile(), ...(value.profile || {}) },
  roadmap: value.roadmap || {},
  practiceCursor: { ...blankState().practiceCursor, ...(value.practiceCursor || {}) },
});
function seedCelebratedUnlocks(state: StaffPathState): StaffPathState {
  if (state.profile.celebratedUnlocks.length > 0) return state;
  const hasProgress = Object.values(state.roadmap).some((record) => record.completedAt)
    || state.practiceAttempts.length > 0
    || state.profile.onboardingComplete;
  if (!hasProgress) return state;
  const unlocked = FEATURES.filter((feature) => feature.isUnlocked(state)).map((feature) => feature.id);
  return { ...state, profile: { ...state.profile, celebratedUnlocks: unlocked } };
}
function legacyRoadmap(): StaffPathState['roadmap'] {
  try {
    const value = JSON.parse(localStorage.getItem('staffpath-state') || 'null');
    const completed = Array.isArray(value?.completed) ? value.completed : [];
    const communication = Array.isArray(value?.communication) ? value.communication : [];
    const elapsed = value?.elapsed && typeof value.elapsed === 'object' ? value.elapsed : {};
    return [...new Set([...completed, ...communication, ...Object.keys(elapsed).map(Number)])].reduce<StaffPathState['roadmap']>((records, rawId) => {
      const id = Number(rawId);
      if (!Number.isInteger(id) || id < 1 || id > 90) return records;
      records[String(id)] = {
        completedAt: completed.includes(id) ? new Date(0).toISOString() : undefined,
        focusedSeconds: Math.max(0, Number(elapsed[id] || 0)),
        communicationComplete: communication.includes(id),
        reflection: '', artifact: '',
      };
      return records;
    }, {});
  } catch { return {}; }
}
function legacyEvidence(): Pick<StaffPathState, 'practiceAttempts' | 'journal'> {
  try {
    const value = JSON.parse(localStorage.getItem('staffpath-state') || 'null');
    const tracks = new Set(['design', 'problem', 'people', 'sdlc']);
    const practiceAttempts = (Array.isArray(value?.practiceAttempts) ? value.practiceAttempts : []).filter((item: unknown) => item && typeof item === 'object').map((item: Record<string, unknown>, index: number) => ({
      id: `legacy-attempt-${String(item.id ?? index)}`,
      challengeId: `legacy-${index}`,
      track: tracks.has(String(item.type)) ? String(item.type) as 'design' | 'problem' | 'people' | 'sdlc' : 'problem' as const,
      title: String(item.title || 'Legacy practice attempt'), variation: String(item.variation || ''), response: String(item.response || ''), reflection: String(item.reflection || ''), score: Number(item.score || 0), maxScore: Number(item.maxScore || 6), date: String(item.date || new Date(0).toISOString()),
    }));
    const journal = (Array.isArray(value?.journal) ? value.journal : []).filter((item: unknown) => item && typeof item === 'object').map((item: Record<string, unknown>, index: number) => ({
      id: `legacy-journal-${index}`, date: String(item.date || new Date(0).toISOString()), learning: String(item.learning || ''), application: String(item.application || ''), artifact: String(item.artifact || ''), quality: Number(item.quality || 3), tags: [],
    }));
    return { practiceAttempts, journal };
  } catch { return { practiceAttempts: [], journal: [] }; }
}
function load(): StaffPathState {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || 'null');
    const evidence = legacyEvidence();
    let loaded: StaffPathState;
    if (value?.version === 2) {
      loaded = {
        ...blankState(),
        ...value,
        profile: { ...defaultProfile(), ...(value.profile || {}) },
        roadmap: value.roadmap || legacyRoadmap(),
        practiceAttempts: value.practiceAttempts?.length ? value.practiceAttempts : evidence.practiceAttempts,
        journal: value.journal?.length ? value.journal : evidence.journal,
        practiceCursor: { ...blankState().practiceCursor, ...(value.practiceCursor || {}) },
      };
    } else {
      loaded = { ...blankState(), roadmap: legacyRoadmap(), ...evidence };
    }
    return seedCelebratedUnlocks(loaded);
  } catch { return seedCelebratedUnlocks({ ...blankState(), roadmap: legacyRoadmap() }); }
}
let state = typeof localStorage === 'undefined' ? blankState() : load();
const emit = () => listeners.forEach((listener) => listener());
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Keep the in-memory session usable if browser storage is unavailable or full. */ } };
export const appStore = {
  get: () => state,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); },
  update: (updater: (current: StaffPathState) => StaffPathState) => { state = updater(state); persist(); emit(); },
  replace: (next: StaffPathState) => { state = normalizeState(next); persist(); emit(); },
  reset: () => { state = blankState(); persist(); emit(); },
};
export function useStaffPathState() { return useSyncExternalStore(appStore.subscribe, appStore.get, appStore.get); }
