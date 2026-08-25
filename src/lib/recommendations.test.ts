import { beforeEach, describe, expect, it } from 'vitest';
import { appStore } from '../lib/appStore';
import { buildPersonalizedRecommendations, findWeakestCompetencies, suggestedStartingWeek } from '../lib/recommendations';

describe('recommendations', () => {
  beforeEach(() => appStore.reset());

  it('identifies weakest competencies from assessment scores', () => {
    appStore.update((current) => ({
      ...current,
      assessments: {
        'technical-foundations': { score: 2, evidence: '', updatedAt: '' },
        'system-design': { score: 4, evidence: '', updatedAt: '' },
        'production': { score: 1.5, evidence: '', updatedAt: '' },
      },
    }));
    const weak = findWeakestCompetencies(appStore.get(), 2);
    expect(weak).toContain('production');
    expect(weak).toContain('technical-foundations');
  });

  it('generates personalized recommendations from gaps', () => {
    appStore.update((current) => ({
      ...current,
      assessments: {
        'communication': { score: 1, evidence: '', updatedAt: '' },
        'system-design': { score: 2, evidence: '', updatedAt: '' },
      },
    }));
    const recs = buildPersonalizedRecommendations(appStore.get());
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some((rec) => rec.type === 'practice' || rec.type === 'chapter')).toBe(true);
  });

  it('suggests earlier starting week for lower scores', () => {
    appStore.update((current) => ({
      ...current,
      assessments: Object.fromEntries(
        ['technical-foundations', 'system-design', 'production', 'business', 'execution', 'influence', 'communication', 'mentoring']
          .map((id) => [id, { score: 1.5, evidence: '', updatedAt: '' }]),
      ),
    }));
    expect(suggestedStartingWeek(appStore.get())).toBe(1);

    appStore.update((current) => ({
      ...current,
      assessments: Object.fromEntries(
        ['technical-foundations', 'system-design', 'production', 'business', 'execution', 'influence', 'communication', 'mentoring']
          .map((id) => [id, { score: 4, evidence: '', updatedAt: '' }]),
      ),
    }));
    expect(suggestedStartingWeek(appStore.get())).toBe(7);
  });
});
