import type { StaffPathState } from '../domain/appState';

export type FeatureId =
  | 'dashboard'
  | 'roadmap'
  | 'coach'
  | 'curriculum'
  | 'practice'
  | 'encyclopedia'
  | 'flashcards'
  | 'resources'
  | 'lifecycle'
  | 'interviews'
  | 'skills'
  | 'communication'
  | 'handbook'
  | 'journal'
  | 'settings';

export interface FeatureDefinition {
  id: FeatureId;
  path: string;
  label: string;
  icon: string;
  requirement: string;
  isUnlocked: (state: StaffPathState) => boolean;
  progress: (state: StaffPathState) => { current: number; target: number };
}

const sessions = (state: StaffPathState) =>
  Object.values(state.roadmap).filter((record) => record.completedAt).length;

export const FEATURES: FeatureDefinition[] = [
  {
    id: 'dashboard',
    path: '/',
    label: 'Today',
    icon: '◎',
    requirement: 'Available from the start',
    isUnlocked: () => true,
    progress: () => ({ current: 1, target: 1 }),
  },
  {
    id: 'roadmap',
    path: '/roadmap',
    label: 'Roadmap',
    icon: '📍',
    requirement: 'Available from the start',
    isUnlocked: () => true,
    progress: () => ({ current: 1, target: 1 }),
  },
  {
    id: 'coach',
    path: '/coach',
    label: 'Coach',
    icon: '✦',
    requirement: 'Complete onboarding',
    isUnlocked: (state) => state.profile.onboardingComplete,
    progress: (state) => ({ current: state.profile.onboardingComplete ? 1 : 0, target: 1 }),
  },
  {
    id: 'curriculum',
    path: '/curriculum',
    label: 'Curriculum',
    icon: '📚',
    requirement: 'Complete 1 roadmap session',
    isUnlocked: (state) => sessions(state) >= 1,
    progress: (state) => ({ current: Math.min(sessions(state), 1), target: 1 }),
  },
  {
    id: 'practice',
    path: '/practice',
    label: 'Practice Lab',
    icon: '⚡',
    requirement: 'Complete 2 roadmap sessions',
    isUnlocked: (state) => sessions(state) >= 2,
    progress: (state) => ({ current: Math.min(sessions(state), 2), target: 2 }),
  },
  {
    id: 'encyclopedia',
    path: '/encyclopedia',
    label: 'Encyclopedia',
    icon: '⌕',
    requirement: 'Complete onboarding',
    isUnlocked: (state) => state.profile.onboardingComplete,
    progress: (state) => ({ current: state.profile.onboardingComplete ? 1 : 0, target: 1 }),
  },
  {
    id: 'flashcards',
    path: '/flashcards',
    label: 'Flashcards',
    icon: '🃏',
    requirement: 'Complete onboarding',
    isUnlocked: (state) => state.profile.onboardingComplete,
    progress: (state) => ({ current: state.profile.onboardingComplete ? 1 : 0, target: 1 }),
  },
  {
    id: 'resources',
    path: '/resources',
    label: 'Resources',
    icon: '🔗',
    requirement: 'Complete 5 roadmap sessions',
    isUnlocked: (state) => sessions(state) >= 5,
    progress: (state) => ({ current: Math.min(sessions(state), 5), target: 5 }),
  },
  {
    id: 'lifecycle',
    path: '/lifecycle',
    label: 'Lifecycle',
    icon: '📈',
    requirement: 'Complete onboarding',
    isUnlocked: (state) => state.profile.onboardingComplete,
    progress: (state) => ({ current: state.profile.onboardingComplete ? 1 : 0, target: 1 }),
  },
  {
    id: 'interviews',
    path: '/interviews',
    label: 'Interview Studio',
    icon: '🎤',
    requirement: 'Complete 7 roadmap sessions',
    isUnlocked: (state) => sessions(state) >= 7,
    progress: (state) => ({ current: Math.min(sessions(state), 7), target: 7 }),
  },
  {
    id: 'skills',
    path: '/skills',
    label: 'Skills',
    icon: '🧠',
    requirement: 'Complete skill assessment',
    isUnlocked: (state) => state.profile.skillAssessmentComplete,
    progress: (state) => ({ current: state.profile.skillAssessmentComplete ? 1 : 0, target: 1 }),
  },
  {
    id: 'communication',
    path: '/communication',
    label: 'Communication',
    icon: '💬',
    requirement: 'Complete 3 roadmap sessions',
    isUnlocked: (state) => sessions(state) >= 3,
    progress: (state) => ({ current: Math.min(sessions(state), 3), target: 3 }),
  },
  {
    id: 'handbook',
    path: '/handbook',
    label: 'Handbook',
    icon: '📓',
    requirement: 'Complete 1 practice attempt',
    isUnlocked: (state) => state.practiceAttempts.length >= 1,
    progress: (state) => ({ current: Math.min(state.practiceAttempts.length, 1), target: 1 }),
  },
  {
    id: 'journal',
    path: '/journal',
    label: 'Journal',
    icon: '✍️',
    requirement: 'Complete 2 roadmap sessions',
    isUnlocked: (state) => sessions(state) >= 2,
    progress: (state) => ({ current: Math.min(sessions(state), 2), target: 2 }),
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Data & backup',
    icon: '⚙',
    requirement: 'Always available',
    isUnlocked: () => true,
    progress: () => ({ current: 1, target: 1 }),
  },
];

export const FEATURE_BY_PATH = Object.fromEntries(FEATURES.map((feature) => [feature.path, feature])) as Record<string, FeatureDefinition>;

export function isFeatureUnlocked(state: StaffPathState, featureId: FeatureId): boolean {
  if (state.profile.unlockAll) return true;
  const feature = FEATURES.find((item) => item.id === featureId);
  return feature ? feature.isUnlocked(state) : true;
}

export function isPathUnlocked(state: StaffPathState, path: string): boolean {
  if (state.profile.unlockAll) return true;
  const feature = FEATURE_BY_PATH[path];
  return feature ? feature.isUnlocked(state) : true;
}

export function getUnlockProgress(state: StaffPathState, featureId: FeatureId): { current: number; target: number; percent: number } {
  const feature = FEATURES.find((item) => item.id === featureId);
  if (!feature) return { current: 1, target: 1, percent: 100 };
  const { current, target } = feature.progress(state);
  return { current, target, percent: Math.round((current / target) * 100) };
}

export function getNextUnlock(state: StaffPathState): FeatureDefinition | null {
  if (state.profile.unlockAll) return null;
  return FEATURES.find((feature) => !feature.isUnlocked(state) && feature.id !== 'settings') || null;
}

export function getUnlockedFeatures(state: StaffPathState): FeatureId[] {
  return FEATURES.filter((feature) => isFeatureUnlocked(state, feature.id)).map((feature) => feature.id);
}

export function detectNewUnlocks(state: StaffPathState): FeatureDefinition[] {
  if (state.profile.unlockAll) return [];
  const celebrated = new Set(state.profile.celebratedUnlocks);
  return FEATURES.filter((feature) => feature.isUnlocked(state) && !celebrated.has(feature.id) && feature.id !== 'dashboard' && feature.id !== 'roadmap' && feature.id !== 'settings');
}

export const NAVIGATION = FEATURES.map((feature) => [feature.path, feature.label, feature.icon] as const);
