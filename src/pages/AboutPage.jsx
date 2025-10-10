import { useLanguage } from '../context/LanguageContext.jsx';

const AboutPage = () => {
  const { t } = useLanguage();
  const expandList = t('aboutPage.expandList', [
    'Add more lessons with local examples and culturally relevant case studies.',
    'Translate key vocabulary into other languages for multilingual classrooms.',
    'Create teacher accounts to assign quizzes and track student growth.',
    'Integrate live webinars or recorded lab demonstrations.'
  ]);
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('aboutPage.eyebrow', 'About')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">{t('aboutPage.heading', 'Our mission')}</h1>
      </header>
      <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 text-slate-300 shadow-lg shadow-slate-950/40">
        <p className="text-sm leading-7">
          {t(
            'aboutPage.description1',
            'SciBridge supports high school students who study Natural Sciences in English. We combine accurate science content with friendly explanations, vocabulary supports, and multimedia to build confidence. Each lesson is written with simple academic language so English learners can participate fully in science classes.'
          )}
        </p>
        <p className="text-sm leading-7">
          {t(
            'aboutPage.description2',
            'Our teaching team includes science educators, language specialists, and designers. Together we create flexible learning modules that teachers can use in class or students can explore independently.'
          )}
        </p>
      </section>
      <section className="space-y-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-slate-200 shadow-lg shadow-slate-950/40">
        <h2 className="text-xl font-display font-semibold text-white">
          {t('aboutPage.expandHeading', 'How to expand this site')}
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-200">
          {expandList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
