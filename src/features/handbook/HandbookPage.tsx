import { useState } from 'react';
import { amazonLeadershipPrinciples, handbookTemplates } from '../../data/handbook';
import { roadmapSessions } from '../../data/roadmap';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { ArchitectureDiagram } from '../encyclopedia/ArchitectureDiagram';

type Tab = 'evidence' | 'stories' | 'diagrams' | 'templates';
const download = (name: string, content: string) => { const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); };

export function HandbookPage() {
  const state = useStaffPathState();
  const [tab, setTab] = useState<Tab>('evidence');
  const [story, setStory] = useState({ title: '', situation: '', task: '', action: '', result: '', reflection: '', principles: [] as string[] });
  const [diagramTitle, setDiagramTitle] = useState('System context');
  const [diagramSource, setDiagramSource] = useState('flowchart LR\n  U[User] --> G[API Gateway]\n  G --> S[Service]\n  S --> D[(Database)]');
  const sessionEvidence = roadmapSessions.filter((session) => { const record = state.roadmap[String(session.id)]; return record?.artifact || record?.reflection; });

  function saveStory(event: React.FormEvent) {
    event.preventDefault();
    if (!story.title.trim() || !story.action.trim() || !story.result.trim()) return;
    appStore.update((current) => ({ ...current, behavioralStories: [...current.behavioralStories, { ...story, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }] }));
    setStory({ title: '', situation: '', task: '', action: '', result: '', reflection: '', principles: [] });
  }
  function saveDiagram() {
    if (!diagramTitle.trim() || !diagramSource.trim()) return;
    appStore.update((current) => {
      const version = current.diagrams.filter((item) => item.title === diagramTitle.trim()).length + 1;
      return { ...current, diagrams: [...current.diagrams, { id: crypto.randomUUID(), title: diagramTitle.trim(), source: diagramSource.trim(), version, updatedAt: new Date().toISOString() }] };
    });
  }

  return <div className="page handbook-page">
    <div className="page-heading"><div><p className="eyebrow">YOUR PORTABLE SOURCE OF TRUTH</p><h1>Living Staff handbook</h1><p>Evidence, designs, reflections, decisions, and stories collect here as you work.</p></div><button className="button primary" onClick={() => download(`staffpath-handbook-${new Date().toISOString().slice(0, 10)}.md`, buildHandbookMarkdown(state))}>Export Markdown</button></div>
    <div className="handbook-stats"><div><strong>{sessionEvidence.length}</strong><span>session artifacts</span></div><div><strong>{state.practiceAttempts.length}</strong><span>practice attempts</span></div><div><strong>{state.behavioralStories.length}</strong><span>leadership stories</span></div><div><strong>{state.diagrams.length}</strong><span>diagram versions</span></div></div>
    <div className="interview-tabs">{(['evidence', 'stories', 'diagrams', 'templates'] as Tab[]).map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'evidence' && <div className="evidence-grid">
      {state.practiceAttempts.slice().reverse().map((attempt) => <article className="evidence-card" key={attempt.id}><span>{attempt.track.toUpperCase()} · {attempt.score}/{attempt.maxScore}</span><h3>{attempt.title}</h3><p>{attempt.response}</p>{attempt.reflection && <em>Reflection · {attempt.reflection}</em>}</article>)}
      {sessionEvidence.map((session) => { const record = state.roadmap[String(session.id)]; return <article className="evidence-card" key={`session-${session.id}`}><span>DAY {session.id} · {session.category.toUpperCase()}</span><h3>{session.title}</h3><p>{record.reflection}</p>{record.artifact && <em>Artifact · {record.artifact}</em>}</article>; })}
      {!sessionEvidence.length && !state.practiceAttempts.length && <div className="interview-empty">Complete roadmap work or save a practice attempt to build your evidence base.</div>}
    </div>}
    {tab === 'stories' && <div className="story-layout">
      <form className="story-form" onSubmit={saveStory}><h2>Build a reusable STAR story</h2>{(['title', 'situation', 'task', 'action', 'result', 'reflection'] as const).map((field) => <label key={field}>{field}<textarea aria-label={`Story ${field}`} value={story[field]} onChange={(event) => setStory((value) => ({ ...value, [field]: event.target.value }))} /></label>)}<fieldset><legend>Company-value overlays (optional)</legend>{amazonLeadershipPrinciples.map((principle) => <label key={principle}><input type="checkbox" checked={story.principles.includes(principle)} onChange={(event) => setStory((value) => ({ ...value, principles: event.target.checked ? [...value.principles, principle] : value.principles.filter((item) => item !== principle) }))} />{principle}</label>)}</fieldset><button className="button primary" disabled={!story.title.trim() || !story.action.trim() || !story.result.trim()}>Save story</button></form>
      <section className="story-bank"><h2>Story bank</h2>{state.behavioralStories.map((item) => <article key={item.id}><span>{item.principles.join(' · ') || 'General Staff leadership'}</span><h3>{item.title}</h3><p><strong>Action:</strong> {item.action}</p><p><strong>Result:</strong> {item.result}</p><em>{item.reflection}</em></article>)}{!state.behavioralStories.length && <div className="interview-empty">Aim for 10–12 adaptable stories with measured outcomes and honest reflection.</div>}</section>
    </div>}
    {tab === 'diagrams' && <div className="diagram-studio">
      <section><h2>Architecture diagram studio</h2><p>Edit Mermaid flowchart source. Saving the same title creates a new version instead of overwriting prior evidence.</p><label>Diagram title<input aria-label="Diagram title" value={diagramTitle} onChange={(event) => setDiagramTitle(event.target.value)} /></label><label>Mermaid source<textarea aria-label="Mermaid source" value={diagramSource} onChange={(event) => setDiagramSource(event.target.value)} /></label><button className="button primary" onClick={saveDiagram}>Save new version</button></section>
      <section><ArchitectureDiagram title={diagramTitle || 'Diagram'} source={diagramSource} /><div className="diagram-history">{state.diagrams.slice().reverse().map((item) => <button key={item.id} onClick={() => { setDiagramTitle(item.title); setDiagramSource(item.source); }}><span>{item.title} · v{item.version}</span><small>{new Date(item.updatedAt).toLocaleDateString()}</small></button>)}{!state.diagrams.length && <div className="interview-empty">Saved diagram versions will appear here.</div>}</div></section>
    </div>}
    {tab === 'templates' && <div className="template-grid">{handbookTemplates.map((template) => <article className="template-card" key={template.title}><h3>{template.title}</h3><pre>{template.body}</pre><button className="button" onClick={() => navigator.clipboard.writeText(template.body)}>Copy template</button></article>)}</div>}
  </div>;
}

export function buildHandbookMarkdown(state: ReturnType<typeof appStore.get>) {
  const completed = Object.values(state.roadmap).filter((record) => record.completedAt).length;
  return `# Staff Engineer Handbook\n\nGenerated ${new Date().toISOString().slice(0, 10)}\n\n## Progress\n\n- Roadmap sessions: ${completed}/90\n- Practice attempts: ${state.practiceAttempts.length}\n- Behavioral stories: ${state.behavioralStories.length}\n- Journal entries: ${state.journal.length}\n- Diagram versions: ${state.diagrams.length}\n\n## Practice evidence\n\n${state.practiceAttempts.map((item) => `### ${item.title}\n\n**Track:** ${item.track} · **Score:** ${item.score}/${item.maxScore}\n\n${item.response}\n\n**Reflection:** ${item.reflection || 'Not recorded.'}`).join('\n\n') || 'No practice evidence yet.'}\n\n## Leadership stories\n\n${state.behavioralStories.map((item) => `### ${item.title}\n\n**Situation:** ${item.situation}\n\n**Task:** ${item.task}\n\n**Action:** ${item.action}\n\n**Result:** ${item.result}\n\n**Reflection:** ${item.reflection}`).join('\n\n') || 'No stories yet.'}\n\n## Architecture diagrams\n\n${state.diagrams.map((item) => `### ${item.title} v${item.version}\n\n\`\`\`mermaid\n${item.source}\n\`\`\``).join('\n\n') || 'No diagrams yet.'}\n\n## Learning journal\n\n${state.journal.map((item) => `### ${item.learning}\n\n${item.application}${item.artifact ? `\n\n**Artifact:** ${item.artifact}` : ''}`).join('\n\n') || 'No journal entries yet.'}`;
}
