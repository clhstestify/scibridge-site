import { Link } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const LessonCard = ({ lesson, subjectId, isCompleted, onComplete }) => {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{lesson.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FiBookOpen aria-hidden />
          <span>{lesson.keyVocabulary.length} key words</span>
        </div>
      </div>
      <p className="text-sm text-slate-600">{lesson.summary}</p>
      <img src={lesson.image} alt={lesson.title} className="h-40 w-full object-cover" />
      <div className="flex flex-wrap gap-2 text-xs text-brand">
        {lesson.keyVocabulary.map((word) => (
          <span key={word} className="rounded-full bg-brand-light/60 px-3 py-1 text-brand-dark">
            {word}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          to={`/subjects/${subjectId}/lessons/${lesson.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          View lesson
        </Link>
        <button
          onClick={() => onComplete?.(lesson.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-brand-light/60 hover:text-brand-dark'
          }`}
        >
          <FiCheckCircle aria-hidden />
          {isCompleted ? 'Completed' : 'Mark as completed'}
        </button>
      </div>
    </article>
  );
};

export default LessonCard;
