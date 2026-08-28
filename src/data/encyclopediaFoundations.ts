import type { ChapterCategory, EncyclopediaChapter } from '../domain/encyclopedia';

interface ChapterSeed {
  id: string; title: string; category: ChapterCategory; summary: string; question: string;
  concepts: string[]; diagram: string; solution: string[]; patterns: string[]; tradeoffs: string[];
  failures: string[]; production: string[]; staff: string[]; related: string[]; systems: string[];
}

function expand(seed: ChapterSeed): EncyclopediaChapter {
  return {
    id: seed.id, title: seed.title, category: seed.category, summary: seed.summary,
    problemStatement: seed.summary,
    interviewQuestion: seed.question,
    coreConcepts: seed.concepts,
    architectureDiagram: seed.diagram,
    solutionApproach: seed.solution,
    designPatterns: seed.patterns,
    tradeoffs: seed.tradeoffs,
    failureScenarios: seed.failures,
    productionConsiderations: seed.production,
    staffDiscussion: seed.staff,
    relatedTopics: seed.related,
    realWorldSystems: seed.systems,
    followUpQuestions: [`How does ${seed.title.toLowerCase()} change at ten times scale?`, 'Which assumption is most dangerous?', 'How would you validate the decision in production?'],
    cheatSheet: [seed.solution[0], seed.tradeoffs[0], seed.production[0]],
    flashcards: [{ question: `What problem does ${seed.title.toLowerCase()} solve?`, answer: seed.summary }, { question: 'What distinguishes a Staff-level answer?', answer: seed.staff[0] }],
    oneMinuteAnswer: `${seed.solution.slice(0, 3).join('. ')}. I would make ${seed.tradeoffs[0].toLowerCase()} explicit, design for ${seed.failures[0].toLowerCase()}, and validate the result with ${seed.production[0].toLowerCase()}.`,
  };
}

export const foundationChapters: EncyclopediaChapter[] = [];
