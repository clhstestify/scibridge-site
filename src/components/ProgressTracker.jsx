import { useLanguage } from '../context/LanguageContext.jsx';

const ProgressTracker = ({ progress, totalLessons, onReset }) => {
  const { t } = useLanguage();
  const completedCount = Object.keys(progress).length;
  const percentage = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 text-slate-200 shadow-lg shadow-slate-950/40">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">{t('progress.title', 'Learning Progress')}</p>
        <h3 className="mt-2 text-2xl font-display font-semibold text-white">
          {t('progress.percentage', `${percentage}% complete`, { percentage })}
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {t('progress.summary', `You have finished ${completedCount} of ${totalLessons} lessons. Keep going!`, {
            completed: completedCount,
            total: totalLessons
          })}
        </p>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <button
        onClick={onReset}
        className="self-start rounded-full border border-brand/50 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20"
      >
        {t('progress.reset', 'Reset progress')}
      </button>
    </section>
  );
};

export default ProgressTracker;
