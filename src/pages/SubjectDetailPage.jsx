import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import { subjects } from '../data/lessons';
import { useLanguage } from '../context/LanguageContext.jsx';

const SubjectDetailPage = ({ progress, onComplete }) => {
  const { subjectId } = useParams();
  const { t } = useLanguage();
  const subject = useMemo(() => subjects.find((item) => item.id === subjectId), [subjectId]);
  const badgeLabel = subject
    ? subject.id === 'english-for-science'
      ? t('subjectsPage.coreBadge', 'Core English Subject')
      : t('subjectsPage.extensionBadge', 'Extension Module')
    : '';

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-white">
          {t('subjectsPage.subjectNotFound', 'Subject not found')}
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          {t('subjectsPage.subjectNotFoundMessage', 'Please return to the subjects page and choose a different topic.')}
        </p>
        <Link
          to="/subjects"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
        >
          {t('lessonPage.backToSubjects', 'Back to subjects')}
        </Link>
      </div>
    );
  }

  const title = t(['subjects', subject.id, 'title'], subject.title);
  const overview = t(['subjects', subject.id, 'overview'], subject.overview);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <header
        className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-cover bg-center p-10 text-white shadow-[0_35px_120px_-40px_rgba(2,6,23,0.9)]"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(14,165,233,0.75), rgba(8,47,73,0.85)), url(${subject.heroImage})` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/80">{badgeLabel}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-100/90">{overview}</p>
      </header>
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-white">
          {t('subjectsPage.lessonCollection', 'Lesson collection')}
        </h2>
        <div className="space-y-6">
          {subject.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              subjectId={subject.id}
              isCompleted={Boolean(progress[lesson.id])}
              onComplete={onComplete}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SubjectDetailPage;
