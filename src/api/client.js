import axios from 'axios';

// Ensure we have a valid base URL based on the environment
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Only fallback to localhost in development, avoiding it in production
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // In production without an env var, we return an empty string
  // The request interceptor will catch this and explicitly fail
  return '';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Interceptor to attach token
api.interceptors.request.use((config) => {
  // Gracefully fail in production if VITE_API_URL is missing
  if (!import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    const error = new Error('Frontend is not configured correctly: Missing API URL.');
    error.isConfigError = true;
    return Promise.reject(error);
  }

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

// Add Interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle explicit configuration errors
    if (error.isConfigError) {
      console.error('[API Configuration Error]', error.message);
      window.dispatchEvent(new CustomEvent('api-offline', { 
        detail: { message: error.message }
      }));
      return Promise.reject(error);
    }

    // Clean fallback handling if the API is unavailable
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('[API Network Error] Unable to reach backend server.');
      // Dispatch a custom event that App.jsx or Root can listen to for a global toast/fallback UI
      window.dispatchEvent(new CustomEvent('api-offline', { 
        detail: { message: 'Server is currently unreachable.' }
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
