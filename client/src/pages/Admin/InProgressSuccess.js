import React from 'react';
import './InProgressSuccess.css';

export default function ({ open, onClose, message }) {
  if (!open) return null;

  const displayMessage = message || "The ticket has been updated to In Progress successfully!";

  return (
    <div className="inProgress-modal-overlay">
      <div className="inProgress-modal-content success-card">

        <div className="inProgress-success-icon-wrapper">
          <svg className="inProgress-success-icon" viewBox="0 0 52 52">
            <path
              className="inProgress-check-path"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              d="M14 27 l10 10 l20 -20"
            />
          </svg>
        </div>
        
        <div className="inProgress-success-message">
          {displayMessage}
        </div>
        
        <button 
          type="button" className="inProgress-btn-ok inProgress-success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}