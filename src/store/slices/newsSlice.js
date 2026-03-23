import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTopHeadlines } from '../../api/newsApi';

export const fetchHeadlines = createAsyncThunk(
  'news/fetchHeadlines',
  async ({ category = 'general', page = 1, max = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await fetchTopHeadlines({ category, page, max });
      return { ...data, category, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch headlines');
    }
  }
);

export const fetchMoreHeadlines = createAsyncThunk(
  'news/fetchMoreHeadlines',
  async ({ category = 'general', page, max = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await fetchTopHeadlines({ category, page, max });
      return { ...data, category, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch more headlines');
    }
  }
);

const initialState = {
  articles: [],
  totalArticles: 0,
  currentPage: 1,
  currentCategory: 'general',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  loadMoreStatus: 'idle',
  error: null,
  lastFetched: null,
  hasMore: true,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.currentPage = 1;
      state.articles = [];
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetNews: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch headlines
      .addCase(fetchHeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHeadlines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles || [];
        state.totalArticles = action.payload.totalArticles || 0;
        state.currentPage = action.payload.page;
        state.currentCategory = action.payload.category;
        state.lastFetched = Date.now();
        state.hasMore = (action.payload.articles || []).length >= 10;
      })
      .addCase(fetchHeadlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      })
      // Fetch more (infinite scroll)
      .addCase(fetchMoreHeadlines.pending, (state) => {
        state.loadMoreStatus = 'loading';
      })
      .addCase(fetchMoreHeadlines.fulfilled, (state, action) => {
        state.loadMoreStatus = 'idle';
        const newArticles = action.payload.articles || [];
        state.articles = [...state.articles, ...newArticles];
        state.currentPage = action.payload.page;
        state.lastFetched = Date.now();
        state.hasMore = newArticles.length >= 10;
      })
      .addCase(fetchMoreHeadlines.rejected, (state, action) => {
        state.loadMoreStatus = 'failed';
        state.error = action.payload || 'Failed to load more articles';
      });
  },
});

export const { setCategory, clearError, resetNews } = newsSlice.actions;

// Selectors
export const selectArticles = (state) => state.news.articles;
export const selectNewsStatus = (state) => state.news.status;
export const selectNewsError = (state) => state.news.error;
export const selectCurrentCategory = (state) => state.news.currentCategory;
export const selectCurrentPage = (state) => state.news.currentPage;
export const selectHasMore = (state) => state.news.hasMore;
export const selectLoadMoreStatus = (state) => state.news.loadMoreStatus;
export const selectLastFetched = (state) => state.news.lastFetched;

export default newsSlice.reducer;
