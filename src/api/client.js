import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Interceptor to attach token
api.interceptors.request.use((config) => {
  try {
    // Supabase stores tokens with keys like 'sb-<project-id>-auth-token'
    const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    
    if (storageKey) {
      const sessionData = JSON.parse(localStorage.getItem(storageKey));
      const token = sessionData?.access_token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error('Error attaching auth token to request:', err);
  }
  return config;
});

export default api;
