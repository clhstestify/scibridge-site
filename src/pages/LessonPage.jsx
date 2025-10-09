import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjects } from '../data/lessons';

const LessonPage = ({ onComplete, progress }) => {
  const { subjectId, lessonId } = useParams();

  const { subject, lesson } = useMemo(() => {
    const subjectData = subjects.find((item) => item.id === subjectId);
    const lessonData = subjectData?.lessons.find((item) => item.id === lessonId);
    return { subject: subjectData, lesson: lessonData };
  }, [lessonId, subjectId]);

  if (!subject || !lesson) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-slate-900">Lesson not found</h1>
        <Link to="/subjects" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
          Back to subjects
        </Link>
      </div>
    );
  }

  const isCompleted = Boolean(progress[lesson.id]);

  return (
    <article className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link to="/subjects" className="text-brand hover:text-brand-dark">
          Subjects
        </Link>{' '}
        /{' '}
        <Link to={`/subjects/${subject.id}`} className="text-brand hover:text-brand-dark">
          {subject.title}
        </Link>{' '}
        / <span className="text-slate-700">{lesson.title}</span>
      </nav>
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Lesson</p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">{lesson.title}</h1>
        <p className="text-base text-slate-600">{lesson.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-brand">
          {lesson.keyVocabulary.map((word) => (
            <span key={word} className="rounded-full bg-brand-light/60 px-3 py-1 text-brand-dark">
              {word}
            </span>
          ))}
        </div>
      </header>
      <img src={lesson.image} alt={lesson.title} className="w-full object-cover" />
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-slate-900">Step-by-step explanation</h2>
        <div className="space-y-3 rounded-3xl bg-white p-6 shadow">
          {lesson.content.map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-3xl bg-slate-900 p-6 text-white">
          <h2 className="text-lg font-semibold">Watch the mini lesson</h2>
          <p className="text-sm text-slate-100">
            Videos help you connect English words with science visuals. Use captions to support language learning.
          </p>
          <div className="aspect-video overflow-hidden rounded-2xl">
            <iframe
              src={lesson.videoUrl}
              title={`${lesson.title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="space-y-3 rounded-3xl border border-brand/30 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Animated concept</h2>
          <p className="text-sm text-slate-600">Use the animation to observe the scientific process in motion.</p>
          <img src={lesson.animationUrl} alt={`${lesson.title} animation`} className="h-64 w-full object-cover" />
          <button
            onClick={() => onComplete(lesson.id)}
            className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-brand text-white shadow hover:bg-brand-dark'
            }`}
          >
            {isCompleted ? 'Lesson completed' : 'Mark lesson as completed'}
          </button>
        </div>
      </section>
      <section className="rounded-3xl bg-brand-light/60 p-6">
        <h2 className="text-lg font-semibold text-brand-dark">Practice ideas</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-700">
          <li>Write the key vocabulary words in your science notebook. Add a short definition in English.</li>
          <li>Summarize the lesson in three sentences. Focus on the main idea and an example.</li>
          <li>Teach a friend using the animation. Explain each step using the new words.</li>
        </ul>
      </section>
    </article>
  );
};

export default LessonPage;
