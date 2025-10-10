import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const SubjectCard = ({ subject }) => {
  const { t } = useLanguage();
  const title = t(['subjects', subject.id, 'title'], subject.title);
  const description = t(['subjects', subject.id, 'description'], subject.description);
  const keywords = t(['subjects', subject.id, 'keywords'], subject.keywords);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/50 transition hover:border-brand/50 hover:bg-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-20" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.45),transparent_60%)]" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-5">
        <img
          src={subject.heroImage}
          alt={`${title} illustration`}
          className="h-44 w-full rounded-2xl border border-slate-800/70 object-cover"
        />
        <div className="flex flex-1 flex-col">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 flex-1 text-sm text-slate-300">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-brand">
            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-slate-200">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <Link
          to={`/subjects/${subject.id}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition group-hover:gap-3"
        >
          {t(['subjects', subject.id, 'cta'], 'Explore lessons')}
          <FiArrowRight aria-hidden />
        </Link>
      </div>
    </article>
  );
};

export default SubjectCard;
