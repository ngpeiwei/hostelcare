import React from 'react';
import './ComplaintSuccess.css';

export default function ({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="cp-modal-overlay">
      <div className="cp-modal-content success-card">

        {/* <div className="cp-success-icon-wrapper">
          <div className="cp-success-icon">&#10004;</div>
        </div> */}

        <div className="cp-success-icon-wrapper">
          <svg className="cp-success-icon" viewBox="0 0 52 52">
            <path
              className="cp-check-path"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              d="M14 27 l10 10 l20 -20"
            />
          </svg>
        </div>
        
        <div className="cp-success-message">
          Your complaint ticket has submitted successfully!
        </div>
        
        <button 
          type="button" className="cp-btn-ok cp-success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}