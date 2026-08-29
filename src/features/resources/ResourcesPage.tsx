import { useMemo, useState } from 'react';
import { learningResources } from '../../data/resources';

const ALL_TYPES = ['All', 'Book', 'Paper', 'Guide', 'Reference', 'Blog'] as const;
type TypeFilter = typeof ALL_TYPES[number];

export function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');

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
          <strong>{learningResources.length}</strong>
          <span>authoritative resources</span>
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
          <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
            <div><span>{item.domain}</span><em>{item.type}</em></div>
            <h2>{item.title}</h2>
            <strong>{item.provider}</strong>
            <p>{item.purpose}</p>
            <b>Open primary source ↗</b>
          </a>
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
