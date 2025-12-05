import { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiRotateCcw, FiShuffle } from 'react-icons/fi';
import { scienceWords } from '../data/words.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const FlashcardsPage = () => {
  const { t } = useLanguage();
  const [cards, setCards] = useState(() => scienceWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const localizedCard = useMemo(() => {
    if (!currentCard) return null;
    return {
      term: t(['words', currentCard.id, 'term'], currentCard.term),
      definition: t(['words', currentCard.id, 'definition'], currentCard.definition),
      example: t(['words', currentCard.id, 'example'], currentCard.example),
      source: t(['words', currentCard.id, 'source'], currentCard.source)
    };
  }, [currentCard, t]);

  const goToCard = (delta) => {
    setCurrentIndex((previous) => {
      const nextIndex = (previous + delta + cards.length) % cards.length;
      return nextIndex;
    });
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...scienceWords].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetOrder = () => {
    setCards(scienceWords);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard || !localizedCard) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('flashcardsPage.eyebrow', 'Flashcards')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('flashcardsPage.heading', 'Practice science vocabulary with flashcards')}
        </h1>
        <p className="text-sm text-slate-700">
          {t(
            'flashcardsPage.description',
            'Tap to flip the card. Shuffle to get a new order or reset to review from the start.'
          )}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={shuffleCards}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand/60 hover:text-slate-900"
        >
          <FiShuffle aria-hidden />
          {t('flashcardsPage.shuffle', 'Shuffle cards')}
        </button>
        <button
          type="button"
          onClick={resetOrder}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand/60 hover:text-slate-900"
        >
          <FiRotateCcw aria-hidden />
          {t('flashcardsPage.reset', 'Reset order')}
        </button>
      </div>

      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsFlipped((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsFlipped((prev) => !prev);
            }
          }}
          className="group relative flex min-h-[280px] cursor-pointer flex-col justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-[0_25px_60px_-45px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand/60"
          aria-label={t('flashcardsPage.cardToggle', 'Toggle flashcard side')}
        >
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.04),transparent_55%)]" />
          </div>
          {!isFlipped ? (
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
                {t('flashcardsPage.front', 'Term')}
              </p>
              <h2 className="text-4xl font-display font-semibold text-slate-900">{localizedCard.term}</h2>
              <p className="text-sm text-slate-700">
                {t('flashcardsPage.tapToSeeDefinition', 'Tap to see the definition and example')}
              </p>
            </div>
          ) : (
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {t('flashcardsPage.back', 'Definition')}
              </p>
              <p className="text-lg font-medium text-slate-900">{localizedCard.definition}</p>
              <p className="text-sm italic text-brand/90">
                {t('flashcardsPage.example', 'Example: {example}', { example: localizedCard.example })}
              </p>
              {localizedCard.source && (
                <p className="text-xs text-slate-500">
                  {t('flashcardsPage.source', 'Source: {source}', { source: localizedCard.source })}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-700">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
            {t('flashcardsPage.progress', 'Card {current} of {total}', {
              current: currentIndex + 1,
              total: cards.length
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToCard(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand/60 hover:text-slate-900"
              aria-label={t('flashcardsPage.previousCard', 'Previous card')}
            >
              <FiChevronLeft aria-hidden />
              {t('flashcardsPage.previous', 'Previous')}
            </button>
            <button
              type="button"
              onClick={() => goToCard(1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand/60 hover:text-slate-900"
              aria-label={t('flashcardsPage.nextCard', 'Next card')}
            >
              {t('flashcardsPage.next', 'Next')}
              <FiChevronRight aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
