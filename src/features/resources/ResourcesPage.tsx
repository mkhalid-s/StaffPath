import { useMemo, useState } from 'react';
import { learningResources } from '../../data/resources';

function useReadResources() {
  const [read, setRead] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('staffpath-read-resources') || '[]')); }
    catch { return new Set(); }
  });
  const toggle = (url: string) => setRead((prev) => {
    const next = new Set(prev);
    next.has(url) ? next.delete(url) : next.add(url);
    try { localStorage.setItem('staffpath-read-resources', JSON.stringify([...next])); } catch {}
    return next;
  });
  return { read, toggle };
}

const ALL_TYPES = ['All', 'Book', 'Paper', 'Guide', 'Reference', 'Blog'] as const;
type TypeFilter = typeof ALL_TYPES[number];

export function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const { read, toggle } = useReadResources();
  const readCount = read.size;

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return learningResources.filter((item) => {
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesQuery = terms.every((term) =>
        `${item.title} ${item.provider} ${item.domain} ${item.purpose}`.toLowerCase().includes(term)
      );
      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: learningResources.length };
    for (const r of learningResources) map[r.type] = (map[r.type] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div className="page resources-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BOOKS · PAPERS · REFERENCES</p>
          <h1>Resource library</h1>
          <p>Use references for depth and verification; use StaffPath to apply, explain, and retain what matters.</p>
        </div>
        <div className="chapter-count">
          <strong>{readCount}/{learningResources.length}</strong>
          <span>resources read</span>
        </div>
      </div>

      <div className="search-panel">
        <label>
          <span>⌕</span>
          <input
            aria-label="Search resources"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reliability, distributed systems, AI, leadership…"
          />
        </label>
        <div className="category-filters">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              className={typeFilter === t ? 'active' : ''}
              onClick={() => setTypeFilter(t)}
            >
              {t}{counts[t] ? ` · ${counts[t]}` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="resource-grid">
        {results.map((item) => (
          <div key={item.url} className={`resource-card-wrap ${read.has(item.url) ? 'resource-read' : ''}`}>
            <a href={item.url} target="_blank" rel="noreferrer">
              <div><span>{item.domain}</span><em>{item.type}</em></div>
              <h2>{item.title}</h2>
              <strong>{item.provider}</strong>
              <p>{item.purpose}</p>
              <b>Open primary source ↗</b>
            </a>
            <button
              className={`resource-read-btn ${read.has(item.url) ? 'read' : ''}`}
              onClick={() => toggle(item.url)}
              aria-label={read.has(item.url) ? 'Mark as unread' : 'Mark as read'}
            >
              {read.has(item.url) ? '✓ Read' : 'Mark read'}
            </button>
          </div>
        ))}
        {!results.length && <div className="interview-empty">No resources match that search.</div>}
      </div>

      <section className="resource-policy">
        <strong>Editorial policy</strong>
        <p>Company-specific claims use authoritative public sources. Product brands illustrate capabilities, not memorization. "Exactly once," body-language interpretation, and other commonly overstated ideas are qualified explicitly.</p>
      </section>
    </div>
  );
}
