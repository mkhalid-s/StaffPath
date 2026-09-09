import { useMemo, useState } from 'react';
import { curriculumModules, type CurriculumLevel } from '../../data/curriculum';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { roadmapSessions, roadmapWeeks } from '../../data/roadmap';
import { getActivePack } from '../../data/companyPacks';
import { useStaffPathState } from '../../lib/appStore';
import { Link } from '../../lib/router';

function chapterById(id: string) {
  return encyclopediaChapters.find((chapter) => chapter.id === id);
}

function weekProgress(week: number, roadmap: Record<string, { completedAt?: string }>) {
  const sessions = roadmapSessions.filter((session) => session.week === week);
  const completed = sessions.filter((session) => roadmap[String(session.id)]?.completedAt).length;
  return { completed, total: sessions.length };
}

export function CurriculumPage() {
  const state = useStaffPathState();
  const [level, setLevel] = useState<'All' | CurriculumLevel>('All');
  const pack = getActivePack(state.profile.selectedCompanyPack);
  const completedIds = new Set(state.completedChapters);

  const visible = useMemo(
    () => curriculumModules.filter((module) => level === 'All' || module.level === level),
    [level],
  );

  const completedWeeks = curriculumModules.filter((module) => {
    const { completed, total } = weekProgress(module.roadmapWeek, state.roadmap);
    return total > 0 && completed === total;
  }).length;

  const chaptersRead = curriculumModules.reduce((sum, module) => (
    sum + module.chapterIds.filter((id) => completedIds.has(id)).length
  ), 0);
  const chaptersTotal = curriculumModules.reduce((sum, module) => sum + module.chapterIds.length, 0);

  return (
    <div className="page curriculum-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">HOW TO STUDY</p>
          <h1>A 12-week knowledge map</h1>
          <p>Curriculum tells you what to learn. The 90-day roadmap is the daily practice loop. Encyclopedia is the depth. Follow a week in this order: read → practice → roadmap session.</p>
        </div>
        <div className="chapter-count">
          <strong>{chaptersRead}/{chaptersTotal}</strong>
          <span>map chapters evidenced</span>
        </div>
      </div>

      <section className="how-it-fits" aria-label="How StaffPath fits together">
        <article>
          <span>01</span>
          <h2>Curriculum</h2>
          <p>The map. Pick a week, open its chapters, then run a matching practice prompt.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Roadmap</h2>
          <p>90 timed sessions. Each curriculum week points at the matching roadmap week so you apply the idea the same day.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Company path</h2>
          <p>{pack ? `${pack.company} overlay is on — chapter angles and pack scenarios follow you into study.` : 'Optional. Overlay Google, Meta, Amazon, and others onto the same core map.'}</p>
          <Link className="text-link" to="/pack">{pack ? `Open ${pack.label} →` : 'Choose a company →'}</Link>
        </article>
      </section>

      <div className="category-filters">
        {(['All', 'Basic', 'Advanced', 'Mastery'] as const).map((item) => (
          <button className={level === item ? 'active' : ''} key={item} onClick={() => setLevel(item)}>{item}</button>
        ))}
      </div>

      <div className="curriculum-list">
        {visible.map((module) => {
          const chapters = module.chapterIds.map((id) => chapterById(id)).filter(Boolean);
          const readCount = module.chapterIds.filter((id) => completedIds.has(id)).length;
          const roadmap = weekProgress(module.roadmapWeek, state.roadmap);
          const roadmapTitle = roadmapWeeks[module.roadmapWeek - 1]?.title ?? `Week ${module.roadmapWeek}`;
          const done = readCount === module.chapterIds.length && roadmap.total > 0 && roadmap.completed === roadmap.total;
          return (
            <article key={module.week} className="curriculum-module" data-done={done || undefined}>
              <header>
                <div>
                  <p className="eyebrow">WEEK {module.week} · {module.level.toUpperCase()}</p>
                  <h2>{module.title}</h2>
                  <p>{module.intent}</p>
                </div>
                <div className="curriculum-module-meta">
                  <strong>{readCount}/{module.chapterIds.length}</strong>
                  <span>chapters</span>
                </div>
              </header>
              <div className="curriculum-progress">
                <div className="curriculum-progress-bar">
                  <div className="curriculum-progress-fill" style={{ width: `${Math.round((readCount / module.chapterIds.length) * 100)}%` }} data-done={readCount === module.chapterIds.length} />
                </div>
                <span className="curriculum-progress-label">
                  Roadmap week {module.roadmapWeek} · {roadmapTitle} · {roadmap.completed}/{roadmap.total} sessions
                </span>
              </div>
              <div className="study-path">
                <p className="eyebrow">STUDY THIS WEEK</p>
                <ol>
                  <li><strong>Read</strong> the chapters below. Mark complete only when you can teach the one-minute answer.</li>
                  <li><strong>Practice</strong> one {module.practiceTrack} scenario without notes.</li>
                  <li><strong>Apply</strong> on the matching roadmap week and capture evidence.</li>
                </ol>
              </div>
              <div className="curriculum-chapters">
                {chapters.map((chapter) => chapter && (
                  <Link
                    key={chapter.id}
                    className={`chapter-rec-chip ${completedIds.has(chapter.id) ? 'done' : ''}`}
                    to={`/encyclopedia?chapter=${encodeURIComponent(chapter.id)}`}
                  >
                    <span className="category-chip" data-cat={chapter.category}>{chapter.category}</span>
                    {chapter.title}
                    {completedIds.has(chapter.id) ? ' ✓' : ''}
                  </Link>
                ))}
              </div>
              <p className="curriculum-output"><strong>Evidence to produce:</strong> {module.output}</p>
              <div className="button-row">
                <Link className="button primary" to={`/encyclopedia?chapter=${encodeURIComponent(module.chapterIds[0])}`}>Start with {chapters[0]?.title ?? 'first chapter'}</Link>
                <Link className="button" to={`/practice?track=${module.practiceTrack}`}>Practice {module.practiceTrack}</Link>
                <Link className="button" to={`/roadmap?week=${module.roadmapWeek}`}>Open roadmap week {module.roadmapWeek}</Link>
              </div>
            </article>
          );
        })}
      </div>

      <section className="coverage-callout">
        <div>
          <p className="eyebrow">COVERAGE IS NOT READINESS</p>
          <h2>{completedWeeks} of 12 roadmap weeks finished</h2>
          <p>A checked chapter is not a passed interview. Use Coach for the next gap, then Interview Studio for a timed mock.</p>
        </div>
        <div className="button-row">
          <Link className="button primary" to="/coach">Ask Coach what is weak</Link>
          <Link className="button" to="/interviews">Run a mock</Link>
        </div>
      </section>
    </div>
  );
}
