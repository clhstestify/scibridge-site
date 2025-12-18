import { useMemo } from 'react';
import { subjects } from '../data/lessons';
import { getLearningTracks } from '../services/learningTrackService';

export const useChapterContent = (subjectId, gradeLevel, chapterId) => {
  const tracks = useMemo(() => getLearningTracks(), []);

  const subject = useMemo(() => subjects.find((item) => item.id === subjectId), [subjectId]);

  const track = useMemo(() => {
    if (!subject) return null;
    const normalizedTitle = subject.title.toLowerCase();
    return tracks.find((entry) => {
      const trackSubject = (entry.subject || '').toLowerCase();
      return (
        entry.gradeLevel === gradeLevel &&
        (trackSubject === normalizedTitle ||
          normalizedTitle.includes(trackSubject) ||
          trackSubject.includes(normalizedTitle))
      );
    });
  }, [gradeLevel, subject, tracks]);

  const chapter = useMemo(
    () => track?.chapters?.find((item) => item.id === chapterId),
    [chapterId, track?.chapters]
  );

  return {
    subject,
    track,
    chapter,
    quizQuestions: track?.quizQuestions || []
  };
};
