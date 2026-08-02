import { useEffect, useRef } from 'react';
import type { EncyclopediaChapter } from '../../domain/encyclopedia';
import { ArchitectureDiagram } from './ArchitectureDiagram';

function ListSection({ title, items }: { title: string; items: string[] }) {
  return <section className="chapter-section"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export function ChapterDetail({ chapter, onClose, completed, onToggleComplete }: { chapter: EncyclopediaChapter; onClose: () => void; completed: boolean; onToggleComplete: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { window.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [onClose]);
  return <div className="chapter-overlay" role="dialog" aria-modal="true" aria-labelledby="chapter-title">
    <button className="chapter-backdrop" onClick={onClose} aria-label="Close chapter" />
    <article className="chapter-detail">
      <header><div><span className="category-chip">{chapter.category}</span><h2 id="chapter-title">{chapter.title}</h2><p>{chapter.summary}</p></div><button ref={closeButton} onClick={onClose} aria-label="Close chapter">×</button></header>
      <div className="chapter-body">
        <section className="chapter-callout"><span>PROBLEM STATEMENT</span><p>{chapter.problemStatement}</p></section>
        <section className="chapter-interview"><span>INTERVIEW QUESTION</span><h3>{chapter.interviewQuestion}</h3></section>
        <ListSection title="Core concepts" items={chapter.coreConcepts} />
        <section className="chapter-section full"><h3>Architecture diagram</h3><ArchitectureDiagram source={chapter.architectureDiagram} title={chapter.title} /></section>
        <ListSection title="Worked solution" items={chapter.solutionApproach} />
        <ListSection title="Design patterns" items={chapter.designPatterns} />
        <ListSection title="Trade-offs" items={chapter.tradeoffs} />
        <ListSection title="Failure scenarios" items={chapter.failureScenarios} />
        <ListSection title="Production considerations" items={chapter.productionConsiderations} />
        <ListSection title="Staff Engineer discussion" items={chapter.staffDiscussion} />
        <ListSection title="Related topics" items={chapter.relatedTopics} />
        <ListSection title="Real-world systems" items={chapter.realWorldSystems} />
        <ListSection title="Follow-up interview questions" items={chapter.followUpQuestions} />
        <ListSection title="Cheat sheet" items={chapter.cheatSheet} />
        <section className="chapter-section full"><h3>Flashcards</h3><div className="flashcards">{chapter.flashcards.map((card) => <details key={card.question}><summary>{card.question}</summary><p>{card.answer}</p></details>)}</div></section>
        <section className="minute-answer full"><span>ONE-MINUTE INTERVIEW ANSWER</span><p>{chapter.oneMinuteAnswer}</p></section>
        <section className="chapter-completion"><div><strong>{completed ? 'Chapter evidenced' : 'Finish with retrieval'}</strong><p>Explain the answer aloud, then mark complete. Reading alone is not mastery.</p></div><button className="button primary" onClick={onToggleComplete}>{completed ? 'Reopen chapter' : 'Mark chapter complete'}</button></section>
      </div>
    </article>
  </div>;
}
