import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  performSearch,
  searchMore,
  selectSearchResults,
  selectSearchStatus,
  selectSearchError,
  selectSearchQuery,
  selectSearchHasMore,
  selectSearchPage,
  selectSearchLoadMoreStatus,
} from '../../store/slices/searchSlice';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import { FiSearch } from 'react-icons/fi';
import './SearchPage.css';

const SearchPage = () => {
  const dispatch = useDispatch();
  const results = useSelector(selectSearchResults);
  const status = useSelector(selectSearchStatus);
  const error = useSelector(selectSearchError);
  const query = useSelector(selectSearchQuery);
  const hasMore = useSelector(selectSearchHasMore);
  const currentPage = useSelector(selectSearchPage);
  const loadMoreStatus = useSelector(selectSearchLoadMoreStatus);

  const handleLoadMore = () => {
    if (loadMoreStatus !== 'loading' && query) {
      dispatch(searchMore({ query, page: currentPage + 1 }));
    }
  };

  const scrollTarget = useInfiniteScroll(
    handleLoadMore,
    hasMore,
    loadMoreStatus === 'loading'
  );

  const handleRetry = () => {
    if (query) {
      dispatch(performSearch({ query }));
    }
  };

  if (!query) {
    return (
      <div className="search-page" id="search-page">
        <div className="search-empty">
          <FiSearch className="search-empty-icon" />
          <h2>Search for News</h2>
          <p>Type in the search bar to find articles on any topic</p>
        </div>
      </div>
    );
  }

  if (status === 'loading' && results.length === 0) {
    return <Loader fullPage text={`Searching for "${query}"...`} />;
  }

  if (status === 'failed' && results.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="search-page" id="search-page">
      <section className="search-hero">
        <h1 className="search-page-title">
          Search Results for <span className="search-query">"{query}"</span>
        </h1>
        <p className="search-result-count">
          {results.length} article{results.length !== 1 ? 's' : ''} found
        </p>
      </section>

      <section className="section">
        {results.length === 0 && status === 'succeeded' ? (
          <div className="no-results">
            <FiSearch className="no-results-icon" />
            <h3>No Results Found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="articles-grid" id="search-articles-grid">
            {results.map((article, index) => (
              <ArticleCard
                key={`${article.url}-${index}`}
                article={article}
                index={index}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={scrollTarget} className="scroll-trigger">
            {loadMoreStatus === 'loading' && (
              <Loader text="Loading more results..." />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
