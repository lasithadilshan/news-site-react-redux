import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiCalendar, FiClock, FiShare2 } from 'react-icons/fi';
import { formatDateTime, formatRelativeTime } from '../../utils/helpers';
import { useState } from 'react';
import './ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="article-not-found" id="article-not-found">
        <div className="not-found-content">
          <h2>Article Not Found</h2>
          <p>The article you're looking for is not available.</p>
          <Link to="/" className="back-home-btn">
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(article.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=1200&q=80';

  return (
    <div className="article-detail-page" id="article-detail-page">
      <div className="article-detail-container">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Article header */}
        <header className="article-detail-header">
          <div className="article-detail-meta">
            {article.source?.name && (
              <span className="detail-source">{article.source.name}</span>
            )}
            <span className="detail-date">
              <FiCalendar size={14} />
              {formatDateTime(article.publishedAt)}
            </span>
            <span className="detail-relative-time">
              <FiClock size={14} />
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-detail-actions">
            <button className="share-btn" onClick={handleShare} id="share-btn">
              <FiShare2 size={16} />
              {copied ? 'Link Copied!' : 'Share'}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="original-link"
              id="original-article-link"
            >
              <FiExternalLink size={16} />
              Read Original
            </a>
          </div>
        </header>

        {/* Featured image */}
        <div className="article-detail-image-wrapper">
          <img
            src={imageError || !article.image ? fallbackImage : article.image}
            alt={article.title}
            className="article-detail-image"
            onError={() => setImageError(true)}
          />
          <div className="image-gradient-overlay" />
        </div>

        {/* Article body */}
        <div className="article-detail-body">
          {article.description && (
            <p className="article-detail-lead">{article.description}</p>
          )}

          {article.content && (
            <div className="article-detail-content">
              <p>{article.content}</p>
            </div>
          )}

          <div className="article-cta">
            <p className="cta-text">
              Continue reading the full article on the original source
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
              id="cta-read-original"
            >
              Read Full Article on {article.source?.name || 'Source'}
              <FiExternalLink />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
