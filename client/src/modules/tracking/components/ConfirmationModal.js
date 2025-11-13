// client/modules/tracking/components/ConfirmationModal.js

import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ open, onClose, onConfirm, message, confirmText = 'Confirm' }) => {
    if (!open) return null;

    return (
        <div className="modal-backdrop-confirmation">
            <div className="modal-content-confirmation">
                <div className="modal-header-confirmation">
                    <h4 className="modal-title-confirmation">Confirmation Message</h4>
                    <button className="close-btn-confirmation" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-body-confirmation">
                    <p>{message}</p>
                </div>

                <div className="modal-footer-confirmation">
                    <button 
                        className="action-button button-secondary" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="action-button button-primary button-confirm" 
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;