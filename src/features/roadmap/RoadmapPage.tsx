import { useEffect, useMemo, useState } from 'react';
import { roadmapSessions, roadmapWeeks, ROADMAP_SESSION_COUNT, sessionsPerWeek, type SessionCategory } from '../../data/roadmap';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import type { RoadmapSessionRecord } from '../../domain/appState';
import { resolveModeConfig } from '../../domain/preparationModes';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { Link, useLocationSearch } from '../../lib/router';
import { getRoadmapFocusSessionId } from '../../lib/studyWeek';
import { enqueueAction, isOnline } from '../../lib/offlineQueue';
import { buildSessionPlan } from './sessionPlan';

const emptyRecord = (): RoadmapSessionRecord => ({ focusedSeconds: 0, communicationComplete: false, reflection: '', artifact: '' });
const formatClock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function RoadmapPage() {
  const state = useStaffPathState();
  const modeConfig = resolveModeConfig(state.profile.preparationMode, state.profile.customMode);
  const focusTarget = modeConfig.focusSeconds;
  const completed = roadmapSessions.filter((session) => state.roadmap[String(session.id)]?.completedAt).length;
  const firstOpen = roadmapSessions.find((session) => !state.roadmap[String(session.id)]?.completedAt) || roadmapSessions[ROADMAP_SESSION_COUNT - 1];
  const [selectedId, setSelectedId] = useState(() => getRoadmapFocusSessionId(state));
  const [filter, setFilter] = useState<'all' | SessionCategory>('all');
  const [running, setRunning] = useState(false);
  const search = useLocationSearch();
  const selected = roadmapSessions[selectedId - 1];
  const record = state.roadmap[String(selectedId)] || emptyRecord();
  const plan = useMemo(() => buildSessionPlan(selected, modeConfig.dailyMinutes), [selected, modeConfig.dailyMinutes]);
  const remaining = Math.max(0, focusTarget - record.focusedSeconds);
  const weeklyPace = sessionsPerWeek(modeConfig.totalDays);
  const currentWeek = roadmapWeeks[selected.week - 1];
  const masteryQuestions = currentWeek?.masteryQuestions ?? [];

  useEffect(() => {
    const week = Number(new URLSearchParams(search).get('week'));
    if (!Number.isInteger(week) || week < 1) return;
    setSelectedId(getRoadmapFocusSessionId(state, week));
  }, [search, state.roadmap, state.profile.studyWeek]);

  useEffect(() => {
    if (!running || remaining === 0) return;
    const timer = window.setInterval(() => {
      appStore.update((current) => {
        const previous = current.roadmap[String(selectedId)] || emptyRecord();
        return { ...current, roadmap: { ...current.roadmap, [selectedId]: { ...previous, focusedSeconds: Math.min(focusTarget, previous.focusedSeconds + 1) } } };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, remaining, selectedId, focusTarget]);

  function updateRecord(patch: Partial<RoadmapSessionRecord>) {
    appStore.update((current) => ({
      ...current,
      roadmap: { ...current.roadmap, [selectedId]: { ...(current.roadmap[String(selectedId)] || emptyRecord()), ...patch } },
    }));
  }

  function completeSession() {
    updateRecord({ completedAt: record.completedAt || new Date().toISOString() });
    if (!isOnline()) enqueueAction('roadmap', `Session ${selectedId}: ${selected.title}`);
    setRunning(false);
  }

  return (
    <div className="page roadmap-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{modeConfig.totalDays} DAYS · {modeConfig.dailyMinutes} MIN DAILY · {modeConfig.label.toUpperCase()}</p>
          <h1>Your Staff-level roadmap</h1>
          <p>Every session ends with application, communication, and durable evidence—not passive consumption. Target pace: {weeklyPace} sessions/week.</p>
        </div>
        <div className="progress-orb"><strong>{Math.round(completed / ROADMAP_SESSION_COUNT * 100)}%</strong><span>{completed} of {ROADMAP_SESSION_COUNT} complete</span></div>
      </div>

      <section className="daily-executor" aria-labelledby="daily-session-title">
        <div className="executor-main">
          <div className="session-meta"><span>DAY {selected.id}</span><span>WEEK {selected.week} · {selected.category.toUpperCase()}</span></div>
          <h2 id="daily-session-title">{selected.title}</h2>
          <p>{selected.description}</p>
          <div className="topic-cloud">{selected.tags.map((tag) => {
            const linked = encyclopediaChapters.find((c) =>
              c.title.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(c.title.toLowerCase().split(' ')[0])
            );
            return linked
              ? <Link key={tag} to="/encyclopedia" className="topic-tag-link" title={`Open: ${linked.title}`}>{tag} ↗</Link>
              : <span key={tag}>{tag}</span>;
          })}</div>
          <div className="focus-blocks">
            {plan.blocks.map((block) => <article key={block.label}><strong>{block.minutes}m</strong><div><span>{block.label}</span><p>{block.prompt}</p></div></article>)}
          </div>
          {masteryQuestions.length > 0 && (
            <div className="mastery-questions">
              <p className="eyebrow">WEEK {selected.week} MASTERY QUESTIONS</p>
              <ul>
                {masteryQuestions.map((question) => <li key={question}>{question}</li>)}
              </ul>
            </div>
          )}
        </div>
        <aside className="session-capture">
          <p className="eyebrow">FOCUS TIMER · {modeConfig.dailyMinutes} MIN</p>
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
