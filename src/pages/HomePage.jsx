import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SubjectCard from '../components/SubjectCard';
import QuizCard from '../components/QuizCard';
import WordOfDay from '../components/WordOfDay';
import ScienceChatbot from '../components/ScienceChatbot';
import { subjects } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { useLanguage } from '../context/LanguageContext.jsx';

const HomePage = () => {
  const featuredQuizzes = useMemo(() => quizzes.slice(0, 2), []);
  const { t } = useLanguage();

  return (
    <div className="space-y-16">
      <Hero />
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
                {t('home.tracksEyebrow', 'Core and extension tracks')}
              </p>
              <h2 className="mt-2 text-2xl font-display font-semibold text-white">
                {t('home.tracksHeading', 'Lead with English, then explore science extensions')}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                {t(
                  'home.tracksDescription',
                  'Begin with the English for Science track to practice vocabulary, grammar, and presentation phrases. When you feel confident, continue to the extension modules for Physics, Chemistry, Biology, and Earth Science—each includes visuals, videos, and key terms in learner-friendly English.'
                )}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
            {t('home.practiceEyebrow', 'Interactive Practice')}
          </p>
          {featuredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <WordOfDay />
          <ScienceChatbot />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/20 via-slate-900 to-slate-950 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-display font-semibold text-white">
            {t('home.forumHeading', 'Practice English with classmates')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-200">
            {t(
              'home.forumDescription',
              'Join the SciBridge Forum to post study updates, ask questions in English, and support other students in Physics, Chemistry, Biology, and Earth Science. Create an account, verify your email, and log in to share your voice safely.'
            )}
          </p>
          <Link
            to="/forum"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
          >
            {t('home.forumCta', 'Visit the forum')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
