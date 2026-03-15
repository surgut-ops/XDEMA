// lib/api.ts
import axios from 'axios';

let baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  .replace(/^http:\/\//i, process.env.NODE_ENV === 'production' ? 'https://' : 'http://');
if (process.env.NODE_ENV === 'production' && !baseURL.endsWith('/api')) {
  baseURL = baseURL.replace(/\/?$/, '') + '/api';
}

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('xdema_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err?.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
};

// ── Courses ───────────────────────────────────────────────
export const coursesApi = {
  getAll: () => api.get('/courses'),
  getOne: (slug: string) => api.get(`/courses/${slug}`),
  update: (id: number, data: any) => api.patch(`/courses/${id}`, data),
  addMaterial: (id: number, data: any) => api.post(`/courses/${id}/materials`, data),
  deleteMaterial: (mid: number) => api.delete(`/courses/materials/${mid}`),
};

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  getMe: () => api.get('/users/me'),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.patch('/users/me/password', { oldPassword, newPassword }),
  getAll: () => api.get('/users'),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// ── Orders ────────────────────────────────────────────────
export const ordersApi = {
  getAll: (type?: string) => api.get('/orders', { params: { type } }),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// ── Reviews ───────────────────────────────────────────────
export const reviewsApi = {
  getApproved: () => api.get('/reviews'),
  getAll: () => api.get('/reviews?all=1'),
  create: (data: { name: string; text: string; rating: number; event?: string }) =>
    api.post('/reviews', data),
  approve: (id: number) => api.patch(`/reviews/${id}/approve`),
  hide: (id: number) => api.patch(`/reviews/${id}/hide`),
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

// ── Gallery ───────────────────────────────────────────────
export const galleryApi = {
  getAll: () => api.get('/gallery'),
  upload: (file: File, label: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('label', label);
    return api.post('/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  addUrl: (label: string, imageUrl: string) => api.post('/gallery/url', { label, imageUrl }),
  update: (id: number, data: any) => api.patch(`/gallery/${id}`, data),
  reorder: (ids: number[]) => api.patch('/gallery/reorder', { ids }),
  delete: (id: number) => api.delete(`/gallery/${id}`),
};

// ── Payments / Checkout ───────────────────────────────────
export const checkoutApi = {
  course: (courseId: number, email: string, name: string) =>
    api.post('/checkout/course', { courseId, email, name }),
  service: (amount: number, description: string, email: string, name: string) =>
    api.post('/checkout/service', { amount, description, email, name }),
  qr: (type: string, amount: number, fromName: string, details: string) =>
    api.post('/checkout/qr', { type, amount, fromName, details }),
};

// ── Settings ──────────────────────────────────────────────
export const settingsApi = {
  getAll: () => api.get('/settings'),
  get: (key: string) => api.get(`/settings/${key}`),
  set: (key: string, value: any) => api.patch(`/settings/${key}`, { value }),
};

// ── Messages ──────────────────────────────────────────────
export const messagesApi = {
  send: (data: { fromName: string; contact: string; text?: string; type: string }) =>
    api.post('/messages', data),
  getAll: () => api.get('/messages'),
  markRead: (id: number) => api.patch(`/messages/${id}/read`),
};

// ── QR ────────────────────────────────────────────────────
export const qrApi = {
  createOrder: (data: { type: string; fromName: string; amount: number; details: string }) =>
    api.post('/qr/order', data),
};

// ── Admin Notifications ───────────────────────────────────
export const adminNotifApi = {
  send: (data: any) => api.post('/admin/notifications', data),
  getAll: () => api.get('/admin/notifications'),
  delete: (id: number) => api.delete(`/admin/notifications/${id}`),
  telegramTest: () => api.post('/admin/notifications/telegram-test'),
};

export default api;
