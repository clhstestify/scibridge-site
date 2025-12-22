import { API_BASE_URL } from './authService';
import { defaultLearningTracks } from '../../shared/learningTrackDefaults.js';

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

function buildHeaders(user, additionalHeaders = {}) {
  if (!user?.username) {
    throw new Error('Signed-in user information is required for this request.');
  }

  return {
    'Content-Type': 'application/json',
    'x-user-username': user.username.toLowerCase(),
    ...additionalHeaders
  };
}

async function handleResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

export function getDefaultLearningTracks() {
  return defaultLearningTracks.map((entry) => normalizeTrack({ ...entry }));
}

export async function getLearningTracks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning-tracks`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Unable to load learning tracks.');
    }
    if (!Array.isArray(payload.tracks)) {
      return getDefaultLearningTracks();
    }
    return payload.tracks.map(normalizeTrack);
  } catch (error) {
    console.error('Unable to load learning tracks', error);
    return getDefaultLearningTracks();
  }
}

export async function addLearningTrack(user, entry) {
  const response = await fetch(`${API_BASE_URL}/api/admin/learning-tracks`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify(entry)
  });
  const payload = await handleResponse(response);
  return normalizeTrack(payload.track);
}

export async function addChapter(user, trackId, chapter) {
  const response = await fetch(`${API_BASE_URL}/api/admin/learning-tracks/${trackId}/chapters`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify(chapter)
  });
  const payload = await handleResponse(response);
  return { track: normalizeTrack(payload.track), chapter: payload.chapter };
}

export async function addLesson(user, trackId, chapterId, lesson) {
  const response = await fetch(`${API_BASE_URL}/api/admin/learning-tracks/${trackId}/chapters/${chapterId}/lessons`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify(lesson)
  });
  const payload = await handleResponse(response);
  return { track: normalizeTrack(payload.track), chapter: payload.chapter, lesson: payload.lesson };
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
