export type ChapterCategory = 'Systems' | 'Data' | 'Reliability' | 'AI' | 'Architecture' | 'Leadership';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface EncyclopediaChapter {
  id: string;
  title: string;
  category: ChapterCategory;
  summary: string;
  problemStatement: string;
  interviewQuestion: string;
  coreConcepts: string[];
  architectureDiagram: string;
  solutionApproach: string[];
  designPatterns: string[];
  tradeoffs: string[];
  failureScenarios: string[];
  productionConsiderations: string[];
  staffDiscussion: string[];
  relatedTopics: string[];
  realWorldSystems: string[];
  followUpQuestions: string[];
  cheatSheet: string[];
  flashcards: Flashcard[];
  oneMinuteAnswer: string;
}
