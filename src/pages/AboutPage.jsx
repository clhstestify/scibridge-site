const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">About</p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">Our mission</h1>
      </header>
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow">
        <p className="text-sm leading-7 text-slate-700">
          SciBridge supports high school students who study Natural Sciences in English. We combine accurate science content with
          friendly explanations, vocabulary supports, and multimedia to build confidence. Each lesson is written with simple
          academic language so English learners can participate fully in science classes.
        </p>
        <p className="text-sm leading-7 text-slate-700">
          Our teaching team includes science educators, language specialists, and designers. Together we create flexible learning
          modules that teachers can use in class or students can explore independently.
        </p>
      </section>
      <section className="space-y-4 rounded-3xl border border-brand/30 bg-brand-light/60 p-6">
        <h2 className="text-xl font-display font-semibold text-brand-dark">How to expand this site</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
          <li>Add more lessons with local examples and culturally relevant case studies.</li>
          <li>Translate key vocabulary into other languages for multilingual classrooms.</li>
          <li>Create teacher accounts to assign quizzes and track student growth.</li>
          <li>Integrate live webinars or recorded lab demonstrations.</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
