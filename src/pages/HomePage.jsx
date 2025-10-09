import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SubjectCard from '../components/SubjectCard';
import QuizCard from '../components/QuizCard';
import WordOfDay from '../components/WordOfDay';
import ScienceChatbot from '../components/ScienceChatbot';
import { subjects } from '../data/lessons';
import { quizzes } from '../data/quizzes';

const HomePage = () => {
  const featuredQuizzes = useMemo(() => quizzes.slice(0, 2), []);

  return (
    <div className="space-y-16">
      <Hero />
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Main Subjects</p>
            <h2 className="mt-2 text-2xl font-display font-semibold text-slate-900">Explore the science universe</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Each subject includes short lessons, pictures, and videos that use academic English with clear definitions. Start
              where you feel comfortable and build your skills step by step.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Interactive Practice</p>
          {featuredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <WordOfDay />
          <ScienceChatbot />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-brand-light/60 p-8 shadow-sm">
          <h2 className="text-2xl font-display font-semibold text-brand-dark">Practice English with classmates</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600">
            Join the SciBridge Forum to post study updates, ask questions in English, and support other students in Physics,
            Chemistry, Biology, and Earth Science. Create an account, verify your email, and log in to share your voice safely.
          </p>
          <Link
            to="/forum"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Visit the forum
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
