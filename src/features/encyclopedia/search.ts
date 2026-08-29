import type { EncyclopediaChapter } from '../../domain/encyclopedia';
import type { CompanyPack } from '../../data/companyPacks';

export function chapterSearchText(chapter: EncyclopediaChapter): string {
  return [
    chapter.title, chapter.category, chapter.summary, chapter.problemStatement, chapter.interviewQuestion,
    ...chapter.coreConcepts, ...chapter.solutionApproach, ...chapter.designPatterns, ...chapter.tradeoffs, ...chapter.failureScenarios,
    ...chapter.productionConsiderations, ...chapter.staffDiscussion, ...chapter.relatedTopics,
    ...chapter.realWorldSystems, ...chapter.followUpQuestions, ...chapter.cheatSheet,
  ].join(' ').toLocaleLowerCase();
}

export function searchChapters(
  chapters: EncyclopediaChapter[],
  query: string,
  category: string,
  activePack?: CompanyPack | null,
): EncyclopediaChapter[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const packAngles = activePack?.chapterAngles ?? {};

  return chapters
    .filter((chapter) => category === 'All' || chapter.category === category)
    .filter((chapter) => {
      const text = chapterSearchText(chapter);
      return terms.every((term) => text.includes(term));
    })
    .sort((a, b) => {
      // Pack-angle chapters surface first when a pack is active and no search query
      const aHasPack = activePack && a.id in packAngles ? 1 : 0;
      const bHasPack = activePack && b.id in packAngles ? 1 : 0;
      if (!terms.length) return bHasPack - aHasPack || a.title.localeCompare(b.title);

      const aTitleHits = terms.filter((term) => a.title.toLocaleLowerCase().includes(term)).length;
      const bTitleHits = terms.filter((term) => b.title.toLocaleLowerCase().includes(term)).length;
      // With a query: title hits win, then pack angle boost, then alpha
      return bTitleHits - aTitleHits || bHasPack - aHasPack || a.title.localeCompare(b.title);
    });
}
