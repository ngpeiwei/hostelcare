import React from 'react';
import './FeedbackSuccess.css';

export default function ({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-content success-card">
        <div className="fb-success-icon-wrapper">
          {/* This is a unicode checkmark */}
          <div className="fb-success-icon">&#10004;</div>
        </div>
        
        <div className="fb-success-message">
          Your feedback has been submitted successfully!
        </div>
        
        <button 
          type="button" className="fb-btn-ok fb-success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}