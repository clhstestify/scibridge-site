import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16 shadow-[0_35px_120px_-40px_rgba(2,6,23,0.9)]">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(8,47,73,0.35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,23,42,0.2)_0%,rgba(15,23,42,0.6)_45%,rgba(2,6,23,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'160\' height=\'160\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop stop-color=\'%23080F1F\' stop-opacity=\'0.35\' offset=\'0%25\'/%3E%3Cstop stop-color=\'%23080F1F\' stop-opacity=\'0\' offset=\'100%25\'/%3E%3C/linearGradient%3E%3Cpattern id=\'p\' width=\'32\' height=\'32\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M32 0H0v32\' fill=\'none\' stroke=\'%230d1b3d\' stroke-opacity=\'0.3\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill=\'url(%23p)\' width=\'160\' height=\'160\'/%3E%3Crect fill=\'url(%23g)\' width=\'160\' height=\'160\'/%3E%3C/svg%3E')]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/70">
          {t('hero.eyebrow', 'English-first learning')}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">
          {t('hero.heading', 'Master English to unlock every science story')}
        </h1>
        <p className="mt-4 text-base text-slate-300 md:text-lg">
          {t(
            'hero.description',
            'Start with Academic English for Science, then extend your skills to Physics, Chemistry, Biology, and Earth Science. Learn with visuals, short videos, interactive quizzes, and vocabulary adapted from Oxford and Cambridge resources.'
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/subjects"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
          >
            {t('hero.primaryCta', 'Explore subjects')}
          </Link>
          <Link
            to="/quizzes"
            className="rounded-full border border-slate-700/80 bg-transparent px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-white"
          >
            {t('hero.secondaryCta', 'Try a quiz')}
          </Link>
        </div>
        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-inner shadow-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t('hero.metricLessonsEyebrow', 'Guided modules')}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{t('hero.metricLessons', '40+ lessons')}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-inner shadow-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t('hero.metricPracticeEyebrow', 'Practice questions')}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{t('hero.metricPractice', '180+ prompts')}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-inner shadow-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t('hero.metricCommunityEyebrow', 'Learner community')}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{t('hero.metricCommunity', 'Forum + chatbot')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
