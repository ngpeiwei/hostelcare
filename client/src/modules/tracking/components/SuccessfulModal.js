// client/modules/tracking/components/SuccessMessageModal.js

import React from 'react';
import './SuccessfulModal.css';

const SuccessMessageModal = ({ open, onClose, title, message }) => {
    if (!open) return null;

    return (
        <div className="modal-backdrop-success">
            <div className="modal-content-success">
                <div className="success-icon-container">
                    {/* Checkmark Icon */}
                    <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <div className="success-text-container">
                    <h4 className="success-title">{title}</h4>
                    <p className="success-message">{message}</p>
                </div>

                <div className="modal-footer-success">
                    <button 
                        className="action-button button-primary" 
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessMessageModal;