import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const NotFoundPage = () => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-display font-semibold text-white">{t('notFound.title', 'Page not found')}</h1>
      <p className="mt-4 text-sm text-slate-300">{t(
        'notFound.description',
        'The page you are looking for does not exist. Use the navigation bar or explore our main subjects.'
      )}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
      >
        {t('notFound.backHome', 'Back to home')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
