import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiExternalLink, FiBookmark } from 'react-icons/fi';
import { formatRelativeTime, truncateText, generateArticleSlug } from '../../utils/helpers';
import './ArticleCard.css';

const ArticleCard = ({ article, index, featured = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slug = generateArticleSlug(article.title);
  const articleIndex = index ?? 0;

  const fallbackImage = `https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80`;

  return (
    <article
      className={`article-card ${featured ? 'featured' : ''}`}
      id={`article-card-${articleIndex}`}
      style={{ '--delay': `${articleIndex * 0.05}s` }}
    >
      <Link
        to={`/article/${slug}`}
        state={{ article }}
        className="article-card-link"
      >
        <div className="article-image-wrapper">
          {!imageLoaded && (
            <div className="image-skeleton">
              <div className="skeleton-shimmer" />
            </div>
          )}
          <img
            src={imageError || !article.image ? fallbackImage : article.image}
            alt={article.title}
            className={`article-image ${imageLoaded ? 'loaded' : ''}`}
            loading="lazy"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="image-overlay" />
        </div>

        <div className="article-content">
          <div className="article-meta">
            {article.source?.name && (
              <span className="article-source">{article.source.name}</span>
            )}
            <span className="article-time">
              <FiClock size={12} />
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          <h3 className="article-title">
            {featured ? article.title : truncateText(article.title, 90)}
          </h3>

          <p className="article-description">
            {truncateText(article.description, featured ? 200 : 120)}
          </p>

          <div className="article-footer">
            <span className="read-more">
              Read full story
              <FiExternalLink size={12} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default memo(ArticleCard);
