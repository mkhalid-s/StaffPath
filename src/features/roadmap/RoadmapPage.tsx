import { useEffect, useMemo, useState } from 'react';
import { roadmapSessions, roadmapWeeks, type SessionCategory } from '../../data/roadmap';
import type { RoadmapSessionRecord } from '../../domain/appState';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { buildSessionPlan } from './sessionPlan';

const emptyRecord = (): RoadmapSessionRecord => ({ focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' });
const formatClock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function RoadmapPage() {
  const state = useStaffPathState();
  const completed = roadmapSessions.filter((session) => state.roadmap[String(session.id)]?.completedAt).length;
  const firstOpen = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt) || roadmapSessions[89];
  const [selectedId, setSelectedId] = useState(firstOpen.id);
  const [filter, setFilter] = useState<'all' | SessionCategory>('all');
  const [running, setRunning] = useState(false);
  const selected = roadmapSessions[selectedId - 1];
  const record = state.roadmap[String(selectedId)] || emptyRecord();
  const plan = useMemo(() => buildSessionPlan(selected), [selected]);
  const remaining = Math.max(0, 3600 - record.focusedSeconds);

  useEffect(() => {
    if (!running || remaining === 0) return;
    const timer = window.setInterval(() => {
      appStore.update((current) => {
        const previous = current.roadmap[String(selectedId)] || emptyRecord();
        return { ...current, roadmap: { ...current.roadmap, [selectedId]: { ...previous, focusedSeconds: Math.min(3600, previous.focusedSeconds + 1) } } };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, remaining, selectedId]);

  function updateRecord(patch: Partial<RoadmapSessionRecord>) {
    appStore.update((current) => ({
      ...current,
      roadmap: { ...current.roadmap, [selectedId]: { ...(current.roadmap[String(selectedId)] || emptyRecord()), ...patch } },
    }));
  }

  function completeSession() {
    updateRecord({ completedAt: record.completedAt || new Date().toISOString() });
    setRunning(false);
  }

  return (
    <div className="page roadmap-page">
      <div className="page-heading">
        <div><p className="eyebrow">90 DAYS · ONE FOCUSED HOUR DAILY</p><h1>Your Staff-level roadmap</h1><p>Every session ends with application, communication, and durable evidence—not passive consumption.</p></div>
        <div className="progress-orb"><strong>{Math.round(completed / 90 * 100)}%</strong><span>{completed} of 90 complete</span></div>
      </div>

      <section className="daily-executor" aria-labelledby="daily-session-title">
        <div className="executor-main">
          <div className="session-meta"><span>DAY {selected.id}</span><span>WEEK {selected.week} · {selected.category.toUpperCase()}</span></div>
          <h2 id="daily-session-title">{selected.title}</h2>
          <p>{selected.description}</p>
          <div className="topic-cloud">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="focus-blocks">
            {plan.blocks.map((block) => <article key={block.label}><strong>{block.minutes}m</strong><div><span>{block.label}</span><p>{block.prompt}</p></div></article>)}
          </div>
        </div>
        <aside className="session-capture">
          <p className="eyebrow">FOCUS TIMER</p>
          <div className="timer-display" aria-live="polite">{formatClock(remaining)}</div>
          <div className="button-row">
            <button className="button primary" onClick={() => setRunning((value) => !value)} disabled={remaining === 0}>{running ? 'Pause' : 'Start focus'}</button>
            <button className="button" onClick={() => { setRunning(false); updateRecord({ focusedSeconds: 0 }); }}>Reset</button>
          </div>
          <label className="check-row"><input type="checkbox" checked={record.communicationComplete} onChange={(event) => updateRecord({ communicationComplete: event.target.checked })} /><span><strong>{plan.communicationTitle}</strong>Communication rep complete</span></label>
          <label>What changed in your thinking?<textarea aria-label="Session reflection" value={record.reflection} onChange={(event) => updateRecord({ reflection: event.target.value })} placeholder="A concise reflection or decision…" /></label>
          <label>Artifact or evidence<textarea aria-label="Session artifact" value={record.artifact} onChange={(event) => updateRecord({ artifact: event.target.value })} placeholder="Diagram, ADR, recording, notes, feedback…" /></label>
          <button className="button primary complete-button" onClick={completeSession} disabled={Boolean(record.completedAt)}>{record.completedAt ? 'Completed ✓' : 'Complete session'}</button>
        </aside>
      </section>

      <section>
        <div className="section-heading roadmap-controls"><div><p className="eyebrow">BASIC → ADVANCED → MASTERY</p><h2>Full curriculum</h2></div><div className="category-filters" aria-label="Filter roadmap">{(['all', 'technical', 'leadership', 'communication'] as const).map((value) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div></div>
        <div className="roadmap-weeks">
          {roadmapWeeks.map((week) => {
            const sessions = week.sessions.filter((session) => filter === 'all' || session.category === filter);
            if (!sessions.length) return null;
            const done = week.sessions.filter((session) => state.roadmap[String(session.id)]?.completedAt).length;
            return <article className="roadmap-week" key={week.week}><header><span>WEEK {week.week}</span><div><h3>{week.title}</h3><p>Output · {week.outcome}</p></div><strong>{done}/{week.sessions.length}</strong></header><div>{sessions.map((session) => <button className={`${selectedId === session.id ? 'current' : ''} ${state.roadmap[String(session.id)]?.completedAt ? 'done' : ''}`} key={session.id} onClick={() => { setSelectedId(session.id); setRunning(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><span>{session.id}</span><div><strong>{session.title}</strong><small>{session.description}</small></div><em>{state.roadmap[String(session.id)]?.completedAt ? '✓' : session.category.slice(0, 1).toUpperCase()}</em></button>)}</div></article>;
          })}
        </div>
      </section>
    </div>
  );
}
