import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiFolder, FiLayers, FiMessageSquare, FiXCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useChapterContent } from '../hooks/useChapterContent.js';
import { normalizeDialogue, normalizeVocabulary } from '../utils/sectionContent.js';

const ChapterPage = () => {
  const { subjectId, gradeLevel, chapterId } = useParams();
  const { t } = useLanguage();
  const { subject, track, chapter, quizQuestions } = useChapterContent(subjectId, gradeLevel, chapterId);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [track?.id]);

  const subjectTitle = t(['subjects', subject?.id, 'title'], subject?.title || '');
  const currentQuestion = quizQuestions[activeQuestionIndex];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setIsCorrect(index === currentQuestion?.correctIndex);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setActiveQuestionIndex((previous) => {
      if (!quizQuestions.length) return 0;
      return (previous + 1) % quizQuestions.length;
    });
  };

  const sections = useMemo(
    () => [
      {
        key: 'vocabulary',
        label: 'Vocabulary',
        description: t(
          'chapterPage.vocabularyDescription',
          'Thu thập từ vựng và cụm từ quan trọng cho chapter này do admin cung cấp.'
        ),
        icon: FiBookOpen
      },
      {
        key: 'quizzes',
        label: 'Quizzes',
        description: t(
          'chapterPage.quizzesDescription',
          'Bài luyện tập, câu hỏi ôn tập hoặc quiz mà admin thêm cho từng lesson.'
        ),
        icon: FiCheckCircle
      },
      {
        key: 'dialogue',
        label: 'Dialogue',
        description: t(
          'chapterPage.dialogueDescription',
          'Đoạn hội thoại luyện nói hoặc kịch bản tình huống song ngữ cho chapter.'
        ),
        icon: FiMessageSquare
      }
    ],
    [t]
  );

  const getSectionStats = (key) => {
    const lessons = chapter?.lessons || [];
    const filledLessons = lessons.filter((lesson) => {
      const content = lesson.sections?.[key];
      if (key === 'vocabulary') {
        const vocabulary = normalizeVocabulary(content);
        return vocabulary.items.length > 0 || Boolean(vocabulary.note);
      }
      if (key === 'dialogue') {
        const dialogue = normalizeDialogue(content);
        return Boolean(dialogue.english) || Boolean(dialogue.vietnamese);
      }
      return Boolean(content);
    }).length;

    return { totalLessons: lessons.length, filledLessons };
  };

  if (!subject || !track || !chapter) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('chapterPage.notFound', 'Không tìm thấy chapter')}
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          {t('chapterPage.notFoundCopy', 'Hãy quay lại khối học để chọn chapter khác trong Lesson collection.')}
        </p>
        <Link
          to={`/subjects/${subjectId}`}
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
        >
          {t('chapterPage.back', 'Quay lại khối học')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-500">
        <Link to="/subjects" className="text-brand hover:text-brand-dark">
          {t('chapterPage.breadcrumbSubjects', 'Subjects')}
        </Link>{' '}
        /{' '}
        <Link to={`/subjects/${subject.id}`} className="text-brand hover:text-brand-dark">
          {subjectTitle}
        </Link>{' '}
        /{' '}
        <span className="text-slate-500">{t('chapterPage.breadcrumbGrade', 'Grade {grade}', { grade: gradeLevel })}</span>{' '}
        / <span className="text-slate-500">{chapter.title}</span>
      </nav>

      <header className="space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          <FiLayers aria-hidden />
          {t('chapterPage.eyebrow', 'Lesson collection')}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-slate-900">{chapter.title}</h1>
            {chapter.description && <p className="mt-2 max-w-2xl text-sm text-slate-700">{chapter.description}</p>}
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {t('chapterPage.gradePill', 'Grade {grade}', { grade: gradeLevel })}
          </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  {t('chapterPage.sectionListEyebrow', 'Nội dung chapter')}
                </p>
                <h2 className="text-xl font-display font-semibold text-slate-900">
                  {t('chapterPage.sectionListTitle', 'Chọn mục để xem nội dung chi tiết')}
                </h2>
                <p className="text-sm text-slate-700">
                  {t(
                    'chapterPage.sectionListDescription',
                    'Mỗi chapter có 3 mục riêng biệt. Bấm vào để mở trang hiển thị đầy đủ Vocabulary, Quizzes hoặc Dialogue.'
                  )}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                {t('chapterPage.lessonCount', '{count} lessons', { count: chapter.lessons?.length || 0 })}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sections.map(({ key, label, description, icon: Icon }) => {
                const stats = getSectionStats(key);
                return (
                  <article
                    key={key}
                    className="flex h-full flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 rounded-full bg-brand/10 p-2 text-brand">
                        <Icon aria-hidden />
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</p>
                        <p className="text-sm text-slate-700">{description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>
                        {t('chapterPage.sectionProgress', '{filled}/{total} lessons có nội dung', {
                          filled: stats.filledLessons,
                          total: stats.totalLessons
                        })}
                      </span>
                      <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">
                        <FiFolder aria-hidden />
                        <span>{label}</span>
                      </div>
                    </div>
                    <Link
                      to={`/subjects/${subjectId}/grades/${gradeLevel}/chapters/${chapterId}/${key}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
                    >
                      {t('chapterPage.viewSection', 'Xem {label}', { label })}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t('chapterPage.quizLabel', 'Interactive quiz')}</p>
                <p className="text-sm text-slate-700">
                  {t(
                    'chapterPage.quizDescription',
                    'Câu hỏi trắc nghiệm (MCQ) do admin nhập trong Admin panel dành riêng cho khối này.'
                  )}
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {quizQuestions.length} {t('chapterPage.quizCount', 'câu')}
              </span>
            </div>

            {quizQuestions.length === 0 && (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {t(
                  'chapterPage.quizEmpty',
                  'Chưa có câu hỏi. Vào Admin panel để thêm MCQ cho học sinh luyện tập trực tiếp trên trang này.'
                )}
              </p>
            )}

            {quizQuestions.length > 0 && currentQuestion && (
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
                  <span>{t('chapterPage.quizQuestionLabel', 'Question {index}', { index: activeQuestionIndex + 1 })}</span>
                  <span className="rounded-full bg-white px-2 py-1 text-slate-700">
                    {t('chapterPage.quizTotal', '{current}/{total}', {
                      current: activeQuestionIndex + 1,
                      total: quizQuestions.length
                    })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{currentQuestion.prompt}</p>
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isAnswer = currentQuestion.correctIndex === index;
                    const statusClass =
                      isCorrect === null
                        ? 'border-slate-200 bg-white text-slate-800 hover:border-brand/40 hover:bg-brand/5'
                        : isAnswer
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : isSelected
                        ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-white text-slate-700';

                    return (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(index)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-medium transition ${statusClass}`}
                      >
                        <span>{option}</span>
                        {isCorrect !== null && isAnswer && <FiCheckCircle className="text-emerald-500" aria-hidden />}
                        {isCorrect !== null && isSelected && !isAnswer && (
                          <FiXCircle className="text-rose-500" aria-hidden />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  {isCorrect === null ? (
                    <span>{t('chapterPage.quizSelectPrompt', 'Chọn đáp án đúng để kiểm tra ngay')}</span>
                  ) : isCorrect ? (
                    <span className="font-semibold text-emerald-700">{t('chapterPage.quizCorrect', 'Chính xác!')}</span>
                  ) : (
                    <span className="font-semibold text-rose-700">{t('chapterPage.quizIncorrect', 'Chưa đúng, thử lại!')}</span>
                  )}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(56,189,248,0.25)] transition hover:bg-brand-dark"
                  >
                    {t('chapterPage.nextQuestion', 'Câu tiếp')}
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{t('chapterPage.dialogueLabel', 'Song ngữ')}</p>
            <p className="mt-2 text-sm text-slate-700">
              {t(
                'chapterPage.dialogueAside',
                'Hội thoại có thể nhập bằng tiếng Anh và tiếng Việt. Người học dễ đối chiếu và luyện phát âm.'
              )}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {t('chapterPage.dialogueAsideHint', 'Cập nhật nội dung trong Admin panel để hiển thị song song tại đây.')}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ChapterPage;
