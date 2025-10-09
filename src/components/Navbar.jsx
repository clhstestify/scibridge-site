import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/subjects', label: 'Subjects' },
  { path: '/quizzes', label: 'Interactive Quizzes' },
  { path: '/forum', label: 'Forum' },
  { path: '/resources', label: 'Resources' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];

const Navbar = ({ onSearch, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    navigate('/subjects', { state: { query } });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-display font-semibold text-brand-dark">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand-dark">
            SB
          </span>
          SciBridge
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors hover:text-brand ${isActive ? 'text-brand-dark' : 'text-slate-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <form onSubmit={handleSubmit} className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-48 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Search lessons"
              aria-label="Search lessons"
            />
          </form>
          {user ? (
            <div className="flex items-center gap-3 rounded-full bg-brand-light/60 px-3 py-1 text-sm font-semibold text-brand-dark">
              <span className="hidden lg:inline">Hi, {user.name}</span>
              <button
                type="button"
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
                onClick={() => {
                  onLogout?.();
                  setIsOpen(false);
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <NavLink
              to="/forum"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Join Forum
            </NavLink>
          )}
        </div>
        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSubmit} className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Search lessons"
              aria-label="Search lessons"
            />
          </form>
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold hover:bg-brand-light/40 ${
                    isActive ? 'bg-brand-light/50 text-brand-dark' : 'text-slate-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  setIsOpen(false);
                }}
                className="rounded-lg bg-brand-dark px-3 py-2 text-left text-sm font-semibold text-white shadow-sm hover:bg-brand"
              >
                Sign out {user.name}
              </button>
            ) : (
              <NavLink
                to="/forum"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                Join the Forum
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
