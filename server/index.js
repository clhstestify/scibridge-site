import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { readUsers, writeUsers } from './utils/userStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const emailConfigured =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_PORT) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASSWORD);

const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  : nodemailer.createTransport({ jsonTransport: true });

function sanitizeUser(user) {
  const { passwordHash, verificationCode, ...safe } = user;
  return safe;
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const users = await readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const verificationCode = uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    verified: false,
    verificationCode,
    createdAt: new Date().toISOString(),
    verifiedAt: null
  };

  users.push(newUser);
  await writeUsers(users);

  const messageBody = `Hello ${newUser.name},\n\nWelcome to SciBridge Forum! Your verification code is ${verificationCode}.\n\nEnter this code in the "Verify email" form to activate your account.\n\nIf you did not create an account, please ignore this email.`;

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@scibridge.local',
      to: normalizedEmail,
      subject: 'Verify your SciBridge Forum account',
      text: messageBody
    });

    if (!emailConfigured) {
      console.info('Email transport not configured. Verification email logged instead:', info.message);
    }

    res.status(201).json({ message: 'Account created. Please check your email for the verification code.' });
  } catch (error) {
    console.error('Error sending verification email', error);
    res.status(500).json({ message: 'Could not send verification email. Try again later.' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  const { email, code } = req.body ?? {};

  if (!email?.trim() || !code?.trim()) {
    return res.status(400).json({ message: 'Email and verification code are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const users = await readUsers();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return res.status(404).json({ message: 'Account not found.' });
  }

  if (user.verified) {
    return res.status(200).json({ message: 'Account already verified. You can sign in.' });
  }

  if (user.verificationCode !== code.trim().toUpperCase()) {
    return res.status(400).json({ message: 'Invalid verification code. Try again.' });
  }

  user.verified = true;
  user.verificationCode = null;
  user.verifiedAt = new Date().toISOString();
  await writeUsers(users);

  res.json({ message: 'Email verified. You can now sign in.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const users = await readUsers();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return res.status(404).json({ message: 'Account not found. Please register first.' });
  }

  if (!user.verified) {
    return res.status(403).json({ message: 'Please verify your email before signing in.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  res.json({
    message: 'Signed in successfully.',
    user: sanitizeUser(user)
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', emailConfigured });
});

app.listen(port, () => {
  console.log(`SciBridge API server running on http://localhost:${port}`);
});
