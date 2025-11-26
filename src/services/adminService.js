import { API_BASE_URL } from './authService';

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

export async function fetchDashboard(user) {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: buildHeaders(user),
    method: 'GET'
  });
  return handleResponse(response);
}

export async function createAnnouncement(user, { title, message, audience }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/announcements`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ title, message, audience })
  });
  return handleResponse(response);
}

export async function createContest(user, { name, description, deadline, audience }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/contests`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ name, description, deadline, audience })
  });
  return handleResponse(response);
}

export async function createPracticeSet(user, { title, focusArea, description, audience, resourceUrl }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/practice-sets`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ title, focusArea, description, audience, resourceUrl })
  });
  return handleResponse(response);
}

export async function updateUserStatus(user, { userId, status }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: buildHeaders(user),
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
}

export async function updateUserRole(user, { userId, role, organization }) {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: buildHeaders(user),
    body: JSON.stringify({ role, organization })
  });
  return handleResponse(response);
}

