import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SubjectCard from '../components/SubjectCard';
import LessonCard from '../components/LessonCard';
import ProgressTracker from '../components/ProgressTracker';
import { subjects, allLessons } from '../data/lessons';
import { useLanguage } from '../context/LanguageContext.jsx';

const SubjectsPage = ({ query, setQuery, progress, onComplete, onResetProgress }) => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (location.state?.query) {
      setQuery(location.state.query);
    }
  }, [location.state, setQuery]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredLessons = normalizedQuery
    ? allLessons.filter((lesson) =>
        [lesson.title, lesson.summary, lesson.subjectTitle, ...lesson.keyVocabulary]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4">
      <header className="space-y-4 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('subjectsPage.eyebrow', 'Learn by topic')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">
          {t('subjectsPage.heading', 'English core lessons and science extensions')}
        </h1>
        <p className="text-sm text-slate-300">
          {t(
            'subjectsPage.description',
            'Search the English for Science lessons first, then explore extension modules in Physics, Chemistry, Biology, and Earth Science. Explanations use simple academic English to support multilingual learners.'
          )}
        </p>
        <SearchBar
          query={query}
          setQuery={setQuery}
          placeholder={t(
            'subjectsPage.searchPlaceholder',
            'Search lesson titles, subjects, or key words'
          )}
        />
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {normalizedQuery && (
            <section className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
              <h2 className="text-lg font-semibold text-white">
                {filteredLessons.length === 1
                  ? t('subjectsPage.resultsSingular', `Found {count} lesson`, { count: filteredLessons.length })
                  : t('subjectsPage.resultsPlural', `Found {count} lessons`, { count: filteredLessons.length })}
              </h2>
              <div className="space-y-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={`${lesson.subjectId}-${lesson.id}`}
                    lesson={lesson}
                    subjectId={lesson.subjectId}
                    isCompleted={Boolean(progress[lesson.id])}
                    onComplete={onComplete}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {t('subjectsPage.browseHeading', 'Browse English core + science extensions')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </section>
        </div>
        <ProgressTracker progress={progress} totalLessons={allLessons.length} onReset={onResetProgress} />
      </div>
    </div>
  );
};

export default SubjectsPage;
