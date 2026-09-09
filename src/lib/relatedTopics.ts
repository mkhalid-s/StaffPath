import { encyclopediaChapters } from '../data/encyclopediaChapters';

const chapterById = new Map(encyclopediaChapters.map((chapter) => [chapter.id, chapter]));

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const titleToId = new Map<string, string>();
const slugToId = new Map<string, string>();

for (const chapter of encyclopediaChapters) {
  titleToId.set(chapter.title.toLowerCase(), chapter.id);
  slugToId.set(slugify(chapter.title), chapter.id);
  slugToId.set(chapter.id, chapter.id);
}

export interface RelatedTopicLink {
  id: string;
  title: string;
  href: string;
}

/** Resolve a related-topic ref (chapter id or legacy title) to a chapter link. */
export function resolveRelatedTopicRef(ref: string): RelatedTopicLink | null {
  const trimmed = ref.trim();
  if (!trimmed) return null;

  const byId = chapterById.get(trimmed);
  if (byId) {
    return { id: byId.id, title: byId.title, href: `/encyclopedia?chapter=${encodeURIComponent(byId.id)}` };
  }

  const byTitle = titleToId.get(trimmed.toLowerCase());
  if (byTitle) {
    const chapter = chapterById.get(byTitle)!;
    return { id: chapter.id, title: chapter.title, href: `/encyclopedia?chapter=${encodeURIComponent(chapter.id)}` };
  }

  const bySlug = slugToId.get(slugify(trimmed));
  if (bySlug) {
    const chapter = chapterById.get(bySlug)!;
    return { id: chapter.id, title: chapter.title, href: `/encyclopedia?chapter=${encodeURIComponent(chapter.id)}` };
  }

  const partial = encyclopediaChapters.find((chapter) => {
    const haystack = `${chapter.title} ${chapter.id}`.toLowerCase();
    const needle = trimmed.toLowerCase();
    return haystack.includes(needle) || needle.includes(chapter.title.toLowerCase());
  });
  if (partial) {
    return { id: partial.id, title: partial.title, href: `/encyclopedia?chapter=${encodeURIComponent(partial.id)}` };
  }

  return null;
}

export function resolveRelatedTopics(refs: string[]): RelatedTopicLink[] {
  const seen = new Set<string>();
  const links: RelatedTopicLink[] = [];
  for (const ref of refs) {
    const resolved = resolveRelatedTopicRef(ref);
    if (!resolved || seen.has(resolved.id)) continue;
    seen.add(resolved.id);
    links.push(resolved);
  }
  return links;
}

export function listUnresolvedRelatedTopics(): { chapterId: string; ref: string }[] {
  const unresolved: { chapterId: string; ref: string }[] = [];
  for (const chapter of encyclopediaChapters) {
    for (const ref of chapter.relatedTopics) {
      if (!resolveRelatedTopicRef(ref)) {
        unresolved.push({ chapterId: chapter.id, ref });
      }
    }
  }
  return unresolved;
}
