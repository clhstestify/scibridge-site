const USERS_STORAGE_KEY = 'scibridge-auth-users';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const readUsers = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Could not read stored users', error);
    return [];
  }
};

const writeUsers = (users) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Could not persist users', error);
  }
};

const normalizeUsername = (value) => value?.trim().toLowerCase();

export async function registerUser({ name, username, password }) {
  const safeUsername = normalizeUsername(username);
  if (!safeUsername || !password?.trim()) {
    throw new Error('Please provide both a username and password.');
  }

  const users = readUsers();
  const existingUser = users.find((user) => normalizeUsername(user.username) === safeUsername);

  if (existingUser) {
    throw new Error('That username is already taken. Please choose another.');
  }

  const newUser = {
    name: name?.trim() || safeUsername,
    username: safeUsername,
    password: password
  };

  const updatedUsers = [...users, newUser];
  writeUsers(updatedUsers);

  return {
    message: 'Account created! You can now sign in.',
    user: {
      name: newUser.name,
      username: newUser.username,
      role: 'student',
      status: 'active'
    }
  };
}

export async function loginUser({ username, password }) {
  const safeUsername = normalizeUsername(username);
  if (!safeUsername || !password?.trim()) {
    throw new Error('Please provide both a username and password.');
  }

  const users = readUsers();
  const matchingUser = users.find(
    (user) => normalizeUsername(user.username) === safeUsername && user.password === password
  );

  if (!matchingUser) {
    throw new Error('Invalid username or password. Please try again.');
  }

  return {
    message: 'Signed in successfully.',
    user: {
      name: matchingUser.name,
      username: matchingUser.username,
      role: 'student',
      status: 'active'
    }
  };
}
