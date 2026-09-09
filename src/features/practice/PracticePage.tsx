import { useEffect, useMemo, useState } from 'react';
import { practiceCatalog, practiceRubrics, practiceTracks, type PracticeTrack } from '../../data/practiceCatalog';
import { getActivePack } from '../../data/companyPacks';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { enqueueAction, isOnline } from '../../lib/offlineQueue';
import { useLocationSearch } from '../../lib/router';

const labels: Record<PracticeTrack, [string, string]> = {
  design: ['System design', 'Architecture, scale, and trade-offs'],
  problem: ['Problem solving', 'Investigation and recommendation'],
  people: ['People leadership', 'What would you say and do?'],
  sdlc: ['SDLC practice', 'Lifecycle plan and decisions'],
};

interface PackScenario {
  track: PracticeTrack;
  title: string;
  prompt: string;
  variations: string[];
  coachingPrompts: string[];
}

const universalDesignProbes = [
  'What is the hardest trade-off in this design, and what would you sacrifice first?',
  'What assumptions would you validate before committing to this architecture?',
  'How does this design fail, and what is the blast radius of the worst failure?',
  'What would you measure in production to know the design is actually working?',
  'How would you migrate from a simpler version of this system without downtime?',
  'What changes at 10× traffic — what breaks first, and how do you address it?',
  'Which decision in this design would you document in an ADR, and why?',
  'Where would cost or organizational complexity change your choice?',
];

export function PracticePage() {
  const state = useStaffPathState();
  const [track, setTrack] = useState<PracticeTrack>('design');
  const [response, setResponse] = useState('');
  const [reflection, setReflection] = useState('');
  const [checked, setChecked] = useState<number[]>([]);
  const [coachOpen, setCoachOpen] = useState(false);
  const [probesOpen, setProbesOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const cursor = state.practiceCursor[track];
  const challenges = practiceCatalog[track];
  const challenge = challenges[cursor % challenges.length];
  const variation = challenge.variations[Math.floor(cursor / challenges.length) % challenge.variations.length];
  const rubric = practiceRubrics[track];
  const pack = getActivePack(state.profile.selectedCompanyPack);
  const [packQOpen, setPackQOpen] = useState(false);
  const [browseQuery, setBrowseQuery] = useState('');
  const [packOverride, setPackOverride] = useState<PackScenario | null>(null);
  const search = useLocationSearch();

  const allScenarios = useMemo(() => practiceTracks.flatMap((t) =>
    practiceCatalog[t].map((s, i) => ({ ...s, trackIndex: i }))
  ), []);

  const browseResults = useMemo(() => {
    if (!browseQuery.trim()) return [];
    const q = browseQuery.toLowerCase();
    return allScenarios.filter((s) =>
      s.title.toLowerCase().includes(q) || s.prompt.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [browseQuery, allScenarios]);
  const packScenarios = pack?.practiceScenarios ?? [];
  const packQuestions = pack?.behavioralQuestions ?? [];
  const active = packOverride
    ? {
      id: `pack-${pack?.id ?? 'none'}-${packOverride.title}`,
      title: packOverride.title,
      prompt: packOverride.prompt,
      variations: packOverride.variations,
      coachingPrompts: packOverride.coachingPrompts,
      solutionGuide: undefined as string[] | undefined,
    }
    : challenge;
  const activeVariation = packOverride
    ? packOverride.variations[0]
    : variation;

  useEffect(() => {
    const params = new URLSearchParams(search);
    const nextTrack = params.get('track');
    if (nextTrack === 'design' || nextTrack === 'problem' || nextTrack === 'people' || nextTrack === 'sdlc') {
      setTrack(nextTrack);
    }
    const packTitle = params.get('packScenario');
    if (!packTitle || !pack) {
      if (!packTitle) setPackOverride(null);
      return;
    }
    const match = pack.practiceScenarios.find((scenario) => scenario.title === packTitle);
    if (match) {
      setTrack(match.track);
      setPackOverride(match);
    }
  }, [search, pack]);

  function switchTrack(next: PracticeTrack) {
    setPackOverride(null);
    setTrack(next);
    setResponse('');
    setReflection('');
    setChecked([]);
    setCoachOpen(false);
    setProbesOpen(false);
    setGuideOpen(false);
  }
  function move(delta: number) {
    appStore.update((current) => ({ ...current, practiceCursor: { ...current.practiceCursor, [track]: Math.max(0, current.practiceCursor[track] + delta) } }));
    setResponse(''); setReflection(''); setChecked([]); setCoachOpen(false); setProbesOpen(false);
  }
  function saveAttempt(event: React.FormEvent) {
    event.preventDefault();
    if (!response.trim()) return;
    appStore.update((current) => ({
      ...current,
      practiceAttempts: [...current.practiceAttempts, { id: crypto.randomUUID(), challengeId: active.id, track, title: active.title, variation: activeVariation, response: response.trim(), reflection: reflection.trim(), score: checked.length, maxScore: rubric.length, date: new Date().toISOString() }],
      practiceCursor: { ...current.practiceCursor, [track]: current.practiceCursor[track] + 1 },
    }));
    if (!isOnline()) enqueueAction('practice', `Practice: ${challenge.title}`);
    setResponse(''); setReflection(''); setChecked([]); setCoachOpen(false); setProbesOpen(false);
  }

  return <div className="page practice-page">
    <div className="page-heading"><div><p className="eyebrow">DELIBERATE PRACTICE · 112 SCENARIOS</p><h1>Practice Lab</h1><p>Produce an answer first. Then reveal coaching, score the evidence, reflect, and repeat.</p></div><div className="chapter-count"><strong>{state.practiceAttempts.length}</strong><span>attempts saved</span></div></div>

    <div className="practice-search-bar">
      <input
        type="search"
        aria-label="Search all scenarios"
        placeholder="Search across all 112 scenarios…"
        value={browseQuery}
        onChange={(e) => setBrowseQuery(e.target.value)}
      />
      {browseQuery && <span className="practice-search-count">{browseResults.length} result{browseResults.length !== 1 ? 's' : ''}</span>}
    </div>

    {browseQuery && browseResults.length > 0 && (
      <div className="practice-browse-grid">
        {browseResults.map((s) => (
          <button
            key={s.id}
            type="button"
            className="practice-browse-card"
            onClick={() => {
              setBrowseQuery('');
              switchTrack(s.track);
              appStore.update((current) => ({
                ...current,
                practiceCursor: { ...current.practiceCursor, [s.track]: s.trackIndex },
              }));
            }}
          >
            <span className="category-chip">{labels[s.track][0]}</span>
            <strong>{s.title}</strong>
            <p>{s.prompt}</p>
          </button>
        ))}
      </div>
    )}

    {browseQuery && browseResults.length === 0 && (
      <div className="interview-empty">No scenarios match "{browseQuery}" — try fewer words.</div>
    )}

    <div className="interview-tabs" role="tablist">{practiceTracks.map((item) => <button role="tab" aria-selected={track === item} className={track === item ? 'active' : ''} key={item} onClick={() => switchTrack(item)}>{labels[item][0]} <span>{practiceCatalog[item].length}</span></button>)}</div>
    <form className="practice-layout" onSubmit={saveAttempt}>
      <section className="challenge-panel">
        <div className="session-meta"><span>{labels[track][0].toUpperCase()}</span><span>{packOverride ? `${pack?.label ?? 'PACK'} SCENARIO` : `CHALLENGE ${cursor % challenges.length + 1} / ${challenges.length}`}</span></div>
        <h2>{active.title}</h2><p>{active.prompt}</p>
        {track === 'design' && (
          <div className="design-probes-card">
            <button className="coach-toggle" type="button" onClick={() => setProbesOpen((value) => !value)}>
              {probesOpen ? 'Hide universal design probes' : 'Universal design probes'}
            </button>
            {probesOpen && (
              <ol className="coach-prompts">
                {universalDesignProbes.map((probe) => <li key={probe}>{probe}</li>)}
              </ol>
            )}
          </div>
        )}
        {pack && (
          <div className="pack-context-card">
            <span>{pack.label.toUpperCase()}</span>
            <p>{pack.practiceContext}</p>
            {packQuestions.length > 0 && (
              <>
                <button className="coach-toggle" type="button" onClick={() => setPackQOpen((value) => !value)}>
                  {packQOpen ? 'Hide behavioral questions' : `Behavioral questions for ${pack.company}`}
                </button>
                {packQOpen && (
                  <ul className="coach-prompts">
                    {packQuestions.map((q) => <li key={q}>{q}</li>)}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
        <div className="variation-card"><span>CONSTRAINT VARIATION</span><strong>{activeVariation}</strong></div>
        <label>{labels[track][1]}<textarea aria-label="Practice response" required value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Clarify the problem, state assumptions, reason through options, make a recommendation…" /></label>
        <label>Post-attempt reflection<textarea aria-label="Practice reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="What was weak? What will you do differently next time?" /></label>
        <div className="button-row"><button className="button" type="button" onClick={() => move(-1)} disabled={cursor === 0}>← Previous</button><button className="button" type="button" onClick={() => move(1)}>Skip / next →</button></div>
      </section>
      <aside className="coaching-panel">
        <p className="eyebrow">DELIBERATE REVIEW</p><h2>Score observable behaviors</h2><p>Check only what your written or spoken answer actually demonstrated.</p>
        <div className="rubric-list">{rubric.map((item, index) => <label key={item}><input type="checkbox" checked={checked.includes(index)} onChange={(event) => setChecked((values) => event.target.checked ? [...values, index] : values.filter((value) => value !== index))} />{item}</label>)}</div>
        <button className="coach-toggle" type="button" onClick={() => setCoachOpen((value) => !value)}>{coachOpen ? 'Hide coaching prompts' : 'Reveal coaching prompts'}</button>
        {coachOpen && <ul className="coach-prompts">{active.coachingPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>}
        <div className="score-preview"><strong>{checked.length}/{rubric.length}</strong><span>self-review evidence</span></div>
        <button className="button primary complete-button" type="submit" disabled={!response.trim()}>Save attempt to handbook</button>
        {active.solutionGuide && active.solutionGuide.length > 0 && (
          <>
            <button className="coach-toggle" type="button" onClick={() => setGuideOpen((v) => !v)}>{guideOpen ? 'Hide solution guide ↑' : 'Reveal solution guide ↓'}</button>
            {guideOpen && (
              <div className="solution-guide">
                <p className="eyebrow">STAFF-LEVEL SOLUTION GUIDE</p>
                <ul>{active.solutionGuide.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
            )}
          </>
        )}
      </aside>
    </form>
    <section><div className="section-heading"><p className="eyebrow">RECENT EVIDENCE</p><h2>Practice history</h2></div><div className="attempt-grid">{state.practiceAttempts.slice().reverse().slice(0, 8).map((attempt) => <article key={attempt.id}><span>{labels[attempt.track][0]} · {new Date(attempt.date).toLocaleDateString()}</span><h3>{attempt.title}</h3><p>{attempt.variation}</p><strong>{attempt.score}/{attempt.maxScore}</strong></article>)}{!state.practiceAttempts.length && <div className="interview-empty">Your saved attempts will become handbook evidence here.</div>}</div></section>
    {pack && packScenarios.length > 0 && (
      <section>
        <div className="section-heading"><p className="eyebrow">{pack.label.toUpperCase()} SCENARIOS</p><h2>Company-specific practice</h2></div>
        <div className="attempt-grid">
          {packScenarios.map((scenario) => (
            <button
              key={scenario.title}
              type="button"
              className="pack-scenario-card"
              onClick={() => {
                setTrack(scenario.track);
                setPackOverride(scenario);
                setResponse('');
                setReflection('');
                window.scrollTo({ top: 0 });
              }}
            >
              <span>[{pack.label}] · {labels[scenario.track][0]}</span>
              <h3>{scenario.title}</h3>
              <p>{scenario.prompt}</p>
              <strong>Run this prompt →</strong>
            </button>
          ))}
        </div>
      </section>
    )}
  </div>;
}
