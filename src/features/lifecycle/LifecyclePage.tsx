const stages = [
  ['Discover', 'Baseline skills, goals, target roles, and evidence gaps.'],
  ['Plan', 'Build a realistic 90-day path and weekly outcomes.'],
  ['Learn', 'Use structured chapters, references, and spaced recall.'],
  ['Practice', 'Solve design, incident, SDLC, and people scenarios.'],
  ['Reflect', 'Capture decisions, mistakes, feedback, and artifacts.'],
  ['Assess', 'Use scorecards and readiness gates—not completion alone.'],
  ['Interview', 'Run timed mocks and adapt evidence to target companies.'],
  ['Operate', 'Continue the system after promotion or placement.'],
];

export function LifecyclePage() {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">COMPLETE LIFECYCLE</p><h1>Preparation is a feedback system.</h1><p>Every activity should improve judgment, produce evidence, or reveal the next gap.</p></div></div><div className="stage-list">{stages.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{copy}</p></div><strong>{index < stages.length - 1 ? '↓' : '↻'}</strong></article>)}</div></div>;
}
