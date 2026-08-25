import { describe, expect, it } from 'vitest';
import { resolveModeConfig, PREPARATION_MODES } from '../domain/preparationModes';
import { sessionsPerWeek } from '../data/roadmap';
import { buildSessionPlan } from '../features/roadmap/sessionPlan';
import { roadmapSessions } from '../data/roadmap';

describe('preparation modes', () => {
  it('resolves intensive mode with 60-minute focus', () => {
    const config = resolveModeConfig('intensive');
    expect(config.dailyMinutes).toBe(60);
    expect(config.focusSeconds).toBe(3600);
    expect(config.totalDays).toBe(90);
  });

  it('resolves custom mode with user settings', () => {
    const config = resolveModeConfig('custom', { totalDays: 150, dailyMinutes: 40 });
    expect(config.dailyMinutes).toBe(40);
    expect(config.focusSeconds).toBe(2400);
    expect(config.totalDays).toBe(150);
  });

  it('scales session plan blocks by daily minutes', () => {
    const session = roadmapSessions[0];
    const full = buildSessionPlan(session, 60);
    const half = buildSessionPlan(session, 30);
    expect(full.totalMinutes).toBe(60);
    expect(half.totalMinutes).toBe(30);
  });

  it('calculates sessions per week for stretched timelines', () => {
    expect(sessionsPerWeek(PREPARATION_MODES.intensive.totalDays)).toBe(7);
    expect(sessionsPerWeek(PREPARATION_MODES.casual.totalDays)).toBeLessThan(7);
  });
});
