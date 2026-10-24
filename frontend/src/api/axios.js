import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, 
async (error) => {
  const original = error.config;
  const refresh = localStorage.getItem('refresh_token');
  const isAuthEndpoint = original.url.includes('token/');
  if ( error.response?.status == 401 && !original._retry && !isAuthEndpoint && refresh ) {
    original._retry = true; // Prevents infinite loop
    try {
      const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
      localStorage.setItem('access_token', res.data.access);
      original.headers.Authorization = `Bearer ${res.data.access}`;
      return api(original);
    } catch(refreshError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
})

export default api;