import { FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const SearchBar = ({ query, setQuery, placeholder = 'Search topics or keywords', onSubmit }) => {
  const { t } = useLanguage();
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 shadow-inner shadow-slate-950/30"
    >
      <FiSearch className="text-xl text-brand" aria-hidden />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="search"
        placeholder={t('searchBar.placeholder', placeholder)}
        aria-label={t('searchBar.placeholder', placeholder)}
        className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(56,189,248,0.25)] transition hover:bg-brand-dark"
      >
        {t('searchBar.submit', 'Search')}
      </button>
    </form>
  );
};

export default SearchBar;
