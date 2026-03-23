import { FiTrendingUp, FiGithub, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <FiTrendingUp className="footer-logo-icon" />
              <span className="footer-logo-text">Pulse</span>
              <span className="footer-logo-accent">News</span>
            </div>
            <p className="footer-tagline">
              Stay informed with real-time news updates from around the world.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Categories</h4>
              <a href="/category/technology">Technology</a>
              <a href="/category/business">Business</a>
              <a href="/category/sports">Sports</a>
              <a href="/category/science">Science</a>
            </div>
            <div className="footer-link-group">
              <h4>More</h4>
              <a href="/category/health">Health</a>
              <a href="/category/entertainment">Entertainment</a>
              <a href="/category/world">World</a>
              <a href="/category/general">General</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} PulseNews. Powered by GNews API.
          </p>
          <p className="footer-made">
            Made with <FiHeart className="heart-icon" /> for news enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
