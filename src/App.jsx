import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { selectTheme } from './store/slices/uiSlice';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx';
import SearchPage from './pages/SearchPage/SearchPage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage/ArticleDetailPage.jsx';

function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app" id="app">
        <Navbar />
        <main className="main-content">
          <div className="page-enter">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/article/:slug" element={<ArticleDetailPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
