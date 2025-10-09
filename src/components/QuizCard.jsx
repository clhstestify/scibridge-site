import { useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const QuizCard = ({ quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const question = quiz.questions[currentQuestion];

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
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{quiz.title}</h3>
        <p className="text-sm text-slate-600">{quiz.description}</p>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-brand">Question {currentQuestion + 1}</p>
        <p className="mt-2 text-base font-medium text-slate-900">{question.prompt}</p>
        <ul className="mt-4 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isAnswer = question.answerIndex === index;
            const statusClass =
              isCorrect === null
                ? 'border-slate-200 bg-white hover:border-brand'
                : isAnswer
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : isSelected
                ? 'border-rose-300 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white';
            return (
              <li key={option}>
                <button
                  onClick={() => handleOptionClick(index)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${statusClass}`}
                >
                  <span>{option}</span>
                  {isCorrect !== null && isAnswer && <FiCheckCircle className="text-emerald-500" aria-hidden />}
                  {isCorrect !== null && isSelected && !isAnswer && (
                    <FiXCircle className="text-rose-500" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {isCorrect !== null && (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
              isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {question.explanation}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          Next question
        </button>
      </div>
    </section>
  );
};

export default QuizCard;
