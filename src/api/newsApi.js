import axios from 'axios';

// GNews strictly blocks CORS from non-localhost domains on their free tier.
// Falling back to Currents API which permits CORS natively for frontend sites like Github Pages.
const API_KEY = import.meta.env.VITE_CURRENTS_API_KEY || import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://api.currentsapi.services/v1';

const newsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

newsApi.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Map Currents API format { news: [...] } to GNews format { articles: [...] } for UI compatibility
    if (data && data.news) {
      return {
        ...response,
        data: {
          articles: data.news.map((item) => {
            // Safely parse "YYYY-MM-DD HH:MM:SS +0000" to "YYYY-MM-DDTHH:MM:SSZ" for strict parsers (Safari/date-fns)
            let safeDateStr = new Date().toISOString();
            if (item.published) {
              const cleanedStr = item.published.replace(' +0000', 'Z').replace(' ', 'T');
              if (!Number.isNaN(new Date(cleanedStr).getTime())) {
                safeDateStr = cleanedStr;
              }
            }

            return {
              title: item.title,
              description: item.description,
              content: item.description,
              url: item.url,
              image: item.image !== 'None' ? item.image : null,
              publishedAt: safeDateStr,
              source: { name: item.author || 'Currents' },
            };
          }),
          totalArticles: data.news.length > 0 ? 100 : 0, // Approximate for pagination math
        },
      };
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 429) {
        error.message = 'API rate limit exceeded. Please try again later.';
      } else if (status === 401 || status === 403) {
        error.message = 'Invalid API key. Please check your GitHub Secrets.';
      } else if (status === 500) {
        error.message = 'News service is temporarily unavailable.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const fetchTopHeadlines = async ({ category = 'general', page = 1, max = 10 } = {}) => {
  const response = await newsApi.get('/latest-news', {
    params: {
      apiKey: API_KEY,
      category: category === 'general' ? undefined : category,
      page_number: page,
      language: 'en',
    },
  });
  return response.data;
};

export const searchNews = async ({ query, page = 1, max = 10 } = {}) => {
  const response = await newsApi.get('/search', {
    params: {
      apiKey: API_KEY,
      keywords: query,
      page_number: page,
      language: 'en',
    },
  });
  return response.data;
};

export default newsApi;
