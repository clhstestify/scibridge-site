import { useEffect, useState } from 'react';
import { FiBookOpen, FiCpu, FiFeather, FiGlobe, FiLayers, FiPlayCircle, FiSearch, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getLearningTracks } from '../services/learningTrackService.js';

const subjectTiles = [
  { key: 'Mathematics', icon: FiLayers, color: 'from-sky-100 to-sky-50', path: '/subjects' },
  { key: 'Physics', icon: FiGlobe, color: 'from-indigo-100 to-indigo-50', path: '/subjects' },
  { key: 'Chemistry', icon: FiFeather, color: 'from-emerald-100 to-emerald-50', path: '/subjects' },
  { key: 'Biology', icon: FiFeather, color: 'from-amber-100 to-amber-50', path: '/subjects' },
  { key: 'IT', icon: FiCpu, color: 'from-fuchsia-100 to-fuchsia-50', path: '/subjects' },
  { key: 'Classroom Language', icon: FiBookOpen, color: 'from-slate-100 to-slate-50', path: '/dictionary' }
];

const gradeLevels = ['10', '11', '12'];

const HomePage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getLearningTracks().then((data) => {
      if (!isMounted) return;
      setTracks(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12">
        <div className="grid gap-6 rounded-3xl border border-sky-100 bg-gradient-to-br from-[#0c4f7f] to-[#0d6ca8] p-6 text-white shadow-[0_30px_90px_-70px_rgba(15,23,42,0.6)] md:grid-cols-[1.4fr,1fr]">
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl bg-white/15 p-4 shadow-inner backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-2xl font-black text-[#0c4f7f]">
                  SB
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">SciBridge</p>
                  <p className="text-xs text-sky-100">{t('homePage.hero.subtitle', 'Connecting Science and English')}</p>
                </div>
              </div>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <label className="flex flex-col gap-1 rounded-xl bg-white/10 p-3">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-100">
                    <FiSearch aria-hidden />
                    {t('homePage.hero.search', 'Search lessons and resources')}
                  </span>
                  <input
                    type="search"
                    placeholder="Ex: Grade 10 algebra"
                    className="rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </label>
                <div className="flex flex-col gap-2 rounded-xl bg-white/10 p-3">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-100">
                    <FiUser aria-hidden /> {t('homePage.hero.profile', 'Profile')}
                  </span>
                  <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800">
                    <span className="h-8 w-8 rounded-full bg-amber-200" />
                    {t('homePage.hero.profileHint', 'Sign in to save progress')}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="rounded-full border border-white/50 bg-white/20 px-3 py-1.5 shadow-sm transition hover:bg-white/30"
                >
                  <FiGlobe className="inline-block" aria-hidden /> {language === 'en' ? 'English' : 'Tiếng Việt'}
                </button>
                <span className="rounded-full bg-white/20 px-3 py-1.5">{t('homePage.hero.languageToggle', 'Bilingual mode')}</span>
                <Link
                  to="/chatbot"
                  className="rounded-full bg-white px-3 py-1.5 text-[#0c4f7f] shadow-md transition hover:-translate-y-0.5"
                >
                  AI Chatbot
                </Link>
              </div>
            </div>

            <div className="grid gap-2 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed shadow-inner">
              <p className="font-semibold uppercase tracking-wide text-amber-200">{t('homePage.hero.quickNav', 'Quick navigation')}</p>
              <div className="flex flex-wrap gap-2 text-[13px] font-semibold">
                <Link to="/" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Home
                </Link>
                <Link to="/dictionary" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Dictionary
                </Link>
                <Link to="/flashcards" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Flashcards
                </Link>
                <Link to="/quizzes" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Practice tests
                </Link>
                <Link to="/dictionary" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Classroom language
                </Link>
                <Link to="/forum" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
                  Forum
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_45%)]" aria-hidden />
            <div className="relative space-y-3 p-6">
              <div className="rounded-2xl bg-white/15 p-4 text-xs leading-relaxed">
                <p className="text-amber-200">{t('homePage.hero.newFeature', 'New! Grade selector')}</p>
                <p>{t('homePage.hero.newFeatureDesc', 'Jump directly to Grade 10, 11, or 12 content for Math, Physics, Chemistry, Biology, IT, and English.')}</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=80"
                alt="Students exploring science"
                className="h-64 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-sky-100">
                <p>{t('homePage.hero.support', 'Practice English in every subject with SciBridge')}</p>
                <p className="text-amber-200">{t('homePage.hero.note', 'Quiz or Game buttons appear when available')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{t('homePage.subjects.eyebrow', 'Subjects')}</p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {subjectTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <Link
                    key={tile.key}
                    to={tile.path}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${tile.color} p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#0c4f7f]">
                        <Icon aria-hidden />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{t('homePage.subjects.grades', 'Grades 10-12')}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{tile.key}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold text-[#0c4f7f]">{t('homePage.gradeLine', 'Trong Mathematics có:')} Grade 10 · Grade 11 · Grade 12</p>
            <p className="text-sm font-semibold text-[#0c4f7f]">{t('homePage.gradeLine2', 'Trong Chapter 1 có:')} Grade 10 (vocabulary, pronunciation, audio). Quiz hoặc game!</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#0c4f7f] px-4 py-2 text-sm font-semibold text-white">{t('homePage.gradeSelector', 'Chọn lớp (Grade)')}</span>
              {gradeLevels.map((grade) => (
                <span key={grade} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  Grade {grade}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <article key={track.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-[#0c4f7f]">
                    <span>{track.subject}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Grade {track.gradeLevel}</span>
                  </div>
                  <img src={track.heroImage} alt={track.chapter} className="h-36 w-full rounded-xl object-cover" loading="lazy" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{track.chapter}</h3>
                    <p className="text-sm text-slate-700">{track.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#0c4f7f]">
                    {track.documentUrl && (
                      <a
                        href={track.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 hover:border-[#0c4f7f]"
                      >
                        <FiBookOpen aria-hidden /> PDF / Doc
                      </a>
                    )}
                    {track.youtubeUrl && (
                      <a
                        href={track.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 hover:border-[#0c4f7f]"
                      >
                        <FiPlayCircle aria-hidden /> YouTube
                      </a>
                    )}
                  </div>
                  {track.quizQuestions?.length ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="font-semibold">{t('homePage.quiz.label', 'Quiz available')}</p>
                      <p className="text-xs text-amber-800">{t('homePage.quiz.cta', 'Làm thử 1-2 câu trắc nghiệm để khởi động!')}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                      {t('homePage.quiz.empty', 'Chưa có quiz • Admin có thể thêm ở trang Admin')}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
