import QuizCard from '../components/QuizCard';
import { quizzes } from '../data/quizzes';

const QuizzesPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Interactive quizzes</p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">Check your understanding</h1>
        <p className="text-sm text-slate-600">
          Choose a quiz to receive instant feedback. Read the explanation after each question to strengthen your science and
          English vocabulary.
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
