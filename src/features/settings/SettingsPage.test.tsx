import { describe, expect, it } from 'vitest';
import { isStaffPathBackup } from './SettingsPage';

describe('backup validation', () => {
  it('rejects partial or unrelated JSON', () => {
    expect(isStaffPathBackup({ version: 2, roadmap: {} })).toBe(false);
    expect(isStaffPathBackup({ hello: 'world' })).toBe(false);
  });
  it('accepts the required v2 collections', () => {
    expect(isStaffPathBackup({
      version: 2,
      profile: { name: 'Test', startDate: '2026-01-01', onboardingComplete: true, preparationMode: 'moderate', skillAssessmentComplete: true },
      roadmap: {},
      mistakes: [],
      mockInterviews: [],
      practiceAttempts: [],
      journal: [],
      behavioralStories: [],
    })).toBe(true);
  });
});
