import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiSun, FiMoon, FiMenu, FiX, FiTrendingUp } from 'react-icons/fi';
import { toggleTheme, selectTheme, toggleMobileMenu, selectMobileMenuOpen, closeMobileMenu } from '../../store/slices/uiSlice';
import { setCategory } from '../../store/slices/newsSlice';
import { performSearch, setQuery, clearSearch } from '../../store/slices/searchSlice';
import { CATEGORIES } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector(selectTheme);
  const mobileMenuOpen = useSelector(selectMobileMenuOpen);
  const [searchInput, setSearchInput] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      dispatch(setQuery(debouncedSearch));
      dispatch(performSearch({ query: debouncedSearch }));
      if (location.pathname !== '/search') {
        navigate('/search');
      }
    }
  }, [debouncedSearch, dispatch, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      dispatch(setQuery(searchInput));
      dispatch(performSearch({ query: searchInput }));
      navigate('/search');
      setSearchExpanded(false);
      dispatch(closeMobileMenu());
    }
  };

  const handleCategoryClick = (categoryId) => {
    dispatch(setCategory(categoryId));
    dispatch(closeMobileMenu());
    navigate(`/category/${categoryId}`);
  };

  const handleLogoClick = () => {
    dispatch(closeMobileMenu());
    setSearchInput('');
    dispatch(clearSearch());
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" id="navbar-logo" onClick={handleLogoClick}>
            <FiTrendingUp className="logo-icon" />
            <span className="logo-text">Pulse</span>
            <span className="logo-accent">News</span>
          </Link>
        </div>

        <div className={`navbar-center ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-categories" id="nav-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`nav-category-btn ${location.pathname === `/category/${cat.id}` ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                id={`nav-cat-${cat.id}`}
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <div className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`} ref={searchRef}>
            <button
              className="search-toggle"
              onClick={() => setSearchExpanded(!searchExpanded)}
              id="search-toggle-btn"
              aria-label="Toggle search"
            >
              <FiSearch />
            </button>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                id="search-input"
                aria-label="Search news articles"
              />
              {searchInput && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </form>
          </div>

          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            id="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => dispatch(toggleMobileMenu())}
            id="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <FiSearch className="mobile-search-icon" />
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search news..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="mobile-search-input"
            />
          </form>
          <div className="mobile-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`mobile-cat-btn ${location.pathname === `/category/${cat.id}` ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                id={`mobile-cat-${cat.id}`}
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
