import { describe, expect, it } from 'vitest';
import { buildDemoState } from './demoSeed';

describe('demoSeed', () => {
  it('returns a state with 42 roadmap sessions complete', () => {
    const state = buildDemoState();
    const completed = Object.values(state.roadmap).filter((r) => r.completedAt).length;
    expect(completed).toBe(42);
  });

  it('has at least 10 practice attempts', () => {
    const state = buildDemoState();
    expect(state.practiceAttempts.length).toBeGreaterThanOrEqual(10);
  });

  it('has at least 4 mock interviews', () => {
    const state = buildDemoState();
    expect(state.mockInterviews.length).toBeGreaterThanOrEqual(4);
  });

  it('has onboarding complete and Amazon pack selected', () => {
    const state = buildDemoState();
    expect(state.profile.onboardingComplete).toBe(true);
    expect(state.profile.selectedCompanyPack).toBe('amazon');
  });
});
