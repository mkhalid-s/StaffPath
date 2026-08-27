import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from './appStore';
import {
  detectNewUnlocks,
  getNextUnlock,
  getUnlockProgress,
  isFeatureUnlocked,
  isPathUnlocked,
} from './featureUnlocks';

describe('featureUnlocks', () => {
  beforeEach(() => appStore.reset());

  it('unlocks dashboard and roadmap from the start', () => {
    const state = appStore.get();
    expect(isFeatureUnlocked(state, 'dashboard')).toBe(true);
    expect(isFeatureUnlocked(state, 'roadmap')).toBe(true);
    expect(isFeatureUnlocked(state, 'practice')).toBe(false);
  });

  it('unlocks practice after 2 sessions', () => {
    appStore.update((current) => ({
      ...current,
      roadmap: {
        '1': { completedAt: '2026-01-01', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
        '2': { completedAt: '2026-01-02', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
      },
    }));
    expect(isFeatureUnlocked(appStore.get(), 'practice')).toBe(true);
    expect(isPathUnlocked(appStore.get(), '/practice')).toBe(true);
  });

  it('reports progress toward next unlock', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: true, skillAssessmentComplete: true },
      roadmap: {
        '1': { completedAt: '2026-01-01', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
      },
    }));
    const progress = getUnlockProgress(appStore.get(), 'practice');
    expect(progress).toEqual({ current: 1, target: 2, percent: 50 });
    expect(getNextUnlock(appStore.get())?.id).toBe('practice');
  });

  it('detects newly unlocked features not yet celebrated', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: true, celebratedUnlocks: [] },
    }));
    const newly = detectNewUnlocks(appStore.get());
    expect(newly.some((feature) => feature.id === 'coach')).toBe(true);
  });

  it('unlockAll bypasses all locks', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, unlockAll: true },
    }));
    expect(isFeatureUnlocked(appStore.get(), 'interviews')).toBe(true);
    expect(getNextUnlock(appStore.get())).toBeNull();
  });
});
