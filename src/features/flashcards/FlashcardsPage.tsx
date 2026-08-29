import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChapterCategory } from '../../domain/encyclopedia';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';

interface ReviewCard {
  id: string;
  chapterId: string;
  chapterTitle: string;
  category: ChapterCategory;
  question: string;
  answer: string;
}

const categories: Array<'All' | ChapterCategory> = ['All', 'Systems', 'Data', 'Reliability', 'AI', 'Architecture', 'Leadership'];
const KNOWN_KEY = 'staffpath-flashcard-known';

function loadKnown(): Set<string> {
  try {
    const raw = localStorage.getItem(KNOWN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function saveKnown(known: Set<string>) {
  try {
    localStorage.setItem(KNOWN_KEY, JSON.stringify([...known]));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const allCards: ReviewCard[] = encyclopediaChapters.flatMap((chapter) =>
  chapter.flashcards.map((card, index) => ({
    id: `${chapter.id}-${index}`,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    category: chapter.category,
    question: card.question,
    answer: card.answer,
  }))
);

export function FlashcardsPage() {
  const [category, setCategory] = useState<'All' | ChapterCategory>('All');
  const [deck, setDeck] = useState<ReviewCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(() => loadKnown());
  const [reviewAgain, setReviewAgain] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const filteredCards = useMemo(
    () => (category === 'All' ? allCards : allCards.filter((c) => c.category === category)),
    [category]
  );

  const buildDeck = useCallback((cards: ReviewCard[], doShuffle: boolean) => {
    setDeck(doShuffle ? shuffle(cards) : cards);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setReviewAgain(new Set());
  }, []);

  useEffect(() => {
    buildDeck(filteredCards, false);
  }, [filteredCards, buildDeck]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'l') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'h') goPrev();
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, deck.length]);

  const current = deck[index];

  function goNext() {
    if (index + 1 >= deck.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setFlipped(false);
  }

  function handleShuffle() {
    buildDeck(filteredCards, true);
  }

  function markKnown(cardId: string) {
    setKnown((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      saveKnown(next);
      return next;
    });
    setReviewAgain((prev) => {
      const next = new Set(prev);
      next.delete(cardId);
      return next;
    });
    goNext();
  }

  function markReviewAgain(cardId: string) {
    setKnown((prev) => {
      const next = new Set(prev);
      next.delete(cardId);
      saveKnown(next);
      return next;
    });
    setReviewAgain((prev) => new Set(prev).add(cardId));
    goNext();
  }

  const knownCount = deck.filter((c) => known.has(c.id)).length;
  const reviewCount = reviewAgain.size;

  return (
    <div className="page flashcard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SPACED RECALL</p>
          <h1>Flashcard review</h1>
          <p>Drill every concept flashcard across the encyclopedia. Reading is not retention — recall is.</p>
        </div>
        <div className="chapter-count">
          <strong>{allCards.length}</strong>
          <span>total flashcards</span>
        </div>
      </div>

      <div className="flashcard-controls">
        <div className="category-filters">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="flashcard-progress">
          {deck.length > 0 && !finished && (
            <>
              <span>Card {index + 1} of {deck.length}</span>
              {current && <span className="category-chip">{current.category}</span>}
            </>
          )}
        </div>
      </div>

      {finished || deck.length === 0 ? (
        <div className="flashcard-summary">
          <h2>{deck.length === 0 ? 'No cards in this category' : 'Deck complete'}</h2>
          {deck.length > 0 && (
            <div className="flashcard-summary-stats">
              <div><strong>{knownCount}</strong><span>known</span></div>
              <div><strong>{reviewCount}</strong><span>to review</span></div>
              <div><strong>{deck.length}</strong><span>total</span></div>
            </div>
          )}
          <button className="button primary" onClick={() => buildDeck(filteredCards, false)}>Restart deck</button>
        </div>
      ) : (
        <>
          <div className="flashcard-viewport">
            {current && (
              <div
                className={`flashcard ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
                aria-label={flipped ? 'Showing answer, click to show question' : 'Showing question, click to reveal answer'}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-face flashcard-question">
                    <span className="eyebrow">{current.chapterTitle}</span>
                    <p>{current.question}</p>
                    <em>Click to reveal answer</em>
                  </div>
                  <div className="flashcard-face flashcard-answer">
                    <span className="eyebrow">Answer</span>
                    <p>{current.answer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flashcard-known-row">
            <button className="button" onClick={() => current && markReviewAgain(current.id)}>↻ Review again</button>
            <button className="button primary" onClick={() => current && markKnown(current.id)}>✓ Mark as known</button>
          </div>

          <div className="flashcard-nav">
            <button className="button" onClick={goPrev} disabled={index === 0}>← Previous</button>
            <button className="button" onClick={handleShuffle}>⤨ Shuffle</button>
            <button className="button" onClick={goNext}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}
