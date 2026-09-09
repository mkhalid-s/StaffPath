import { useMemo } from 'react';
import { roadmapSessions } from '../../data/roadmap';
import { useStaffPathState } from '../../lib/appStore';
import { Link } from '../../lib/router';

const stages = [
  {
    title: 'Discover',
    copy: 'Baseline skills, goals, target roles, and evidence gaps.',
    to: '/skills',
    cta: 'Open skills assessment',
  },
  {
    title: 'Plan',
    copy: 'Build a realistic 90-day path and weekly outcomes.',
    to: '/roadmap',
    cta: 'Open roadmap',
  },
  {
    title: 'Learn',
    copy: 'Use structured chapters, references, and spaced recall.',
    to: '/encyclopedia',
    cta: 'Open encyclopedia',
  },
  {
    title: 'Practice',
    copy: 'Solve design, incident, SDLC, and people scenarios.',
    to: '/practice',
    cta: 'Open practice lab',
  },
  {
    title: 'Reflect',
    copy: 'Capture decisions, mistakes, feedback, and artifacts.',
    to: '/journal',
    cta: 'Open journal',
  },
  {
    title: 'Assess',
    copy: 'Use scorecards and readiness gates — not completion alone.',
    to: '/skills',
    cta: 'Open assessment',
  },
  {
    title: 'Interview',
    copy: 'Run timed mocks and adapt evidence to target companies.',
    to: '/interviews',
    cta: 'Open interview studio',
  },
  {
    title: 'Operate',
    copy: 'Continue the system after promotion or placement.',
    to: '/roadmap',
    cta: 'Continue roadmap',
  },
];

interface Gate {
  label: string;
  pass: boolean;
  evidence: string;
}

export function LifecyclePage() {
  const state = useStaffPathState();

  const evidence = useMemo(() => {
    const sessionsComplete = Object.values(state.roadmap).filter((r) => r.completedAt).length;
    const totalSessions = roadmapSessions.length;
    const practiceCount = state.practiceAttempts.length;
    const designAttempts = state.practiceAttempts.filter((a) => {
      const id = typeof a === 'object' && 'scenarioId' in a ? String((a as { scenarioId?: unknown }).scenarioId) : '';
      return id.startsWith('design-') || id.includes('design');
    }).length;
    const mistakeCount = state.mistakes.length;
    const journalCount = state.journal.length;
    const mockCount = state.mockInterviews.length;
    const aiMocks = state.mockInterviews.filter((m) => m.type === 'ai-design').length;
    const behavioralMocks = state.mockInterviews.filter((m) => m.type === 'behavioral').length;
    const commCount = Object.values(state.communicationLessons).filter((l) => l.completedAt).length;
    const last3 = [...state.mockInterviews].reverse().slice(0, 3);
    const last3Avg = last3.length >= 3 ? last3.reduce((s, m) => s + m.score, 0) / 3 : 0;

    const stageEvidence = [
      { label: 'Discover', metric: state.profile.skillAssessmentComplete ? 'Assessment complete' : 'Assessment not started', pass: !!state.profile.skillAssessmentComplete },
      { label: 'Plan', metric: state.profile.onboardingComplete ? `Mode: ${state.profile.preparationMode ?? 'set'}` : 'Onboarding not complete', pass: !!state.profile.onboardingComplete },
      { label: 'Learn', metric: `${sessionsComplete} / ${totalSessions} sessions`, pass: sessionsComplete >= Math.round(totalSessions * 0.25) },
      { label: 'Practice', metric: `${practiceCount} attempt${practiceCount !== 1 ? 's' : ''}`, pass: practiceCount >= 10 },
      { label: 'Reflect', metric: `${mistakeCount} mistake${mistakeCount !== 1 ? 's' : ''} · ${journalCount} journal entr${journalCount !== 1 ? 'ies' : 'y'}`, pass: mistakeCount >= 5 && journalCount >= 3 },
      { label: 'Assess', metric: `${mockCount} mock${mockCount !== 1 ? 's' : ''} · avg ${last3.length ? last3.reduce((s, m) => s + m.score, 0) / last3.length : 0}/5`, pass: mockCount >= 3 },
      { label: 'Interview', metric: `${behavioralMocks} behavioral · ${aiMocks} AI design`, pass: mockCount >= 6 && behavioralMocks >= 2 && aiMocks >= 1 },
      { label: 'Operate', metric: `${sessionsComplete} / ${totalSessions} sessions · ${commCount} comm lessons`, pass: sessionsComplete === totalSessions },
    ];

    const gates: Gate[] = [
      { label: 'Run a complete 45-min design without losing structure', pass: designAttempts >= 3, evidence: `${designAttempts} design practice attempts` },
      { label: 'Estimate scale and connect it to architecture choices', pass: practiceCount >= 5, evidence: `${practiceCount} practice attempts total` },
      { label: 'Explain idempotency, retries, acknowledgment, and reconciliation', pass: mistakeCount >= 3, evidence: `${mistakeCount} mistakes captured and reviewed` },
      { label: 'Design overload protection for synchronized traffic', pass: designAttempts >= 2, evidence: `${designAttempts} design scenarios attempted` },
      { label: 'Design a production AI system with evaluation, freshness, and safety controls', pass: aiMocks >= 1, evidence: `${aiMocks} AI design mocks recorded` },
      { label: 'Have 12 metric-backed STAR stories adaptable to multiple principles', pass: behavioralMocks >= 3, evidence: `${behavioralMocks} behavioral mocks recorded` },
      { label: 'Explain one architecture decision to engineers, product, security, and executives', pass: commCount >= 5, evidence: `${commCount} communication lessons complete` },
      { label: 'Last 3 mocks average ≥ 4 / 5 with no dimension below 3', pass: last3.length >= 3 && last3Avg >= 4, evidence: last3.length >= 3 ? `Last 3 avg: ${Math.round(last3Avg * 10) / 10} / 5` : `Only ${last3.length} mocks recorded` },
    ];

    const gatesPassed = gates.filter((g) => g.pass).length;
    return { stageEvidence, gates, gatesPassed, sessionsComplete, totalSessions };
  }, [state]);

  const overallPct = Math.round((evidence.gatesPassed / evidence.gates.length) * 100);

  return (
    <div className="page lifecycle-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">REFERENCE · NOT YOUR DAILY CALENDAR</p>
          <h1>Preparation is a feedback system.</h1>
          <p>Every activity should improve judgment, produce evidence, or reveal the next gap. For day-to-day prep, follow <Link to="/curriculum">Curriculum week-by-week</Link> and the <Link to="/roadmap">90-day roadmap</Link>. Use this page for the full delivery lifecycle picture.</p>
        </div>
        <div className="chapter-count">
          <strong>{evidence.gatesPassed}/{evidence.gates.length}</strong>
          <span>gates passed</span>
        </div>
      </div>

      <div className="stage-list">
        {stages.map(({ title, copy, to, cta }, index) => {
          const ev = evidence.stageEvidence[index];
          return (
            <article key={title} data-pass={ev.pass || undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
                <div className="stage-evidence">
                  <span className={`stage-badge ${ev.pass ? 'stage-badge--pass' : 'stage-badge--open'}`}>
                    {ev.pass ? '✓' : '○'} {ev.metric}
                  </span>
                  <Link to={to} className="stage-link">{cta} →</Link>
                </div>
              </div>
              <strong>{index < stages.length - 1 ? '↓' : '↻'}</strong>
            </article>
          );
        })}
      </div>

      <section className="readiness-gates">
        <div className="section-heading">
          <p className="eyebrow">READINESS GATES</p>
          <h2>Interview readiness — {overallPct}% ({evidence.gatesPassed}/{evidence.gates.length})</h2>
          <p>Pass all eight gates before your target interview date.</p>
        </div>
        <div className="gates-progress">
          <div className="gates-bar"><div className="gates-fill" style={{ width: `${overallPct}%` }} /></div>
        </div>
        <div className="gates-list">
          {evidence.gates.map((gate) => (
            <div key={gate.label} className={`gate-item ${gate.pass ? 'gate-item--pass' : ''}`}>
              <span className="gate-check">{gate.pass ? '✓' : '○'}</span>
              <div>
                <p className="gate-label">{gate.label}</p>
                <p className="gate-evidence">{gate.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
