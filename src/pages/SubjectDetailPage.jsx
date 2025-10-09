import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import { subjects } from '../data/lessons';

const SubjectDetailPage = ({ progress, onComplete }) => {
  const { subjectId } = useParams();
  const subject = useMemo(() => subjects.find((item) => item.id === subjectId), [subjectId]);

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-slate-900">Subject not found</h1>
        <p className="mt-3 text-sm text-slate-600">Please return to the subjects page and choose a different topic.</p>
        <Link to="/subjects" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
          Back to subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <header className="relative overflow-hidden rounded-3xl bg-cover bg-center p-10 text-white shadow-lg"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(14,165,233,0.8), rgba(236,72,153,0.7)), url(${subject.heroImage})` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">Subject Spotlight</p>
        <h1 className="mt-3 text-4xl font-display font-semibold">{subject.title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-100">{subject.overview}</p>
      </header>
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-slate-900">Lesson collection</h2>
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
