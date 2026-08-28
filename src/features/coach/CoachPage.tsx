import { useState } from 'react';
import { Link } from '../../lib/router';
import { useStaffPathState } from '../../lib/appStore';
import { buildWhatsNextActions, identifyFocusAreas } from '../../lib/intelligence';
import { buildCoachActions, retrieveCoachMatches } from './recommendations';

const categoryIcon: Record<string, string> = {
  roadmap: '□', practice: '△', mistake: '◉', assessment: '◇', communication: '◌', chapter: '⌕', journal: '≡',
};

export function CoachPage() {
  const state = useStaffPathState();
  const intelligentActions = buildWhatsNextActions(state);
  const focusAreas = identifyFocusAreas(state, 3);
  const fallbackActions = buildCoachActions(state);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const matches = submitted ? retrieveCoachMatches(submitted) : { chapters: [], scenarios: [] };
  const usingIntelligence = intelligentActions.length > 0;

  return (
    <div className="page coach-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PRIVATE · EVIDENCE-AWARE · LOCAL</p>
          <h1>Your preparation coach</h1>
          <p>StaffPath recommends the next useful action from your real progress and retrieves material already in your source of truth.</p>
        </div>
      </div>

      <section className="coach-priorities">
        <div>
          <p className="eyebrow">NEXT BEST ACTIONS</p>
          <h2>Do less, deliberately.</h2>
        </div>
        <div>
          {usingIntelligence
            ? intelligentActions.map((action, index) => (
                <Link key={action.title} to={action.to}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{categoryIcon[action.category] ?? '✦'} {action.title}</strong>
                    <p>{action.reason}</p>
                    <em>{action.insight}</em>
                  </div>
                  <em>→</em>
                </Link>
              ))
            : fallbackActions.map((action, index) => (
                <Link key={action.title} to={action.to}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.reason}</p>
                  </div>
                  <em>→</em>
                </Link>
              ))}
        </div>
      </section>

      {focusAreas.length > 0 && (
        <section className="coach-focus-areas">
          <div>
            <p className="eyebrow">RECOMMENDED FOCUS</p>
            <h2>Gap areas from your assessment</h2>
          </div>
          <div>
            {focusAreas.map((area) => (
              <article key={area.competencyId}>
                <div>
                  <strong>{area.title}</strong>
                  <span>{area.score}/5</span>
                </div>
                <p>{area.reason}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="coach-search">
        <p className="eyebrow">ASK YOUR KNOWLEDGE BASE</p>
        <h2>Find a concept or practice problem</h2>
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()); }}>
          <input aria-label="Coach question" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. How do I prevent duplicate payment processing?" />
          <button className="button primary" disabled={!query.trim()}>Find guidance</button>
        </form>
        {submitted && (
          <div className="coach-results">
            <p>Results are retrieved from curated StaffPath content; this local coach does not fabricate an open-ended answer.</p>
            <div>
              {matches.chapters.map((chapter) => (
                <Link to="/encyclopedia" key={chapter.id}>
                  <span>CHAPTER</span>
                  <strong>{chapter.title}</strong>
                  <p>{chapter.summary}</p>
                </Link>
              ))}
              {matches.scenarios.map((scenario) => (
                <Link to="/practice" key={scenario.id}>
                  <span>PRACTICE</span>
                  <strong>{scenario.title}</strong>
                  <p>{scenario.prompt}</p>
                </Link>
              ))}
              {!matches.chapters.length && !matches.scenarios.length && (
                <div className="interview-empty">No strong local match. Try concrete terms such as caching, payments, conflict, migration, RAG, or rate limiting.</div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
