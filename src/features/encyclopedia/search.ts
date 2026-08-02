import type { EncyclopediaChapter } from '../../domain/encyclopedia';

export function chapterSearchText(chapter: EncyclopediaChapter): string {
  return [
    chapter.title, chapter.category, chapter.summary, chapter.problemStatement, chapter.interviewQuestion,
    ...chapter.coreConcepts, ...chapter.solutionApproach, ...chapter.designPatterns, ...chapter.tradeoffs, ...chapter.failureScenarios,
    ...chapter.productionConsiderations, ...chapter.staffDiscussion, ...chapter.relatedTopics,
    ...chapter.realWorldSystems, ...chapter.followUpQuestions, ...chapter.cheatSheet,
  ].join(' ').toLocaleLowerCase();
}

export function searchChapters(chapters: EncyclopediaChapter[], query: string, category: string): EncyclopediaChapter[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return chapters
    .filter((chapter) => category === 'All' || chapter.category === category)
    .filter((chapter) => {
      const text = chapterSearchText(chapter);
      return terms.every((term) => text.includes(term));
    })
    .sort((a, b) => {
      if (!terms.length) return a.title.localeCompare(b.title);
      const aTitleHits = terms.filter((term) => a.title.toLocaleLowerCase().includes(term)).length;
      const bTitleHits = terms.filter((term) => b.title.toLocaleLowerCase().includes(term)).length;
      return bTitleHits - aTitleHits || a.title.localeCompare(b.title);
    });
}
