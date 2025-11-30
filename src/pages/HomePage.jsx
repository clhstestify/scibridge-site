import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import ScienceChatbot from '../components/ScienceChatbot.jsx';

const studentFeatures = [
  {
    icon: '📚',
    title: { vi: 'Bài học', en: 'Lessons' },
    description: {
      vi: 'Học Toán, Lý, Hóa, Sinh, Tin học bằng tiếng Anh',
      en: 'Learn Maths, Physics, Chemistry, Biology, and ICT in English'
    },
    subtopics: {
      vi: ['Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Tin học'],
      en: ['Maths', 'Physics', 'Chemistry', 'Biology', 'ICT']
    }
  },
  {
    icon: '🎯',
    title: { vi: 'Bài tập & Quiz', en: 'Exercises & Quizzes' },
    description: {
      vi: 'Luyện tập trắc nghiệm có phân loại mức độ',
      en: 'Practice tests with difficulty levels'
    }
  },
  {
    icon: '🎴',
    title: { vi: 'Flashcards', en: 'Flashcards' },
    description: {
      vi: 'Học từ vựng chuyên ngành dễ dàng',
      en: 'Learn technical vocabulary easily'
    }
  },
  {
    icon: '🏆',
    title: { vi: 'Contest & Ranking', en: 'Contests & Rankings' },
    description: {
      vi: 'Thi đua và xếp hạng với bạn bè',
      en: 'Compete and rank with friends'
    }
  },
  {
    icon: '💬',
    title: { vi: 'Giao tiếp Học đường', en: 'School Communication' },
    description: {
      vi: 'Học tình huống giao tiếp bằng tiếng Anh',
      en: 'Learn English communication scenarios'
    }
  },
  {
    icon: '🎥',
    title: { vi: 'Thí nghiệm mô phỏng', en: 'Virtual Labs' },
    description: {
      vi: 'Thực hành thí nghiệm trực tuyến',
      en: 'Practice experiments online'
    }
  },
  {
    icon: '📝',
    title: { vi: 'Phòng thi Online', en: 'Online Testing' },
    description: {
      vi: "Làm bài kiểm tra 15', 45' trực tuyến",
      en: 'Take 15-min and 45-min tests online'
    }
  },
  {
    icon: '📊',
    title: { vi: 'Theo dõi Tiến độ', en: 'Progress Tracking' },
    description: {
      vi: 'Xem báo cáo kết quả học tập của bạn',
      en: 'View your learning progress reports'
    }
  }
];

const teacherFeatures = [
  {
    icon: '📖',
    title: { vi: 'Bài giảng CLIL', en: 'CLIL Lessons' },
    description: {
      vi: 'Bài giảng mẫu và lesson plan STEM',
      en: 'Sample lessons and STEM lesson plans'
    }
  },
  {
    icon: '🛠️',
    title: { vi: 'Tạo Quiz & Đề thi', en: 'Quiz & Test Creator' },
    description: {
      vi: 'Công cụ tạo bài tập và đề kiểm tra',
      en: 'Tools to create exercises and tests'
    }
  },
  {
    icon: '📚',
    title: { vi: 'Kho Tài liệu', en: 'Resource Library' },
    description: {
      vi: 'Worksheet, PPT, flashcards tải xuống',
      en: 'Downloadable worksheets, PPTs, flashcards'
    }
  },
  {
    icon: '💡',
    title: { vi: 'Bồi dưỡng Giáo viên', en: 'Teacher Training' },
    description: {
      vi: 'Học cách dạy STEM bằng tiếng Anh',
      en: 'Learn how to teach STEM in English'
    }
  },
  {
    icon: '🗣️',
    title: { vi: 'Classroom Language', en: 'Classroom Language' },
    description: {
      vi: 'Ngôn ngữ lớp học và ra lệnh bằng tiếng Anh',
      en: 'Classroom instructions in English'
    }
  },
  {
    icon: '📦',
    title: { vi: 'Kho Câu hỏi', en: 'Question Bank' },
    description: {
      vi: 'Câu hỏi trắc nghiệm phân loại mức độ',
      en: 'Categorized multiple-choice questions'
    }
  },
  {
    icon: '👥',
    title: { vi: 'Quản lý Lớp học', en: 'Class Management' },
    description: {
      vi: 'Theo dõi tiến độ và kết quả học sinh',
      en: 'Track student progress and results'
    }
  },
  {
    icon: '✅',
    title: { vi: 'Assessment Tools', en: 'Assessment Tools' },
    description: {
      vi: 'Công cụ đánh giá và phản hồi học sinh',
      en: 'Tools for student assessment and feedback'
    }
  }
];

const subjects = [
  {
    iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    title: { vi: 'Toán học', en: 'Mathematics' },
    description: {
      vi: 'Phân số, Đại số, Hình học, Hàm số',
      en: 'Fractions, Algebra, Geometry, Functions'
    },
    badges: [
      { vi: '📝 Bài tập', en: '📝 Exercises' },
      { vi: '🎴 Flashcards', en: '🎴 Flashcards' },
      { vi: '📊 Quiz', en: '📊 Quiz' }
    ]
  },
  {
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    title: { vi: 'Vật lý', en: 'Physics' },
    description: {
      vi: 'Chuyển động, Lực, Năng lượng, Điện học',
      en: 'Motion, Force, Energy, Electricity'
    },
    badges: [
      { vi: '🔬 Thí nghiệm', en: '🔬 Labs' },
      { vi: '🎥 Video', en: '🎥 Video' },
      { vi: '📐 PISA', en: '📐 PISA' }
    ]
  },
  {
    iconPath: 'M7 2v2H6c-1.1 0-2 .9-2 2v16h16V6c0-1.1-.9-2-2-2h-1V2h-2v2H9V2H7zm11 18H6V11h12v9z',
    title: { vi: 'Hóa học', en: 'Chemistry' },
    description: {
      vi: 'Nguyên tố, Hợp chất, Phản ứng',
      en: 'Elements, Compounds, Reactions'
    },
    badges: [
      { vi: '⚗️ Bảng tuần hoàn', en: '⚗️ Periodic Table' },
      { vi: '🧪 Công thức', en: '🧪 Formulas' }
    ]
  },
  {
    iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-4v-4H6v-4h4V5h4v4h4v4h-4v4z',
    title: { vi: 'Sinh học', en: 'Biology' },
    description: {
      vi: 'Tế bào, Di truyền, Quang hợp, Sinh thái',
      en: 'Cells, Genetics, Photosynthesis, Ecology'
    },
    badges: [
      { vi: '🧬 DNA', en: '🧬 DNA' },
      { vi: '🌿 Cơ thể', en: '🌿 Body' },
      { vi: '📊 Infographic', en: '📊 Infographic' }
    ]
  },
  {
    iconPath: 'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
    title: { vi: 'Tin học / ICT', en: 'IT / ICT' },
    description: {
      vi: 'Thuật toán, Mạng, Lập trình Python',
      en: 'Algorithms, Networks, Python Programming'
    },
    badges: [
      { vi: '💻 Coding', en: '💻 Coding' },
      { vi: '🐍 Python', en: '🐍 Python' },
      { vi: '🔐 Bảo mật', en: '🔐 Security' }
    ]
  }
];

const communicationBlocks = [
  {
    icon: '👋',
    title: { vi: 'Chào hỏi & Giới thiệu', en: 'Greetings & Introductions' },
    description: {
      vi: 'Cách chào hỏi và tự giới thiệu bản thân',
      en: 'How to greet and introduce yourself'
    }
  },
  {
    icon: '📚',
    title: { vi: 'Hội thoại trong Lớp', en: 'Classroom Conversations' },
    description: {
      vi: 'Giao tiếp với giáo viên và bạn học',
      en: 'Communicate with teachers and classmates'
    }
  },
  {
    icon: '🎤',
    title: { vi: 'Luyện phát âm', en: 'Pronunciation Practice' },
    description: {
      vi: 'Audio mẫu và bài tập luyện nói',
      en: 'Sample audio and speaking exercises'
    }
  }
];

const localizedCopy = {
  vi: {
    heroTitle: 'Học STEM bằng Tiếng Anh',
    heroSubtitle: 'Nền tảng học tập và giảng dạy Toán - Lý - Hóa - Sinh - Tin bằng tiếng Anh',
    studentTab: '👨‍🎓 Dành cho Học sinh',
    teacherTab: '👩‍🏫 Dành cho Giáo viên',
    subjectsTitle: 'Các Môn Học STEM',
    subjectsSubtitle:
      'Học từ vựng chuyên ngành, bài giảng video, bài tập, quiz và flashcards',
    communicationTitle: '🗣️ Giao tiếp Tiếng Anh Học đường',
    communicationSubtitle: 'Học giao tiếp theo tình huống thực tế trong lớp học',
    forumTitle: 'Tham gia Diễn đàn SciBridge',
    forumDescription:
      'Chia sẻ mẹo học tập, đặt câu hỏi STEM và luyện tiếng Anh cùng cộng đồng thân thiện.',
    forumCta: 'Đăng nhập để tham gia thảo luận',
    ctaTitle: 'Bắt đầu học ngay hôm nay!',
    ctaSubtitle: 'Tham gia cùng hàng ngàn học sinh và giáo viên đang học STEM bằng tiếng Anh',
    primaryCta: '📝 Đăng ký miễn phí',
    secondaryCta: '📖 Xem Demo'
  },
  en: {
    heroTitle: 'Learn STEM in English',
    heroSubtitle: 'Platform for learning and teaching Math, Physics, Chemistry, Biology, and IT in English',
    studentTab: '👨‍🎓 For Students',
    teacherTab: '👩‍🏫 For Teachers',
    subjectsTitle: 'STEM Subjects',
    subjectsSubtitle: 'Learn technical vocabulary, video lessons, exercises, quizzes and flashcards',
    communicationTitle: '🗣️ School English Communication',
    communicationSubtitle: 'Learn communication through real classroom situations',
    forumTitle: 'Join the SciBridge Forum',
    forumDescription:
      'Share your study tips, ask for STEM help, and practice English with other learners in a supportive space.',
    forumCta: 'Log in to join the conversation',
    ctaTitle: 'Start Learning Today!',
    ctaSubtitle: 'Join thousands of students and teachers learning STEM in English',
    primaryCta: '📝 Sign Up Free',
    secondaryCta: '📖 View Demo'
  }
};

const HomePage = ({ user }) => {
  const { language, t } = useLanguage();
  const [activePortal, setActivePortal] = useState('student');

  const copy = useMemo(() => localizedCopy[language] ?? localizedCopy.en, [language]);
  const features = activePortal === 'student' ? studentFeatures : teacherFeatures;

  return (
    <div className="space-y-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 shadow-lg shadow-slate-200/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_35%)]" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center">
          <p className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 shadow-sm shadow-sky-100 backdrop-blur">
            STEM English Learning
          </p>
          <h1 className="text-4xl font-black leading-tight text-slate-900 drop-shadow-sm md:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 md:text-xl">{copy.heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setActivePortal('student')}
              className={`tab-button ${
                activePortal === 'student'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                  : 'bg-white text-slate-700 shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {copy.studentTab}
            </button>
            <button
              type="button"
              onClick={() => setActivePortal('teacher')}
              className={`tab-button ${
                activePortal === 'teacher'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-slate-700 shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {copy.teacherTab}
            </button>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <article
                key={`${feature.title.en}-${index}`}
                className="card-hover relative rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-2xl shadow-sm shadow-sky-100">
                  <span aria-hidden>{feature.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {feature.title[language] ?? feature.title.en}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description[language] ?? feature.description.en}
                </p>
                {feature.subtopics && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(feature.subtopics[language] ?? feature.subtopics.en).map((topic) => (
                      <span
                        key={`${feature.title.en}-${topic}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">STEM</p>
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.subjectsTitle}</h2>
          <p className="text-lg text-slate-600">{copy.subjectsSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {subjects.map((subject, index) => (
            <article
              key={`${subject.title.en}-${index}`}
              className="subject-card relative rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]"
            >
              <div className="mb-4 flex justify-center">
                <svg className="feature-icon" style={{ fill: 'var(--primary-action, #0ea5e9)' }} viewBox="0 0 24 24">
                  <path d={subject.iconPath} />
                  {subject.title.en === 'Physics' && <circle cx="12" cy="12" r="3" />}
                  {subject.title.en === 'Chemistry' && <circle cx="9" cy="14" r="1.5" />} 
                  {subject.title.en === 'Chemistry' && <circle cx="15" cy="14" r="1.5" />} 
                  {subject.title.en === 'IT / ICT' && <path d="M4 6h16v10H4z" />}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {subject.title[language] ?? subject.title.en}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {subject.description[language] ?? subject.description.en}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700">
                {subject.badges.map((badge) => (
                  <span
                    key={badge.en}
                    className="rounded-full bg-slate-100 px-3 py-1"
                  >
                    {badge[language] ?? badge.en}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr,1.05fr]">
          <div className="flex flex-col justify-center space-y-4 rounded-3xl border border-slate-100 bg-white/90 px-6 py-8 shadow-[0_15px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">AI Lab</p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              {t('homeForum.chatbotTitle', 'Science helper chatbot')}
            </h2>
            <p className="text-lg text-slate-600">
              {t(
                'homeForum.chatbotDescription',
                'Ask questions about your lessons in English and get clear, simple answers.'
              )}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• {t('chatbot.description', 'Type a topic keyword and receive an easy English explanation.')}</li>
              <li>
                •{' '}
                {t(
                  'forumPage.safeCommunity',
                  'Practice writing science questions safely with vocabulary support.'
                )}
              </li>
              <li>
                •{' '}
                {t('forumPage.registerCta', 'Register and start chatting')}
              </li>
            </ul>
            {!user && (
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
                >
                  {t('forumPage.login', 'Log in')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-brand"
                >
                  {t('forumPage.register', 'Register')}
                </Link>
              </div>
            )}
          </div>
          <div className="h-full">
            {user ? (
              <ScienceChatbot />
            ) : (
              <div className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-slate-700">
                <p className="text-lg font-semibold text-slate-900">
                  {t('forumPage.loginToComment', 'Please log in to join the discussion.')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t(
                    'chatbot.placeholder',
                    'Log in to ask about force, atoms, ecosystems, or climate.'
                  )}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    {t('forumPage.login', 'Log in')}
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-brand"
                  >
                    {t('forumPage.register', 'Register')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.communicationTitle}</h2>
          <p className="mt-3 text-lg text-slate-600">{copy.communicationSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {communicationBlocks.map((block) => (
            <article
              key={block.title.en}
              className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(148,163,184,0.12)]"
            >
              <div className="text-3xl" aria-hidden>
                {block.icon}
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {block.title[language] ?? block.title.en}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {block.description[language] ?? block.description.en}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-100 bg-white/90 px-4 py-12 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Forum</p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.forumTitle}</h2>
            <p className="text-lg text-slate-600">{copy.forumDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                {copy.forumCta}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-400"
              >
                📝 {copy.primaryCta}
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.15),transparent_35%)]" aria-hidden />
            <div className="relative space-y-4">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">💡 Chủ đề nổi bật</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>• Cách trình bày thí nghiệm bằng tiếng Anh</li>
                  <li>• Hỏi đáp bài tập Toán, Lý, Hóa, Sinh</li>
                  <li>• Mẹo luyện speaking với bạn học</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">🤝 Không gian an toàn</p>
                <p className="mt-2 text-sm text-slate-600">Đăng nhập để bình luận, trao đổi và xây dựng cộng đồng học tập tích cực.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-sky-500 to-emerald-500 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center text-white">
          <h2 className="text-3xl font-black md:text-4xl">{copy.ctaTitle}</h2>
          <p className="text-lg md:text-xl md:max-w-3xl">{copy.ctaSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-xl bg-white px-7 py-4 text-lg font-bold text-sky-600 shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl">
              {copy.primaryCta}
            </button>
            <button className="rounded-xl border-2 border-white px-7 py-4 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              {copy.secondaryCta}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
