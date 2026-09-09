import { describe, expect, it } from 'vitest';
import { curriculumModules } from '../data/curriculum';
import { getResourcesByTitles } from './resources';

describe('resources helper', () => {
  it('resolves curriculum resource titles to library entries', () => {
    for (const module of curriculumModules) {
      if (!module.resourceTitles?.length) continue;
      const resources = getResourcesByTitles(module.resourceTitles);
      expect(resources.length, `${module.title} resources`).toBe(module.resourceTitles.length);
    }
  });
});
