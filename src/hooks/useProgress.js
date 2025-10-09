/**
 * Lightweight localStorage-based progress tracker.
 * Replace with API calls if you want server-side student profiles.
 */
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'scibridge-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Progress storage unavailable', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Could not save progress', error);
    }
  }, [progress]);

  const markCompleted = (lessonId) => {
    setProgress((prev) => ({ ...prev, [lessonId]: true }));
  };

  const resetProgress = () => setProgress({});

  return { progress, markCompleted, resetProgress };
};
