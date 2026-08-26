import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from './appStore';
import { buildQuickActions, getQuickActionBadgeCount, pickRandomPractice } from './quickActions';

describe('quickActions', () => {
  beforeEach(() => appStore.reset());

  it('includes start session and journal for unlocked user', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: true, skillAssessmentComplete: true },
      roadmap: {
        '1': { completedAt: '2026-01-01', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
        '2': { completedAt: '2026-01-02', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
      },
    }));
    const actions = buildQuickActions(appStore.get());
    expect(actions.some((a) => a.id === 'session')).toBe(true);
    expect(actions.some((a) => a.id === 'journal')).toBe(true);
    expect(actions.some((a) => a.id === 'random-practice')).toBe(true);
  });

  it('prioritizes due mistakes with badge', () => {
    const today = new Date('2026-08-26');
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, onboardingComplete: true },
      roadmap: Object.fromEntries(
        Array.from({ length: 7 }, (_, i) => [
          String(i + 1),
          { completedAt: '2026-01-01', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
        ]),
      ),
      mistakes: [{
        id: 'm1', prompt: 'retry', missed: 'idempotency', correction: 'dedupe',
        nextReview: '2026-08-25', reviewCount: 0, resolved: false,
      }],
    }));
    const actions = buildQuickActions(appStore.get(), today);
    expect(actions[0].id).toBe('mistakes');
    expect(actions[0].badge).toBe(1);
    expect(getQuickActionBadgeCount(appStore.get(), today)).toBe(1);
  });

  it('picks a random practice cursor position', () => {
    const cursor = pickRandomPractice(appStore.get());
    const total = cursor.design + cursor.problem + cursor.people + cursor.sdlc;
    expect(total).toBeGreaterThanOrEqual(0);
  });

  it('omits locked features for new users', () => {
    const actions = buildQuickActions(appStore.get());
    expect(actions.some((a) => a.id === 'journal')).toBe(false);
    expect(actions.some((a) => a.id === 'session')).toBe(true);
  });
});
