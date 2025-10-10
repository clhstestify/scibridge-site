import { Link } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const LessonCard = ({ lesson, subjectId, isCompleted, onComplete }) => {
  const { t } = useLanguage();
  const title = t(['lessons', subjectId, lesson.id, 'title'], lesson.title);
  const summary = t(['lessons', subjectId, lesson.id, 'summary'], lesson.summary);
  const keyVocabulary = t(['lessons', subjectId, lesson.id, 'keyVocabulary'], lesson.keyVocabulary);
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiBookOpen aria-hidden />
          <span>{t('lessonCard.keyWords', `${keyVocabulary.length} key words`, { count: keyVocabulary.length })}</span>
        </div>
      </div>
      <p className="text-sm text-slate-300">{summary}</p>
      <img src={lesson.image} alt={title} className="h-40 w-full rounded-2xl border border-slate-800/70 object-cover" />
      <div className="flex flex-wrap gap-2 text-xs text-brand">
        {keyVocabulary.map((word) => (
          <span key={word} className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-slate-200">
            {word}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          to={`/subjects/${subjectId}/lessons/${lesson.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          {t('lessonCard.viewLesson', 'View lesson')}
        </Link>
        <button
          onClick={() => onComplete?.(lesson.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            isCompleted
              ? 'border border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
              : 'border border-slate-700 bg-slate-950/70 text-slate-200 hover:border-brand/50 hover:text-white'
          }`}
        >
          <FiCheckCircle aria-hidden />
          {isCompleted ? t('lessonCard.completed', 'Completed') : t('lessonCard.markCompleted', 'Mark as completed')}
        </button>
      </div>
    </article>
  );
};

export default LessonCard;
