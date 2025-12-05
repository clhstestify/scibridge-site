import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readUsers, writeUsers } from './utils/userStore.js';
import { readAdminData, writeAdminData } from './utils/adminStore.js';
import { readForumData, writeForumData } from './utils/forumStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? ['http://localhost:5173'];
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

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
    message: 'Account created and saved locally.',
    user: sanitizeUser(newUser)
  });
});

// Login through the API has been removed in favor of offline verification tools.

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

app.listen(port, () => {
  console.log(`SciBridge API server running on http://localhost:${port}`);
});
