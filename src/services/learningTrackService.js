import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'scibridge-learning-tracks';

const defaultTracks = [
  {
    id: 'math-10-ch1',
    subject: 'Mathematics',
    gradeLevel: '10',
    chapter: 'Chapter 1: Algebra foundations',
    summary: 'Warm-up problems, vocabulary, and a short practice quiz to guide learners into Grade 10 algebra.',
    heroImage:
      'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80',
    documentUrl: 'https://example.com/math-grade10.pdf',
    youtubeUrl: 'https://www.youtube.com/watch?v=fNX7cIX0cT0',
    quizQuestions: [
      {
        id: 'math-10-q1',
        prompt: 'Solve: 2(x + 3) = 14',
        options: ['x = 4', 'x = 7', 'x = 5', 'x = 2'],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'physics-11-ch2',
    subject: 'Physics',
    gradeLevel: '11',
    chapter: 'Chapter 2: Waves & sound',
    summary: 'Notebook-friendly diagrams, pronunciation tips, and a YouTube animation explain wavelength, amplitude, and frequency.',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    documentUrl: 'https://example.com/physics-waves.docx',
    youtubeUrl: 'https://www.youtube.com/watch?v=dlC1tW4j8Mk',
    quizQuestions: [
      {
        id: 'physics-11-q1',
        prompt: 'Which statement is correct for sound waves?',
        options: ['They are transverse waves', 'They do not need a medium', 'They are longitudinal waves', 'They travel fastest in gas'],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'chemistry-12-ch3',
    subject: 'Chemistry',
    gradeLevel: '12',
    chapter: 'Chapter 3: Organic reactions',
    summary: 'Step-by-step reaction maps plus a downloadable worksheet for Grade 12 revision.',
    heroImage:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    documentUrl: 'https://example.com/organic-reactions.pdf',
    youtubeUrl: '',
    quizQuestions: []
  }
];

const isBrowser = typeof window !== 'undefined';

function readFromStorage() {
  if (!isBrowser) return defaultTracks;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultTracks;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultTracks;
  } catch (error) {
    console.error('Unable to read learning tracks', error);
    return defaultTracks;
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
  const newTrack = { id: uuid(), quizQuestions: [], ...entry };
  const updated = [newTrack, ...tracks];
  persist(updated);
  return newTrack;
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

export function clearLearningTracks() {
  if (!isBrowser) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
