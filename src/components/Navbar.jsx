import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const baseNavItems = [
  { path: '/', labelKey: 'navbar.home', defaultLabel: 'Home' },
  { path: '/subjects', labelKey: 'navbar.subjects', defaultLabel: 'Subjects' },
  { path: '/quizzes', labelKey: 'navbar.quizzes', defaultLabel: 'Interactive Quizzes' },
  { path: '/forum', labelKey: 'navbar.forum', defaultLabel: 'Forum' },
  { path: '/resources', labelKey: 'navbar.resources', defaultLabel: 'Resources' },
  { path: '/about', labelKey: 'navbar.about', defaultLabel: 'About' },
  { path: '/contact', labelKey: 'navbar.contact', defaultLabel: 'Contact' }
];

const Navbar = ({ onSearch, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();

  const navItems = useMemo(() => {
    const items = [...baseNavItems];
    if (user?.role === 'admin' || user?.role === 'teacher') {
      items.splice(3, 0, { path: '/admin', labelKey: 'navbar.admin', defaultLabel: 'Admin Panel' });
    }
    return items;
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    navigate('/subjects', { state: { query } });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex h-20 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/80 px-4 py-2 text-lg font-display font-semibold text-white shadow-[0_0_20px_rgba(15,23,42,0.45)] transition hover:border-brand/70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-sm font-bold uppercase tracking-wide text-brand">
              SB
            </span>
            <span className="hidden sm:inline">SciBridge</span>
          </Link>
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand after:content-['']"
                      : "text-slate-300 hover:text-white hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-1 hover:after:h-0.5 hover:after:rounded-full hover:after:bg-slate-700 hover:after:content-['']"
                  }`
                }
              >
                {t(item.labelKey, item.defaultLabel)}
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <form onSubmit={handleSubmit} className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-48 rounded-full border border-slate-800 bg-slate-900/70 py-2 pl-11 pr-4 text-sm font-medium text-slate-200 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder={t('navbar.searchPlaceholder', 'Search lessons')}
                aria-label={t('navbar.searchAria', 'Search lessons')}
              />
            </form>
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-brand/70 hover:text-white"
              aria-label={t('navbar.languageToggle', 'Switch language')}
            >
              <FiGlobe aria-hidden />
              {language === 'en' ? 'EN' : 'VI'}
            </button>
            {user ? (
              <div className="flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
                <span className="hidden xl:inline text-slate-200">{t('navbar.greeting', `Hi, {name}`, { name: user.name })}</span>
                <span className="rounded-full bg-slate-950/60 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
                  {t('navbar.role', 'Role')}: {user.role}
                </span>
                <button
                  type="button"
                  className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                >
                  {t('navbar.signOut', 'Sign out')}
                </button>
              </div>
            ) : (
              <NavLink
                to="/forum"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {t('navbar.joinForum', 'Join Forum')}
              </NavLink>
            )}
          </div>
          <button
            className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 p-2 text-slate-200 transition hover:border-brand/70 hover:text-white md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </nav>
      </div>
      {isOpen && (
        <div className="border-t border-slate-800/60 bg-slate-950/95 px-4 py-5 md:hidden">
          <form onSubmit={handleSubmit} className="relative mb-5">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-slate-800 bg-slate-900/80 py-2 pl-11 pr-4 text-sm text-slate-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder={t('navbar.searchPlaceholder', 'Search lessons')}
              aria-label={t('navbar.searchAria', 'Search lessons')}
            />
          </form>
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border border-brand/50 bg-brand/15 text-white'
                      : 'border border-slate-800 bg-slate-900/70 text-slate-200 hover:border-brand/40 hover:text-white'
                  }`
                }
              >
                {t(item.labelKey, item.defaultLabel)}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left text-sm font-semibold text-slate-200 transition hover:border-brand/60 hover:text-white"
            >
              <span className="inline-flex items-center gap-2">
                <FiGlobe aria-hidden />
                {t('navbar.languageToggle', 'Switch language')}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-wide text-slate-500">{language === 'en' ? 'English' : 'Tiếng Việt'}</span>
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  setIsOpen(false);
                }}
                className="rounded-xl bg-brand px-3 py-2 text-left text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                {t('navbar.signOutWithName', 'Sign out {name}', { name: user.name })}
              </button>
            ) : (
              <NavLink
                to="/forum"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                {t('navbar.joinForumMobile', 'Join the Forum')}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
