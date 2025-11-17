import React from 'react';
import './ProfileUpdateSuccess.css';

export default function ({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="pu-modal-overlay">
      <div className="pu-modal-content success-card">

        {/* <div className="pu-success-icon-wrapper">
          <div className="pu-success-icon">&#10004;</div>
        </div> */}

        <div className="pu-success-icon-wrapper">
          <svg className="pu-success-icon" viewBox="0 0 52 52">
            <path
              className="pu-check-path"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              d="M14 27 l10 10 l20 -20"
            />
          </svg>
        </div>
        
        <div className="pu-success-message">
          Your profile information has updated successfully!
        </div>
        
        <button 
          type="button" className="pu-btn-ok pu-success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}