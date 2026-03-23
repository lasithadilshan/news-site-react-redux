import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHeadlines,
  fetchMoreHeadlines,
  selectArticles,
  selectNewsStatus,
  selectNewsError,
  selectCurrentPage,
  selectHasMore,
  selectLoadMoreStatus,
} from '../../store/slices/newsSlice';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import { FiTrendingUp, FiZap } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const status = useSelector(selectNewsStatus);
  const error = useSelector(selectNewsError);
  const currentPage = useSelector(selectCurrentPage);
  const hasMore = useSelector(selectHasMore);
  const loadMoreStatus = useSelector(selectLoadMoreStatus);

  useAutoRefresh();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHeadlines({ category: 'general' }));
    }
  }, [dispatch, status]);

  const handleLoadMore = () => {
    if (loadMoreStatus !== 'loading') {
      dispatch(fetchMoreHeadlines({ category: 'general', page: currentPage + 1 }));
    }
  };

  const scrollTarget = useInfiniteScroll(
    handleLoadMore,
    hasMore,
    loadMoreStatus === 'loading'
  );

  const handleRetry = () => {
    dispatch(fetchHeadlines({ category: 'general' }));
  };

  if (status === 'loading' && articles.length === 0) {
    return <Loader fullPage text="Fetching breaking news..." />;
  }

  if (status === 'failed' && articles.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FiZap className="hero-badge-icon" />
            <span>Live Updates</span>
          </div>
          <h1 className="hero-title">
            Stay Ahead with
            <span className="hero-gradient"> Breaking News</span>
          </h1>
          <p className="hero-subtitle">
            Real-time headlines from trusted sources worldwide. Updated every 5 minutes.
          </p>
        </div>
        <div className="hero-decoration">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
      </section>

      {/* Trending section */}
      <section className="section" id="trending-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <FiTrendingUp className="section-icon" />
            <h2 className="section-title">Top Headlines</h2>
          </div>
          <span className="article-count">{articles.length} articles</span>
        </div>

        <div className="articles-grid" id="articles-grid">
          {articles.map((article, index) => (
            <ArticleCard
              key={`${article.url}-${index}`}
              article={article}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={scrollTarget} className="scroll-trigger">
            {loadMoreStatus === 'loading' && (
              <Loader text="Loading more stories..." />
            )}
          </div>
        )}

        {!hasMore && articles.length > 0 && (
          <div className="end-message">
            <p>✨ You're all caught up!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
