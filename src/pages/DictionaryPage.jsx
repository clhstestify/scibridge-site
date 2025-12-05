import { useMemo, useState } from 'react';
import { FiBookOpen, FiSearch } from 'react-icons/fi';
import { scienceWords } from '../data/words.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const DictionaryPage = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filteredWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return scienceWords;
    return scienceWords.filter((word) => {
      const termMatches = word.term.toLowerCase().includes(normalizedQuery);
      const definitionMatches = word.definition.toLowerCase().includes(normalizedQuery);
      return termMatches || definitionMatches;
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('dictionaryPage.eyebrow', 'Dictionary')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('dictionaryPage.heading', 'Science terms in simple English')}
        </h1>
        <p className="text-sm text-slate-700">
          {t(
            'dictionaryPage.description',
            'Search for a concept to see its definition, an example sentence, and the original source. All entries come from the shared SciBridge vocabulary set.'
          )}
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder={t('dictionaryPage.searchPlaceholder', 'Search science terms')}
            aria-label={t('dictionaryPage.searchAria', 'Search science terms')}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredWords.map((word) => {
          const localizedTerm = t(['words', word.id, 'term'], word.term);
          const localizedDefinition = t(['words', word.id, 'definition'], word.definition);
          const localizedExample = t(['words', word.id, 'example'], word.example);
          const localizedSource = t(['words', word.id, 'source'], word.source);

          return (
            <article
              key={word.id}
              className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
                    {t('dictionaryPage.entryLabel', 'Vocabulary')}
                  </p>
                  <h2 className="text-xl font-display font-semibold text-slate-900">{localizedTerm}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
                  <FiBookOpen aria-hidden />
                  {t('dictionaryPage.sourceLabel', 'CLIL Glossary')}
                </span>
              </div>
              <p className="text-sm text-slate-800">{localizedDefinition}</p>
              <p className="text-sm italic text-brand/80">
                {t('dictionaryPage.example', 'Example: {example}', { example: localizedExample })}
              </p>
              {localizedSource && (
                <p className="text-xs text-slate-500">{t('dictionaryPage.definitionSource', 'Source: {source}', { source: localizedSource })}</p>
              )}
            </article>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-600">
          {t('dictionaryPage.noResults', 'No terms match your search yet.')}
        </div>
      )}
    </div>
  );
};

export default DictionaryPage;
