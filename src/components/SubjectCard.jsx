import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SubjectCard = ({ subject }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-[1px] shadow-lg transition hover:shadow-xl"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(56,189,248,0.4), rgba(236,72,153,0.4))` }}
    >
      <div className="flex flex-1 flex-col gap-4 rounded-[calc(1.5rem-1px)] bg-white p-6">
        <img src={subject.heroImage} alt={`${subject.title} illustration`} className="h-48 w-full object-cover" />
        <div className="flex flex-1 flex-col">
          <h3 className="text-xl font-semibold text-slate-900">{subject.title}</h3>
          <p className="mt-2 flex-1 text-sm text-slate-600">{subject.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-brand">
            {subject.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-brand-light/60 px-3 py-1 text-brand-dark">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <Link
          to={`/subjects/${subject.id}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition group-hover:gap-3"
        >
          Explore lessons
          <FiArrowRight aria-hidden />
        </Link>
      </div>
    </article>
  );
};

export default SubjectCard;
