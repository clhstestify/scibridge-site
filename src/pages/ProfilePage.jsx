import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiFilter,
  FiList,
  FiTrendingUp,
  FiUpload,
  FiUser
} from 'react-icons/fi';
import { subjects } from '../data/lessons';
import { useLanguage } from '../context/LanguageContext.jsx';

const defaultAvatarOptions = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=60',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=60',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=60'
];

const defaultProfile = {
  name: 'Guest Learner',
  username: 'guest',
  role: 'student',
  avatar: defaultAvatarOptions[0],
  bio: 'Personalize your learning journey with a short introduction about your goals.'
};

const baseProgressRecords = (lessonLookup) => [
  {
    lessonId: 'language-of-experiments',
    status: 'in-progress',
    progressPercent: 40,
    lastAccessed: '2 hours ago',
    quizScore: 82,
    subjectTitle: lessonLookup['language-of-experiments']?.subjectTitle,
    lessonTitle: lessonLookup['language-of-experiments']?.title,
    subjectId: lessonLookup['language-of-experiments']?.subjectId
  },
  {
    lessonId: 'grade-10-math',
    status: 'in-progress',
    progressPercent: 25,
    lastAccessed: '1 day ago',
    quizScore: null,
    subjectTitle: lessonLookup['grade-10-math']?.subjectTitle,
    lessonTitle: lessonLookup['grade-10-math']?.title,
    subjectId: lessonLookup['grade-10-math']?.subjectId
  },
  {
    lessonId: 'science-presentation-skills',
    status: 'completed',
    progressPercent: 100,
    completionDate: '2024-12-01',
    quizScore: 76,
    subjectTitle: lessonLookup['science-presentation-skills']?.subjectTitle,
    lessonTitle: lessonLookup['science-presentation-skills']?.title,
    subjectId: lessonLookup['science-presentation-skills']?.subjectId
  },
  {
    lessonId: 'newton-laws',
    status: 'completed',
    progressPercent: 100,
    completionDate: '2024-11-12',
    quizScore: 88,
    subjectTitle: lessonLookup['newton-laws']?.subjectTitle,
    lessonTitle: lessonLookup['newton-laws']?.title,
    subjectId: lessonLookup['newton-laws']?.subjectId
  }
];

const ProfilePage = ({ user, onProfileUpdate, progress = {} }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(user ?? defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState(profile.bio || '');
  const [avatarDraft, setAvatarDraft] = useState(profile.avatar || defaultAvatarOptions[0]);
  const [error, setError] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('in-progress');

  useEffect(() => {
    setProfile(user ?? defaultProfile);
  }, [user]);

  useEffect(() => {
    setBioDraft(profile.bio || '');
    setAvatarDraft(profile.avatar || defaultAvatarOptions[0]);
  }, [profile]);

  const flattenedLessons = useMemo(
    () =>
      subjects.flatMap((subject) =>
        subject.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          subjectId: subject.id,
          subjectTitle: subject.title
        }))
      ),
    []
  );

  const lessonLookup = useMemo(
    () =>
      flattenedLessons.reduce((map, lesson) => {
        map[lesson.id] = lesson;
        return map;
      }, {}),
    [flattenedLessons]
  );

  const completedRecordsFromProgress = useMemo(
    () =>
      flattenedLessons
        .filter((lesson) => progress?.[lesson.id])
        .map((lesson) => ({
          lessonId: lesson.id,
          status: 'completed',
          progressPercent: 100,
          completionDate: new Date().toISOString().slice(0, 10),
          quizScore: null,
          subjectTitle: lesson.subjectTitle,
          lessonTitle: lesson.title,
          subjectId: lesson.subjectId
        })),
    [flattenedLessons, progress]
  );

  const mergedRecords = useMemo(() => {
    const seed = baseProgressRecords(lessonLookup);
    const map = new Map();
    seed.forEach((record) => {
      const lesson = lessonLookup[record.lessonId];
      map.set(record.lessonId, {
        ...record,
        subjectTitle: record.subjectTitle || lesson?.subjectTitle,
        lessonTitle: record.lessonTitle || lesson?.title,
        subjectId: record.subjectId || lesson?.subjectId
      });
    });
    completedRecordsFromProgress.forEach((record) => {
      const existing = map.get(record.lessonId);
      map.set(record.lessonId, { ...existing, ...record });
    });
    return Array.from(map.values());
  }, [completedRecordsFromProgress, lessonLookup]);

  const inProgressLessons = mergedRecords.filter((record) => record.status === 'in-progress');
  const completedLessons = mergedRecords.filter((record) => record.status === 'completed');

  const totalLessons = flattenedLessons.length;
  const completedCount = completedLessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const inProgressCount = inProgressLessons.length;
  const quizzesTaken = mergedRecords.filter((record) => record.quizScore !== null).length;
  const quizzesPassed = mergedRecords.filter((record) => (record.quizScore ?? 0) >= 70).length;
  const lessonsStarted = mergedRecords.length;

  const filteredInProgress = subjectFilter === 'all'
    ? inProgressLessons
    : inProgressLessons.filter((lesson) => lesson.subjectTitle === subjectFilter);

  const filteredCompleted = subjectFilter === 'all'
    ? completedLessons
    : completedLessons.filter((lesson) => lesson.subjectTitle === subjectFilter);

  const subjectFilters = useMemo(
    () => ['all', ...new Set(flattenedLessons.map((lesson) => lesson.subjectTitle))],
    [flattenedLessons]
  );

  const streakDays = Math.max(5, completedCount || inProgressCount ? 3 : 1);
  const estimatedHours = Math.max(2, Math.round((lessonsStarted * 45) / 60));

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarDraft(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    if (!bioDraft.trim()) {
      setError(t('profilePage.editModal.bioRequired', 'Bio is required'));
      return;
    }
    if (bioDraft.length > 200) {
      setError(t('profilePage.editModal.bioTooLong', 'Bio must be under 200 characters'));
      return;
    }

    const updatedProfile = {
      ...profile,
      avatar: avatarDraft,
      bio: bioDraft.trim()
    };
    setProfile(updatedProfile);
    onProfileUpdate?.(updatedProfile);
    setIsEditing(false);
    setError('');
  };

  const renderLessonCard = (record, isCompleted) => {
    const subjectName = record.subjectTitle || t('profilePage.labels.unknownSubject', 'Unknown subject');
    const lessonTitle = record.lessonTitle || t('profilePage.labels.unknownLesson', 'Lesson');
    const subjectId = record.subjectId;
    const lessonLink = subjectId ? `/subjects/${subjectId}/lessons/${record.lessonId}` : '#';

    return (
      <article
        key={record.lessonId}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{subjectName}</p>
            <h3 className="text-lg font-bold text-slate-900">{lessonTitle}</h3>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FiCheckCircle aria-hidden />
              {t('profilePage.tabs.completed', 'Completed')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <FiTrendingUp aria-hidden />
              {t('profilePage.tabs.inProgress', 'In progress')}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <FiClock aria-hidden />
            {isCompleted
              ? t('profilePage.list.completedOn', 'Completed on {date}', { date: record.completionDate || '—' })
              : t('profilePage.list.progress', 'Progress: {percent}%', { percent: record.progressPercent ?? 0 })}
          </div>
          {record.quizScore !== null && record.quizScore !== undefined && (
            <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
              <FiAward aria-hidden />
              {t('profilePage.list.quizScore', 'Quiz: {score}%', { score: record.quizScore })}
            </div>
          )}
          {!isCompleted && record.lastAccessed && (
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
              <FiClock aria-hidden />
              {t('profilePage.list.lastAccess', 'Last study: {time}', { time: record.lastAccessed })}
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-brand to-blue-500"
              style={{ width: `${Math.min(100, record.progressPercent ?? 0)}%` }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <FiBookOpen aria-hidden />
            <span>{t('profilePage.list.lessonId', 'Lesson ID')}: {record.lessonId}</span>
          </div>
          <Link
            to={lessonLink}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            {isCompleted
              ? t('profilePage.list.review', 'Review lesson')
              : t('profilePage.list.continue', 'Continue')}
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-16">
      <section className="border-b border-slate-200 bg-gradient-to-r from-brand/5 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">{t('profilePage.eyebrow', 'Learning Profile')}</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">{t('profilePage.title', 'Personalized roadmap')}</h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                {t(
                  'profilePage.subtitle',
                  'See your learning path, celebrate milestones, and give teachers a quick overview of your progress.'
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
              <FiAward className="text-brand" aria-hidden />
              {t('profilePage.motivation', 'Personalization boosts motivation and keeps you learning!')}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profile.avatar || defaultAvatarOptions[0]}
                      alt={profile.name}
                      className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                    />
                    <span className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow">
                      <FiUser aria-hidden />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('profilePage.personal.title', 'Personal info')}</p>
                    <h2 className="text-2xl font-display font-bold text-slate-900">{profile.name || 'Guest'}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-800">
                        {profile.role === 'teacher' || profile.role === 'admin'
                          ? t('profilePage.personal.roleTeacher', 'Teacher')
                          : t('profilePage.personal.roleStudent', 'Student')}
                      </span>
                      {profile.username && (
                        <span className="text-xs uppercase tracking-wide text-slate-500">@{profile.username}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand/60 hover:text-slate-900"
                >
                  <FiEdit aria-hidden />
                  {t('profilePage.personal.edit', 'Edit profile')}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-700">{profile.bio || t('profilePage.personal.addBio', 'Add a short bio to personalize your learning.')}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                    {t('profilePage.personal.privacy', 'Only you can edit this bio. Admins can view overall progress.')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <FiAward className="text-brand" aria-hidden />
                    {t('profilePage.personal.tipTitle', 'Personalization tip')}
                  </div>
                  <p>{t('profilePage.personal.tipBody', 'A friendly bio and avatar help mentors connect with you faster.')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t('profilePage.progress.overall', 'Overall progress')}</p>
                <span className="text-lg font-bold text-brand">{overallProgress}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand via-sky-400 to-blue-600"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                {t('profilePage.progress.caption', 'Completed {count}/{total} lessons', {
                  count: completedCount,
                  total: totalLessons
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('profilePage.progress.completed', 'Completed')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{completedCount}</p>
                <p className="text-xs text-slate-600">{t('profilePage.progress.completedHint', 'Lessons finished')}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('profilePage.progress.inProgress', 'In progress')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{inProgressCount}</p>
                <p className="text-xs text-slate-600">{t('profilePage.progress.inProgressHint', 'Keep the streak going')}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('profilePage.progress.quizzes', 'Quizzes')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{quizzesTaken}</p>
                <p className="text-xs text-slate-600">{t('profilePage.progress.quizzesHint', 'Attempted quizzes')}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('profilePage.progress.passed', 'Passed')}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{quizzesPassed}</p>
                <p className="text-xs text-slate-600">{t('profilePage.progress.passedHint', '>= 70% score')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FiList aria-hidden />
                {t('profilePage.section.learning', 'What you are learning')}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FiFilter className="text-slate-500" aria-hidden />
                <span className="text-slate-600">{t('profilePage.filter.label', 'Filter')}</span>
                <div className="flex flex-wrap gap-2">
                  {subjectFilters.map((subject) => (
                    <button
                      key={subject || 'unknown'}
                      type="button"
                      onClick={() => setSubjectFilter(subject)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        subjectFilter === subject
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40'
                      }`}
                    >
                      {subject === 'all' ? t('profilePage.filter.all', 'All subjects') : subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('in-progress')}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'in-progress'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('profilePage.tabs.inProgress', 'In progress')} ({inProgressLessons.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'completed'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('profilePage.tabs.completed', 'Completed')} ({completedLessons.length})
              </button>
            </div>

            {activeTab === 'in-progress' ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredInProgress.length === 0 ? (
                  <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                    {t('profilePage.empty.inProgress', 'No lessons in progress yet.')}
                  </div>
                ) : (
                  filteredInProgress.map((record) => renderLessonCard(record, false))
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredCompleted.length === 0 ? (
                  <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                    {t('profilePage.empty.completed', 'Complete a lesson to see it here.')}
                  </div>
                ) : (
                  filteredCompleted.map((record) => renderLessonCard(record, true))
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t('profilePage.activity.title', 'Activity')}</p>
                <FiTrendingUp className="text-brand" aria-hidden />
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    <FiAward className="text-amber-500" aria-hidden />
                    {t('profilePage.activity.streak', '{count}-day streak', { count: streakDays })}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {t('profilePage.activity.keepGoing', 'Keep going!')}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <FiClock className="text-slate-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900">{t('profilePage.activity.lastStudy', 'Last study')}</p>
                    <p className="text-sm text-slate-700">{t('profilePage.activity.lastStudyValue', '2 hours ago')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <FiBookOpen className="text-slate-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900">{t('profilePage.activity.totalTime', 'Total time')}</p>
                    <p className="text-sm text-slate-700">{t('profilePage.activity.totalTimeValue', '{hours} hours', { hours: estimatedHours })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <FiAward className="text-slate-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-slate-900">{t('profilePage.activity.recentQuiz', 'Recent quiz')}</p>
                    <p className="text-sm text-slate-700">{t('profilePage.activity.recentQuizValue', 'Best score {score}%', { score: Math.max(...mergedRecords.map((r) => r.quizScore || 0), 0) })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand/5 via-white to-sky-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t('profilePage.summary.title', 'Snapshot')}</p>
              <div className="mt-4 space-y-3 text-slate-800">
                <div className="flex items-center justify-between">
                  <span>{t('profilePage.summary.lessons', 'Lessons started')}</span>
                  <span className="font-bold text-slate-900">{lessonsStarted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('profilePage.summary.completed', 'Lessons completed')}</span>
                  <span className="font-bold text-slate-900">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('profilePage.summary.inProgress', 'Currently learning')}</span>
                  <span className="font-bold text-slate-900">{inProgressCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('profilePage.summary.quizzes', 'Quizzes attempted')}</span>
                  <span className="font-bold text-slate-900">{quizzesTaken}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('profilePage.editModal.title', 'Edit profile')}</p>
                <h3 className="text-xl font-display font-bold text-slate-900">{t('profilePage.editModal.subtitle', 'Update your avatar and bio')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-500 transition hover:text-slate-800"
                aria-label={t('profilePage.editModal.cancel', 'Cancel')}
              >
                ✕
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSaveProfile}>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="bio">
                  {t('profilePage.editModal.bioLabel', 'Bio (200 characters max)')}
                </label>
                <textarea
                  id="bio"
                  value={bioDraft}
                  onChange={(event) => setBioDraft(event.target.value)}
                  maxLength={200}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-brand focus:bg-white focus:outline-none"
                  placeholder={t('profilePage.editModal.bioPlaceholder', 'Share your learning goals or interests...')}
                />
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{t('profilePage.editModal.bioHint', 'Keep it friendly and concise.')}</span>
                  <span>{bioDraft.length}/200</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">{t('profilePage.editModal.avatarLabel', 'Avatar')}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarDraft}
                      alt={profile.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow"
                    />
                    <div className="space-y-2 text-sm">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 shadow-sm hover:border-brand/60">
                        <FiUpload aria-hidden />
                        {t('profilePage.editModal.upload', 'Upload image')}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                      <div className="flex gap-2">
                        {defaultAvatarOptions.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setAvatarDraft(avatar)}
                            className={`h-10 w-10 overflow-hidden rounded-full border ${
                              avatarDraft === avatar ? 'border-brand ring-2 ring-brand/40' : 'border-slate-200'
                            }`}
                          >
                            <img src={avatar} alt="Default avatar" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{t('profilePage.editModal.securityTitle', 'Privacy')}</p>
                  <p>{t('profilePage.editModal.securityBody', 'You can only edit your own profile. Admins can review progress to support you.')}</p>
                </div>
              </div>

              {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  {t('profilePage.editModal.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  <FiCheckCircle aria-hidden />
                  {t('profilePage.editModal.save', 'Save changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
