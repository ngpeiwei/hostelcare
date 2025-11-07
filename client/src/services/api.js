// Simple API helper using fetch to provide an axios-like interface
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(method, path, body, config = {}) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    config.headers || {}
  );

  // attach token if present
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  return { data, status: res.status, ok: res.ok, response: res };
}

const api = {
  get: (path, config) => request('GET', path, null, config),
  post: (path, body, config) => request('POST', path, body, config),
  put: (path, body, config) => request('PUT', path, body, config),
  delete: (path, body, config) => request('DELETE', path, body, config),
};

export default api;
