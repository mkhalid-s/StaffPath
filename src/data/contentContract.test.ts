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
    expect(Object.values(practiceCatalog).flat()).toHaveLength(86);
    expect(communicationLessons).toHaveLength(14);
    expect(encyclopediaChapters).toHaveLength(43);
    expect(learningResources).toHaveLength(47);
    for (const prompts of Object.values(interviewPrompts)) expect(prompts.length).toBeGreaterThanOrEqual(6);
  });
});
