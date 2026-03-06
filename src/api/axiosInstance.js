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
    // Handle both 401 (unauthorized) and 403 (forbidden/expired token)
    // BUT only redirect for non-login endpoints to avoid infinite loop
    const url = err.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    
    if (!isAuthEndpoint && (err.response?.status === 401 || err.response?.status === 403)) {
      localStorage.removeItem('lms-auth');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default API;
