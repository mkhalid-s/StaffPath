import { describe, expect, it } from 'vitest';
import { buildHandbookMarkdown } from './HandbookPage';
import type { StaffPathState } from '../../domain/appState';

describe('handbook export', () => {
  it('exports progress and evidence as portable Markdown', () => {
    const state: StaffPathState = { version: 2, profile: { name: 'Test', startDate: '2026-01-01', onboardingComplete: true, preparationMode: 'moderate', skillAssessmentComplete: true }, assessments: {}, completedChapters: [], mistakes: [], mockInterviews: [], roadmap: { '1': { completedAt: '2026-01-01', focusedSeconds: 3600, communicationComplete: true, reflection: 'Staff means scope.', artifact: 'brief.md' } }, practiceAttempts: [{ id: 'a', challengeId: 'design-1', track: 'design', title: 'URL shortener', variation: 'global', response: 'Use regional redirects.', reflection: 'Estimate first.', score: 5, maxScore: 6, date: '2026-01-01' }], practiceCursor: { design: 0, problem: 0, people: 0, sdlc: 0 }, communicationLessons: {}, journal: [], behavioralStories: [], diagrams: [] };
    const markdown = buildHandbookMarkdown(state);
    expect(markdown).toContain('Roadmap sessions: 1/90');
    expect(markdown).toContain('### URL shortener');
    expect(markdown).toContain('Estimate first.');
  });
});
