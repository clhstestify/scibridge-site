import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SubjectCard from '../components/SubjectCard';
import LessonCard from '../components/LessonCard';
import ProgressTracker from '../components/ProgressTracker';
import { subjects, allLessons } from '../data/lessons';

const SubjectsPage = ({ query, setQuery, progress, onComplete, onResetProgress }) => {
  const location = useLocation();

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
    <div className="mx-auto max-w-6xl space-y-12 px-4">
      <header className="space-y-4 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Learn by topic</p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">Subjects and lesson library</h1>
        <p className="text-sm text-slate-600">
          Search for a lesson or browse the four main science subjects. The explanations use simple academic English to support
          multilingual learners.
        </p>
        <SearchBar query={query} setQuery={setQuery} placeholder="Search lesson titles, subjects, or key words" />
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {normalizedQuery && (
            <section className="space-y-4 rounded-3xl border border-brand/30 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                {filteredLessons.length} lesson{filteredLessons.length === 1 ? '' : 's'} found
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
            <h2 className="text-lg font-semibold text-slate-900">Browse subjects</h2>
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
