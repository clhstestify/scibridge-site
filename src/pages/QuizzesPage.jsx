import QuizCard from '../components/QuizCard';
import { quizzes } from '../data/quizzes';
import { useLanguage } from '../context/LanguageContext.jsx';

const QuizzesPage = () => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('quizzesPage.eyebrow', 'Interactive quizzes')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">
          {t('quizzesPage.heading', 'Lead with English, review science')}
        </h1>
        <p className="text-sm text-slate-300">
          {t(
            'quizzesPage.description',
            'Start with the English for Science Communication quiz, then try the extension quizzes for Physics, Chemistry, Biology, and Earth Science. Read each explanation to strengthen your academic English vocabulary.'
          )}
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizzesPage;
