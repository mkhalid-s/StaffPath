import { describe, expect, it } from 'vitest';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { searchChapters } from './search';

describe('searchChapters', () => {
  it('keeps every published chapter complete and uniquely addressable', () => {
    expect(encyclopediaChapters).toHaveLength(28);
    expect(new Set(encyclopediaChapters.map((chapter) => chapter.id)).size).toBe(encyclopediaChapters.length);
    for (const chapter of encyclopediaChapters) {
      expect(chapter.architectureDiagram).toContain('flowchart');
      expect(chapter.solutionApproach.length).toBeGreaterThanOrEqual(5);
      expect(chapter.tradeoffs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.failureScenarios.length).toBeGreaterThanOrEqual(3);
      expect(chapter.flashcards.length).toBeGreaterThanOrEqual(2);
      expect(chapter.oneMinuteAnswer.length).toBeGreaterThan(80);
    }
  });
  it('searches across failure scenarios and core concepts', () => {
    expect(searchChapters(encyclopediaChapters, 'duplicate event', 'All').map((chapter) => chapter.id)).toContain('idempotent-webhooks');
    expect(searchChapters(encyclopediaChapters, 'embedding', 'All').map((chapter) => chapter.id)).toContain('semantic-cache');
  });

  it('requires every query term and respects category', () => {
    const results = searchChapters(encyclopediaChapters, 'model fallback', 'AI');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((chapter) => chapter.category === 'AI')).toBe(true);
  });

  it('returns no results for an unrelated query', () => {
    expect(searchChapters(encyclopediaChapters, 'quantum submarine', 'All')).toEqual([]);
  });
});
