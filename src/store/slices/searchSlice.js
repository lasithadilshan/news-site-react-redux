import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchNews } from '../../api/newsApi';

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, page = 1, max = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await searchNews({ query, page, max });
      return { ...data, query, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

export const searchMore = createAsyncThunk(
  'search/searchMore',
  async ({ query, page, max = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await searchNews({ query, page, max });
      return { ...data, query, page };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load more results');
    }
  }
);

const initialState = {
  query: '',
  results: [],
  totalResults: 0,
  currentPage: 1,
  status: 'idle',
  loadMoreStatus: 'idle',
  error: null,
  hasMore: true,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload.articles || [];
        state.totalResults = action.payload.totalArticles || 0;
        state.currentPage = action.payload.page;
        state.query = action.payload.query;
        state.hasMore = (action.payload.articles || []).length >= 10;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Search failed';
      })
      .addCase(searchMore.pending, (state) => {
        state.loadMoreStatus = 'loading';
      })
      .addCase(searchMore.fulfilled, (state, action) => {
        state.loadMoreStatus = 'idle';
        const newResults = action.payload.articles || [];
        state.results = [...state.results, ...newResults];
        state.currentPage = action.payload.page;
        state.hasMore = newResults.length >= 10;
      })
      .addCase(searchMore.rejected, (state, action) => {
        state.loadMoreStatus = 'failed';
        state.error = action.payload || 'Failed to load more results';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;

export const selectSearchResults = (state) => state.search.results;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchHasMore = (state) => state.search.hasMore;
export const selectSearchPage = (state) => state.search.currentPage;
export const selectSearchLoadMoreStatus = (state) => state.search.loadMoreStatus;

export default searchSlice.reducer;
