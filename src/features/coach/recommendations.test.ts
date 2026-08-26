import { describe, expect, it } from 'vitest';
import type { StaffPathState } from '../../domain/appState';
import { buildCoachActions, retrieveCoachMatches } from './recommendations';

const blank: StaffPathState = { version: 2, profile: { name: 'Test', startDate: '2026-01-01', onboardingComplete: true, preparationMode: 'moderate', skillAssessmentComplete: true, unlockAll: false, celebratedUnlocks: [] }, assessments: {}, completedChapters: [], mistakes: [], mockInterviews: [], roadmap: {}, practiceAttempts: [], practiceCursor: { design: 0, problem: 0, people: 0, sdlc: 0 }, communicationLessons: {}, journal: [], behavioralStories: [], diagrams: [] };

describe('preparation coach', () => {
  it('prioritizes due mistake retrieval above new work', () => {
    const state = { ...blank, mistakes: [{ id: 'm', prompt: 'retry', missed: 'idempotency', correction: 'dedupe', nextReview: '2026-01-01', reviewCount: 0, resolved: false }] };
    expect(buildCoachActions(state, new Date('2026-08-01'))[0].title).toContain('Review 1 due mistake');
  });
  it('retrieves curated guidance and scenarios', () => {
    const result = retrieveCoachMatches('duplicate payment processing');
    expect(result.chapters.some((chapter) => chapter.title.toLowerCase().includes('payment'))).toBe(true);
    expect(result.scenarios.some((scenario) => scenario.title.toLowerCase().includes('payment'))).toBe(true);
  });
});
