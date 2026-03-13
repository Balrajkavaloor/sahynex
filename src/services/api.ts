import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 15000
});

api.interceptors.response.use(
  response => response,
  error => {
    // Surface error for stores/pages to handle; easy to customize later
    return Promise.reject(error);
  }
);

