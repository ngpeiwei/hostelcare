import React from 'react';
import './SignUpSuccess.css';

export default function ({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="su-modal-overlay">
      <div className="su-modal-content success-card">

        {/* <div className="su-success-icon-wrapper">
          <div className="su-success-icon">&#10004;</div>
        </div> */}

        <div className="su-success-icon-wrapper">
          <svg className="su-success-icon" viewBox="0 0 52 52">
            <path
              className="su-check-path"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              d="M14 27 l10 10 l20 -20"
            />
          </svg>
        </div>
        
        <div className="su-success-message">
          Your account has been created successfully!
        </div>
        
        <button 
          type="button" className="su-btn-ok su-success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}