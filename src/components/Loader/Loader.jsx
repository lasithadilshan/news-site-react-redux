import './Loader.css';

const Loader = ({ text = 'Loading latest news...', fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`} id="loader">
      <div className="loader-content">
        <div className="pulse-loader">
          <div className="pulse-ring" />
          <div className="pulse-ring" />
          <div className="pulse-ring" />
          <div className="pulse-dot" />
        </div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
