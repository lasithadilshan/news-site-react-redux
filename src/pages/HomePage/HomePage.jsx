import { useEffect, useState } from 'react';
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
import { fetchAiSummary } from '../../api/newsApi';
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import { FiTrendingUp, FiZap, FiCpu } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const status = useSelector(selectNewsStatus);
  const error = useSelector(selectNewsError);
  const currentPage = useSelector(selectCurrentPage);
  const hasMore = useSelector(selectHasMore);
  const loadMoreStatus = useSelector(selectLoadMoreStatus);

  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useAutoRefresh();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHeadlines({ category: 'general' }));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'succeeded' && articles.length > 0 && !aiSummary && !aiLoading) {
      setAiLoading(true);
      fetchAiSummary({ category: 'general' })
        .then((res) => {
          if (res.summary) setAiSummary(res.summary);
          setAiLoading(false);
        })
        .catch((err) => {
          console.error("AI Summary failed", err);
          setAiLoading(false);
        });
    }
  }, [status, articles.length]);

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

      {/* AI Summary Section */}
      {(aiLoading || aiSummary) && (
        <section className="section" style={{ marginTop: '-2rem', marginBottom: '2rem' }}>
          <div className="section-header">
            <div className="section-title-wrapper" style={{ gap: '0.75rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <FiCpu className="section-icon" style={{ color: 'white', margin: 0, fontSize: '1.25rem' }} />
              </div>
              <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI Briefing
              </h2>
            </div>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a855f7 0%, #6366f1 100%)' }} />
            {aiLoading ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                 <FiZap style={{ animation: 'pulse 1.5s infinite', color: '#a855f7' }} />
                 <span>Generating real-time automated summary via Gemini 1.5 Flash...</span>
               </div>
            ) : (
              <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>
                {aiSummary.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            )}
          </div>
        </section>
      )}

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
