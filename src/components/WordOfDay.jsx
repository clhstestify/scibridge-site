import { useMemo } from 'react';
import { scienceWords } from '../data/words';
import { useLanguage } from '../context/LanguageContext.jsx';

const WordOfDay = () => {
  const { t } = useLanguage();
  const word = useMemo(() => {
    const index = new Date().getDate() % scienceWords.length;
    return scienceWords[index];
  }, []);

  const localizedTerm = t(['words', word.id, 'term'], word.term);
  const localizedDefinition = t(['words', word.id, 'definition'], word.definition);
  const localizedExample = t(['words', word.id, 'example'], word.example);
  const localizedSource = t(['words', word.id, 'source'], word.source);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/40">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.3),transparent_60%)]" />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('wordOfDay.eyebrow', 'Word of the Day')}
        </p>
        <h3 className="mt-2 text-2xl font-display font-semibold text-white">{localizedTerm}</h3>
        <p className="mt-3 text-sm text-slate-300">{localizedDefinition}</p>
        <p className="mt-2 text-sm italic text-brand/80">
          {t('wordOfDay.example', `Example: {example}`, { example: localizedExample })}
        </p>
        {localizedSource && (
          <p className="mt-2 text-xs text-slate-500">
            {t('wordOfDay.definitionSource', 'Definition adapted from {source}.', { source: localizedSource })}
          </p>
        )}
      </div>
    </section>
  );
};

export default WordOfDay;
