import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChapterCategory } from '../../domain/encyclopedia';
import { encyclopediaChapters } from '../../data/encyclopediaChapters';
import { localDayKey } from '../../lib/dates';

interface ReviewCard {
  id: string;
  chapterId: string;
  chapterTitle: string;
  category: ChapterCategory;
  question: string;
  answer: string;
}

interface ScheduleEntry {
  interval: number;
  nextReview: string;
  repetitions: number;
}

const categories: Array<'All' | ChapterCategory> = ['All', 'Systems', 'Data', 'Reliability', 'AI', 'Architecture', 'Leadership'];
const KNOWN_KEY = 'staffpath-flashcard-known';
const SCHEDULE_KEY = 'staffpath-flashcard-schedule';

function loadKnownLegacy(): Set<string> {
  try {
    const raw = localStorage.getItem(KNOWN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function todayIso(): string {
  return localDayKey();
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localDayKey(d);
}

function loadSchedule(): Record<string, ScheduleEntry> {
  let schedule: Record<string, ScheduleEntry> = {};
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (raw) schedule = JSON.parse(raw) ?? {};
  } catch {
    schedule = {};
  }
  for (const cardId of loadKnownLegacy()) {
    if (!schedule[cardId]) {
      schedule[cardId] = { interval: 7, nextReview: addDays(7), repetitions: 3 };
    }
  }
  return schedule;
}

function saveSchedule(schedule: Record<string, ScheduleEntry>) {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
}

function nextEntry(prev: ScheduleEntry | undefined, quality: 'easy' | 'hard'): ScheduleEntry {
  if (quality === 'hard') {
    return { interval: 0, nextReview: todayIso(), repetitions: 0 };
  }
  const repetitions = (prev?.repetitions ?? 0) + 1;
  let interval: number;
  if (repetitions === 1) interval = 1;
  else if (repetitions === 2) interval = 4;
  else interval = Math.round((prev?.interval || 4) * 2.5);
  return { interval, nextReview: addDays(interval), repetitions };
}

function cardState(entry: ScheduleEntry | undefined): 'new' | 'learning' | 'known' {
  if (!entry) return 'new';
  return entry.interval >= 7 ? 'known' : 'learning';
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
  const [dueOnly, setDueOnly] = useState(false);
  const [deck, setDeck] = useState<ReviewCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, ScheduleEntry>>(() => loadSchedule());
  const [lastRated, setLastRated] = useState<{ id: string; interval: number } | null>(null);
  const [finished, setFinished] = useState(false);

  const today = todayIso();

  const filteredCards = useMemo(() => {
    let cards = category === 'All' ? allCards : allCards.filter((c) => c.category === category);
    if (dueOnly) {
      cards = cards.filter((c) => {
        const entry = schedule[c.id];
        return !entry || entry.nextReview <= today;
      });
    }
    return cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, dueOnly]);

  const buildDeck = useCallback((cards: ReviewCard[], doShuffle: boolean) => {
    setDeck(doShuffle ? shuffle(cards) : cards);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setLastRated(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck.length]);

  const current = deck[index];

  function goNext() {
    if (index + 1 >= deck.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
    setLastRated(null);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setFlipped(false);
    setLastRated(null);
  }

  function handleShuffle() {
    buildDeck(filteredCards, true);
  }

  function rate(cardId: string, quality: 'easy' | 'hard') {
    const entry = nextEntry(schedule[cardId], quality);
    setSchedule((prev) => {
      const next = { ...prev, [cardId]: entry };
      saveSchedule(next);
      return next;
    });
    setLastRated({ id: cardId, interval: entry.interval });
  }

  const summaryStats = useMemo(() => {
    let known = 0;
    let learning = 0;
    let isNew = 0;
    for (const c of deck) {
      const state = cardState(schedule[c.id]);
      if (state === 'known') known++;
      else if (state === 'learning') learning++;
      else isNew++;
    }
    return { known, learning, isNew };
  }, [deck, schedule]);

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
          <button className={dueOnly ? 'active' : ''} onClick={() => setDueOnly((v) => !v)}>Due today</button>
        </div>
        <div className="flashcard-progress">
          {deck.length > 0 && !finished && (
            <>
              <span>Card {index + 1} of {deck.length}</span>
              {current && <span className="category-chip">{current.category}</span>}
              {current && (
                <span className="flashcard-state-chip" data-state={cardState(schedule[current.id])}>
                  {cardState(schedule[current.id])}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {finished || deck.length === 0 ? (
        <div className="flashcard-summary">
          <h2>{deck.length === 0 ? 'No cards match these filters' : 'Deck complete'}</h2>
          {deck.length > 0 && (
            <div className="flashcard-summary-stats">
              <div><strong>{summaryStats.known}</strong><span>known</span></div>
              <div><strong>{summaryStats.learning}</strong><span>learning</span></div>
              <div><strong>{summaryStats.isNew}</strong><span>new</span></div>
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
            {lastRated && current && lastRated.id === current.id ? (
              <div className="flashcard-rated">
                <span>
                  {lastRated.interval === 0
                    ? 'Review again shortly'
                    : `Next review in ${lastRated.interval} day${lastRated.interval === 1 ? '' : 's'}`}
                </span>
                <button className="button primary" onClick={goNext}>Continue →</button>
              </div>
            ) : (
              <>
                <button className="button" onClick={() => current && rate(current.id, 'hard')}>Hard ↻</button>
                <button className="button primary" onClick={() => current && rate(current.id, 'easy')}>Easy ✓</button>
              </>
            )}
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
