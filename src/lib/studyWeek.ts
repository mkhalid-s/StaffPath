import { curriculumModules, type CurriculumModule } from '../data/curriculum';
import { encyclopediaChapters } from '../data/encyclopediaChapters';
import { roadmapSessions } from '../data/roadmap';
import type { StaffPathState } from '../domain/appState';

export function getCurriculumModule(week: number): CurriculumModule | undefined {
  return curriculumModules.find((module) => module.week === week);
}

export function weekRoadmapProgress(state: StaffPathState, roadmapWeek: number) {
  const sessions = roadmapSessions.filter((session) => session.week === roadmapWeek);
  const completed = sessions.filter((session) => state.roadmap[String(session.id)]?.completedAt).length;
  return { completed, total: sessions.length, sessions };
}

export function weekChapterProgress(state: StaffPathState, chapterIds: string[]) {
  const completed = chapterIds.filter((id) => state.completedChapters.includes(id)).length;
  return { completed, total: chapterIds.length };
}

export function isCurriculumWeekComplete(state: StaffPathState, week: number): boolean {
  const module = getCurriculumModule(week);
  if (!module) return false;
  const chapters = weekChapterProgress(state, module.chapterIds);
  const roadmap = weekRoadmapProgress(state, module.roadmapWeek);
  return chapters.completed === chapters.total && roadmap.total > 0 && roadmap.completed === roadmap.total;
}

/** Effective study week: stored cursor, auto-advanced when a week is fully complete. */
export function resolveStudyWeek(state: StaffPathState): number {
  const stored = state.profile.studyWeek ?? 1;
  let week = Math.min(Math.max(stored, 1), 12);
  while (week < 12 && isCurriculumWeekComplete(state, week)) {
    week += 1;
  }
  return week;
}

export interface StudyWeekPlan {
  week: number;
  module: CurriculumModule;
  chapters: { id: string; title: string; done: boolean }[];
  nextChapterId: string | null;
  practiceTrack: string;
  practiceLink: string;
  roadmapWeek: number;
  roadmapLink: string;
  roadmapProgress: { completed: number; total: number };
  chapterProgress: { completed: number; total: number };
  nextRoadmapSession: { id: number; title: string } | null;
}

export function buildStudyWeekPlan(state: StaffPathState): StudyWeekPlan | null {
  const week = resolveStudyWeek(state);
  const module = getCurriculumModule(week);
  if (!module) return null;

  const chapters = module.chapterIds.map((id) => {
    const chapter = encyclopediaChapters.find((item) => item.id === id);
    return { id, title: chapter?.title ?? id, done: state.completedChapters.includes(id) };
  });
  const nextChapter = chapters.find((chapter) => !chapter.done) ?? chapters[0] ?? null;
  const roadmapProg = weekRoadmapProgress(state, module.roadmapWeek);
  const nextSession = roadmapSessions.find(
    (session) => session.week === module.roadmapWeek && !state.roadmap[String(session.id)]?.completedAt,
  );

  return {
    week,
    module,
    chapters,
    nextChapterId: nextChapter?.id ?? null,
    practiceTrack: module.practiceTrack,
    practiceLink: `/practice?track=${module.practiceTrack}`,
    roadmapWeek: module.roadmapWeek,
    roadmapLink: `/roadmap?week=${module.roadmapWeek}`,
    roadmapProgress: { completed: roadmapProg.completed, total: roadmapProg.total },
    chapterProgress: weekChapterProgress(state, module.chapterIds),
    nextRoadmapSession: nextSession ? { id: nextSession.id, title: nextSession.title } : null,
  };
}
