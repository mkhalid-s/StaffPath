import type { CompanyPackId } from '../../data/companyPacks';
import { COMPANY_PACKS } from '../../data/companyPacks';
import { appStore, useStaffPathState } from '../../lib/appStore';

interface PackWithDetails {
  interviewFormat?: string;
  keySignals?: string[];
  commonMistakes?: string[];
}

export function CompanyPackSelection() {
  const state = useStaffPathState();
  const selected = state.profile.selectedCompanyPack;

  return (
    <section className="settings-section">
      <div className="section-heading">
        <div><p className="eyebrow">COMPANY PACK</p><h2>Interview context overlay</h2></div>
      </div>
      <p>Add company-specific angles to encyclopedia chapters and practice scenarios. Core content stays the same — packs layer on context.</p>
      <div className="mode-cards settings-mode-cards">
        <button
          type="button"
          className={`mode-card ${selected === 'none' ? 'selected' : ''}`}
          onClick={() => appStore.update((c) => ({ ...c, profile: { ...c.profile, selectedCompanyPack: 'none' } }))}
        >
          <strong>None</strong>
          <span>General Staff preparation</span>
        </button>
        {(Object.values(COMPANY_PACKS)).map((pack) => (
          <button
            key={pack.id}
            type="button"
            className={`mode-card ${selected === pack.id ? 'selected' : ''}`}
            onClick={() => appStore.update((c) => ({ ...c, profile: { ...c.profile, selectedCompanyPack: pack.id as CompanyPackId } }))}
          >
            <strong>{pack.label}</strong>
            <span>{pack.company}</span>
            <p>{pack.description}</p>
          </button>
        ))}
      </div>
      {selected !== 'none' && COMPANY_PACKS[selected] && (
        <div className="pack-preview">
          <p className="eyebrow">PACK FOCUS</p>
          <div className="topic-cloud">
            {COMPANY_PACKS[selected].focus.map((item) => <span key={item}>{item}</span>)}
          </div>
          {(COMPANY_PACKS[selected] as PackWithDetails).interviewFormat && (
            <>
              <p className="eyebrow">INTERVIEW FORMAT</p>
              <p>{(COMPANY_PACKS[selected] as PackWithDetails).interviewFormat}</p>
            </>
          )}
          {((COMPANY_PACKS[selected] as PackWithDetails).keySignals?.length ?? 0) > 0 && (
            <>
              <p className="eyebrow">WHAT THEY LOOK FOR</p>
              <ul className="pack-questions">
                {(COMPANY_PACKS[selected] as PackWithDetails).keySignals!.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
          {((COMPANY_PACKS[selected] as PackWithDetails).commonMistakes?.length ?? 0) > 0 && (
            <>
              <p className="eyebrow">COMMON MISTAKES</p>
              <ul className="pack-questions">
                {(COMPANY_PACKS[selected] as PackWithDetails).commonMistakes!.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
          <p className="eyebrow">SAMPLE BEHAVIORAL QUESTIONS</p>
          <ul className="pack-questions">
            {COMPANY_PACKS[selected].behavioralQuestions.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
