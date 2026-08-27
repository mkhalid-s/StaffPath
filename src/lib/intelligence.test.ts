import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from './appStore';
import {
  analyzeLearningPatterns,
  buildWhatsNextActions,
  computeMilestones,
  computeStreak,
  getActivityHeatmap,
  identifyFocusAreas,
} from './intelligence';

describe('intelligence', () => {
  beforeEach(() => appStore.reset());

  it('computes streak from consecutive active days', () => {
    const today = new Date('2026-08-26');
    appStore.update((current) => ({
      ...current,
      roadmap: {
        '1': { completedAt: '2026-08-26T10:00:00Z', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
        '2': { completedAt: '2026-08-25T10:00:00Z', focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' },
      },
    }));
    expect(computeStreak(appStore.get(), today)).toBe(2);
  });

  it('prioritizes due mistakes in whats-next actions', () => {
    const today = new Date('2026-08-26');
    appStore.update((current) => ({
      ...current,
      mistakes: [{
        id: 'm1', prompt: 'retry', missed: 'idempotency', correction: 'dedupe',
        nextReview: '2026-08-25', reviewCount: 0, resolved: false,
      }],
    }));
    const actions = buildWhatsNextActions(appStore.get(), today);
    expect(actions[0].category).toBe('mistake');
    expect(actions[0].title).toContain('due mistake');
  });

  it('identifies focus areas from assessment gaps', () => {
    appStore.update((current) => ({
      ...current,
      assessments: {
        'system-design': { score: 1.5, evidence: '', updatedAt: '' },
        'communication': { score: 4, evidence: 'good', updatedAt: '' },
      },
    }));
    const areas = identifyFocusAreas(appStore.get(), 2);
    expect(areas[0].competencyId).toBe('system-design');
    expect(areas[0].reason).toContain('1.5/5');
  });

  it('detects learning velocity patterns', () => {
    const today = new Date('2026-08-26');
    const patterns = analyzeLearningPatterns(appStore.get(), today);
    expect(patterns.velocity).toBe('inactive');
    expect(patterns.scheduleSuggestion).toContain('20-minute');
  });

  it('tracks milestones and activity heatmap', () => {
    appStore.update((current) => ({
      ...current,
      roadmap: {
        '1': { completedAt: '2026-08-26T10:00:00Z', focusedSeconds: 1800, communicationComplete: true, reflection: '', artifact: '' },
      },
      practiceAttempts: [{
        id: 'a1', challengeId: 'd1', track: 'design', title: 'Test', variation: '', response: '', reflection: '', score: 4, maxScore: 6, date: '2026-08-26T12:00:00Z',
      }],
    }));
    const milestones = computeMilestones(appStore.get());
    expect(milestones.find((m) => m.id === 'first-session')?.achieved).toBe(true);
    const heatmap = getActivityHeatmap(appStore.get(), 7, new Date('2026-08-26'));
    const today = heatmap.find((d) => d.date === '2026-08-26');
    expect(today?.total).toBe(2);
  });
});
