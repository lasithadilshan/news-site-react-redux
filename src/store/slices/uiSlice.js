import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('newsapp-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const initialState = {
  theme: getInitialTheme(),
  mobileMenuOpen: false,
  searchModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('newsapp-theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('newsapp-theme', action.payload);
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearchModal,
  closeSearchModal,
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectSearchModalOpen = (state) => state.ui.searchModalOpen;

export default uiSlice.reducer;
