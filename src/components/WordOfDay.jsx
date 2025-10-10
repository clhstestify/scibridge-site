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
    <section className="rounded-3xl border border-brand/30 bg-brand-light/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
        {t('wordOfDay.eyebrow', 'Word of the Day')}
      </p>
      <h3 className="mt-2 text-2xl font-display font-semibold text-brand-dark">{localizedTerm}</h3>
      <p className="mt-3 text-sm text-slate-700">{localizedDefinition}</p>
      <p className="mt-2 text-sm italic text-brand-dark/80">
        {t('wordOfDay.example', `Example: {example}`, { example: localizedExample })}
      </p>
      {localizedSource && (
        <p className="mt-2 text-xs text-slate-500">
          {t('wordOfDay.definitionSource', 'Definition adapted from {source}.', { source: localizedSource })}
        </p>
      )}
    </section>
  );
};

export default WordOfDay;
