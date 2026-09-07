import { type FormEvent, useEffect, useState } from 'react';
import { appStore, useStaffPathState } from '../../lib/appStore';
import type { MockInterviewRecord } from '../../domain/appState';
import { interviewPrompts } from '../../data/interviewPrompts';
import { getActivePack } from '../../data/companyPacks';
import { localDayKey } from '../../lib/dates';

const criteria = ['Requirements', 'Estimation', 'Architecture', 'Technical depth', 'Trade-offs', 'Failure handling', 'Staff-level judgment', 'Communication'];
const isoAfter = (days: number) => { const date = new Date(); date.setDate(date.getDate() + days); return localDayKey(date); };

type InterviewType = MockInterviewRecord['type'] | 'pack-behavioral';

interface InterviewPhase { label: string; seconds: number; purpose: string; }

const SYSTEM_DESIGN_PHASES: InterviewPhase[] = [
  { label: 'Clarify', seconds: 5 * 60, purpose: 'Users, use cases, scope, exclusions' },
  { label: 'Estimate', seconds: 5 * 60, purpose: 'Scale, traffic, storage, bandwidth' },
  { label: 'Design', seconds: 20 * 60, purpose: 'High-level architecture, APIs, data model' },
  { label: 'Deep dive', seconds: 10 * 60, purpose: '2-3 critical paths, failure handling' },
  { label: 'Trade-offs', seconds: 5 * 60, purpose: 'Alternatives, evolution, risks, summary' },
];
const TOTAL_PHASED_SECONDS = SYSTEM_DESIGN_PHASES.reduce((sum, phase) => sum + phase.seconds, 0);
const formatClock = (totalSeconds: number) => `${String(Math.floor(Math.max(0, totalSeconds) / 60)).padStart(2, '0')}:${String(Math.max(0, totalSeconds) % 60).padStart(2, '0')}`;

export function InterviewPage() {
  const state = useStaffPathState();
  const pack = getActivePack(state.profile.selectedCompanyPack);
  const [tab, setTab] = useState<'mock' | 'mistakes'>('mock');
  const [type, setType] = useState<InterviewType>('system-design');
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(criteria.map((item) => [item, 3])));
  const [feedback, setFeedback] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeInPhase, setTimeInPhase] = useState(SYSTEM_DESIGN_PHASES[0].seconds);
  const [phaseFlash, setPhaseFlash] = useState(false);
  const average = Math.round((Object.values(scores).reduce((sum, score) => sum + score, 0) / criteria.length) * 10) / 10;

  const packBehavioralPool = pack?.behavioralQuestions ?? [];
  const activePool: string[] = type === 'pack-behavioral'
    ? packBehavioralPool
    : interviewPrompts[type as MockInterviewRecord['type']];
  const prompt = activePool.length > 0 ? activePool[promptIndex % activePool.length] : 'No prompts available.';
  const isPhased = type === 'system-design';

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(45 * 60);
    setPhaseIndex(0);
    setTimeInPhase(SYSTEM_DESIGN_PHASES[0].seconds);
  };

  const skipPhase = () => {
    setPhaseIndex((value) => {
      const next = Math.min(value + 1, SYSTEM_DESIGN_PHASES.length - 1);
      setTimeInPhase(SYSTEM_DESIGN_PHASES[next].seconds);
      return next;
    });
  };

  useEffect(() => {
    if (!running) return;
    if (isPhased) {
      if (timeInPhase <= 0) {
        if (phaseIndex >= SYSTEM_DESIGN_PHASES.length - 1) { setRunning(false); return; }
        setPhaseFlash(true);
        window.setTimeout(() => setPhaseFlash(false), 900);
        setPhaseIndex((value) => value + 1);
        setTimeInPhase(SYSTEM_DESIGN_PHASES[phaseIndex + 1].seconds);
        return;
      }
      const timer = window.setInterval(() => setTimeInPhase((value) => value - 1), 1000);
      return () => window.clearInterval(timer);
    }
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, secondsLeft, isPhased, timeInPhase, phaseIndex]);

  const phaseElapsedSeconds = SYSTEM_DESIGN_PHASES.slice(0, phaseIndex).reduce((sum, phase) => sum + phase.seconds, 0) + (SYSTEM_DESIGN_PHASES[phaseIndex].seconds - timeInPhase);
  const phaseTotalRemaining = TOTAL_PHASED_SECONDS - phaseElapsedSeconds;

  const saveMock = (event: FormEvent) => {
    event.preventDefault();
    const durationMinutes = isPhased
      ? Math.max(0, Math.round(phaseElapsedSeconds / 60))
      : Math.max(0, Math.round((45 * 60 - secondsLeft) / 60));
    const savedType: MockInterviewRecord['type'] = type === 'pack-behavioral' ? 'behavioral' : type;
    appStore.update((current) => ({
      ...current,
      mockInterviews: [...current.mockInterviews, {
        id: crypto.randomUUID(), type: savedType, score: average,
        date: localDayKey(), feedback, prompt,
        durationMinutes, criteria: { ...scores }
      }]
    }));
    setFeedback('');
    setRunning(false);
  };

  const saveMistake = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget), p = String(data.get('prompt')).trim();
    if (!p) return;
    appStore.update((current) => ({ ...current, mistakes: [...current.mistakes, { id: crypto.randomUUID(), prompt: p, missed: String(data.get('missed')).trim(), correction: String(data.get('correction')).trim(), nextReview: isoAfter(2), reviewCount: 0, resolved: false }] }));
    event.currentTarget.reset();
  };

  const reviewMistake = (id: string, resolved: boolean) => appStore.update((current) => ({
    ...current, mistakes: current.mistakes.map((item) => {
      if (item.id !== id) return item;
      const count = item.reviewCount + 1, intervals = [2, 7, 14, 30];
      return { ...item, resolved, reviewCount: count, nextReview: isoAfter(intervals[Math.min(count, intervals.length - 1)]) };
    })
  }));

  const recentMockAvg = (() => {
    const last3 = [...state.mockInterviews].reverse().slice(0, 3);
    if (!last3.length) return null;
    return Math.round((last3.reduce((s, m) => s + m.score, 0) / last3.length) * 10) / 10;
  })();

  const sparklineScores = state.mockInterviews.slice(-10).map((m) => m.score);
  const sparklinePath = (() => {
    if (sparklineScores.length < 2) return null;
    const width = 140, height = 40, padding = 4;
    const stepX = (width - padding * 2) / (sparklineScores.length - 1);
    const toY = (score: number) => height - padding - ((score - 1) / 4) * (height - padding * 2);
    const points = sparklineScores.map((score, index) => [padding + index * stepX, toY(score)]);
    const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const last = points[points.length - 1];
    return { d, lastX: last[0], lastY: last[1] };
  })();

  return (
    <div className="page interview-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">INTERVIEW FEEDBACK LOOP</p>
          <h1>Practice. Score. Correct. Repeat.</h1>
          <p>Mocks create evidence; mistakes create the next revision queue.</p>
        </div>
        <div className="chapter-count">
          <strong>{state.mockInterviews.length}</strong>
          <span>mock interviews</span>
          {recentMockAvg !== null && <><strong style={{marginTop:'4px'}}>{recentMockAvg}</strong><span>last 3 avg</span></>}
        </div>
      </div>

      {pack && (
        <div className="pack-context-card" style={{marginBottom:'16px'}}>
          <span>{pack.label.toUpperCase()}</span>
          <p>{pack.interviewFormat ?? pack.practiceContext}</p>
        </div>
      )}

      <div className="interview-tabs">
        <button className={tab === 'mock' ? 'active' : ''} onClick={() => setTab('mock')}>Mock scorecard</button>
        <button className={tab === 'mistakes' ? 'active' : ''} onClick={() => setTab('mistakes')}>
          Mistake journal <span>{state.mistakes.filter((item) => !item.resolved).length}</span>
        </button>
      </div>

      {tab === 'mock' ? (
        <>
          <section className={`mock-runner ${isPhased && phaseFlash ? 'phase-flash' : ''}`}>
            <div>
              <span>{type === 'pack-behavioral' ? `${pack?.company ?? 'Pack'} behavioral`.toUpperCase() : type.replace('-', ' ').toUpperCase()}</span>
              <h2>{prompt}</h2>
              <button onClick={() => setPromptIndex((value) => value + 1)}>New prompt ↻</button>
            </div>

            {isPhased ? (
              <div className="phase-timer">
                <div className="phase-timer-head">
                  <p className="eyebrow phase-timer-label">{SYSTEM_DESIGN_PHASES[phaseIndex].label}</p>
                  <span className="phase-timer-count">{phaseIndex + 1} of {SYSTEM_DESIGN_PHASES.length}</span>
                </div>
                <p className="phase-timer-purpose">{SYSTEM_DESIGN_PHASES[phaseIndex].purpose}</p>
                <div className="phase-progress-bar">
                  <div className="phase-progress-fill" style={{ width: `${((SYSTEM_DESIGN_PHASES[phaseIndex].seconds - timeInPhase) / SYSTEM_DESIGN_PHASES[phaseIndex].seconds) * 100}%` }} />
                </div>
                <div className="phase-dots">
                  {SYSTEM_DESIGN_PHASES.map((phase, index) => (
                    <span key={phase.label} className={`phase-dot ${index < phaseIndex ? 'done' : ''} ${index === phaseIndex ? 'active' : ''}`} title={phase.label} />
                  ))}
                </div>
                <div className="phase-timer-controls">
                  <strong>{formatClock(timeInPhase)}</strong>
                  <small>{formatClock(phaseTotalRemaining)} total remaining</small>
                  <button className="button primary" onClick={() => setRunning((value) => !value)}>{running ? 'Pause mock' : 'Start mock'}</button>
                  <button className="button" onClick={skipPhase} disabled={phaseIndex >= SYSTEM_DESIGN_PHASES.length - 1}>Skip phase →</button>
                  <button className="button" onClick={resetTimer}>Reset</button>
                </div>
              </div>
            ) : (
              <div>
                <strong>{formatClock(secondsLeft)}</strong>
                <button className="button primary" onClick={() => setRunning((value) => !value)}>{running ? 'Pause mock' : 'Start mock'}</button>
                <button className="button" onClick={() => { setRunning(false); setSecondsLeft(45 * 60); }}>Reset</button>
              </div>
            )}
          </section>

          <div className="interview-layout">
            <form className="scorecard-panel" onSubmit={saveMock}>
              <div className="form-heading">
                <div><p className="eyebrow">MOCK REVIEW</p><h2>Structured scorecard</h2></div>
                <div><strong>{average}</strong><small>/ 5</small></div>
              </div>
              <label>
                Interview type
                <select value={type} onChange={(event) => { setType(event.target.value as InterviewType); setPromptIndex(0); resetTimer(); }}>
                  <option value="system-design">System design</option>
                  <option value="ai-design">AI system design</option>
                  <option value="behavioral">Behavioral leadership</option>
                  <option value="coding">Coding and problem solving</option>
                  {pack && packBehavioralPool.length > 0 && (
                    <option value="pack-behavioral">{pack.company} behavioral ({packBehavioralPool.length} questions)</option>
                  )}
                </select>
              </label>

              {type === 'pack-behavioral' && pack && (
                <div className="pack-context-card" style={{margin:'0 0 12px'}}>
                  <span>KEY SIGNALS — {pack.company.toUpperCase()}</span>
                  <ul style={{margin:'6px 0 0',paddingLeft:'16px',fontSize:'12px',lineHeight:'1.6'}}>
                    {(pack.keySignals ?? []).map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}

              <div className="score-criteria">
                {criteria.map((criterion) => (
                  <label key={criterion}>
                    <span>{criterion}<strong>{scores[criterion]}</strong></span>
                    <input aria-label={`${criterion} score`} type="range" min="1" max="5" value={scores[criterion]} onChange={(event) => setScores((current) => ({ ...current, [criterion]: Number(event.target.value) }))} />
                  </label>
                ))}
              </div>
              <label>
                Feedback and next action
                <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Strong signals, missed areas, and the next deliberate practice…" />
              </label>
              <button className="button primary" type="submit">Save mock interview</button>
            </form>

            <section className="mock-history">
              <p className="eyebrow">HISTORY</p>
              {sparklinePath && (
                <svg className="score-sparkline" width="140" height="40" viewBox="0 0 140 40" role="img" aria-label="Mock interview score trend">
                  <path d={sparklinePath.d} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={sparklinePath.lastX} cy={sparklinePath.lastY} r="3" fill="var(--lime)" />
                </svg>
              )}
              <h2>Recent mocks</h2>
              {[...state.mockInterviews].reverse().map((mock) => (
                <article key={mock.id}>
                  <div><strong>{mock.type.replace('-', ' ')}</strong><span>{mock.date}{mock.durationMinutes ? ` · ${mock.durationMinutes}m` : ''}</span></div>
                  {mock.prompt && <b>{mock.prompt}</b>}
                  <em>{mock.score}/5</em>
                  <p>{mock.feedback || 'No written feedback.'}</p>
                </article>
              ))}
              {!state.mockInterviews.length && <div className="interview-empty">No mock interviews recorded yet.</div>}
            </section>
          </div>
        </>
      ) : (
        <div className="mistake-layout">
          <form className="mistake-form" onSubmit={saveMistake}>
            <p className="eyebrow">CAPTURE A MISTAKE</p>
            <h2>Turn the miss into a mental model.</h2>
            <label>Question or scenario<textarea name="prompt" required placeholder="What were you trying to answer?" /></label>
            <label>What did you miss?<textarea name="missed" placeholder="Incorrect assumption, omitted risk, weak explanation…" /></label>
            <label>Correct model or response<textarea name="correction" placeholder="What should you recognize and do next time?" /></label>
            <button className="button primary" type="submit">Add to review queue</button>
          </form>
          <section className="mistake-list">
            <p className="eyebrow">SPACED REVIEW</p>
            <h2>Revision queue</h2>
            {[...state.mistakes].sort((a, b) => a.nextReview.localeCompare(b.nextReview)).map((item) => (
              <article className={item.resolved ? 'resolved' : ''} key={item.id}>
                <div><span>REVIEW {item.nextReview}</span><strong>{item.prompt}</strong><p>{item.correction || item.missed}</p></div>
                <div>
                  <button onClick={() => reviewMistake(item.id, false)}>Reviewed</button>
                  <button onClick={() => reviewMistake(item.id, true)}>{item.resolved ? 'Reopen' : 'Resolved'}</button>
                </div>
              </article>
            ))}
            {!state.mistakes.length && <div className="interview-empty">No mistakes recorded. Your first mock will give you material.</div>}
          </section>
        </div>
      )}
    </div>
  );
}
