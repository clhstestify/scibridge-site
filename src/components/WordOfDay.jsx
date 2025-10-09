import { useMemo } from 'react';
import { scienceWords } from '../data/words';

const WordOfDay = () => {
  const word = useMemo(() => {
    const index = new Date().getDate() % scienceWords.length;
    return scienceWords[index];
  }, []);

  return (
    <section className="rounded-3xl border border-brand/30 bg-brand-light/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Word of the Day</p>
      <h3 className="mt-2 text-2xl font-display font-semibold text-brand-dark">{word.term}</h3>
      <p className="mt-3 text-sm text-slate-700">{word.definition}</p>
      <p className="mt-2 text-sm italic text-brand-dark/80">Example: {word.example}</p>
      {word.source && (
        <p className="mt-2 text-xs text-slate-500">Definition adapted from {word.source}.</p>
      )}
    </section>
  );
};

export default WordOfDay;
