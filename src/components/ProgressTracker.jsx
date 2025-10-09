const ProgressTracker = ({ progress, totalLessons, onReset }) => {
  const completedCount = Object.keys(progress).length;
  const percentage = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide">Learning Progress</p>
        <h3 className="mt-2 text-2xl font-display font-semibold">{percentage}% complete</h3>
        <p className="mt-1 text-sm text-emerald-700/80">
          You have finished {completedCount} of {totalLessons} lessons. Keep going!
        </p>
      </div>
      <div className="h-3 w-full rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <button
        onClick={onReset}
        className="self-start rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-600 shadow-sm hover:bg-emerald-100"
      >
        Reset progress
      </button>
    </section>
  );
};

export default ProgressTracker;
