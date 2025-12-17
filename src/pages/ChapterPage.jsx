import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiFolder, FiLayers, FiMessageSquare } from 'react-icons/fi';
import { subjects } from '../data/lessons';
import { getLearningTracks } from '../services/learningTrackService';
import { useLanguage } from '../context/LanguageContext.jsx';

const ChapterPage = () => {
  const { subjectId, gradeLevel, chapterId } = useParams();
  const { t } = useLanguage();

  const subject = useMemo(() => subjects.find((item) => item.id === subjectId), [subjectId]);
  const tracks = useMemo(() => getLearningTracks(), []);

  const track = useMemo(() => {
    if (!subject) return null;
    const normalizedTitle = subject.title.toLowerCase();
    return tracks.find((entry) => {
      const trackSubject = (entry.subject || '').toLowerCase();
      return (
        entry.gradeLevel === gradeLevel &&
        (trackSubject === normalizedTitle ||
          normalizedTitle.includes(trackSubject) ||
          trackSubject.includes(normalizedTitle))
      );
    });
  }, [gradeLevel, subject, tracks]);

  const chapter = useMemo(
    () => track?.chapters?.find((item) => item.id === chapterId),
    [chapterId, track?.chapters]
  );

  const subjectTitle = t(['subjects', subject?.id, 'title'], subject?.title || '');

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
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {[
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
              'Đoạn hội thoại luyện nói hoặc kịch bản tình huống cho chapter.'
            ),
            icon: FiMessageSquare
          }
        ].map(({ key, label, description, icon: Icon }) => (
          <section key={key} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-brand/10 p-2 text-brand">
                <Icon aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</p>
                <p className="text-sm text-slate-700">{description}</p>
              </div>
            </div>

            {!chapter.lessons?.length ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {t('chapterPage.noLessons', 'Chapter này chưa có lesson. Admin hãy thêm bài để hiển thị nội dung đầy đủ.')}
              </p>
            ) : (
              <div className="space-y-3">
                {chapter.lessons.map((lesson) => {
                  const content = lesson.sections?.[key];

                  return (
                    <article
                      key={`${key}-${lesson.id}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <FiFolder className="text-brand" aria-hidden />
                        <span>{lesson.title}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                        {content ||
                          t(
                            'chapterPage.sectionFallback',
                            'Admin chưa thêm nội dung cho mục này. Vui lòng cập nhật trong admin panel.'
                          )}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ChapterPage;
