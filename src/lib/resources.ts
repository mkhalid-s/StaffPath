import { learningResources, type LearningResource } from '../data/resources';

const byTitle = new Map(learningResources.map((resource) => [resource.title, resource]));

export function getResourceByTitle(title: string): LearningResource | undefined {
  return byTitle.get(title);
}

export function getResourcesByTitles(titles: string[] | undefined): LearningResource[] {
  if (!titles?.length) return [];
  return titles.map((title) => byTitle.get(title)).filter((resource): resource is LearningResource => Boolean(resource));
}
