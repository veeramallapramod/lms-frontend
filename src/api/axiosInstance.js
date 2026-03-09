import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use((req) => {
  try {
    const auth = JSON.parse(localStorage.getItem('lms-auth') || '{}');
    const token = auth?.state?.token;
    if (token) req.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

    // Only logout on 401 (token expired/invalid) — NOT on 403 (just no permission)
    if (!isAuthEndpoint && err.response?.status === 401) {
      localStorage.removeItem('lms-auth');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default API;