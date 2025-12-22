import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiFolder, FiLayers, FiMessageSquare } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useChapterContent } from '../hooks/useChapterContent.js';
import { normalizeDialogue, normalizeVocabulary } from '../utils/sectionContent.js';
import { FiBookOpen, FiCheckCircle, FiFolder, FiLayers, FiMessageSquare, FiVolume2 } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useChapterContent } from '../hooks/useChapterContent.js';
import { buildAudioSrc, normalizeDialogue, normalizeVocabulary } from '../utils/sectionContent.js';

const ChapterSectionPage = () => {
  const { subjectId, gradeLevel, chapterId, sectionKey } = useParams();
  const { t } = useLanguage();
  const audioBaseUrl = import.meta.env.VITE_AUDIO_BASE_URL || '/uploads';
  const { subject, chapter, quizQuestions } = useChapterContent(subjectId, gradeLevel, chapterId);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const sections = useMemo(
    () => ({
      vocabulary: {
        label: 'Vocabulary',
        description: t(
          'chapterSectionPage.vocabularyDescription',
          'Xem toàn bộ từ vựng, bản dịch và file audio được thêm cho từng lesson trong chapter này.'
        ),
        icon: FiBookOpen
      },
      quizzes: {
        label: 'Quizzes',
        description: t(
          'chapterSectionPage.quizzesDescription',
          'Danh sách bài tập, câu hỏi luyện tập hoặc hướng dẫn thực hành cho từng lesson.'
        ),
        icon: FiCheckCircle
      },
      dialogue: {
        label: 'Dialogue',
        description: t(
          'chapterSectionPage.dialogueDescription',
          'Hội thoại song ngữ giúp luyện nói, nghe và phản xạ trong bối cảnh của lesson.'
        ),
        icon: FiMessageSquare
      }
    }),
    [t]
  );

  const selectedSection = sections[sectionKey];
  const totalQuestions = quizQuestions.length;
  const currentQuizQuestion = quizQuestions[quizIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
  };

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuiz = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuizQuestion?.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = quizIndex + 1;
    if (nextIndex >= totalQuestions) {
      setQuizFinished(true);
    } else {
      setQuizIndex(nextIndex);
      setSelectedOption(null);
    }
  };

  const handleRestartQuiz = () => {
    setQuizFinished(false);
    setQuizStarted(false);
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
  };

  if (!subject || !chapter || !selectedSection) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('chapterSectionPage.notFound', 'Không tìm thấy nội dung')}
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          {t(
            'chapterSectionPage.notFoundCopy',
            'Mục hoặc chapter không tồn tại. Hãy quay lại trang chapter và thử lại.'
          )}
        </p>
        <Link
          to={`/subjects/${subjectId}/grades/${gradeLevel}/chapters/${chapterId}`}
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
        >
          {t('chapterSectionPage.backToChapter', 'Quay lại chapter')}
        </Link>
      </div>
    );
  }

  const icon = selectedSection.icon;
  const IconComponent = icon || FiLayers;

  const renderQuizContent = (content) => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.join('\n');
    if (content && typeof content === 'object') {
      return content.text || content.description || content.instructions || '';
    }
    return '';
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-500">
        <Link to="/subjects" className="text-brand hover:text-brand-dark">
          {t('chapterPage.breadcrumbSubjects', 'Subjects')}
        </Link>{' '}
        /{' '}
        <Link to={`/subjects/${subject.id}`} className="text-brand hover:text-brand-dark">
          {t(['subjects', subject.id, 'title'], subject.title)}
        </Link>{' '}
        /{' '}
        <Link
          to={`/subjects/${subjectId}/grades/${gradeLevel}/chapters/${chapterId}`}
          className="text-brand hover:text-brand-dark"
        >
          {t('chapterPage.breadcrumbGrade', 'Grade {grade}', { grade: gradeLevel })} / {chapter.title}
        </Link>{' '}
        / <span className="text-slate-500">{selectedSection.label}</span>
      </nav>

      <header className="space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-brand/10 p-3 text-brand">
            <IconComponent aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">{selectedSection.label}</p>
            <h1 className="text-3xl font-display font-semibold text-slate-900">{chapter.title}</h1>
            <p className="text-sm text-slate-700">{selectedSection.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold uppercase tracking-wide text-slate-700">
            {t('chapterPage.gradePill', 'Grade {grade}', { grade: gradeLevel })}
          </span>
          <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">
            {t('chapterSectionPage.lessonCount', '{count} lessons', { count: chapter.lessons?.length || 0 })}
          </span>
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {!chapter.lessons?.length ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {t('chapterPage.noLessons', 'Chapter này chưa có lesson. Admin hãy thêm bài để hiển thị nội dung đầy đủ.')}
          </p>
        ) : (
          <div className="space-y-4">
            {chapter.lessons.map((lesson, lessonIndex) => {
              const content = lesson.sections?.[sectionKey];
              const vocabulary = normalizeVocabulary(lesson.sections?.vocabulary);
              const dialogue = normalizeDialogue(content);
              const hasDialogue = dialogue.english || dialogue.vietnamese;
              const quizText = renderQuizContent(content);

              return (
                <article
                  key={`${sectionKey}-${lesson.id}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <FiFolder className="text-brand" aria-hidden />
                      <span>{lesson.title}</span>
                    </div>
                    {sectionKey === 'quizzes' && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                        MCQ ready
                      </span>
                    )}
                  </div>

                  {sectionKey === 'dialogue' ? (
                    hasDialogue ? (
                      <div className="mt-4 space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-5 shadow-inner">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                              {t('chapterSectionPage.dialogueLabel', 'Dialogue')}
                            </p>
                            <h3 className="text-lg font-display font-semibold text-slate-900">{chapter.title}</h3>
                            <p className="text-sm text-slate-600">
                              {t(
                                'chapterSectionPage.dialogueSubhead',
                                'Đoạn hội thoại song ngữ giúp luyện nghe và nói theo ngữ cảnh của chapter.'
                              )}
                            </p>
                          </div>
                          {dialogue.audioFileName && (
                            <button
                              type="button"
                              onClick={() => {
                                const audio = new Audio(buildAudioSrc(audioBaseUrl, dialogue.audioFileName));
                                audio.play().catch(() => {});
                              }}
                              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
                            >
                              <FiVolume2 aria-hidden />
                              {t('chapterSectionPage.listenDialogue', 'Nghe hội thoại')}
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          {dialogue.english && (
                            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Gb English</p>
                              <p className="mt-2 whitespace-pre-line text-sm text-slate-900">{dialogue.english}</p>
                            </div>
                          )}
                          {dialogue.vietnamese && (
                            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Vn Tiếng Việt</p>
                              <p className="mt-2 whitespace-pre-line text-sm text-slate-900">{dialogue.vietnamese}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {t(
                          'chapterPage.sectionFallback',
                          'Admin chưa thêm nội dung cho mục này. Vui lòng cập nhật trong admin panel.'
                        )}
                      </p>
                    )
                  ) : sectionKey === 'vocabulary' ? (
                    vocabulary.items.length ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-5 items-center border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          <span className="col-span-2">{t('chapterSectionPage.wordColumn', 'Word')}</span>
                          <span className="col-span-3">{t('chapterSectionPage.definitionColumn', 'Definition')}</span>
                        </div>
                        <div className="divide-y divide-slate-200 text-sm text-slate-800">
                          {vocabulary.items.map((item) => (
                            <div key={`${lesson.id}-${item.term}`} className="grid grid-cols-5 gap-4 px-4 py-4">
                              <div className="col-span-2 space-y-1">
                                <p className="text-base font-semibold text-slate-900">{item.term}</p>
                                {item.pronunciation && (
                                  <p className="text-xs font-medium italic text-slate-600">{item.pronunciation}</p>
                                )}
                              </div>
                              <div className="col-span-3 space-y-1">
                                <p className="text-sm text-slate-800">
                                  {item.translation || t('chapterPage.noTranslation', 'Chưa có nghĩa')}
                                </p>
                                {item.definition && <p className="text-xs text-slate-600">{item.definition}</p>}
                              </div>
                            </div>
                          ))}
                          {vocabulary.items.map((item) => {
                            const audioSrc = buildAudioSrc(audioBaseUrl, item.audioFileName);
                            return (
                              <div key={`${lesson.id}-${item.term}`} className="grid grid-cols-5 gap-4 px-4 py-4">
                                <div className="col-span-2 space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-base font-semibold text-slate-900">{item.term}</p>
                                    {audioSrc && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const audio = new Audio(audioSrc);
                                          audio.play().catch(() => {});
                                        }}
                                        className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand/20"
                                      >
                                        <FiVolume2 aria-hidden />
                                        {t('chapterSectionPage.listen', 'Nghe')}
                                      </button>
                                    )}
                                  </div>
                                  {item.pronunciation && (
                                    <p className="text-xs font-medium italic text-slate-600">{item.pronunciation}</p>
                                  )}
                                </div>
                                <div className="col-span-3 space-y-1">
                                  <p className="text-sm text-slate-800">
                                    {item.translation || t('chapterPage.noTranslation', 'Chưa có nghĩa')}
                                  </p>
                                  {item.definition && <p className="text-xs text-slate-600">{item.definition}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {vocabulary.note && (
                          <p className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
                            {vocabulary.note}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {vocabulary.note ||
                          t(
                            'chapterPage.sectionFallback',
                            'Admin chưa thêm nội dung cho mục này. Vui lòng cập nhật trong admin panel.'
                          )}
                      </p>
                    )
                  ) : sectionKey === 'quizzes' ? (
                    totalQuestions && lessonIndex === 0 ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                            {t('chapterSectionPage.quizEyebrow', 'Vector Vocabulary Quiz')}
                          </p>
                          <h3 className="text-2xl font-display font-semibold text-slate-900">
                            {t('chapterSectionPage.quizTitle', 'Multiple Choice Quiz')}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">
                            {quizText ||
                              t(
                                'chapterSectionPage.quizLead',
                                'Test your understanding với {count} câu hỏi trắc nghiệm kèm giải thích tiếng Việt.',
                                { count: totalQuestions }
                              )}
                          </p>
                        </div>

                        {!quizStarted || quizFinished ? (
                          <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-3xl bg-white px-8 py-10 text-center shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-2xl">📄</div>
                            <div className="space-y-1">
                              <p className="text-lg font-semibold text-slate-900">{t('chapterSectionPage.quizCardTitle', 'Multiple Choice')}</p>
                              <p className="text-sm text-slate-700">
                                {t('chapterSectionPage.quizCardDescription', '{count} questions about vector terms', {
                                  count: totalQuestions
                                })}
                              </p>
                              <p className="text-xs text-slate-500">
                                {t(
                                  'chapterSectionPage.quizCardHint',
                                  'Mỗi câu hỏi có giải thích tiếng Việt giúp bạn hiểu nghĩa rõ hơn.'
                                )}
                              </p>
                            </div>
                            {quizFinished && (
                              <div className="flex flex-col items-center gap-1 rounded-xl bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
                                <span>{t('chapterSectionPage.quizScore', 'Điểm của bạn: {score}/{total}', { score, total: totalQuestions })}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={handleStartQuiz}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
                            >
                              {quizFinished
                                ? t('chapterSectionPage.quizRestart', 'Làm lại quiz')
                                : t('chapterSectionPage.quizStart', 'Start Quiz')}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
                              <span>{t('chapterSectionPage.quizProgress', 'Question {current}/{total}', { current: quizIndex + 1, total: totalQuestions })}</span>
                              <span className="text-brand">{t('chapterSectionPage.quizScoreLabel', 'Score: {score}/{total}', { score, total: totalQuestions })}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900">{currentQuizQuestion?.prompt}</h4>
                            <div className="space-y-3">
                              {currentQuizQuestion?.options?.map((option, optionIndex) => {
                                const isSelected = selectedOption === optionIndex;
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleSelectOption(optionIndex)}
                                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium text-slate-800 transition ${
                                      isSelected
                                        ? 'border-brand bg-brand/10 shadow-[0_10px_25px_rgba(56,189,248,0.25)]'
                                        : 'border-slate-300 bg-white hover:border-brand/50 hover:bg-brand/5'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={handleRestartQuiz}
                                className="text-xs font-semibold text-slate-500 underline decoration-slate-300 decoration-2 underline-offset-4 hover:text-slate-700"
                              >
                                {t('chapterSectionPage.quizRestartInline', 'Reset')}
                              </button>
                              <button
                                type="button"
                                onClick={handleNextQuiz}
                                disabled={selectedOption === null}
                                className={`rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition ${
                                  selectedOption === null ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand hover:bg-brand-dark'
                                }`}
                              >
                                {quizIndex + 1 === totalQuestions
                                  ? t('chapterSectionPage.quizFinish', 'Hoàn thành')
                                  : t('chapterSectionPage.quizNext', 'Next')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : quizText ? (
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{quizText}</p>
                    ) : (
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {t(
                          'chapterPage.sectionFallback',
                          'Admin chưa thêm nội dung cho mục này. Vui lòng cập nhật trong admin panel.'
                        )}
                      </p>
                    )
                  ) : quizText ? (
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{quizText}</p>
                  ) : (
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                      {t(
                        'chapterPage.sectionFallback',
                        'Admin chưa thêm nội dung cho mục này. Vui lòng cập nhật trong admin panel.'
                      )}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChapterSectionPage;
