import { practiceCatalog, type PracticeTrack } from '../data/practiceCatalog';
import { roadmapSessions } from '../data/roadmap';
import type { StaffPathState } from '../domain/appState';
import { isPathUnlocked } from './featureUnlocks';
import { buildWhatsNextActions } from './intelligence';

export interface QuickAction {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  to: string;
  badge?: number;
  priority: number;
  randomPractice?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  roadmap: '□', practice: '△', mistake: '◉', assessment: '◇', communication: '◌', chapter: '⌕', journal: '≡',
};

export function pickRandomPractice(state: StaffPathState): StaffPathState['practiceCursor'] {
  const tracks: PracticeTrack[] = ['design', 'problem', 'people', 'sdlc'];
  const track = tracks[Math.floor(Math.random() * tracks.length)];
  const catalog = practiceCatalog[track];
  const index = Math.floor(Math.random() * catalog.length);
  return { ...state.practiceCursor, [track]: index };
}

export function buildQuickActions(state: StaffPathState, today = new Date()): QuickAction[] {
  const day = today.toISOString().slice(0, 10);
  const dueMistakes = state.mistakes.filter((m) => !m.resolved && m.nextReview <= day).length;
  const next = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt);
  const actions: QuickAction[] = [];

  if (dueMistakes > 0 && isPathUnlocked(state, '/interviews')) {
    actions.push({
      id: 'mistakes',
      title: 'Review due mistakes',
      subtitle: `${dueMistakes} due for spaced retrieval`,
      icon: '◉',
      to: '/interviews',
      badge: dueMistakes,
      priority: 100,
    });
  }

  if (next && isPathUnlocked(state, '/roadmap')) {
    actions.push({
      id: 'session',
      title: "Start today's session",
      subtitle: `Day ${next.id}: ${next.title}`,
      icon: '□',
      to: '/roadmap',
      priority: 90,
    });
  }

  if (isPathUnlocked(state, '/practice')) {
    actions.push({
      id: 'random-practice',
      title: 'Practice random scenario',
      subtitle: 'Surprise yourself with an unseen challenge',
      icon: '△',
      to: '/practice',
      randomPractice: true,
      priority: 70,
    });
  }

  if (isPathUnlocked(state, '/journal')) {
    actions.push({
      id: 'journal',
      title: 'Quick journal entry',
      subtitle: 'Capture a reflection in under two minutes',
      icon: '≡',
      to: '/journal',
      priority: 65,
    });
  }

  if (isPathUnlocked(state, '/communication')) {
    actions.push({
      id: 'communication',
      title: 'Communication rep',
      subtitle: 'Build daily speaking fluency',
      icon: '◌',
      to: '/communication',
      priority: 55,
    });
  }

  for (const intel of buildWhatsNextActions(state, today).slice(0, 2)) {
    if (actions.some((action) => action.to === intel.to && action.title === intel.title)) continue;
    actions.push({
      id: `intel-${intel.category}-${intel.title}`,
      title: intel.title,
      subtitle: intel.insight,
      icon: CATEGORY_ICONS[intel.category] ?? '✦',
      to: intel.to,
      priority: intel.priority - 5,
    });
  }

  return actions
    .sort((a, b) => b.priority - a.priority)
    .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index)
    .slice(0, 5);
}

export function getQuickActionBadgeCount(state: StaffPathState, today = new Date()): number {
  const day = today.toISOString().slice(0, 10);
  return state.mistakes.filter((m) => !m.resolved && m.nextReview <= day).length;
}
