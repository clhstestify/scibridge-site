import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { readUsers, writeUsers } from './utils/userStore.js';
import { readAdminData, writeAdminData } from './utils/adminStore.js';
import { readForumData, writeForumData } from './utils/forumStore.js';
import {
  addChapterToTrack,
  addLessonToChapter,
  addLearningTrack,
  addQuizQuestionToTrack,
  readLearningTracks
} from './utils/learningTrackStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? ['http://localhost:5173'];
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distPath, 'index.html');

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(uploadRoot));

async function ensureUploadDirectories() {
  await fs.mkdir(uploadRoot, { recursive: true });
  await Promise.all(
    uploadFolders.map((folder) => fs.mkdir(path.join(uploadRoot, folder), { recursive: true }))
  );
}

app.post('/api/chatbot', async (req, res) => {
  const { prompt } = req.body ?? {};

  if (!prompt?.trim()) {
    return res.status(400).json({ message: 'A question or prompt is required.' });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ message: 'AI service is not configured. Please add GEMINI_API_KEY.' });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
  const wrappedPrompt = [
    'You are a friendly science tutor. Answer with a concise, age-appropriate explanation in simple English and avoid unsafe guidance.',
    `Question: ${prompt.trim()}`
  ].join(' ');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: wrappedPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 256
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('Gemini API error', errorBody);
      return res.status(502).json({ message: 'The AI response is unavailable right now. Please try again soon.' });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!reply) {
      return res.status(502).json({ message: 'The AI could not generate a response.' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error contacting Gemini API', error);
    res.status(500).json({ message: 'Could not reach the AI service. Try again later.' });
  }
});

function ensureUserDefaults(user) {
  if (!user.role) {
    user.role = 'student';
  }
  if (!user.status) {
    user.status = 'active';
  }
  if (!Object.prototype.hasOwnProperty.call(user, 'organization')) {
    user.organization = null;
  }
}

function sanitizeUser(user) {
  ensureUserDefaults(user);
  const { passwordHash, ...safe } = user;
  return safe;
}

function sanitizeCreator(user) {
  const { id, name, username, role, organization } = sanitizeUser(user);
  return { id, name, username, role, organization };
}

async function authenticateRequest(req, res, next) {
  const requesterUsername = req.header('x-user-username');

  if (!requesterUsername) {
    return res.status(401).json({ message: 'Missing user username header.' });
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.username === requesterUsername.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Account not found.' });
  }

  ensureUserDefaults(user);

  if (user.status === 'banned') {
    return res.status(403).json({ message: 'Account has been banned.' });
  }

  req.requestUser = user;
  req.allUsers = users;
  req.persistUsers = async () => writeUsers(users);
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    const { requestUser } = req;
    if (!requestUser || !roles.includes(requestUser.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

app.post('/api/auth/register', async (req, res) => {
  const { name, username, password } = req.body ?? {};

  if (!username?.trim() || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const normalizedUsername = username.toLowerCase();
  const users = await readUsers();

  if (users.some((user) => user.username === normalizedUsername)) {
    return res.status(409).json({ message: 'An account with this username already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name: name?.trim() || normalizedUsername,
    username: normalizedUsername,
    passwordHash,
    createdAt: new Date().toISOString(),
    role: 'student',
    status: 'active',
    organization: null
  };

  users.push(newUser);
  await writeUsers(users);

  res.status(201).json({
    message: 'Account created. You can sign in now.',
    user: sanitizeUser(newUser)
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username?.trim() || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const normalizedUsername = username.toLowerCase();
  const users = await readUsers();
  const user = users.find((entry) => entry.username === normalizedUsername);

  if (!user) {
    return res.status(404).json({ message: 'Account not found. Please register first.' });
  }

  if (user.status === 'banned') {
    return res.status(403).json({ message: 'This account has been banned by an administrator.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  res.json({
    message: 'Signed in successfully.',
    user: sanitizeUser(user)
  });
});

app.get('/api/learning-tracks', async (_req, res) => {
  try {
    const data = await readLearningTracks();
    res.json({ tracks: data.tracks });
  } catch (error) {
    console.error('Unable to load learning tracks', error);
    res.status(500).json({ message: 'Could not load learning tracks.' });
  }
});

app.get('/api/forum/posts', async (_req, res) => {
  const forumData = await readForumData();
  res.json({ posts: forumData.posts });
});

app.post('/api/forum/posts', authenticateRequest, async (req, res) => {
  const { subject, content } = req.body ?? {};

  if (!subject?.trim() || !content?.trim()) {
    return res.status(400).json({ message: 'Subject and content are required.' });
  }

  const forumData = await readForumData();
  const creator = req.requestUser;

  const post = {
    id: uuidv4(),
    translationId: null,
    subject: subject.trim(),
    createdAt: new Date().toISOString(),
    content: content.trim(),
    createdBy: sanitizeCreator(creator),
    comments: []
  };

  forumData.posts.unshift(post);
  await writeForumData(forumData);

  res.status(201).json({ message: 'Post created.', post });
});

app.post('/api/forum/posts/:id/comments', authenticateRequest, async (req, res) => {
  const { content } = req.body ?? {};

  if (!content?.trim()) {
    return res.status(400).json({ message: 'Comment content is required.' });
  }

  const forumData = await readForumData();
  const post = forumData.posts.find((entry) => entry.id === req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const comment = {
    id: uuidv4(),
    translationId: null,
    createdAt: new Date().toISOString(),
    content: content.trim(),
    createdBy: sanitizeCreator(req.requestUser)
  };

  post.comments.push(comment);
  await writeForumData(forumData);

  res.status(201).json({ message: 'Comment added.', comment });
});

function filterContentForUser(user, data) {
  if (user.role === 'admin') {
    return data;
  }

  const organization = user.organization;
  if (!organization) {
    return data.filter((entry) => entry.audience === 'global');
  }

  return data.filter((entry) => entry.audience === 'global' || entry.audience === organization);
}

app.get(
  '/api/admin/dashboard',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { requestUser, allUsers } = req;
    const adminData = await readAdminData();

    const sanitizedCurrentUser = sanitizeUser(requestUser);
    const userList =
      requestUser.role === 'admin'
        ? allUsers.map(sanitizeUser)
        : allUsers
            .filter((user) => {
              ensureUserDefaults(user);
              if (user.role === 'admin') {
                return false;
              }
              if (!requestUser.organization) {
                return user.organization === null && user.role === 'student';
              }
              return user.organization === requestUser.organization;
            })
            .map(sanitizeUser);

    res.json({
      viewer: sanitizedCurrentUser,
      users: userList,
      announcements: filterContentForUser(requestUser, adminData.announcements),
      contests: filterContentForUser(requestUser, adminData.contests),
      practiceSets: filterContentForUser(requestUser, adminData.practiceSets)
    });
  }
);

app.post(
  '/api/admin/announcements',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { title, message, audience } = req.body ?? {};

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const adminData = await readAdminData();
    const creator = req.requestUser;
    const normalizedAudience =
      creator.role === 'admin' ? (audience?.trim() || 'global') : creator.organization || 'global';

    const announcement = {
      id: uuidv4(),
      title: title.trim(),
      message: message.trim(),
      audience: normalizedAudience,
      createdAt: new Date().toISOString(),
      createdBy: sanitizeCreator(creator)
    };

    adminData.announcements.unshift(announcement);
    await writeAdminData(adminData);

    res.status(201).json({ message: 'Announcement posted.', announcement });
  }
);

app.post(
  '/api/admin/contests',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { name, description, deadline, audience } = req.body ?? {};

    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Contest name and description are required.' });
    }

    const adminData = await readAdminData();
    const creator = req.requestUser;
    const normalizedAudience =
      creator.role === 'admin' ? (audience?.trim() || 'global') : creator.organization || 'global';

    const contest = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      deadline: deadline?.trim() || null,
      audience: normalizedAudience,
      createdAt: new Date().toISOString(),
      createdBy: sanitizeCreator(creator)
    };

    adminData.contests.unshift(contest);
    await writeAdminData(adminData);

    res.status(201).json({ message: 'Contest created.', contest });
  }
);

app.post(
  '/api/admin/practice-sets',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { title, focusArea, description, audience, resourceUrl } = req.body ?? {};

    if (!title?.trim() || !focusArea?.trim()) {
      return res.status(400).json({ message: 'Title and focus area are required.' });
    }

    const adminData = await readAdminData();
    const creator = req.requestUser;
    const normalizedAudience =
      creator.role === 'admin' ? (audience?.trim() || 'global') : creator.organization || 'global';

    const practiceSet = {
      id: uuidv4(),
      title: title.trim(),
      focusArea: focusArea.trim(),
      description: description?.trim() || '',
      resourceUrl: resourceUrl?.trim() || null,
      audience: normalizedAudience,
      createdAt: new Date().toISOString(),
      createdBy: sanitizeCreator(creator)
    };

    adminData.practiceSets.unshift(practiceSet);
    await writeAdminData(adminData);

    res.status(201).json({ message: 'Practice set saved.', practiceSet });
  }
);

app.post(
  '/api/admin/learning-tracks',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { subject, gradeLevel, summary, heroImage, documentUrl, youtubeUrl } = req.body ?? {};

    if (!subject?.trim() || !gradeLevel?.trim() || !summary?.trim()) {
      return res.status(400).json({ message: 'Subject, grade level, and summary are required.' });
    }

    try {
      const track = await addLearningTrack({
        subject: subject.trim(),
        gradeLevel: gradeLevel.trim(),
        summary: summary.trim(),
        heroImage: heroImage?.trim() || '',
        documentUrl: documentUrl?.trim() || '',
        youtubeUrl: youtubeUrl?.trim() || ''
      });

      res.status(201).json({ message: 'Learning track created.', track });
    } catch (error) {
      console.error('Unable to save learning track', error);
      res.status(500).json({ message: 'Could not save learning track.' });
    }
  }
);

app.post(
  '/api/admin/learning-tracks/:trackId/chapters',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { title, description } = req.body ?? {};
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Chapter title is required.' });
    }

    try {
      const { track, chapter } = await addChapterToTrack(req.params.trackId, {
        title: title.trim(),
        description: description?.trim() || ''
      });

      if (!track) {
        return res.status(404).json({ message: 'Learning track not found.' });
      }

      res.status(201).json({ message: 'Chapter saved.', track, chapter });
    } catch (error) {
      console.error('Unable to save chapter', error);
      res.status(500).json({ message: 'Could not save chapter.' });
    }
  }
);

app.post(
  '/api/admin/learning-tracks/:trackId/chapters/:chapterId/lessons',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { title, sections } = req.body ?? {};

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Lesson title is required.' });
    }

    const vocabularyItems = Array.isArray(sections?.vocabulary?.items) ? sections.vocabulary.items : [];
    const vocabularyNote = sections?.vocabulary?.note || sections?.vocabulary || '';
    const quizzesText = sections?.quizzes || '';
    const dialogueEnglish = sections?.dialogue?.english || '';
    const dialogueVietnamese = sections?.dialogue?.vietnamese || '';

    const hasVocabulary = vocabularyItems.length > 0 || vocabularyNote.trim();
    const hasDialogue = dialogueEnglish.trim() || dialogueVietnamese.trim();
    const hasQuizzes = typeof quizzesText === 'string' && quizzesText.trim();

    if (!hasVocabulary && !hasDialogue && !hasQuizzes) {
      return res.status(400).json({ message: 'Add vocabulary, dialogue, or quiz instructions before saving this lesson.' });
    }

    try {
      const { track, chapter, lesson } = await addLessonToChapter(req.params.trackId, req.params.chapterId, {
        title: title.trim(),
        sections: {
          vocabulary: {
            items: vocabularyItems,
            note: vocabularyNote
          },
          quizzes: sections?.quizzes || '',
          dialogue: sections?.dialogue || {}
        }
      });

      if (!track) {
        return res.status(404).json({ message: 'Learning track not found.' });
      }
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found.' });
      }

      res.status(201).json({ message: 'Lesson saved.', track, chapter, lesson });
    } catch (error) {
      console.error('Unable to save lesson', error);
      res.status(500).json({ message: 'Could not save lesson.' });
    }
  }
);

app.post(
  '/api/admin/learning-tracks/:trackId/quizzes',
  authenticateRequest,
  requireRole('admin', 'teacher'),
  async (req, res) => {
    const { prompt, options, correctIndex } = req.body ?? {};

    const cleanedPrompt = prompt?.trim();
    const cleanedOptions = Array.isArray(options)
      ? options.map((option) => option?.toString().trim()).filter(Boolean)
      : [];

    if (!cleanedPrompt || cleanedOptions.length < 2) {
      return res.status(400).json({ message: 'Prompt and at least two answer choices are required.' });
    }

    const boundedIndex = Math.min(Math.max(Number(correctIndex) || 0, 0), cleanedOptions.length - 1);

    try {
      const { track } = await addQuizQuestionToTrack(req.params.trackId, {
        prompt: cleanedPrompt,
        options: cleanedOptions,
        correctIndex: boundedIndex
      });

      if (!track) {
        return res.status(404).json({ message: 'Learning track not found.' });
      }

      res.status(201).json({ message: 'Quiz question attached.', track });
    } catch (error) {
      console.error('Unable to save quiz question', error);
      res.status(500).json({ message: 'Could not save quiz question.' });
    }
  }
);

app.patch(
  '/api/admin/users/:id/status',
  authenticateRequest,
  requireRole('admin'),
  async (req, res) => {
    const { status } = req.body ?? {};
    const validStatuses = ['active', 'banned'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const { allUsers, persistUsers } = req;
    const user = allUsers.find((entry) => entry.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    ensureUserDefaults(user);
    user.status = status;

    await persistUsers();

    res.json({ message: 'User status updated.', user: sanitizeUser(user) });
  }
);

app.patch(
  '/api/admin/users/:id/role',
  authenticateRequest,
  requireRole('admin'),
  async (req, res) => {
    const { role, organization } = req.body ?? {};
    const validRoles = ['student', 'teacher', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role value.' });
    }

    const { allUsers, persistUsers } = req;
    const user = allUsers.find((entry) => entry.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    ensureUserDefaults(user);

    user.role = role;
    user.organization = role === 'teacher' ? organization?.trim() || null : null;

    await persistUsers();

    res.json({ message: 'User role updated.', user: sanitizeUser(user) });
  }
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', authMode: 'username' });
});

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Endpoint not found.' });
    }
    return res.sendFile(indexHtmlPath);
  });
}

app.listen(port, () => {
  console.log(`SciBridge API server running on http://localhost:${port}`);
});
