import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import './ErrorMessage.css';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="error-container" id="error-message">
      <div className="error-content">
        <div className="error-icon-wrapper">
          <FiAlertTriangle className="error-icon" />
        </div>
        <h3 className="error-title">Oops!</h3>
        <p className="error-text">{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry} id="retry-btn">
            <FiRefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
