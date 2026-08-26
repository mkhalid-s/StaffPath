import type { CustomModeConfig, PreparationMode } from './preparationModes';

export interface UserProfile {
  name: string;
  startDate: string;
  onboardingComplete: boolean;
  preparationMode: PreparationMode;
  customMode?: CustomModeConfig;
  skillAssessmentComplete: boolean;
  unlockAll: boolean;
  celebratedUnlocks: string[];
}

export interface CompetencyAssessment { score: number; evidence: string; updatedAt: string }
export interface MistakeRecord { id: string; prompt: string; missed: string; correction: string; nextReview: string; reviewCount: number; resolved: boolean }
export interface MockInterviewRecord { id: string; type: 'system-design' | 'behavioral' | 'coding' | 'ai-design'; score: number; date: string; feedback: string; prompt?: string; durationMinutes?: number; criteria?: Record<string, number> }
export interface RoadmapSessionRecord {
  completedAt?: string;
  focusedSeconds: number;
  communicationComplete: boolean;
  reflection: string;
  artifact: string;
}
export type PracticeTrack = 'design' | 'problem' | 'people' | 'sdlc';
export interface PracticeAttemptRecord {
  id: string;
  challengeId: string;
  track: PracticeTrack;
  title: string;
  variation: string;
  response: string;
  reflection: string;
  score: number;
  maxScore: number;
  date: string;
}
export interface CommunicationLessonRecord { completedAt?: string; practiceNote: string; confidence: number }
export interface JournalEntryRecord { id: string; date: string; learning: string; application: string; artifact: string; quality: number; tags: string[] }
export interface BehavioralStoryRecord { id: string; title: string; situation: string; task: string; action: string; result: string; reflection: string; principles: string[]; updatedAt: string }
export interface DiagramArtifactRecord { id: string; title: string; source: string; version: number; updatedAt: string }
export interface StaffPathState {
  version: 2;
  profile: UserProfile;
  assessments: Record<string, CompetencyAssessment>;
  completedChapters: string[];
  mistakes: MistakeRecord[];
  mockInterviews: MockInterviewRecord[];
  roadmap: Record<string, RoadmapSessionRecord>;
  practiceAttempts: PracticeAttemptRecord[];
  practiceCursor: Record<PracticeTrack, number>;
  communicationLessons: Record<string, CommunicationLessonRecord>;
  journal: JournalEntryRecord[];
  behavioralStories: BehavioralStoryRecord[];
  diagrams: DiagramArtifactRecord[];
}
