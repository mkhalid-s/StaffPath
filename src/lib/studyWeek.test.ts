import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from './appStore';
import { buildStudyWeekPlan, isCurriculumWeekComplete, resolveStudyWeek } from './studyWeek';

describe('studyWeek', () => {
  beforeEach(() => appStore.reset());

  it('defaults to week 1 for new users', () => {
    expect(resolveStudyWeek(appStore.get())).toBe(1);
    expect(buildStudyWeekPlan(appStore.get())?.week).toBe(1);
  });

  it('uses persisted study week from profile', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, studyWeek: 4, onboardingComplete: true },
    }));
    expect(resolveStudyWeek(appStore.get())).toBe(4);
    expect(buildStudyWeekPlan(appStore.get())?.module.title).toMatch(/caching/i);
  });

  it('advances when a curriculum week is fully complete', () => {
    appStore.update((current) => ({
      ...current,
      profile: { ...current.profile, studyWeek: 1, onboardingComplete: true },
      completedChapters: [
        'requirements-quality-attributes',
        'capacity-estimation',
        'virtual-waiting-room',
      ],
      roadmap: {
        '15': { completedAt: '2026-01-01', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '16': { completedAt: '2026-01-02', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '17': { completedAt: '2026-01-03', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '18': { completedAt: '2026-01-04', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '19': { completedAt: '2026-01-05', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '20': { completedAt: '2026-01-06', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
        '21': { completedAt: '2026-01-07', focusedSeconds: 3600, communicationComplete: true, reflection: '', artifact: '' },
      },
    }));
    expect(isCurriculumWeekComplete(appStore.get(), 1)).toBe(true);
    expect(resolveStudyWeek(appStore.get())).toBe(2);
  });

  it('builds deep links for read, practice, and apply', () => {
    const plan = buildStudyWeekPlan(appStore.get());
    expect(plan?.nextChapterId).toBe('requirements-quality-attributes');
    expect(plan?.practiceLink).toBe('/practice?track=design');
    expect(plan?.roadmapLink).toContain('week=3');
  });
});
