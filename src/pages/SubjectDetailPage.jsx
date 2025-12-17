import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiBookOpen, FiLayers, FiList, FiPlayCircle } from 'react-icons/fi';
import LessonCard from '../components/LessonCard';
import { subjects } from '../data/lessons';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getLearningTracks } from '../services/learningTrackService.js';

const SubjectDetailPage = ({ progress, onComplete }) => {
  const { subjectId } = useParams();
  const { t } = useLanguage();
  const [tracks, setTracks] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const subject = useMemo(() => subjects.find((item) => item.id === subjectId), [subjectId]);
  const badgeLabel = subject
    ? subject.id === 'english-for-science'
      ? t('subjectsPage.coreBadge', 'Core English Subject')
      : t('subjectsPage.extensionBadge', 'Extension Module')
    : '';

  useEffect(() => {
    setTracks(getLearningTracks());
  }, []);

  useEffect(() => {
    setSelectedGrade('10');
    setSelectedChapterId(null);
    setSelectedLessonId(null);
  }, [subjectId]);

  const subjectTracks = useMemo(() => {
    if (!subject) return [];
    const normalizedTitle = subject.title.toLowerCase();
    return tracks.filter((track) => {
      const trackSubject = (track.subject || '').toLowerCase();
      return trackSubject === normalizedTitle || normalizedTitle.includes(trackSubject) || trackSubject.includes(normalizedTitle);
    });
  }, [subject, tracks]);

  const gradeTracks = useMemo(
    () => subjectTracks.filter((track) => track.gradeLevel === selectedGrade),
    [subjectTracks, selectedGrade]
  );

  const activeTrack = gradeTracks[0];
  const chapters = activeTrack?.chapters ?? [];
  const activeChapter = chapters.find((chapter) => chapter.id === selectedChapterId) || chapters[0];
  const lessons = activeChapter?.lessons ?? [];
  const activeLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  useEffect(() => {
    if (chapters.length && !selectedChapterId) {
      setSelectedChapterId(chapters[0].id);
    }
  }, [chapters, selectedChapterId]);

  useEffect(() => {
    if (lessons.length && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  const gradeLevels = ['10', '11', '12'];

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('subjectsPage.subjectNotFound', 'Subject not found')}
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          {t('subjectsPage.subjectNotFoundMessage', 'Please return to the subjects page and choose a different topic.')}
        </p>
        <Link
          to="/subjects"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:bg-brand-dark"
        >
          {t('lessonPage.backToSubjects', 'Back to subjects')}
        </Link>
      </div>
    );
  }

  const title = t(['subjects', subject.id, 'title'], subject.title);
  const overview = t(['subjects', subject.id, 'overview'], subject.overview);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <header
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white bg-cover bg-center p-10 text-slate-900 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.3)]"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.92), rgba(224,242,254,0.9)), url(${subject.heroImage})`,
          backgroundBlendMode: 'multiply'
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/80">{badgeLabel}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-700">{overview}</p>
      </header>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">
              {t('subjectsPage.gradeSelector', 'Chọn khối học')}
            </p>
            <h2 className="text-xl font-display font-semibold text-slate-900">
              {t('subjectsPage.gradeCollection', 'Bấm vào khối để xem Chapter do admin thêm')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {gradeLevels.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedGrade === grade
                    ? 'border-brand bg-brand text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)]'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand/60'
                }`}
              >
                {t('subjectsPage.gradeLabel', 'Grade {grade}', { grade })}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>
            {t(
              'subjectsPage.gradeHint',
              'Các chapter và nội dung bên dưới được thêm qua admin panel. Chọn khối → chapter → lesson để xem VOCAB/PRACTICE/DIALOGUE.'
            )}
          </p>
          {!gradeTracks.length && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
              {t(
                'subjectsPage.noChapters',
                'Chưa có chapter cho khối này. Admin hãy thêm bài trong trang quản trị để hiển thị tại đây.'
              )}
            </p>
          )}
        </div>

        {!!gradeTracks.length && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,1.2fr]">
            <article className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
                <span>{activeTrack?.summary || t('subjectsPage.chapterList', 'Danh sách chapter')}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Grade {selectedGrade}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => {
                      setSelectedChapterId(chapter.id);
                      setSelectedLessonId(chapter.lessons?.[0]?.id || null);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeChapter?.id === chapter.id
                        ? 'border-brand bg-brand text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand/60'
                    }`}
                  >
                    <FiLayers aria-hidden />
                    {chapter.title}
                  </button>
                ))}
              </div>

              {activeChapter?.description && (
                <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {activeChapter.description}
                </p>
              )}

              {!chapters.length && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  {t('subjectsPage.noChapterAdmin', 'Admin chưa thêm chapter cho khối này.')} 
                </p>
              )}
            </article>

            <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
                <FiList aria-hidden />
                <span>{activeChapter?.title || t('subjectsPage.lessonList', 'Chọn chapter để xem lesson')}</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`rounded-xl border p-3 text-left shadow-sm transition ${
                      activeLesson?.id === lesson.id
                        ? 'border-brand bg-brand/5'
                        : 'border-slate-200 bg-slate-50 hover:border-brand/50'
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">{lesson.title}</p>
                    <p className="mt-1 text-sm text-slate-700 line-clamp-3">
                      {lesson.sections?.vocab || t('subjectsPage.lessonPlaceholder', 'Admin thêm nội dung ở VOCAB/PRACTICE/DIALOGUE')}
                    </p>
                  </button>
                ))}
              </div>

              {activeLesson && (
                <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">VOCAB</p>
                    <p className="mt-1 whitespace-pre-line">{activeLesson.sections?.vocab || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">PRACTICE</p>
                    <p className="mt-1 whitespace-pre-line">{activeLesson.sections?.practice || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">DIALOGUE</p>
                    <p className="mt-1 whitespace-pre-line">{activeLesson.sections?.dialogue || '-'}</p>
                  </div>
                </div>
              )}

              {!lessons.length && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  {t('subjectsPage.noLessons', 'Chưa có lesson trong chapter này. Admin thêm bài để hiển thị.')}
                </p>
              )}
            </article>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-slate-900">
          {t('subjectsPage.lessonCollection', 'Lesson collection')}
        </h2>
        <div className="space-y-6">
          {subject.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              subjectId={subject.id}
              isCompleted={Boolean(progress[lesson.id])}
              onComplete={onComplete}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SubjectDetailPage;
