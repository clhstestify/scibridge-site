import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiGlobe, FiLogOut } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const baseNavItems = [
  { path: '/', labelKey: 'navbar.home', defaultLabel: 'Home' },
  { path: '/subjects', labelKey: 'navbar.subjects', defaultLabel: 'Subjects' },
  { path: '/quizzes', labelKey: 'navbar.quizzes', defaultLabel: 'Interactive Quizzes' },
  { path: '/flashcards', labelKey: 'navbar.flashcards', defaultLabel: 'Flashcards' },
  { path: '/dictionary', labelKey: 'navbar.dictionary', defaultLabel: 'Dictionary' },
  { path: '/chatbot', labelKey: 'navbar.chatbot', defaultLabel: 'Chatbot' },
  { path: '/profile', labelKey: 'navbar.profile', defaultLabel: 'Profile' },
  { path: '/login', labelKey: 'navbar.login', defaultLabel: 'Log in' },
  { path: '/register', labelKey: 'navbar.register', defaultLabel: 'Register' },
  { path: '/contact', labelKey: 'navbar.contact', defaultLabel: 'Contact' }
];

const Navbar = ({ onSearch, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const displayName = user?.name || user?.username || 'Member';

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

  const headerClasses = 'border-slate-200 bg-white/85 text-slate-900 shadow-sm';

  const inputClasses = 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-brand/60';

  const desktopNavClass = ({ isActive }) => {
    const activeClasses =
      "text-brand-dark after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand after:content-['']";
    const inactiveClasses =
      "text-slate-600 hover:text-slate-900 hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:-bottom-1 hover:after:h-0.5 hover:after:rounded-full hover:after:bg-slate-200 hover:after:content-['']";
    return `relative rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? activeClasses : inactiveClasses}`;
  };

  const mobileNavClass = ({ isActive }) => {
    if (isActive) {
      return 'rounded-xl border border-brand/40 bg-brand/5 text-brand-dark';
    }
    return 'rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-brand/40 hover:text-slate-900';
  };

  const pillButtonBase = 'border border-slate-200 bg-white text-slate-700 hover:border-brand/60 hover:text-slate-900';

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur ${headerClasses}`}>
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex h-20 items-center gap-4">
          <div className="flex flex-1 items-center justify-start">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-lg font-display font-semibold text-slate-900 shadow-[0_0_20px_rgba(15,23,42,0.15)] transition hover:border-brand/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-sm font-bold uppercase tracking-wide text-brand">
                SB
              </span>
              <span className="hidden sm:inline">SciBridge</span>
            </Link>
          </div>
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={desktopNavClass}
              >
                {t(item.labelKey, item.defaultLabel)}
              </NavLink>
            ))}
          </div>
          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <form onSubmit={handleSubmit} className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={`w-48 rounded-full py-2 pl-11 pr-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand/40 ${inputClasses}`}
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
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${pillButtonBase}`}
              aria-label={t('navbar.languageToggle', 'Switch language')}
            >
              <FiGlobe aria-hidden />
              {language === 'en' ? 'EN' : 'VI'}
            </button>
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                <Link
                  to="/profile"
                  className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark transition hover:bg-brand/20"
                >
                  {displayName}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  <FiLogOut aria-hidden />
                  Log out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {t('navbar.login', 'Log in')}
              </NavLink>
            )}
          </div>
          <button
            className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-brand/70 hover:text-slate-900 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </nav>
      </div>
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
          <form onSubmit={handleSubmit} className="relative mb-5">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
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
                className={({ isActive }) => `${mobileNavClass({ isActive })} px-3 py-2 text-sm font-semibold transition`}
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
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-brand/60 hover:text-slate-900"
            >
              <span className="inline-flex items-center gap-2">
                <FiGlobe aria-hidden />
                {t('navbar.languageToggle', 'Switch language')}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-wide text-slate-500">{language === 'en' ? 'English' : 'Tiếng Việt'}</span>
            </button>
            {user ? (
              <div className="rounded-2xl border border-slate-200/60 bg-slate-100/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-600">Signed in</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-dark"
                  >
                    {t('navbar.profile', 'Profile')}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  <FiLogOut aria-hidden />
                  Log out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                {t('navbar.login', 'Log in')}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
