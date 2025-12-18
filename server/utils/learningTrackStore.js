import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { defaultLearningTracks } from '../../shared/learningTrackDefaults.js';

const learningTrackPath = path.resolve(process.cwd(), 'server/data/learningTracks.json');

const fallbackHeroImage =
  defaultLearningTracks[0]?.heroImage ||
  'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80';

const defaultData = {
  tracks: defaultLearningTracks
};

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '');

async function ensureLearningTrackFile() {
  try {
    await fs.access(learningTrackPath);
  } catch (error) {
    await fs.mkdir(path.dirname(learningTrackPath), { recursive: true });
    await fs.writeFile(learningTrackPath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function normalizeDialogue(dialogue = {}) {
  if (typeof dialogue === 'string') {
    return { english: sanitizeString(dialogue), vietnamese: '' };
  }

  const english = sanitizeString(dialogue.english ?? dialogue.en);
  const vietnamese = sanitizeString(dialogue.vietnamese ?? dialogue.vi);

  return {
    english,
    vietnamese
  };
}

function normalizeVocabulary(vocabulary = {}) {
  if (typeof vocabulary === 'string') {
    return { items: [], note: sanitizeString(vocabulary) };
  }

  const toItem = (entry = {}) => ({
    term: sanitizeString(entry.term ?? entry.word),
    translation: sanitizeString(entry.translation ?? entry.meaning ?? entry.definition),
    audioFileName: sanitizeString(entry.audioFileName ?? entry.audio ?? entry.fileName ?? entry.audioUrl)
  });

  const items = Array.isArray(vocabulary.items ?? vocabulary)
    ? (vocabulary.items ?? vocabulary).map(toItem)
    : [];

  const note = sanitizeString(vocabulary.note ?? vocabulary.text ?? vocabulary.description);

  return { items, note };
}

function normalizeSections(sections = {}) {
  const normalized = {
    vocabulary: normalizeVocabulary(sections.vocabulary ?? sections.vocab),
    quizzes: sanitizeString(sections.quizzes ?? sections.practice),
    dialogue: normalizeDialogue(sections.dialogue ?? sections.conversation)
  };

  return normalized;
}

function normalizeLesson(lesson = {}) {
  return {
    id: lesson.id || uuidv4(),
    title: sanitizeString(lesson.title) || 'Lesson',
    sections: normalizeSections(lesson.sections)
  };
}

function normalizeChapter(chapter = {}) {
  const lessons = Array.isArray(chapter.lessons) ? chapter.lessons.map(normalizeLesson) : [];
  return {
    id: chapter.id || uuidv4(),
    title: sanitizeString(chapter.title) || 'Chapter',
    description: sanitizeString(chapter.description),
    lessons
  };
}

function normalizeTrack(track = {}) {
  const chapters = Array.isArray(track.chapters) ? track.chapters.map(normalizeChapter) : [];
  const quizQuestions = Array.isArray(track.quizQuestions)
    ? track.quizQuestions.map((entry = {}) => ({
        id: entry.id || uuidv4(),
        prompt: sanitizeString(entry.prompt),
        options: Array.isArray(entry.options) ? entry.options.map(sanitizeString).filter(Boolean) : [],
        correctIndex: Number.isInteger(entry.correctIndex) ? entry.correctIndex : 0
      }))
    : [];

  const heroImage = sanitizeString(track.heroImage) || fallbackHeroImage;

  return {
    id: track.id || uuidv4(),
    subject: sanitizeString(track.subject) || 'Science',
    gradeLevel: sanitizeString(track.gradeLevel) || '10',
    summary: sanitizeString(track.summary),
    heroImage,
    documentUrl: sanitizeString(track.documentUrl),
    youtubeUrl: sanitizeString(track.youtubeUrl),
    quizQuestions,
    chapters
  };
}

function normalizeData(data = {}) {
  if (!data || !Array.isArray(data.tracks)) {
    return { tracks: defaultData.tracks.map(normalizeTrack) };
  }
  return { tracks: data.tracks.map(normalizeTrack) };
}

export async function readLearningTracks() {
  await ensureLearningTrackFile();
  try {
    const content = await fs.readFile(learningTrackPath, 'utf8');
    const parsed = JSON.parse(content);
    return normalizeData(parsed);
  } catch (error) {
    return normalizeData(defaultData);
  }
}

export async function writeLearningTracks(data) {
  await ensureLearningTrackFile();
  const normalized = normalizeData(data);
  await fs.writeFile(learningTrackPath, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

export async function addLearningTrack(entry) {
  const data = await readLearningTracks();
  const track = normalizeTrack({ ...entry, id: uuidv4(), chapters: [], quizQuestions: [] });
  data.tracks.unshift(track);
  await writeLearningTracks(data);
  return track;
}

export async function addChapterToTrack(trackId, chapter) {
  const data = await readLearningTracks();
  const track = data.tracks.find((entry) => entry.id === trackId);

  if (!track) {
    return { track: null, chapter: null };
  }

  const chapterEntry = normalizeChapter({ ...chapter, id: uuidv4() });
  track.chapters = [chapterEntry, ...(track.chapters || [])];

  await writeLearningTracks(data);
  return { track, chapter: chapterEntry };
}

export async function addLessonToChapter(trackId, chapterId, lesson) {
  const data = await readLearningTracks();
  const track = data.tracks.find((entry) => entry.id === trackId);
  if (!track) {
    return { track: null, chapter: null, lesson: null };
  }

  const chapter = (track.chapters || []).find((entry) => entry.id === chapterId);
  if (!chapter) {
    return { track, chapter: null, lesson: null };
  }

  const lessonEntry = normalizeLesson({ ...lesson, id: uuidv4() });
  chapter.lessons = [lessonEntry, ...(chapter.lessons || [])];

  await writeLearningTracks(data);
  return { track, chapter, lesson: lessonEntry };
}

export async function addQuizQuestionToTrack(trackId, question) {
  const data = await readLearningTracks();
  const track = data.tracks.find((entry) => entry.id === trackId);
  if (!track) {
    return { track: null };
  }

  const normalizedQuestion = {
    id: uuidv4(),
    prompt: sanitizeString(question.prompt),
    options: Array.isArray(question.options) ? question.options.map(sanitizeString).filter(Boolean) : [],
    correctIndex: Number.isInteger(question.correctIndex) ? question.correctIndex : 0
  };

  track.quizQuestions = Array.isArray(track.quizQuestions)
    ? [...track.quizQuestions, normalizedQuestion]
    : [normalizedQuestion];

  await writeLearningTracks(data);
  return { track };
}
