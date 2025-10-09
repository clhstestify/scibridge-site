import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-light via-white to-accent-light px-6 py-16 shadow-lg">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">Natural Sciences in English</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 md:text-5xl">
          Discover science with clear English explanations
        </h1>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          SciBridge helps high school students master Physics, Chemistry, Biology, and Earth Science. Learn with visuals,
          short videos, interactive quizzes, and a friendly vocabulary focus.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/subjects"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            Explore subjects
          </Link>
          <Link
            to="/quizzes"
            className="rounded-full border border-brand bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand-light/60"
          >
            Try a quiz
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
    </section>
  );
};

export default Hero;
