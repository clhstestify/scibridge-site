import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ query, setQuery, placeholder = 'Search topics or keywords', onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
    >
      <FiSearch className="text-xl text-brand" aria-hidden />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
