import { roadmapSessions } from '../data/roadmap';
import { practiceCatalog, type PracticeTrack } from '../data/practiceCatalog';
import { encyclopediaChapters } from '../data/encyclopediaChapters';
import type { StaffPathState } from '../domain/appState';
import { COMPETENCIES, findWeakestCompetencies } from './recommendations';

const COMPETENCY_CHAPTERS: Record<string, string[]> = {
  'technical-foundations': ['cap-pacelc-consistency', 'consensus-coordination', 'distributed-transactions', 'messaging-delivery-semantics', 'replication-protocols'],
  'system-design': ['requirements-quality-attributes', 'load-balancing-rate-limits', 'capacity-estimation', 'api-protocol-selection', 'consistent-hashing'],
  'production': ['slo-observability-incidents', 'resilience-patterns', 'cache-stampede', 'chaos-engineering', 'autoscaling-capacity'],
  'business': ['technical-strategy-decisions', 'cost-optimization-finops', 'dora-metrics-engineering', 'platform-engineering'],
  'execution': ['safe-delivery-migrations', 'technical-debt-management', 'progressive-delivery', 'cqrs-event-sourcing'],
  'influence': ['technical-strategy-decisions', 'influence-conflict-feedback', 'platform-engineering', 'staff-archetypes'],
  'communication': ['influence-conflict-feedback', 'api-protocol-selection', 'technical-strategy-decisions'],
  'mentoring': ['mentoring-leverage', 'staff-archetypes', 'influence-conflict-feedback'],
};

export interface IntelligentAction {
  title: string;
  reason: string;
  insight: string;
  to: string;
  priority: number;
  category: 'roadmap' | 'practice' | 'mistake' | 'assessment' | 'communication' | 'chapter' | 'journal';
}

export interface FocusArea {
  competencyId: string;
  title: string;
  score: number;
  reason: string;
}

export interface LearningPattern {
  streak: number;
  sessionsThisWeek: number;
  velocity: 'accelerating' | 'steady' | 'plateau' | 'inactive';
  timeByCategory: Record<string, number>;
  scheduleSuggestion: string;
}

export interface Milestone {
  id: string;
  label: string;
  achieved: boolean;
  progress: number;
  target: number;
}

export interface ActivityDay {
  date: string;
  sessions: number;
  practice: number;
  journal: number;
  total: number;
}

const TRACK_TO_COMPETENCY: Record<PracticeTrack, string> = {
  design: 'system-design',
  problem: 'technical-foundations',
  people: 'influence',
  sdlc: 'execution',
};

function completedSessions(state: StaffPathState) {
  return Object.values(state.roadmap).filter((record) => record.completedAt);
}

function daysAgo(iso: string, today: Date): number {
  const then = new Date(iso.slice(0, 10));
  return Math.floor((today.getTime() - then.getTime()) / 86_400_000);
}

export function computeStreak(state: StaffPathState, today = new Date()): number {
  const dates = new Set<string>();
  for (const record of completedSessions(state)) {
    if (record.completedAt) dates.add(record.completedAt.slice(0, 10));
  }
  for (const entry of state.journal) dates.add(entry.date.slice(0, 10));
  if (!dates.size) return 0;

  let streak = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function analyzeLearningPatterns(state: StaffPathState, today = new Date()): LearningPattern {
  const sessions = completedSessions(state);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeek = sessions.filter((r) => r.completedAt && new Date(r.completedAt) >= weekAgo).length;
  const lastWeek = sessions.filter((r) => {
    if (!r.completedAt) return false;
    const d = new Date(r.completedAt);
    return d >= twoWeeksAgo && d < weekAgo;
  }).length;

  let velocity: LearningPattern['velocity'] = 'inactive';
  if (thisWeek === 0 && lastWeek === 0) velocity = 'inactive';
  else if (thisWeek > lastWeek) velocity = 'accelerating';
  else if (thisWeek === lastWeek && thisWeek > 0) velocity = 'steady';
  else if (thisWeek < lastWeek) velocity = 'plateau';

  const timeByCategory: Record<string, number> = { technical: 0, leadership: 0, communication: 0 };
  for (const [id, record] of Object.entries(state.roadmap)) {
    if (!record.completedAt) continue;
    const session = roadmapSessions.find((s) => String(s.id) === id);
    if (session) timeByCategory[session.category] = (timeByCategory[session.category] || 0) + (record.focusedSeconds / 60);
  }

  const suggestions: Record<LearningPattern['velocity'], string> = {
    accelerating: 'Strong momentum — maintain your current pace and protect focus time.',
    steady: 'Consistent progress — consider adding one practice scenario this week.',
    plateau: 'Activity dipped this week — shorten sessions rather than skipping them.',
    inactive: 'Start with a single 20-minute session today to rebuild the habit.',
  };

  return {
    streak: computeStreak(state, today),
    sessionsThisWeek: thisWeek,
    velocity,
    timeByCategory,
    scheduleSuggestion: suggestions[velocity],
  };
}

export function identifyFocusAreas(state: StaffPathState, limit = 3): FocusArea[] {
  const weak = findWeakestCompetencies(state, limit);
  const mistakeTopics = state.mistakes.filter((m) => !m.resolved).map((m) => m.missed.toLowerCase());

  return weak.map((competencyId) => {
    const comp = COMPETENCIES.find((c) => c.id === competencyId);
    const score = state.assessments[competencyId]?.score ?? 1;
    const practiceCount = state.practiceAttempts.filter(
      (a) => TRACK_TO_COMPETENCY[a.track] === competencyId,
    ).length;
    const relatedMistakes = mistakeTopics.filter((topic) =>
      comp?.title.toLowerCase().includes(topic) || topic.includes(competencyId.replace('-', ' ')),
    ).length;

    let reason = `Self-assessment score is ${score}/5.`;
    if (practiceCount === 0) reason += ' No practice attempts yet in this area.';
    else if (practiceCount < 2) reason += ` Only ${practiceCount} practice attempt${practiceCount === 1 ? '' : 's'}.`;
    if (relatedMistakes > 0) reason += ` ${relatedMistakes} related mistake${relatedMistakes === 1 ? '' : 's'} flagged.`;

    return { competencyId, title: comp?.title ?? competencyId, score, reason };
  });
}

export function buildWhatsNextActions(state: StaffPathState, today = new Date()): IntelligentAction[] {
  const day = today.toISOString().slice(0, 10);
  const actions: IntelligentAction[] = [];
  const patterns = analyzeLearningPatterns(state, today);
  const focusAreas = identifyFocusAreas(state, 2);

  const dueMistakes = state.mistakes.filter((m) => !m.resolved && m.nextReview <= day);
  if (dueMistakes.length) {
    const topics = [...new Set(dueMistakes.map((m) => m.missed))].slice(0, 2).join(', ');
    actions.push({
      title: `Review ${dueMistakes.length} due mistake${dueMistakes.length === 1 ? '' : 's'}`,
      reason: 'Spaced retrieval on schedule beats collecting new topics.',
      insight: `Topics due: ${topics}`,
      to: '/interviews',
      priority: 100,
      category: 'mistake',
    });
  }

  const next = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt);
  if (next) {
    const gapMatch = focusAreas.find((area) =>
      next.tags.some((tag) => area.title.toLowerCase().includes(tag.toLowerCase())),
    );
    actions.push({
      title: `Day ${next.id}: ${next.title}`,
      reason: `Advances Week ${next.week} — ${next.outcome}.`,
      insight: gapMatch
        ? `Aligns with your ${gapMatch.title.toLowerCase()} gap.`
        : `${patterns.sessionsThisWeek} session${patterns.sessionsThisWeek === 1 ? '' : 's'} this week.`,
      to: '/roadmap',
      priority: 85,
      category: 'roadmap',
    });
  }

  for (const area of focusAreas) {
    const tracks = Object.entries(TRACK_TO_COMPETENCY).filter(([, comp]) => comp === area.competencyId).map(([track]) => track as PracticeTrack);
    if (!tracks.length) continue;
    const track = tracks[0];
    const scenario = practiceCatalog[track][state.practiceCursor[track] % practiceCatalog[track].length];
    actions.push({
      title: `Practice: ${scenario.title}`,
      reason: area.reason,
      insight: `Targets your weakest area: ${area.title}.`,
      to: '/practice',
      priority: 70 - area.score * 5,
      category: 'practice',
    });
  }

  const staleEvidence = COMPETENCIES.filter((comp) => {
    const assessment = state.assessments[comp.id];
    return assessment && !assessment.evidence.trim();
  });
  if (staleEvidence.length) {
    actions.push({
      title: `Add evidence: ${staleEvidence[0].title}`,
      reason: `${staleEvidence.length} assessed area${staleEvidence.length === 1 ? '' : 's'} lack written evidence.`,
      insight: 'Readiness gates require demonstrated proof, not slider scores alone.',
      to: '/skills',
      priority: 55,
      category: 'assessment',
    });
  }

  const recentPractice = state.practiceAttempts.filter((a) => daysAgo(a.date, today) <= 3);
  const lowScoreAttempts = recentPractice.filter((a) => a.score / a.maxScore < 0.6);
  if (lowScoreAttempts.length) {
    actions.push({
      title: 'Revisit recent practice reflection',
      reason: `${lowScoreAttempts.length} recent attempt${lowScoreAttempts.length === 1 ? '' : 's'} scored below 60%.`,
      insight: 'Low scores often signal a gap in structure, not knowledge.',
      to: '/journal',
      priority: 50,
      category: 'journal',
    });
  }

  if (patterns.velocity === 'plateau' || patterns.velocity === 'inactive') {
    actions.push({
      title: 'Complete a communication rep',
      reason: patterns.scheduleSuggestion,
      insight: `Current streak: ${patterns.streak} day${patterns.streak === 1 ? '' : 's'}.`,
      to: '/communication',
      priority: 45,
      category: 'communication',
    });
  }

  // Chapter recommendation — weakest competency, excluding completed chapters
  for (const area of focusAreas) {
    const chapterIds = COMPETENCY_CHAPTERS[area.competencyId] ?? [];
    const chapter = encyclopediaChapters.find(
      (c) => chapterIds.includes(c.id) && !state.completedChapters.includes(c.id)
    );
    if (chapter) {
      actions.push({
        title: `Study: ${chapter.title}`,
        reason: area.reason,
        insight: `Closes your ${area.title.toLowerCase()} gap — ${chapter.coreConcepts.slice(0, 2).join(', ')}.`,
        to: '/encyclopedia',
        priority: 62,
        category: 'chapter',
      });
      break;
    }
  }

  return actions
    .sort((a, b) => b.priority - a.priority)
    .filter((item, index, list) => list.findIndex((other) => other.title === item.title) === index)
    .slice(0, 5);
}

const COMPETENCY_TO_TRACK: Record<string, PracticeTrack> = {
  'technical-foundations': 'problem',
  'system-design': 'design',
  'production': 'problem',
  'business': 'people',
  'execution': 'sdlc',
  'influence': 'people',
  'communication': 'people',
  'mentoring': 'people',
};

export interface StudyWeek {
  week: number;
  title: string;
  focusTitle: string;
  chapters: { id: string; title: string }[];
  scenario?: { id: string; title: string; track: PracticeTrack };
  tasks: string[];
}

export interface StudyPlan {
  weeks: StudyWeek[];
  generatedFor: string[];
}

function weekForCompetency(weekNum: number, state: StaffPathState, competencyId: string): StudyWeek {
  const comp = COMPETENCIES.find((c) => c.id === competencyId);
  const chapterIds = COMPETENCY_CHAPTERS[competencyId] ?? [];
  const chapters = encyclopediaChapters
    .filter((c) => chapterIds.includes(c.id) && !state.completedChapters.includes(c.id))
    .slice(0, 3)
    .map((c) => ({ id: c.id, title: c.title }));
  const track = COMPETENCY_TO_TRACK[competencyId] ?? 'design';
  const scenario = practiceCatalog[track][state.practiceCursor[track] % practiceCatalog[track].length];
  const focusTitle = comp?.title ?? competencyId;

  return {
    week: weekNum,
    title: `Week ${weekNum}: ${focusTitle}`,
    focusTitle,
    chapters,
    scenario: { id: scenario.id, title: scenario.title, track },
    tasks: [
      chapters.length
        ? `Read ${chapters.length} recommended chapter${chapters.length === 1 ? '' : 's'} on ${focusTitle.toLowerCase()}.`
        : `Review your existing notes on ${focusTitle.toLowerCase()}.`,
      `Complete practice scenario: ${scenario.title}.`,
      `Write one evidence entry for ${focusTitle.toLowerCase()} in Assessment.`,
    ],
  };
}

export function buildStudyPlan(state: StaffPathState): StudyPlan {
  const weakest = findWeakestCompetencies(state, 2);
  const first = weakest[0] ?? 'system-design';
  const second = weakest[1] ?? (first === 'technical-foundations' ? 'system-design' : 'technical-foundations');

  const week1 = weekForCompetency(1, state, first);
  const week2 = weekForCompetency(2, state, second);

  const openMistakes = state.mistakes.filter((m) => !m.resolved).slice(0, 3);
  const week3: StudyWeek = {
    week: 3,
    title: 'Week 3: Mock interview volume',
    focusTitle: 'Interview reps',
    chapters: [],
    tasks: [
      'Run 2 system-design mock interviews.',
      'Run 1 behavioral mock interview.',
      'Log every miss immediately in Mistakes for spaced review.',
    ],
  };

  const week4: StudyWeek = {
    week: 4,
    title: 'Week 4: Review and integrate',
    focusTitle: 'Consolidation',
    chapters: [],
    tasks: [
      openMistakes.length
        ? `Review your ${openMistakes.length} biggest open mistake${openMistakes.length === 1 ? '' : 's'}: ${openMistakes.map((m) => m.missed).join(', ')}.`
        : 'Review your three biggest recent mistakes.',
      'Run one full 45-minute system design interview end-to-end, unaided.',
      'Update evidence for every competency touched this month.',
    ],
  };

  return { weeks: [week1, week2, week3, week4], generatedFor: [first, second] };
}

export function computeMilestones(state: StaffPathState): Milestone[] {
  const sessions = completedSessions(state).length;
  const streak = computeStreak(state);
  const practice = state.practiceAttempts.length;
  const evidence = COMPETENCIES.filter((c) => state.assessments[c.id]?.evidence.trim()).length;

  return [
    { id: 'first-session', label: 'First session', achieved: sessions >= 1, progress: Math.min(sessions, 1), target: 1 },
    { id: 'week-one', label: 'Week one complete', achieved: sessions >= 7, progress: Math.min(sessions, 7), target: 7 },
    { id: 'streak-3', label: '3-day streak', achieved: streak >= 3, progress: Math.min(streak, 3), target: 3 },
    { id: 'streak-7', label: '7-day streak', achieved: streak >= 7, progress: Math.min(streak, 7), target: 7 },
    { id: 'practice-5', label: '5 practice attempts', achieved: practice >= 5, progress: Math.min(practice, 5), target: 5 },
    { id: 'evidence-4', label: 'Evidence in 4 areas', achieved: evidence >= 4, progress: Math.min(evidence, 4), target: 4 },
    { id: 'mock-3', label: '3 mock interviews', achieved: state.mockInterviews.length >= 3, progress: Math.min(state.mockInterviews.length, 3), target: 3 },
  ];
}

export function getActivityHeatmap(state: StaffPathState, days = 84, today = new Date()): ActivityDay[] {
  const map = new Map<string, ActivityDay>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { date: key, sessions: 0, practice: 0, journal: 0, total: 0 });
  }

  for (const record of completedSessions(state)) {
    if (!record.completedAt) continue;
    const key = record.completedAt.slice(0, 10);
    const entry = map.get(key);
    if (entry) { entry.sessions++; entry.total++; }
  }
  for (const attempt of state.practiceAttempts) {
    const key = attempt.date.slice(0, 10);
    const entry = map.get(key);
    if (entry) { entry.practice++; entry.total++; }
  }
  for (const entry of state.journal) {
    const key = entry.date.slice(0, 10);
    const day = map.get(key);
    if (day) { day.journal++; day.total++; }
  }

  return [...map.values()];
}

export function getCompetencyScores(state: StaffPathState): { id: string; label: string; score: number }[] {
  return COMPETENCIES.map((comp) => ({
    id: comp.id,
    label: comp.title.split(' ')[0],
    score: state.assessments[comp.id]?.score ?? 1,
  }));
}
