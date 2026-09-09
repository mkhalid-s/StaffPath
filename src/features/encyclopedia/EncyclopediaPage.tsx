import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { ChapterCategory, EncyclopediaChapter } from '../../domain/encyclopedia';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { ChapterDetail } from './ChapterDetail';
import { searchChapters } from './search';
import { getActivePack, getChapterPackAngle } from '../../data/companyPacks';
import { FOCUS_SEARCH_EVENT } from '../../lib/keyboardShortcuts';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { useLocationSearch } from '../../lib/router';

const categories: Array<'All' | ChapterCategory> = ['All', 'Systems', 'Data', 'Reliability', 'AI', 'Architecture', 'Leadership'];

export function EncyclopediaPage() {
  const state = useStaffPathState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<EncyclopediaChapter | null>(null);
  const deferredQuery = useDeferredValue(query);
  const searchInput = useRef<HTMLInputElement>(null);
  const pack = getActivePack(state.profile.selectedCompanyPack);
  const search = useLocationSearch();
  const results = useMemo(() => searchChapters(encyclopediaChapters, deferredQuery, category, pack), [deferredQuery, category, pack]);
  useEffect(() => {
    const focusSearch = () => searchInput.current?.focus();
    window.addEventListener(FOCUS_SEARCH_EVENT, focusSearch);
    return () => window.removeEventListener(FOCUS_SEARCH_EVENT, focusSearch);
  }, []);
  useEffect(() => {
    const chapterId = new URLSearchParams(search).get('chapter');
    if (!chapterId) return;
    const match = encyclopediaChapters.find((chapter) => chapter.id === chapterId);
    if (match) setSelected(match);
  }, [search]);

  return <div className="page encyclopedia-page">
    <div className="page-heading"><div><p className="eyebrow">ENGINEERING ENCYCLOPEDIA</p><h1>Search concepts. Connect judgment.</h1><p>Every chapter follows one interview-to-production structure.{pack && ` ${pack.label} overlay active — pack-angled chapters sort first.`}</p></div><div className="chapter-count"><strong>{state.completedChapters.length}/{encyclopediaChapters.length}</strong><span>chapters complete</span></div></div>
    <div className="search-panel">
      <label><span>⌕</span><input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search idempotency, hot keys, routing, failure scenarios…" aria-label="Search encyclopedia" /><kbd>⌘ K</kbd></label>
      <div className="category-filters">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </div>
    <div className="results-heading"><span>{results.length} chapter{results.length === 1 ? '' : 's'}</span>{query && <small>matching “{query}”</small>}</div>
    <div className="chapter-grid">{results.map((chapter) => {
      const packAngle = getChapterPackAngle(state.profile.selectedCompanyPack, chapter.id);
      const isComplete = state.completedChapters.includes(chapter.id);
      return <button className={`chapter-card ${packAngle ? 'has-pack-angle' : ''} ${isComplete ? 'completed' : ''}`} data-category={chapter.category} key={chapter.id} onClick={() => setSelected(chapter)}><div><span className="category-chip" data-cat={chapter.category}>{chapter.category}</span>{packAngle && <span className="pack-chip">{pack?.company}</span>}<span>{chapter.coreConcepts.length} concepts</span></div><h2>{chapter.title}</h2><p>{packAngle || chapter.summary}</p><ul>{chapter.coreConcepts.slice(0, 4).map((concept) => <li key={concept}>{concept}</li>)}</ul><strong>Open chapter →</strong></button>;
    })}{!results.length && <div className="empty-results"><strong>No chapters found</strong><p>Try a broader concept or another category.</p></div>}</div>
    {selected && <ChapterDetail chapter={selected} packAngle={getChapterPackAngle(state.profile.selectedCompanyPack, selected.id)} completed={state.completedChapters.includes(selected.id)} onToggleComplete={() => appStore.update((current) => ({ ...current, completedChapters: current.completedChapters.includes(selected.id) ? current.completedChapters.filter((id) => id !== selected.id) : [...current.completedChapters, selected.id] }))} onClose={() => setSelected(null)} />}
  </div>;
}
