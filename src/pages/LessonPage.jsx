import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjects } from '../data/lessons';
import { useLanguage } from '../context/LanguageContext.jsx';

const LessonPage = ({ onComplete, progress }) => {
  const { subjectId, lessonId } = useParams();
  const { t } = useLanguage();

  const { subject, lesson } = useMemo(() => {
    const subjectData = subjects.find((item) => item.id === subjectId);
    const lessonData = subjectData?.lessons.find((item) => item.id === lessonId);
    return { subject: subjectData, lesson: lessonData };
  }, [lessonId, subjectId]);

  if (!subject || !lesson) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-white">
          {t('lessonPage.notFoundTitle', 'Lesson not found')}
        </h1>
        <Link
          to="/subjects"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
        >
          {t('lessonPage.backToSubjects', 'Back to subjects')}
        </Link>
      </div>
    );
  }

  const isCompleted = Boolean(progress[lesson.id]);
  const subjectTitle = t(['subjects', subject.id, 'title'], subject.title);
  const lessonTitle = t(['lessons', subject.id, lesson.id, 'title'], lesson.title);
  const lessonSummary = t(['lessons', subject.id, lesson.id, 'summary'], lesson.summary);
  const keyVocabulary = t(['lessons', subject.id, lesson.id, 'keyVocabulary'], lesson.keyVocabulary);
  const lessonContent = t(['lessons', subject.id, lesson.id, 'content'], lesson.content);
  const practiceIdeas = t(['lessons', subject.id, lesson.id, 'practice'], t('lessonPage.practiceList', [
    'Write the key vocabulary words in your science notebook. Add a short definition in English.',
    'Summarize the lesson in three sentences. Focus on the main idea and an example.',
    'Teach a friend using the animation. Explain each step using the new words.'
  ]));

  return (
    <article className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <nav className="text-sm text-slate-400">
        <Link to="/subjects" className="text-brand hover:text-brand-dark">
          {t('lessonPage.breadcrumbSubjects', 'Subjects')}
        </Link>{' '}
        /{' '}
        <Link to={`/subjects/${subject.id}`} className="text-brand hover:text-brand-dark">
          {subjectTitle}
        </Link>{' '}
        / <span className="text-slate-300">{lessonTitle}</span>
      </nav>
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('lessonPage.eyebrow', 'Lesson')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">{lessonTitle}</h1>
        <p className="text-base text-slate-300">{lessonSummary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-brand">
          {keyVocabulary.map((word) => (
            <span key={word} className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-slate-200">
              {word}
            </span>
          ))}
        </div>
      </header>
      <img
        src={lesson.image}
        alt={lessonTitle}
        className="w-full rounded-3xl border border-slate-800/70 object-cover"
      />
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-white">
          {t('lessonPage.stepsHeading', 'Step-by-step explanation')}
        </h2>
        <div className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
          {lessonContent.map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6 text-white shadow-lg shadow-slate-950/40">
          <h2 className="text-lg font-semibold">{t('lessonPage.videoHeading', 'Watch the mini lesson')}</h2>
          <p className="text-sm text-slate-200">
            {t(
              'lessonPage.videoDescription',
              'Videos help you connect English words with science visuals. Use captions to support language learning.'
            )}
          </p>
          <div className="aspect-video overflow-hidden rounded-2xl">
            <iframe
              src={lesson.videoUrl}
              title={`${lessonTitle} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 text-slate-200 shadow-lg shadow-slate-950/40">
          <h2 className="text-lg font-semibold text-white">{t('lessonPage.animationHeading', 'Animated concept')}</h2>
          <p className="text-sm text-slate-300">
            {t('lessonPage.animationDescription', 'Use the animation to observe the scientific process in motion.')}
          </p>
          <img
            src={lesson.animationUrl}
            alt={`${lessonTitle} animation`}
            className="h-64 w-full rounded-2xl border border-slate-800/70 object-cover"
          />
          <button
            onClick={() => onComplete(lesson.id)}
            className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
              isCompleted
                ? 'border border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
                : 'bg-brand text-white shadow-[0_10px_25px_rgba(56,189,248,0.25)] hover:bg-brand-dark'
            }`}
          >
            {isCompleted
              ? t('lessonPage.completed', 'Lesson completed')
              : t('lessonPage.markCompleted', 'Mark lesson as completed')}
          </button>
        </div>
      </section>
      <section className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-slate-200 shadow-lg shadow-slate-950/40">
        <h2 className="text-lg font-semibold text-white">{t('lessonPage.practiceHeading', 'Practice ideas')}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
          {practiceIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default LessonPage;
