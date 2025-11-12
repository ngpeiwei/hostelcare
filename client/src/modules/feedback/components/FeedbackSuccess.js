import React from 'react';
import './FeedbackSuccess.css';

export default function ({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content success-card">
        <div className="success-icon-wrapper">
          {/* This is a unicode checkmark */}
          <div className="success-icon">&#10004;</div>
        </div>
        
        <h2 className="success-message">
          Your complaint has submitted successfully!
        </h2>
        
        <button 
          type="button" 
          className="btn-submit success-ok-btn" 
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}