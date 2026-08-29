import { useMemo, useState } from 'react';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { enqueueAction, isOnline } from '../../lib/offlineQueue';

const SUGGESTED_TAGS = ['system-design', 'behavioral', 'leadership', 'mistake', 'insight', 'practice'];

const ALL_PROMPTS = [
  'What was the most surprising thing you learned today?',
  'What assumption did you test and what did you find?',
  'What would you do differently if you faced this situation again?',
  'What decision are you second-guessing and why?',
  'What did you explain to someone else today — and what did explaining it reveal?',
  'What failure or near-miss are you not capturing that you should?',
];

function pickPrompts() {
  const shuffled = [...ALL_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function JournalPage() {
  const state = useStaffPathState();
  const [learning, setLearning] = useState('');
  const [application, setApplication] = useState('');
  const [artifact, setArtifact] = useState('');
  const [tags, setTags] = useState('');
  const [quality, setQuality] = useState(3);
  const [prompts, setPrompts] = useState(pickPrompts);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!learning.trim()) return;
    appStore.update((current) => ({
      ...current,
      journal: [...current.journal, {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        learning: learning.trim(),
        application: application.trim(),
        artifact: artifact.trim(),
        quality,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      }],
    }));
    if (!isOnline()) enqueueAction('journal', 'Journal reflection');
    setLearning(''); setApplication(''); setArtifact(''); setTags(''); setQuality(3);
  }

  function addSuggestedTag(tag: string) {
    const existing = tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (existing.includes(tag)) return;
    setTags([...existing, tag].join(', '));
  }

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const entry of state.journal) for (const t of entry.tags) set.add(t);
    return ['All', ...Array.from(set).sort()];
  }, [state.journal]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.journal
      .slice()
      .reverse()
      .filter((entry) => activeTag === 'All' || entry.tags.includes(activeTag))
      .filter((entry) => {
        if (!q) return true;
        const haystack = `${entry.learning} ${entry.application} ${entry.artifact} ${entry.tags.join(' ')} ${new Date(entry.date).toLocaleDateString()}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [state.journal, query, activeTag]);

  return (
    <div className="page journal-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">REFLECT → ADAPT → RETRIEVE</p>
          <h1>Learning journal</h1>
          <p>Turn activity into durable judgment and searchable evidence.</p>
        </div>
        <div className="chapter-count"><strong>{state.journal.length}</strong><span>reflections</span></div>
      </div>

      <div className="journal-layout">
        <form className="journal-form" onSubmit={save}>
          <h2>Capture a reflection</h2>

          <div className="journal-prompts">
            <div className="journal-prompts-head">
              <span>WRITING PROMPTS</span>
              <button type="button" className="prompt-shuffle" onClick={() => setPrompts(pickPrompts())}>↻ New prompts</button>
            </div>
            <ul>{prompts.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>

          <label>What changed in your thinking?
            <textarea aria-label="Journal learning" required value={learning} onChange={(event) => setLearning(event.target.value)} />
          </label>
          <label>Where will you apply it?
            <textarea aria-label="Journal application" value={application} onChange={(event) => setApplication(event.target.value)} />
          </label>
          <label>Artifact or evidence
            <input aria-label="Journal artifact" value={artifact} onChange={(event) => setArtifact(event.target.value)} placeholder="Link, filename, diagram, feedback…" />
          </label>
          <label>Tags
            <input aria-label="Journal tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="reliability, influence, migration" />
          </label>
          <div className="tag-suggestions">
            {SUGGESTED_TAGS.map((tag) => (
              <button type="button" key={tag} onClick={() => addSuggestedTag(tag)}>+ {tag}</button>
            ))}
          </div>
          <label className="confidence-row">
            <span>Learning quality</span>
            <input aria-label="Learning quality" type="range" min="1" max="5" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            <strong>{quality}/5</strong>
          </label>
          <button className="button primary" disabled={!learning.trim()}>Save reflection</button>
        </form>

        <section className="journal-entries">
          <div className="journal-entries-head">
            <h2>Evidence timeline</h2>
            <a className="button" href="/handbook">Export in Handbook →</a>
          </div>
          <div className="search-panel journal-search">
            <label>
              <span>⌕</span>
              <input aria-label="Search journal" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reflections, artifacts, tags…" />
            </label>
            {allTags.length > 1 && (
              <div className="category-filters">
                {allTags.map((tag) => (
                  <button key={tag} className={activeTag === tag ? 'active' : ''} onClick={() => setActiveTag(tag)}>{tag}</button>
                ))}
              </div>
            )}
          </div>
          {filtered.map((entry) => (
            <article key={entry.id}>
              <div><span>{new Date(entry.date).toLocaleDateString()}</span><strong>QUALITY {entry.quality}/5</strong></div>
              <h3>{entry.learning}</h3>
              {entry.application && <p>{entry.application}</p>}
              {entry.tags.length > 0 && <div className="topic-cloud">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
              {entry.artifact && <em>Artifact · {entry.artifact}</em>}
            </article>
          ))}
          {!state.journal.length && <div className="interview-empty">No reflections yet. Capture the insight that should change your next decision.</div>}
          {!!state.journal.length && !filtered.length && <div className="interview-empty">No reflections match that search.</div>}
        </section>
      </div>
    </div>
  );
}
