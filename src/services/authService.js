const getDefaultApiBase = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // In development we still point to the local API server, but in production we
  // fall back to same-origin requests to avoid mixed-content errors when the
  // site is served over HTTPS.
  if (origin.startsWith('http://localhost')) {
    return 'http://localhost:4000';
  }

  return '';
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiBase();

async function handleResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

export async function registerUser({ name, username, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, password })
  });
  return handleResponse(response);
}

export async function loginUser({ username, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}
