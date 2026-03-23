import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHeadlines,
  fetchMoreHeadlines,
  setCategory,
  selectArticles,
  selectNewsStatus,
  selectNewsError,
  selectCurrentPage,
  selectHasMore,
  selectLoadMoreStatus,
  selectCurrentCategory,
} from '../../store/slices/newsSlice';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import { CATEGORIES } from '../../utils/constants';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles);
  const status = useSelector(selectNewsStatus);
  const error = useSelector(selectNewsError);
  const currentPage = useSelector(selectCurrentPage);
  const hasMore = useSelector(selectHasMore);
  const loadMoreStatus = useSelector(selectLoadMoreStatus);
  const currentCategory = useSelector(selectCurrentCategory);

  useAutoRefresh();

  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  useEffect(() => {
    if (categoryId !== currentCategory) {
      dispatch(setCategory(categoryId));
      dispatch(fetchHeadlines({ category: categoryId }));
    }
  }, [categoryId, dispatch, currentCategory]);

  const handleLoadMore = () => {
    if (loadMoreStatus !== 'loading') {
      dispatch(fetchMoreHeadlines({ category: categoryId, page: currentPage + 1 }));
    }
  };

  const scrollTarget = useInfiniteScroll(
    handleLoadMore,
    hasMore,
    loadMoreStatus === 'loading'
  );

  const handleRetry = () => {
    dispatch(fetchHeadlines({ category: categoryId }));
  };

  if (status === 'loading' && articles.length === 0) {
    return <Loader fullPage text={`Loading ${category.label} news...`} />;
  }

  if (status === 'failed' && articles.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="category-page" id="category-page">
      <section className="category-hero" style={{ '--cat-color': category.color }}>
        <div className="category-hero-content">
          <span className="category-emoji">{category.icon}</span>
          <h1 className="category-page-title">{category.label}</h1>
          <p className="category-page-subtitle">
            Latest {category.label.toLowerCase()} news from around the world
          </p>
        </div>
        <div className="category-hero-glow" />
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">Latest Stories</h2>
          </div>
          <span className="article-count">{articles.length} articles</span>
        </div>

        {articles.length === 0 && status === 'succeeded' ? (
          <div className="no-articles">
            <p>No articles found for this category. Try again later.</p>
          </div>
        ) : (
          <div className="articles-grid" id="category-articles-grid">
            {articles.map((article, index) => (
              <ArticleCard
                key={`${article.url}-${index}`}
                article={article}
                index={index}
                featured={index === 0}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={scrollTarget} className="scroll-trigger">
            {loadMoreStatus === 'loading' && (
              <Loader text="Loading more stories..." />
            )}
          </div>
        )}

        {!hasMore && articles.length > 0 && (
          <div className="end-message">
            <p>✨ You're all caught up on {category.label}!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
