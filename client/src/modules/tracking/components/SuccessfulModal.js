// client/modules/tracking/components/SuccessMessageModal.js

import React from 'react';
import './SuccessfulModal.css';

export default function SuccessMessageModal({ open, onClose, message }) {
    if (!open) return null;

    return (
        <div className="sm-modal-overlay">
            <div className="sm-modal-content success-card">

                <div className="sm-success-icon-wrapper">
                    <svg className="sm-success-icon" viewBox="0 0 52 52">
                        <path
                            className="sm-check-path"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="6"
                            d="M14 27 l10 10 l20 -20"
                        />
                    </svg>
                </div>

                <div className="sm-success-message">
                    {message}
                </div>

                <button 
                    type="button"
                    className="sm-btn-ok sm-success-ok-btn"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
}