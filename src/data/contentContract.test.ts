import { describe, expect, it } from 'vitest';
import { communicationLessons } from './communicationLessons';
import { curriculumModules } from './curriculum';
import { encyclopediaChapters } from './encyclopediaChapters';
import { interviewPrompts } from './interviewPrompts';
import { practiceCatalog } from './practiceCatalog';
import { learningResources } from './resources';
import { roadmapSessions } from './roadmap';

describe('complete preparation content contract', () => {
  it('retains the planned curriculum and practice breadth', () => {
    expect(roadmapSessions).toHaveLength(90);
    expect(curriculumModules).toHaveLength(12);
    expect(Object.values(practiceCatalog).flat()).toHaveLength(116);
    expect(communicationLessons).toHaveLength(19);
    expect(encyclopediaChapters).toHaveLength(65);
    expect(learningResources).toHaveLength(52);
    for (const prompts of Object.values(interviewPrompts)) expect(prompts.length).toBeGreaterThanOrEqual(6);
  });

  it('wires every curriculum module to real encyclopedia chapters and a roadmap week', () => {
    const ids = new Set(encyclopediaChapters.map((chapter) => chapter.id));
    for (const module of curriculumModules) {
      expect(module.chapterIds.length).toBeGreaterThan(0);
      expect(module.roadmapWeek).toBeGreaterThanOrEqual(1);
      expect(module.roadmapWeek).toBeLessThanOrEqual(12);
      expect(module.intent.length).toBeGreaterThan(40);
      for (const chapterId of module.chapterIds) {
        expect(ids.has(chapterId), `${module.title} → missing chapter ${chapterId}`).toBe(true);
      }
      if (module.resourceTitles?.length) {
        const titles = new Set(learningResources.map((resource) => resource.title));
        for (const title of module.resourceTitles) {
          expect(titles.has(title), `${module.title} → missing resource ${title}`).toBe(true);
        }
      }
    }
  });
});
