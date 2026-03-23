import axios from 'axios';

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

const newsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

newsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 429) {
        error.message = 'API rate limit exceeded. Please try again later.';
      } else if (status === 403) {
        error.message = 'Invalid API key. Please check your configuration.';
      } else if (status === 500) {
        error.message = 'News service is temporarily unavailable.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const fetchTopHeadlines = async ({ category = 'general', page = 1, max = 10, lang = 'en' } = {}) => {
  const response = await newsApi.get('/top-headlines', {
    params: {
      token: API_KEY,
      topic: category === 'general' ? undefined : category,
      page,
      max,
      lang,
    },
  });
  return response.data;
};

export const searchNews = async ({ query, page = 1, max = 10, lang = 'en', sortby = 'publishedAt' } = {}) => {
  const response = await newsApi.get('/search', {
    params: {
      token: API_KEY,
      q: query,
      page,
      max,
      lang,
      sortby,
    },
  });
  return response.data;
};

export default newsApi;
