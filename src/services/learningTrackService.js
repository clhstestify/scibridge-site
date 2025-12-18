import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'scibridge-learning-tracks';

function normalizeDialogue(dialogue = '') {
  if (typeof dialogue === 'string') {
    return { english: dialogue, vietnamese: '' };
  }

  if (dialogue && typeof dialogue === 'object') {
    const english = dialogue.english ?? dialogue.en ?? '';
    const vietnamese = dialogue.vietnamese ?? dialogue.vi ?? '';

    if (english || vietnamese) {
      return { english, vietnamese };
    }
  }

  return { english: '', vietnamese: '' };
}

function normalizeVocabulary(vocabulary = '') {
  // Accept legacy string content or new structured items
  if (typeof vocabulary === 'string') {
    return { items: [], note: vocabulary };
  }

  const toItem = (entry = {}) => ({
    term: entry.term || entry.word || '',
    translation: entry.translation || entry.meaning || entry.definition || '',
    audioFileName: entry.audioFileName || entry.audio || entry.fileName || entry.audioUrl || ''
  });

  if (Array.isArray(vocabulary)) {
    return { items: vocabulary.map(toItem), note: '' };
  }

  if (vocabulary && typeof vocabulary === 'object') {
    const items = Array.isArray(vocabulary.items) ? vocabulary.items.map(toItem) : [];
    const note = vocabulary.note || vocabulary.text || vocabulary.description || '';
    return { items, note };
  }

  return { items: [], note: '' };
}

const defaultTracks = [
  {
    id: 'efs-grade-10',
    subject: 'English for Science',
    gradeLevel: '10',
    summary:
      'Bấm vào khối 10 để xem 7 chapter do admin thêm. Chọn Chapter 4 rồi mở Lesson 7 để thấy 3 mục VOCABULARY/QUIZZES/DIALOGUE.',
    heroImage:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    documentUrl: '',
    youtubeUrl: '',
    quizQuestions: [],
    chapters: Array.from({ length: 7 }).map((_, index) => {
      const chapterNumber = index + 1;
      const lessonCount = chapterNumber === 4 ? 8 : 2;
      return {
        id: `efs-10-ch-${chapterNumber}`,
        title: `Chapter ${chapterNumber}`,
        description:
          chapterNumber === 4
            ? 'Từ vựng và bài luyện nghe/nói tập trung vào thí nghiệm hóa học đơn giản.'
            : 'Nội dung mẫu để admin chỉnh sửa hoặc thay thế.',
        lessons: Array.from({ length: lessonCount }).map((__, lessonIndex) => {
          const lessonNumber = lessonIndex + 1;
          return {
            id: `efs-10-ch-${chapterNumber}-lesson-${lessonNumber}`,
            title: `Lesson ${lessonNumber}`,
            sections: {
              vocabulary:
                lessonNumber === 7 && chapterNumber === 4
                  ? {
                      items: [
                        {
                          term: 'beaker',
                          translation: 'cốc đong thủy tinh',
                          audioFileName: 'sample-beaker.mp3'
                        },
                        {
                          term: 'observe',
                          translation: 'quan sát',
                          audioFileName: 'sample-observe.mp3'
                        }
                      ],
                      note: '10 thuật ngữ chính: beaker, observe, mixture, stir, measure, spill, safety goggles, reaction, timer, record.'
                    }
                  : { items: [], note: 'Thêm từ vựng chính tại đây.' },
              quizzes:
                lessonNumber === 7 && chapterNumber === 4
                  ? 'Viết 5 câu mô tả các bước của thí nghiệm pha dung dịch muối. Đọc to và thu âm lại.'
                  : 'Thêm bài tập/quiz hoặc hướng dẫn thực hành.',
              dialogue:
                lessonNumber === 7 && chapterNumber === 4
                  ? {
                      english: 'A: “Which tool do we need?” B: “The beaker and the timer so we can record the reaction.”',
                      vietnamese: 'A: “Chúng ta cần dụng cụ nào?” B: “Cốc đong và đồng hồ bấm giờ để ghi lại phản ứng.”'
                    }
                  : {
                      english: 'Write a short practice dialogue for this lesson.',
                      vietnamese: 'Viết đoạn hội thoại ngắn để luyện nói.'
                    }
            }
          };
        })
      };
    })
  }
];

function normalizeSections(sections = {}) {
  const normalized = {
    vocabulary: normalizeVocabulary(sections.vocabulary),
    quizzes: '',
    dialogue: normalizeDialogue(sections.dialogue),
    ...sections
  };

  if (!normalized.vocabulary && sections.vocab) {
    normalized.vocabulary = sections.vocab;
  }

  if (!normalized.quizzes && sections.practice) {
    normalized.quizzes = sections.practice;
  }

  const rawVocabulary = sections.vocabulary ?? sections.vocab ?? normalized.vocabulary;
  normalized.vocabulary = normalizeVocabulary(rawVocabulary);

  const rawDialogue = sections.dialogue ?? sections.conversation ?? normalized.dialogue;
  normalized.dialogue = normalizeDialogue(rawDialogue);

  return normalized;
}

const isBrowser = typeof window !== 'undefined';

function normalizeTrack(track) {
  const base = {
    quizQuestions: [],
    heroImage: '',
    documentUrl: '',
    youtubeUrl: '',
    chapters: [],
    ...track
  };

  if (base.chapters?.length) {
    base.chapters = base.chapters.map((chapter) => ({
      lessons: [],
      ...chapter,
      lessons: (chapter.lessons || []).map((lesson) => ({
        sections: normalizeSections(lesson.sections),
        ...lesson
      }))
    }));
  } else if (base.chapter) {
    // Backward compatibility: old single-chapter tracks become one chapter with one lesson
    base.chapters = [
      {
        id: `${base.id}-chapter`,
        title: base.chapter,
        description: base.summary,
        lessons: [
          {
            id: `${base.id}-lesson-1`,
            title: base.chapter,
            sections: normalizeSections({
              vocabulary: base.summary || 'Admin có thể cập nhật từ vựng tại đây.',
              quizzes: base.documentUrl ? `Mở tài liệu: ${base.documentUrl}` : 'Thêm bài tập tại đây.',
              dialogue: base.youtubeUrl ? `Xem video: ${base.youtubeUrl}` : 'Thêm hội thoại tại đây.'
            })
          }
        ]
      }
    ];
  }

  return base;
}

function readFromStorage() {
  if (!isBrowser) return defaultTracks.map(normalizeTrack);
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultTracks.map(normalizeTrack);
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaultTracks.map(normalizeTrack);
    return parsed.map(normalizeTrack);
  } catch (error) {
    console.error('Unable to read learning tracks', error);
    return defaultTracks.map(normalizeTrack);
  }
}

function persist(tracks) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  } catch (error) {
    console.error('Unable to save learning tracks', error);
  }
}

export function getLearningTracks() {
  return readFromStorage();
}

export function addLearningTrack(entry) {
  const tracks = readFromStorage();
  const newTrack = normalizeTrack({ id: uuid(), ...entry });
  const updated = [newTrack, ...tracks];
  persist(updated);
  return newTrack;
}

export function addChapter(trackId, chapter) {
  const tracks = readFromStorage();
  const updated = tracks.map((track) => {
    if (track.id !== trackId) return track;
    const chapters = Array.isArray(track.chapters) ? track.chapters : [];
    return {
      ...track,
      chapters: [{ id: uuid(), lessons: [], ...chapter }, ...chapters]
    };
  });
  persist(updated);
  return updated.find((track) => track.id === trackId);
}

export function addLesson(trackId, chapterId, lesson) {
  const tracks = readFromStorage();
  const updated = tracks.map((track) => {
    if (track.id !== trackId) return track;
    const chapters = (track.chapters || []).map((chapter) => {
      if (chapter.id !== chapterId) return chapter;
      const lessons = Array.isArray(chapter.lessons) ? chapter.lessons : [];
      return {
        ...chapter,
        lessons: [
          {
            id: uuid(),
            sections: normalizeSections(lesson.sections),
            ...lesson
          },
          ...lessons
        ]
      };
    });

    return { ...track, chapters };
  });
  persist(updated);
  return updated
    .find((track) => track.id === trackId)
    ?.chapters.find((chapter) => chapter.id === chapterId);
}

export function addQuizQuestion(trackId, question) {
  const tracks = readFromStorage();
  const updated = tracks.map((track) => {
    if (track.id !== trackId) return track;
    const quizQuestions = Array.isArray(track.quizQuestions) ? track.quizQuestions : [];
    return { ...track, quizQuestions: [...quizQuestions, { id: uuid(), ...question }] };
  });
  persist(updated);
  return updated.find((track) => track.id === trackId);
}

export function removeLesson(trackId, chapterId, lessonId) {
  const tracks = readFromStorage();
  const updated = tracks.map((track) => {
    if (track.id !== trackId) return track;
    const chapters = (track.chapters || []).map((chapter) => {
      if (chapter.id !== chapterId) return chapter;
      return {
        ...chapter,
        lessons: (chapter.lessons || []).filter((lesson) => lesson.id !== lessonId)
      };
    });
    return { ...track, chapters };
  });
  persist(updated);
  return updated;
}

export function clearLearningTracks() {
  if (!isBrowser) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
