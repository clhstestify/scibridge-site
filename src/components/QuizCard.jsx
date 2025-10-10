import { useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const QuizCard = ({ quiz }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const question = quiz.questions[currentQuestion];
  const title = t(['quizzes', quiz.id, 'title'], quiz.title);
  const description = t(['quizzes', quiz.id, 'description'], quiz.description);
  const prompt = t(['quizzes', quiz.id, 'questions', currentQuestion, 'prompt'], question.prompt);
  const options = t(['quizzes', quiz.id, 'questions', currentQuestion, 'options'], question.options);
  const explanation = t(
    ['quizzes', quiz.id, 'questions', currentQuestion, 'explanation'],
    question.explanation
  );

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const correct = index === question.answerIndex;
    setIsCorrect(correct);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuestion((prev) => (prev + 1) % quiz.questions.length);
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
        <p className="text-sm font-semibold text-brand">
          {t('quizzesPage.questionLabel', `Question {index}`, { index: currentQuestion + 1 })}
        </p>
        <p className="mt-2 text-base font-medium text-white">{prompt}</p>
        <ul className="mt-4 space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isAnswer = question.answerIndex === index;
            const statusClass =
              isCorrect === null
                ? 'border-slate-700/60 bg-slate-900/70 text-slate-200 hover:border-brand/40'
                : isAnswer
                ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200'
                : isSelected
                ? 'border-rose-500/70 bg-rose-500/10 text-rose-200'
                : 'border-slate-800 bg-slate-900/70 text-slate-300';
            return (
              <li key={option}>
                <button
                  onClick={() => handleOptionClick(index)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${statusClass}`}
                >
                  <span>{option}</span>
                  {isCorrect !== null && isAnswer && <FiCheckCircle className="text-emerald-300" aria-hidden />}
                  {isCorrect !== null && isSelected && !isAnswer && (
                    <FiXCircle className="text-rose-300" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {isCorrect !== null && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              isCorrect
                ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-500/60 bg-rose-500/10 text-rose-200'
            }`}
          >
            {explanation}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(56,189,248,0.25)] transition hover:bg-brand-dark"
        >
          {t('quizzesPage.nextQuestion', 'Next question')}
        </button>
      </div>
    </section>
  );
};

export default QuizCard;
