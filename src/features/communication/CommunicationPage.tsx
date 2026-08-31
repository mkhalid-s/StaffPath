import { useState } from 'react';
import { communicationLessons } from '../../data/communicationLessons';
import { appStore, useStaffPathState } from '../../lib/appStore';

const LESSON_GROUPS = [
  { label: 'Presence & Voice', ids: ['first-impression', 'voice-trust', 'confidence', 'body-language'] },
  { label: 'Speaking & Influence', ids: ['speak-up', 'storytelling', 'read-room', 'interrupt'] },
  { label: 'Difficult Conversations', ids: ['feedback', 'difficult-people', 'say-no', 'conflict', 'listening', 'small-talk'] },
  { label: 'Written Communication', ids: ['write-design-doc', 'executive-brief', 'run-design-review', 'write-rfc', 'present-tradeoffs'] },
];

export function CommunicationPage() {
  const state = useStaffPathState();
  const completed = communicationLessons.filter((lesson) => state.communicationLessons[lesson.id]?.completedAt).length;
  const [selectedId, setSelectedId] = useState(communicationLessons.find((lesson) => !state.communicationLessons[lesson.id]?.completedAt)?.id || communicationLessons[0].id);
  const lesson = communicationLessons.find((item) => item.id === selectedId)!;
  const record = state.communicationLessons[selectedId] || { practiceNote: '', confidence: 3 };
  const update = (patch: Partial<typeof record>) => appStore.update((current) => ({ ...current, communicationLessons: { ...current.communicationLessons, [selectedId]: { ...record, ...patch } } }));
  return <div className="page communication-page"><div className="page-heading"><div><p className="eyebrow">NONTECHNICAL MASTERY</p><h1>Communication Gym</h1><p>Practice presence, listening, conflict, feedback, storytelling, and influence as observable behaviors.</p></div><div className="progress-orb"><strong>{completed}/{communicationLessons.length}</strong><span>lessons evidenced</span></div></div>
    <div className="communication-layout"><nav aria-label="Communication lessons">{LESSON_GROUPS.map((group) => {
      const groupLessons = group.ids.map((id) => communicationLessons.find((l) => l.id === id)).filter(Boolean) as typeof communicationLessons;
      if (!groupLessons.length) return null;
      return <div key={group.label} className="comm-nav-group">
        <span className="nav-group-label">{group.label}</span>
        {groupLessons.map((item) => <button className={`${item.id === selectedId ? 'active' : ''} ${state.communicationLessons[item.id]?.completedAt ? 'done' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)}><span>{item.minutes}m</span><div><strong>{item.title}</strong></div><em>{state.communicationLessons[item.id]?.completedAt ? '✓' : '→'}</em></button>)}
      </div>;
    })}</nav>
      <section className="communication-workout"><span className="category-chip">{lesson.minutes} MINUTE WORKOUT</span><h2>{lesson.title}</h2><p className="lesson-outcome">{lesson.outcome}</p><div className="drill-list">{lesson.drills.map((drill, index) => <article key={drill}><span>0{index + 1}</span><p>{drill}</p></article>)}</div><div className="lesson-caution"><strong>Responsible practice</strong><p>{lesson.caution}</p></div><label>Practice evidence<textarea aria-label="Communication practice evidence" value={record.practiceNote} onChange={(event) => update({ practiceNote: event.target.value })} placeholder="What did you practice? What feedback or observable result did you get?" /></label><label className="confidence-row"><span>Confidence after practice</span><input aria-label="Communication confidence" type="range" min="1" max="5" value={record.confidence} onChange={(event) => update({ confidence: Number(event.target.value) })} /><strong>{record.confidence}/5</strong></label><button className="button primary" disabled={!record.practiceNote.trim() || Boolean(record.completedAt)} onClick={() => update({ completedAt: new Date().toISOString() })}>{record.completedAt ? 'Evidence captured ✓' : 'Complete with evidence'}</button></section>
    </div></div>;
}
