import { API_BASE_URL } from './authService';

async function handleResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

export async function fetchForumPosts() {
  const response = await fetch(`${API_BASE_URL}/api/forum/posts`);
  return handleResponse(response);
}

export async function createForumPost({ subject, content, username }) {
  const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-username': username
    },
    body: JSON.stringify({ subject, content })
  });
  return handleResponse(response);
}

export async function addForumComment({ postId, content, username }) {
  const response = await fetch(`${API_BASE_URL}/api/forum/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-username': username
    },
    body: JSON.stringify({ content })
  });
  return handleResponse(response);
}
