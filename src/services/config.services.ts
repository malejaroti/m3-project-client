import axios from 'axios';

const api = axios.create({
  // baseURL: `http://localhost:5005/api`,
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`
});

api.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`;
  }

  return config;
});
export default api;
