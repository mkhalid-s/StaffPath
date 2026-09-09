import { COMPANY_PACKS, getActivePack, type CompanyPackId } from '../../data/companyPacks';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { appStore, useStaffPathState } from '../../lib/appStore';
import { Link } from '../../lib/router';

function selectPack(id: CompanyPackId) {
  appStore.update((current) => ({
    ...current,
    profile: { ...current.profile, selectedCompanyPack: id },
  }));
}

export function PackPage() {
  const state = useStaffPathState();
  const selected = state.profile.selectedCompanyPack;
  const pack = getActivePack(selected);
  const completed = new Set(state.completedChapters);

  return (
    <div className="page pack-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMPANY INTERVIEW PATH</p>
          <h1>{pack ? `${pack.company} overlay` : 'Pick the loop you are actually interviewing for'}</h1>
          <p>
            Packs do not replace the Staff core. They overlay company-specific angles, signals, and practice prompts onto the same encyclopedia and practice lab.
            {pack ? ` ${Object.keys(pack.chapterAngles).length} chapters and ${pack.practiceScenarios.length} scenarios are queued for ${pack.company}.` : ' Choose one pack to get a study path you can follow today.'}
          </p>
        </div>
      </div>

      <div className="mode-cards settings-mode-cards pack-picker">
        <button type="button" className={`mode-card ${selected === 'none' ? 'selected' : ''}`} onClick={() => selectPack('none')}>
          <strong>General Staff</strong>
          <span>No overlay</span>
          <p>Use the curriculum map as-is. Best while you are still deciding where to interview.</p>
        </button>
        {Object.values(COMPANY_PACKS).map((item) => (
          <button key={item.id} type="button" className={`mode-card ${selected === item.id ? 'selected' : ''}`} onClick={() => selectPack(item.id)}>
            <strong>{item.label}</strong>
            <span>{item.company}</span>
            <p>{item.description}</p>
          </button>
        ))}
      </div>

      {!pack && (
        <div className="interview-empty">
          Select a company above. You will get a chapter reading list with interviewer angles, pack-only scenarios, and the behavioral questions that round actually uses.
        </div>
      )}

      {pack && (
        <>
          <section className="pack-brief">
            <article>
              <p className="eyebrow">HOW THE LOOP RUNS</p>
              <h2>{pack.interviewFormat}</h2>
            </article>
            <article>
              <p className="eyebrow">WHAT THEY SCORE</p>
              <ul>{pack.keySignals.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <p className="eyebrow">HOW PEOPLE FAIL</p>
              <ul>{pack.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">STEP 1 · READ WITH THEIR LENS</p>
                <h2>Chapters this pack rewrites</h2>
              </div>
              <span className="unlock-count">
                {Object.keys(pack.chapterAngles).filter((id) => completed.has(id)).length}/{Object.keys(pack.chapterAngles).length} read
              </span>
            </div>
            <p className="pack-lead">Open a chapter. The pack angle sits at the top — answer that lens, not a generic summary.</p>
            <div className="pack-chapter-list">
              {Object.entries(pack.chapterAngles).map(([id, angle]) => {
                const chapter = encyclopediaChapters.find((item) => item.id === id);
                return (
                  <Link key={id} className="pack-chapter-row" to={`/encyclopedia?chapter=${encodeURIComponent(id)}`}>
                    <div>
                      <strong>{chapter?.title ?? id}</strong>
                      <p>{angle}</p>
                    </div>
                    <em>{completed.has(id) ? 'Reviewed ✓' : 'Open →'}</em>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">STEP 2 · PRACTICE THEIR PROMPTS</p>
                <h2>Pack scenarios</h2>
              </div>
            </div>
            <div className="attempt-grid">
              {pack.practiceScenarios.map((scenario) => (
                <Link
                  key={scenario.title}
                  className="pack-scenario-card"
                  to={`/practice?track=${scenario.track}&packScenario=${encodeURIComponent(scenario.title)}`}
                >
                  <span>{scenario.track}</span>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.prompt}</p>
                  <strong>Start this prompt →</strong>
                </Link>
              ))}
            </div>
          </section>

          <section className="pack-behavior">
            <div className="section-heading">
              <div>
                <p className="eyebrow">STEP 3 · BEHAVIORAL</p>
                <h2>Questions to storyboard this week</h2>
              </div>
            </div>
            <ul className="pack-questions">
              {pack.behavioralQuestions.map((question) => <li key={question}>{question}</li>)}
            </ul>
            <Link className="button primary" to="/interviews">Score a mock in Interview Studio</Link>
          </section>
        </>
      )}
    </div>
  );
}
