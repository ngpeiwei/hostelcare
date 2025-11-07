import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ComplaintForm from './ComplaintForm';
import '../Complaint.css';

export default function ComplaintModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className="complaint-overlay"
      role="presentation"
      onMouseDown={(e) => {
        // close when clicking the overlay (but not when clicking the dialog)
        if (e.target.classList.contains('complaint-overlay')) onClose && onClose();
      }}
    >
      <div className="complaint-modal" role="dialog" aria-modal="true">
        <div className="complaint-modal-header">
          <h3>Complaint Ticket</h3>
          <button
            className="complaint-modal-close"
            aria-label="Close complaint form"
            onClick={() => onClose && onClose()}
          >
            ✕
          </button>
        </div>

        <div className="complaint-modal-body">
          <ComplaintForm onSuccess={() => onClose && onClose()} />
        </div>
      </div>
    </div>
  );

  // Render the modal into document.body so it's not affected by page-level blur
  return ReactDOM.createPortal(modal, document.body);
}
