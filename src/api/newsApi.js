import axios from 'axios';

// Point this to your Render/Vercel URL once the backend repo is deployed.
// For local testing, it defaults to the local Express server.
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

const newsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

newsApi.interceptors.response.use(
  (response) => {
    // We already formatted the payload EXACTLY as the UI expects inside our custom Express Backend!
    // No more mapping required on the client side!
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 429) {
        error.message = 'Backend hit max rate limits upstream! Trying cache...';
      } else if (status === 401 || status === 403) {
        error.message = 'The custom API backend has an invalid GNews Key.';
      } else if (status === 500) {
        error.message = 'Custom proxy service is temporarily unavailable.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out to the proxy. Please check your connection.';
    } else {
      error.message = 'Could not reach backend API. Is the Render/Vercel service running?';
    }
    return Promise.reject(error);
  }
);

export const fetchTopHeadlines = async ({ category = 'general', page = 1, max = 10 } = {}) => {
  const response = await newsApi.get('/headlines', {
    params: {
      category: category === 'general' ? undefined : category,
      page,
      max
    },
  });
  return response.data;
};

export const searchNews = async ({ query, page = 1, max = 10 } = {}) => {
  const response = await newsApi.get('/search', {
    params: {
      q: query,
      page,
      max
    },
  });
  return response.data;
};

export const fetchAiSummary = async ({ category = 'general' } = {}) => {
  const response = await newsApi.get('/ai-summary', {
    params: {
      category: category === 'general' ? undefined : category
    },
  });
  return response.data;
};

export default newsApi;
