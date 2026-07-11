// Hardcoded directly since the Vercel env var wasn't reliably making it into
// the build. If you ever move the backend, update this one line.
const API_ROOT = 'https://dakaf-api.onrender.com';
const API_BASE = `${API_ROOT}/api`;

// Product images come back as relative paths like "/uploads/xyz.jpg" -
// this turns them into a full URL against the same backend.
export function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_ROOT}${path}`;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

export const api = {
  getProducts: (categoryId) =>
    request(`/products${categoryId ? `?category=${categoryId}` : ''}`),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/categories'),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  adminLogin: (username, password) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  adminCreateCategory: (token, payload) =>
    request('/admin/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),

  adminCreateProduct: (token, formData) =>
    request('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }),

  adminDeleteProduct: (token, id) =>
    request(`/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
