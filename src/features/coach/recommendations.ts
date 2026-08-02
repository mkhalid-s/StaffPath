import { practiceCatalog, type PracticeTrack } from '../../data/practiceCatalog';
import { roadmapSessions } from '../../data/roadmap';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import type { StaffPathState } from '../../domain/appState';
import { searchChapters } from '../encyclopedia/search';

export interface CoachAction { title: string; reason: string; to: string; priority: number }

export function buildCoachActions(state: StaffPathState, today = new Date()): CoachAction[] {
  const day = today.toISOString().slice(0, 10);
  const due = state.mistakes.filter((item) => !item.resolved && item.nextReview <= day).length;
  const next = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt);
  const tracks: PracticeTrack[] = ['design', 'problem', 'people', 'sdlc'];
  const practiceCounts = Object.fromEntries(tracks.map((track) => [track, state.practiceAttempts.filter((attempt) => attempt.track === track).length])) as Record<PracticeTrack, number>;
  const weakestTrack = tracks.reduce((weakest, track) => practiceCounts[track] < practiceCounts[weakest] ? track : weakest, tracks[0]);
  const missingEvidence = Object.values(state.assessments).filter((assessment) => !assessment.evidence.trim()).length;
  return [
    ...(due ? [{ title: `Review ${due} due mistake${due === 1 ? '' : 's'}`, reason: 'Retrieval on schedule is more valuable than collecting another topic.', to: '/interviews', priority: 100 }] : []),
    ...(next ? [{ title: `Complete Day ${next.id}: ${next.title}`, reason: `This advances the ${next.weekTitle} outcome and creates handbook evidence.`, to: '/roadmap', priority: 80 }] : []),
    { title: `Practice ${weakestTrack}: ${practiceCatalog[weakestTrack][state.practiceCursor[weakestTrack] % practiceCatalog[weakestTrack].length].title}`, reason: `Your ${weakestTrack} track has the fewest attempts (${practiceCounts[weakestTrack]}).`, to: '/practice', priority: 60 },
    ...(state.behavioralStories.length < 10 ? [{ title: 'Add one measured leadership story', reason: `${state.behavioralStories.length}/10 reusable stories captured; include scope, collaborators, result, and learning.`, to: '/handbook', priority: 50 }] : []),
    ...(missingEvidence ? [{ title: 'Strengthen competency evidence', reason: `${missingEvidence} assessed areas still lack written evidence.`, to: '/skills', priority: 40 }] : []),
  ].sort((a, b) => b.priority - a.priority).slice(0, 4);
}

export function retrieveCoachMatches(query: string) {
  const stopWords = new Set(['what', 'when', 'where', 'which', 'with', 'this', 'that', 'from', 'have', 'does', 'should', 'could', 'would', 'into', 'prevent']);
  const words = query.toLowerCase().split(/\W+/).filter((word) => word.length > 2 && !stopWords.has(word));
  const chapters = searchChapters(encyclopediaChapters, words.join(' '), 'All').slice(0, 3);
  const scenarios = Object.values(practiceCatalog).flat().map((item) => ({ item, score: words.filter((word) => `${item.title} ${item.prompt} ${item.coachingPrompts.join(' ')}`.toLowerCase().includes(word)).length })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map(({ item }) => item);
  return { chapters, scenarios };
}
