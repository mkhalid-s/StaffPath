import { describe, expect, it } from 'vitest';
import { encyclopediaChapters } from '../data/encyclopediaChapters';
import { listUnresolvedRelatedTopics, resolveRelatedTopicRef } from './relatedTopics';

describe('relatedTopics', () => {
  it('resolves chapter ids directly', () => {
    const link = resolveRelatedTopicRef('load-balancing-rate-limits');
    expect(link?.id).toBe('load-balancing-rate-limits');
    expect(link?.href).toContain('load-balancing-rate-limits');
  });

  it('resolves legacy title strings to chapter links', () => {
    const link = resolveRelatedTopicRef('Capacity estimation');
    expect(link?.id).toBe('capacity-estimation');
  });

  it('resolves slug-style chapter id refs in related topics', () => {
    const slugRefs = encyclopediaChapters
      .flatMap((chapter) => chapter.relatedTopics)
      .filter((ref) => /^[a-z0-9-]+$/.test(ref));
    for (const ref of slugRefs) {
      expect(resolveRelatedTopicRef(ref)?.id).toBe(ref);
    }
  });

  it('reports unresolved legacy title refs for content cleanup', () => {
    const unresolved = listUnresolvedRelatedTopics();
    const slugUnresolved = unresolved.filter((item) => /^[a-z0-9-]+$/.test(item.ref));
    expect(slugUnresolved).toEqual([]);
  });

  it('covers every chapter related topic list', () => {
    expect(encyclopediaChapters.every((chapter) => chapter.relatedTopics.length > 0)).toBe(true);
  });
});
