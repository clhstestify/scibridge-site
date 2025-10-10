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
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('subjectsPage.subjectNotFound', 'Subject not found')}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {t('subjectsPage.subjectNotFoundMessage', 'Please return to the subjects page and choose a different topic.')}
        </p>
        <Link to="/subjects" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
          {t('lessonPage.backToSubjects', 'Back to subjects')}
        </Link>
      </div>
    );
  }

  const title = t(['subjects', subject.id, 'title'], subject.title);
  const overview = t(['subjects', subject.id, 'overview'], subject.overview);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <header className="relative overflow-hidden rounded-3xl bg-cover bg-center p-10 text-white shadow-lg"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(14,165,233,0.8), rgba(236,72,153,0.7)), url(${subject.heroImage})` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">{badgeLabel}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-100">{overview}</p>
      </header>
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-slate-900">
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
