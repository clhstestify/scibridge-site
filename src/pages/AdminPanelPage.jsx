import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheckCircle,
  FiEdit,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiList,
  FiPlayCircle,
  FiShield,
  FiUserCheck,
  FiUsers
} from 'react-icons/fi';
import {
  createAnnouncement,
  createContest,
  createPracticeSet,
  fetchDashboard,
  updateUserRole,
  updateUserStatus
} from '../services/adminService';
import {
  addChapter,
  addLearningTrack,
  addLesson,
  addQuizQuestion,
  getLearningTracks
} from '../services/learningTrackService.js';
import WPAdminToolbar from '../components/WPAdminToolbar.jsx';

const WORDPRESS_ADMIN_URL = (import.meta.env.VITE_WORDPRESS_ADMIN_URL || '').trim();

const defaultAnnouncement = { title: '', message: '', audience: 'global' };
const defaultContest = { name: '', description: '', deadline: '', audience: 'global' };
const defaultPractice = { title: '', focusArea: '', description: '', resourceUrl: '', audience: 'global' };
const defaultTrackForm = {
  subject: 'Mathematics',
  gradeLevel: '10',
  summary: '',
  heroImage: '',
  documentUrl: '',
  youtubeUrl: ''
};
const defaultChapterForm = { trackId: '', title: '', description: '' };
const defaultLessonForm = {
  trackId: '',
  chapterId: '',
  title: '',
  vocabularyNote: '',
  vocabularyItems: [],
  quizzes: '',
  dialogueEnglish: '',
  dialogueVietnamese: ''
};
const defaultQuizDraft = { trackId: '', prompt: '', options: ['', '', '', ''], correctIndex: 0 };
const defaultVocabularyDraft = { term: '', translation: '', audioFileName: '', file: null };

const sectionIds = {
  wordpress: 'wordpress-admin-section',
  overview: 'admin-section-overview',
  announcements: 'admin-section-announcements',
  contests: 'admin-section-contests',
  practice: 'admin-section-practice',
  tracks: 'admin-section-tracks',
  people: 'admin-section-people'
};

const WordPressAdminEmbed = ({ url }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (!url) {
      return undefined;
    }

    timeoutRef.current = setTimeout(() => {
      setHasError(true);
    }, 12000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, [url]);

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setHasError(false);
    setIsLoaded(true);
  };

  if (!url) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <p>
          Provide a WordPress admin URL by setting
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
            VITE_WORDPRESS_ADMIN_URL
          </code>
          in your environment. This enables the embedded WordPress dashboard for content management.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">WordPress admin</h2>
          <p className="text-sm text-slate-600">
            Manage posts, pages, plugins, and users on your connected WordPress site without leaving SciBridge.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <FiExternalLink aria-hidden />
          Open in new tab
        </a>
      </div>
      <div className="relative min-h-[80vh] bg-slate-100 lg:min-h-[85vh]">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            Loading WordPress admin…
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-red-600">
            <FiAlertTriangle className="h-6 w-6" aria-hidden />
            <p>
              We couldn&apos;t load the WordPress dashboard. Confirm the URL is correct and that the site allows embedding its
              admin panel inside an iframe.
            </p>
          </div>
        )}
        <iframe
          key={url}
          src={url}
          title="WordPress admin"
          className={`h-full w-full bg-white transition-opacity duration-300 ${
            isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    </div>
  );
};

const AdminPanelPage = ({ user, onProfileUpdate, onLogout }) => {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('wordpress');

  const [announcementForm, setAnnouncementForm] = useState(defaultAnnouncement);
  const [contestForm, setContestForm] = useState(defaultContest);
  const [practiceForm, setPracticeForm] = useState(defaultPractice);
  const [trackForm, setTrackForm] = useState(defaultTrackForm);
  const [chapterForm, setChapterForm] = useState(defaultChapterForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);
  const [quizDraft, setQuizDraft] = useState(defaultQuizDraft);
  const [vocabularyDraft, setVocabularyDraft] = useState(defaultVocabularyDraft);
  const [learningTracks, setLearningTracks] = useState(() => getLearningTracks());

  const [roleDrafts, setRoleDrafts] = useState({});
  const [orgDrafts, setOrgDrafts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vocabularyInputKey, setVocabularyInputKey] = useState(0);

  const subjectChoices = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'IT',
    'English for Science',
    'Classroom Language'
  ];

  const role = user?.role;
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const canAccessPanel = Boolean(user) && (isAdmin || isTeacher);

  useEffect(() => {
    if (!canAccessPanel) {
      return;
    }

    let isMounted = true;
    setStatus('loading');
    fetchDashboard(user)
      .then((data) => {
        if (!isMounted) return;
        setDashboard(data);
        setStatus('ready');
        setErrorMessage('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [canAccessPanel, user]);

  useEffect(() => {
    if (!dashboard || !user) {
      return;
    }
    if (dashboard.viewer && dashboard.viewer.username === user.username) {
      onProfileUpdate?.(dashboard.viewer);
    }
  }, [dashboard, onProfileUpdate, user]);

  useEffect(() => {
    if (learningTracks.length === 0 || quizDraft.trackId) {
      return;
    }
    setQuizDraft((previous) => ({ ...previous, trackId: learningTracks[0].id }));
  }, [learningTracks, quizDraft.trackId]);

  useEffect(() => {
    if (!learningTracks.length) return;
    const firstTrackId = learningTracks[0].id;
    setChapterForm((previous) => ({ ...previous, trackId: previous.trackId || firstTrackId }));
    setLessonForm((previous) => ({
      ...previous,
      trackId: previous.trackId || firstTrackId,
      chapterId: previous.chapterId || learningTracks[0].chapters?.[0]?.id || '',
      vocabularyItems: previous.vocabularyItems || [],
      vocabularyNote: previous.vocabularyNote || ''
    }));
  }, [learningTracks]);

  useEffect(() => {
    if (!lessonForm.trackId) return;
    const track = learningTracks.find((entry) => entry.id === lessonForm.trackId);
    if (!track) return;
    const firstChapterId = track.chapters?.[0]?.id || '';
    const chapterExists = track.chapters?.some((chapter) => chapter.id === lessonForm.chapterId);
    if (!chapterExists && firstChapterId !== lessonForm.chapterId) {
      setLessonForm((previous) => ({ ...previous, chapterId: firstChapterId }));
    }
  }, [learningTracks, lessonForm.trackId, lessonForm.chapterId]);

  const setRoleDraft = (userId, value) => {
    setRoleDrafts((previous) => ({ ...previous, [userId]: value }));
  };

  const setOrgDraft = (userId, value) => {
    setOrgDrafts((previous) => ({ ...previous, [userId]: value }));
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
  };

  const addVocabularyItem = (entry) => {
    const cleaned = {
      term: entry.term?.trim() || '',
      translation: entry.translation?.trim() || '',
      audioFileName: resolveAudioFileName(entry)
    };

    if (!cleaned.term) {
      handleError('Nhập từ vựng trước khi lưu.');
      return false;
    }

    setLessonForm((previous) => ({
      ...previous,
      vocabularyItems: [...(previous.vocabularyItems || []), cleaned]
    }));
    setErrorMessage('');
    setVocabularyDraft(defaultVocabularyDraft);
    setVocabularyInputKey((value) => value + 1);
    return true;
  };

  const removeVocabularyItem = (index) => {
    setLessonForm((previous) => ({
      ...previous,
      vocabularyItems: (previous.vocabularyItems || []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
  };

  const resolveAudioFileName = (entry) => entry.file?.name || entry.audioFileName || '';

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { announcement } = await createAnnouncement(user, announcementForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          announcements: [announcement, ...(previous.announcements ?? [])]
        };
      });
      setAnnouncementForm(defaultAnnouncement);
      handleSuccess('Announcement published successfully.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContestSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { contest } = await createContest(user, contestForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          contests: [contest, ...(previous.contests ?? [])]
        };
      });
      setContestForm(defaultContest);
      handleSuccess('Contest created for learners.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePracticeSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { practiceSet } = await createPracticeSet(user, practiceForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          practiceSets: [practiceSet, ...(previous.practiceSets ?? [])]
        };
      });
      setPracticeForm(defaultPractice);
      handleSuccess('Practice set shared with your learners.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const newTrack = addLearningTrack(trackForm);
      setLearningTracks((previous) => [newTrack, ...previous]);
      setTrackForm(defaultTrackForm);
      setQuizDraft((previous) => ({ ...defaultQuizDraft, trackId: previous.trackId || newTrack.id }));
      handleSuccess('Saved new grade-level content. Learners can see it on the home page.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChapterSubmit = (event) => {
    event.preventDefault();
    if (!chapterForm.trackId) {
      handleError('Chọn khối trước khi thêm chapter.');
      return;
    }
    setIsSubmitting(true);
    try {
      addChapter(chapterForm.trackId, { title: chapterForm.title, description: chapterForm.description });
      setLearningTracks(getLearningTracks());
      setChapterForm((previous) => ({ ...previous, title: '', description: '' }));
      handleSuccess('Đã thêm chapter mới. Hãy thêm lesson và nội dung cho VOCABULARY/QUIZZES/DIALOGUE.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLessonSubmit = (event) => {
    event.preventDefault();
    if (!lessonForm.trackId || !lessonForm.chapterId) {
      handleError('Chọn khối và chapter trước khi thêm lesson.');
      return;
    }

    if (!lessonForm.vocabularyItems.length && !lessonForm.vocabularyNote.trim()) {
      handleError('Thêm ít nhất 1 từ vựng hoặc ghi chú vocabulary.');
      return;
    }
    setIsSubmitting(true);
    try {
      addLesson(lessonForm.trackId, lessonForm.chapterId, {
        title: lessonForm.title,
        sections: {
          vocabulary: {
            items: lessonForm.vocabularyItems,
            note: lessonForm.vocabularyNote
          },
          quizzes: lessonForm.quizzes,
          dialogue: {
            english: lessonForm.dialogueEnglish,
            vietnamese: lessonForm.dialogueVietnamese
          }
        }
      });
      setLearningTracks(getLearningTracks());
      setLessonForm((previous) => ({
        ...previous,
        title: '',
        vocabularyNote: '',
        vocabularyItems: [],
        quizzes: '',
        dialogueEnglish: '',
        dialogueVietnamese: ''
      }));
      handleSuccess('Đã lưu lesson với 3 mục VOCABULARY/QUIZZES/DIALOGUE.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizDraftChange = (index, value) => {
    setQuizDraft((previous) => {
      const options = [...previous.options];
      options[index] = value;
      return { ...previous, options };
    });
  };

  const handleQuizSubmit = (event) => {
    event.preventDefault();
    if (!quizDraft.trackId) {
      handleError('Select a lesson before attaching a quiz question.');
      return;
    }

    const cleanedOptions = quizDraft.options.filter((option) => option.trim() !== '');
    if (cleanedOptions.length < 2) {
      handleError('Please provide at least two answer choices.');
      return;
    }

    setIsSubmitting(true);
    try {
      const boundedIndex = Math.min(Math.max(Number(quizDraft.correctIndex), 0), cleanedOptions.length - 1);
      const updatedTrack = addQuizQuestion(quizDraft.trackId, {
        prompt: quizDraft.prompt,
        options: cleanedOptions,
        correctIndex: boundedIndex
      });
      setLearningTracks((previous) =>
        previous.map((track) => (track.id === updatedTrack.id ? updatedTrack : track))
      );
      setQuizDraft({ ...defaultQuizDraft, trackId: updatedTrack.id });
      handleSuccess('Quiz question added to this lesson.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleUpdate = async (target) => {
    const nextRole = roleDrafts[target.id] ?? target.role;
    const nextOrg = orgDrafts[target.id] ?? target.organization ?? '';

    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await updateUserRole(user, {
        userId: target.id,
        role: nextRole,
        organization: nextOrg
      });

      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          users: previous.users.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry))
        };
      });

      if (updatedUser.username === user.username) {
        onProfileUpdate?.(updatedUser);
      }

      setRoleDrafts((previous) => ({ ...previous, [target.id]: undefined }));
      setOrgDrafts((previous) => ({ ...previous, [target.id]: undefined }));
      handleSuccess('User role updated successfully.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (target) => {
    const nextStatus = target.status === 'active' ? 'banned' : 'active';
    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await updateUserStatus(user, {
        userId: target.id,
        status: nextStatus
      });

      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          users: previous.users.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry))
        };
      });
      handleSuccess(`User status changed to ${nextStatus}.`);
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    const element = document.getElementById(sectionIds[section] ?? section);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headline = useMemo(() => {
    if (isAdmin) {
      return 'Administrative hub';
    }
    if (isTeacher) {
      return 'Teaching leadership hub';
    }
    return 'Admin panel';
  }, [isAdmin, isTeacher]);

  const users = dashboard?.users ?? [];
  const announcements = dashboard?.announcements ?? [];
  const contests = dashboard?.contests ?? [];
  const practiceSets = dashboard?.practiceSets ?? [];

  const stats = useMemo(() => {
    const activeUsers = users.filter((entry) => entry.status === 'active').length;
    const teachers = users.filter((entry) => entry.role === 'teacher').length;
    const admins = users.filter((entry) => entry.role === 'admin').length;
    return [
      {
        label: 'Community members',
        value: users.length,
        hint: `${teachers} teachers · ${admins} admins`
      },
      {
        label: 'Announcements',
        value: announcements.length,
        hint: 'Shared English-language updates'
      },
      {
        label: 'Active contests',
        value: contests.length,
        hint: 'Learning challenges currently live'
      },
      {
        label: 'Practice sets',
        value: practiceSets.length,
        hint: 'Guided science-language exercises'
      },
      {
        label: 'Grade-level lessons',
        value: learningTracks.length,
        hint: 'Admin-created media, docs, and quizzes'
      },
      {
        label: 'Active users',
        value: activeUsers,
        hint: `${users.length - activeUsers} awaiting action`
      }
    ];
  }, [announcements.length, contests.length, learningTracks.length, practiceSets.length, users]);

  const navItems = useMemo(
    () => [
      { id: 'wordpress', label: 'WordPress admin', icon: FiGlobe },
      { id: 'overview', label: 'Overview', icon: FiLayers },
      { id: 'announcements', label: 'Announcements', icon: FiEdit, badge: announcements.length || undefined },
      { id: 'contests', label: 'Contests', icon: FiUsers, badge: contests.length || undefined },
      { id: 'practice', label: 'Practice', icon: FiUserCheck, badge: practiceSets.length || undefined },
      { id: 'tracks', label: 'Grade content', icon: FiBookOpen, badge: learningTracks.length || undefined },
      { id: 'people', label: 'People', icon: FiShield, badge: users.length || undefined }
    ],
    [announcements.length, contests.length, learningTracks.length, practiceSets.length, users.length]
  );

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <FiShield className="mx-auto h-12 w-12 text-brand" aria-hidden />
        <h1 className="mt-6 text-3xl font-display font-semibold text-slate-900">Sign in to access the admin panel</h1>
        <p className="mt-3 text-sm text-slate-600">
          Please create an account, sign in with your username, and ensure you have administrator or teacher permissions to view this page.
        </p>
      </div>
    );
  }

  if (!canAccessPanel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-amber-500" aria-hidden />
        <h1 className="mt-6 text-3xl font-display font-semibold text-slate-900">Limited access</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account is currently a student account. Please contact an administrator if you need teacher or admin permissions
          to manage community content.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <WPAdminToolbar user={user} onLogout={onLogout} />
      <div className="mx-auto w-full px-4 py-10 lg:px-10 xl:px-12">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{headline}</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Review SciBridge community insights and jump straight into your connected WordPress admin dashboard.
              </p>
              {status === 'loading' && <p className="mt-1 text-sm text-slate-500">Loading dashboard data…</p>}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="font-semibold text-slate-800">{user?.name ?? user?.username}</div>
              <div>@{user.username}</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                {isAdmin ? 'Admin' : 'Teacher'}
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              <FiAlertTriangle className="h-5 w-5" aria-hidden />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
              <FiCheckCircle className="h-5 w-5" aria-hidden />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px,1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSectionSelect(item.id)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon aria-hidden />
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-700">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="space-y-8">
            <section id={sectionIds.wordpress} className="space-y-4">
              <WordPressAdminEmbed url={WORDPRESS_ADMIN_URL} />
              <p className="text-sm text-slate-600">
                The embedded admin panel respects the permissions and authentication of your WordPress installation. If the
                dashboard does not appear, ensure the site is accessible from the SciBridge domain and that embedding is
                permitted (check the <code className="font-mono text-xs">X-Frame-Options</code> header).
              </p>
            </section>

            <section id={sectionIds.overview} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Community insights</h2>
                  <p className="text-sm text-slate-600">Monitor the status of your SciBridge learning community at a glance.</p>
                </div>
                <div className="text-xs uppercase tracking-wide text-slate-400">Updated automatically</div>
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((entry) => (
                  <div key={entry.label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-sm font-medium text-slate-600">{entry.label}</dt>
                    <dd className="mt-1 text-2xl font-semibold text-slate-900">{entry.value}</dd>
                    <p className="mt-1 text-xs text-slate-500">{entry.hint}</p>
                  </div>
                ))}
              </dl>
            </section>

            <section id={sectionIds.announcements} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Publish announcement</h2>
                  <p className="text-sm text-slate-600">Share timely English updates across your learners.</p>
                </div>
              </div>
              <form onSubmit={handleAnnouncementSubmit} className="mt-4 grid gap-4">
                <label className="grid gap-1 text-sm text-slate-700">
                  Title
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(event) => setAnnouncementForm((previous) => ({ ...previous, title: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Weekly English immersion focus"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Message
                  <textarea
                    value={announcementForm.message}
                    onChange={(event) => setAnnouncementForm((previous) => ({ ...previous, message: event.target.value }))}
                    className="min-h-[140px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Use friendly academic language to guide students."
                    required
                  />
                </label>
                {isAdmin && (
                  <label className="grid gap-1 text-sm text-slate-700">
                    Audience
                    <input
                      type="text"
                      value={announcementForm.audience}
                      onChange={(event) =>
                        setAnnouncementForm((previous) => ({ ...previous, audience: event.target.value }))
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                      placeholder="global or organization name"
                    />
                  </label>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                  disabled={isSubmitting}
                >
                  <FiEdit aria-hidden />
                  Share announcement
                </button>
              </form>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">Recent announcements</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  {announcements.length === 0 && <p className="text-slate-500">No announcements published yet.</p>}
                  {announcements.map((announcement) => (
                    <article key={announcement.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Audience: {announcement.audience}</p>
                      <p className="mt-2 text-sm text-slate-700">{announcement.message}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id={sectionIds.contests} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Launch contest or challenge</h2>
                  <p className="text-sm text-slate-600">Create science-language challenges and keep learners on schedule.</p>
                </div>
              </div>
              <form onSubmit={handleContestSubmit} className="mt-4 grid gap-4">
                <label className="grid gap-1 text-sm text-slate-700">
                  Contest name
                  <input
                    type="text"
                    value={contestForm.name}
                    onChange={(event) => setContestForm((previous) => ({ ...previous, name: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="English Lab Journal Showcase"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Description
                  <textarea
                    value={contestForm.description}
                    onChange={(event) => setContestForm((previous) => ({ ...previous, description: event.target.value }))}
                    className="min-h-[140px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Students submit a one-page explanation of a recent experiment in English."
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Deadline (optional)
                  <input
                    type="date"
                    value={contestForm.deadline}
                    onChange={(event) => setContestForm((previous) => ({ ...previous, deadline: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </label>
                {isAdmin && (
                  <label className="grid gap-1 text-sm text-slate-700">
                    Audience
                    <input
                      type="text"
                      value={contestForm.audience}
                      onChange={(event) => setContestForm((previous) => ({ ...previous, audience: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                      placeholder="global or organization name"
                    />
                  </label>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                  disabled={isSubmitting}
                >
                  <FiUsers aria-hidden />
                  Create contest
                </button>
              </form>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">Active contests</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  {contests.length === 0 && <p className="text-slate-500">No contests created yet.</p>}
                  {contests.map((contest) => (
                    <article key={contest.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <h4 className="font-semibold text-slate-900">{contest.name}</h4>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                        Audience: {contest.audience}
                        {contest.deadline ? ` · Due ${contest.deadline}` : ''}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{contest.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id={sectionIds.practice} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Build English practice sets</h2>
                  <p className="text-sm text-slate-600">Connect vocabulary, grammar, and science concepts with curated resources.</p>
                </div>
              </div>
              <form onSubmit={handlePracticeSubmit} className="mt-4 grid gap-4">
                <label className="grid gap-1 text-sm text-slate-700">
                  Title
                  <input
                    type="text"
                    value={practiceForm.title}
                    onChange={(event) => setPracticeForm((previous) => ({ ...previous, title: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Photosynthesis vocabulary focus"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Focus area
                  <input
                    type="text"
                    value={practiceForm.focusArea}
                    onChange={(event) => setPracticeForm((previous) => ({ ...previous, focusArea: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Key vocabulary"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Description
                  <textarea
                    value={practiceForm.description}
                    onChange={(event) => setPracticeForm((previous) => ({ ...previous, description: event.target.value }))}
                    className="min-h-[140px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="Summarize the activity in clear English."
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-700">
                  Resource URL (optional)
                  <input
                    type="url"
                    value={practiceForm.resourceUrl}
                    onChange={(event) => setPracticeForm((previous) => ({ ...previous, resourceUrl: event.target.value }))}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="https://"
                  />
                </label>
                {isAdmin && (
                  <label className="grid gap-1 text-sm text-slate-700">
                    Audience
                    <input
                      type="text"
                      value={practiceForm.audience}
                      onChange={(event) => setPracticeForm((previous) => ({ ...previous, audience: event.target.value }))}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                      placeholder="global or organization name"
                    />
                  </label>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                  disabled={isSubmitting}
                >
                  <FiUserCheck aria-hidden />
                  Share practice set
                </button>
              </form>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">Practice sets</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  {practiceSets.length === 0 && <p className="text-slate-500">No practice sets created yet.</p>}
                  {practiceSets.map((practice) => (
                    <article key={practice.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <h4 className="font-semibold text-slate-900">{practice.title}</h4>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                        Focus: {practice.focusArea} · Audience: {practice.audience}
                      </p>
                      {practice.description && <p className="mt-2 text-sm text-slate-700">{practice.description}</p>}
                      {practice.resourceUrl && (
                        <a
                          href={practice.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand"
                        >
                          <FiExternalLink className="h-4 w-4" aria-hidden />
                          Open linked resource
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id={sectionIds.tracks} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Grade → Chapter → Lesson (3 mục)</h2>
                  <p className="text-sm text-slate-600">
                    Làm đúng flow mẫu: Khối 10 có 7 chapter, chọn Chapter 4 rồi Lesson 7 sẽ thấy VOCAB/PRACTICE/DIALOGUE. Dữ
                    liệu lưu tại trình duyệt cho admin thử nghiệm nhanh.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr,1fr]">
                <div className="space-y-4">
                  <form onSubmit={handleTrackSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">1) Tạo khối (grade)</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-1 text-sm text-slate-700">
                        Subject
                        <select
                          value={trackForm.subject}
                          onChange={(event) => setTrackForm((previous) => ({ ...previous, subject: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          required
                        >
                          {subjectChoices.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm text-slate-700">
                        Grade
                        <select
                          value={trackForm.gradeLevel}
                          onChange={(event) => setTrackForm((previous) => ({ ...previous, gradeLevel: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          required
                        >
                          {['10', '11', '12'].map((grade) => (
                            <option key={grade} value={grade}>
                              Grade {grade}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="grid gap-1 text-sm text-slate-700">
                      Grade summary
                      <textarea
                        value={trackForm.summary}
                        onChange={(event) => setTrackForm((previous) => ({ ...previous, summary: event.target.value }))}
                        className="min-h-[90px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="Ví dụ: Khối 10 có 7 chapter. Chọn Chapter 4 để xem Lesson 7 với 3 mục."
                        required
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-1 text-sm text-slate-700">
                        Cover image URL
                        <input
                          type="url"
                          value={trackForm.heroImage}
                          onChange={(event) => setTrackForm((previous) => ({ ...previous, heroImage: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="https://..."
                          required
                        />
                      </label>
                      <label className="grid gap-1 text-sm text-slate-700">
                        PDF/Doc link (optional)
                        <input
                          type="url"
                          value={trackForm.documentUrl}
                          onChange={(event) => setTrackForm((previous) => ({ ...previous, documentUrl: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="https://example.com/grade10.pdf"
                        />
                      </label>
                      <label className="grid gap-1 text-sm text-slate-700">
                        YouTube link (optional)
                        <input
                          type="url"
                          value={trackForm.youtubeUrl}
                          onChange={(event) => setTrackForm((previous) => ({ ...previous, youtubeUrl: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                      disabled={isSubmitting}
                    >
                      <FiBookOpen aria-hidden /> Lưu khối
                    </button>
                    <p className="text-xs text-slate-500">Tạo khối xong thì thêm chapter và lesson bên dưới.</p>
                  </form>

                  <form onSubmit={handleChapterSubmit} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">2) Thêm chapter cho khối</p>
                    <label className="grid gap-1 text-sm text-slate-700">
                      Chọn khối
                      <select
                        value={chapterForm.trackId}
                        onChange={(event) => setChapterForm((previous) => ({ ...previous, trackId: event.target.value }))}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                      >
                        {learningTracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.subject} · Grade {track.gradeLevel}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm text-slate-700">
                      Chapter title (VD: Chapter 4)
                      <input
                        type="text"
                        value={chapterForm.title}
                        onChange={(event) => setChapterForm((previous) => ({ ...previous, title: event.target.value }))}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="Chapter 4"
                        required
                      />
                    </label>
                    <label className="grid gap-1 text-sm text-slate-700">
                      Mô tả ngắn
                      <textarea
                        value={chapterForm.description}
                        onChange={(event) => setChapterForm((previous) => ({ ...previous, description: event.target.value }))}
                        className="min-h-[80px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="Học từ vựng thí nghiệm hóa học"
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
                      disabled={isSubmitting || learningTracks.length === 0}
                    >
                      <FiLayers aria-hidden /> Lưu chapter
                    </button>
                  </form>

                  <form onSubmit={handleLessonSubmit} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">3) Thêm lesson với 3 mục</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-1 text-sm text-slate-700">
                        Khối
                        <select
                          value={lessonForm.trackId}
                          onChange={(event) =>
                            setLessonForm((previous) => ({ ...previous, trackId: event.target.value, chapterId: '' }))
                          }
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        >
                          {learningTracks.map((track) => (
                            <option key={track.id} value={track.id}>
                              {track.subject} · Grade {track.gradeLevel}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm text-slate-700">
                        Chapter
                        <select
                          value={lessonForm.chapterId}
                          onChange={(event) => setLessonForm((previous) => ({ ...previous, chapterId: event.target.value }))}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        >
                          {(learningTracks.find((track) => track.id === lessonForm.trackId)?.chapters || []).map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                              {chapter.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="grid gap-1 text-sm text-slate-700">
                      Lesson title (VD: Lesson 7)
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(event) => setLessonForm((previous) => ({ ...previous, title: event.target.value }))}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="Lesson 7"
                        required
                      />
                    </label>
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="grid gap-1 text-sm text-slate-700">
                        VOCABULARY (audio cho từng từ)
                        <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                          <div className="grid gap-2 md:grid-cols-3">
                            <label className="grid gap-1 text-xs font-semibold text-slate-700">
                              Từ vựng
                              <input
                                type="text"
                                value={vocabularyDraft.term}
                                onChange={(event) => setVocabularyDraft((previous) => ({ ...previous, term: event.target.value }))}
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                                placeholder="beaker"
                              />
                            </label>
                            <label className="grid gap-1 text-xs font-semibold text-slate-700">
                              Nghĩa/giải thích
                              <input
                                type="text"
                                value={vocabularyDraft.translation}
                                onChange={(event) =>
                                  setVocabularyDraft((previous) => ({ ...previous, translation: event.target.value }))
                                }
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                                placeholder="cốc đong"
                              />
                            </label>
                            <label className="grid gap-1 text-xs font-semibold text-slate-700">
                              File MP3 (upload lên backend)
                              <input
                                key={vocabularyInputKey}
                                type="file"
                                accept="audio/mpeg"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  setVocabularyDraft((previous) => ({
                                    ...previous,
                                    file: file || null,
                                    audioFileName: file?.name || ''
                                  }));
                                }}
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              />
                              {vocabularyDraft.audioFileName && (
                                <span className="text-[11px] font-medium text-brand">Sẽ lưu file: {vocabularyDraft.audioFileName}</span>
                              )}
                            </label>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <p>Âm thanh là file mp3 được upload lên backend. Dán file, hệ thống lưu tên file để phát lại.</p>
                            <button
                              type="button"
                              onClick={() => addVocabularyItem(vocabularyDraft)}
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                            >
                              + Thêm từ
                            </button>
                          </div>
                          {lessonForm.vocabularyItems.length > 0 && (
                            <ul className="space-y-2 text-xs text-slate-800">
                              {lessonForm.vocabularyItems.map((item, index) => (
                                <li
                                  key={`${item.term}-${index}`}
                                  className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm"
                                >
                                  <div className="space-y-0.5">
                                    <p className="font-semibold text-slate-900">{item.term}</p>
                                    <p className="text-slate-700">{item.translation || '—'}</p>
                                    {item.audioFileName && <p className="text-[11px] text-brand">MP3: {item.audioFileName}</p>}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeVocabularyItem(index)}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-500"
                                  >
                                    Xóa
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                          <label className="grid gap-1 text-xs font-semibold text-slate-700">
                            Ghi chú (tùy chọn)
                            <textarea
                              value={lessonForm.vocabularyNote}
                              onChange={(event) => setLessonForm((previous) => ({ ...previous, vocabularyNote: event.target.value }))}
                              className="min-h-[80px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              placeholder="Danh sách tổng quan hoặc hướng dẫn phát âm"
                            />
                          </label>
                        </div>
                      </label>
                      <label className="grid gap-1 text-sm text-slate-700">
                        QUIZZES
                        <textarea
                          value={lessonForm.quizzes}
                          onChange={(event) => setLessonForm((previous) => ({ ...previous, quizzes: event.target.value }))}
                          className="min-h-[100px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="Bài tập/quiz hoặc hướng dẫn luyện tập"
                        />
                      </label>
                      <div className="grid gap-2 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">DIALOGUE (song ngữ)</p>
                        <div className="grid gap-2">
                          <label className="grid gap-1">
                            English
                            <textarea
                              value={lessonForm.dialogueEnglish}
                              onChange={(event) =>
                                setLessonForm((previous) => ({ ...previous, dialogueEnglish: event.target.value }))
                              }
                              className="min-h-[80px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              placeholder="Short dialogue in English"
                            />
                          </label>
                          <label className="grid gap-1">
                            Vietnamese
                            <textarea
                              value={lessonForm.dialogueVietnamese}
                              onChange={(event) =>
                                setLessonForm((previous) => ({ ...previous, dialogueVietnamese: event.target.value }))
                              }
                              className="min-h-[80px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              placeholder="Hội thoại tiếng Việt"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                      disabled={isSubmitting || learningTracks.length === 0}
                    >
                      <FiList aria-hidden /> Lưu lesson 3 mục
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900">Published grade content</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {learningTracks.length} khối
                      </span>
                    </div>
                    <div className="grid gap-3">
                      {learningTracks.map((track) => (
                        <article key={track.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
                            <span>{track.subject}</span>
                            <span className="rounded-full bg-white px-2 py-1 text-slate-700">Grade {track.gradeLevel}</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{track.summary}</p>
                          <div className="mt-2 text-xs text-slate-600">
                            <p>Chapters: {track.chapters?.length || 0}</p>
                            <p>Quiz: {track.quizQuestions?.length || 0} câu</p>
                          </div>
                          <div className="mt-2 space-y-2 text-sm text-slate-700">
                            {(track.chapters || []).map((chapter) => (
                              <div key={chapter.id} className="rounded border border-slate-200 bg-white p-2">
                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
                                  <span>{chapter.title}</span>
                                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{chapter.lessons?.length || 0} lessons</span>
                                </div>
                                <ul className="mt-1 space-y-1 text-xs text-slate-700">
                                  {(chapter.lessons || []).map((lesson) => (
                                    <li key={lesson.id} className="rounded bg-slate-50 px-2 py-1">
                                      <span className="font-semibold text-brand">{lesson.title}</span> · VOCAB | PRACTICE | DIALOGUE
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[1fr,1.05fr]">
                    <form onSubmit={handleQuizSubmit} className="grid gap-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-1 text-sm text-slate-700">
                          Select lesson
                          <select
                            value={quizDraft.trackId}
                            onChange={(event) => setQuizDraft((previous) => ({ ...previous, trackId: event.target.value }))}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          >
                            {learningTracks.map((track) => (
                              <option key={track.id} value={track.id}>
                                {track.subject} · Grade {track.gradeLevel}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 text-sm text-slate-700">
                          Correct option index (0-3)
                          <input
                            type="number"
                            min="0"
                            max="3"
                            value={quizDraft.correctIndex}
                            onChange={(event) => setQuizDraft((previous) => ({ ...previous, correctIndex: event.target.value }))}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          />
                        </label>
                      </div>
                      <label className="grid gap-1 text-sm text-slate-700">
                        Question prompt
                        <textarea
                          value={quizDraft.prompt}
                          onChange={(event) => setQuizDraft((previous) => ({ ...previous, prompt: event.target.value }))}
                          className="min-h-[90px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          placeholder="What is the acceleration due to gravity on Earth?"
                        />
                      </label>
                      <div className="grid gap-2 md:grid-cols-2">
                        {quizDraft.options.map((option, index) => (
                          <label key={index} className="grid gap-1 text-sm text-slate-700">
                            Answer choice {index + 1}
                            <input
                              type="text"
                              value={option}
                              onChange={(event) => handleQuizDraftChange(index, event.target.value)}
                              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              placeholder="Type an answer option"
                            />
                          </label>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                        disabled={isSubmitting || learningTracks.length === 0}
                      >
                        <FiPlayCircle aria-hidden /> Attach quiz question
                      </button>
                      <p className="text-xs text-slate-500">Add more questions to the same lesson by submitting again.</p>
                    </form>

                    <div className="space-y-2 text-sm text-slate-700">
                      <h3 className="text-base font-semibold text-slate-900">Quiz preview</h3>
                      {learningTracks.map((track) => (
                        <div key={track.id} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
                            <span>
                              {track.subject} · Grade {track.gradeLevel}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                              {track.quizQuestions?.length || 0} questions
                            </span>
                          </div>
                          {track.quizQuestions?.length ? (
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                              {track.quizQuestions.map((question) => (
                                <li key={question.id} className="text-sm">
                                  {question.prompt}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-xs text-slate-500">No questions yet.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id={sectionIds.people} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Manage people</h2>
                  <p className="text-sm text-slate-600">Adjust permissions, update organizations, and toggle account access.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4">
                {users.length === 0 && <p className="text-sm text-slate-600">No members found yet.</p>}
                {users.map((entry) => {
                  const currentRole = roleDrafts[entry.id] ?? entry.role;
                  const currentOrganization = orgDrafts[entry.id] ?? entry.organization ?? '';
                  const isTeacherDraft = currentRole === 'teacher';
                  return (
                    <article key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold text-slate-900">{entry.name}</div>
                          <div className="text-sm text-slate-600">@{entry.username}</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 font-semibold ${
                              entry.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {entry.status}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700">
                            Role: {entry.role}
                          </span>
                          {entry.organization && (
                            <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700">
                              Org: {entry.organization}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm text-slate-700">
                          Role
                          <select
                            value={currentRole}
                            onChange={(event) => setRoleDraft(entry.id, event.target.value)}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </label>
                        {isTeacherDraft && (
                          <label className="grid gap-1 text-sm text-slate-700">
                            Organization
                            <input
                              type="text"
                              value={currentOrganization}
                              onChange={(event) => setOrgDraft(entry.id, event.target.value)}
                              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                              placeholder="e.g., Green Valley High"
                            />
                          </label>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/60"
                          onClick={() => handleRoleUpdate(entry)}
                          disabled={isSubmitting}
                        >
                          <FiCheckCircle aria-hidden />
                          Save role
                        </button>
                        <button
                          type="button"
                          className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                            entry.status === 'active'
                              ? 'bg-red-600 text-white hover:bg-red-500'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                          onClick={() => handleStatusToggle(entry)}
                          disabled={isSubmitting}
                        >
                          <FiShield aria-hidden />
                          {entry.status === 'active' ? 'Ban user' : 'Reinstate'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
