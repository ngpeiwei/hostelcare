// client/modules/tracking/components/StudentDetailsModal.js

import React from 'react';
import './StudentDetailsModal.css';

// Component to display the current status pill
const StatusPill = ({ status }) => {
    // Uses CSS classes status-resolved or status-inprogress, etc., defined in StudentDashboard.css
    const statusClass = status.toLowerCase().replace(/\s/g, '');
    return <span className={`pill status-${statusClass}`}>{status}</span>;
};

const StudentDetailsModal = ({ open, onClose, complaintData }) => {
    if (!open || !complaintData) return null;

    // Helper to format text (since we removed the markdown bolding earlier)
    const displayValue = (value) => value || 'N/A';

    return (
        <div className="modal-backdrop-student">
            <div className="modal-content-student">
                <div className="modal-header-student">
                    <h3 className="modal-title-student">Complaint Details: #{complaintData.id.slice(0, 8).toUpperCase()}</h3>
                    <button className="close-btn-student" onClick={onClose}>&times;</button>
                </div>

                <div className="complaint-modal-body">
                    {/* <div className="status-header">
                        <StatusPill status={complaintData.status} />
                    </div> */}

                    <div className="ticket-header-pill">
                        {complaintData.title}
                    </div>

                    <div className="info-grid-student">
                        
                        {/* FIRST COLUMN */}
                        {/* <p>Name: {displayValue(complaintData.name)}</p> */}
                        <p>Created: {displayValue(complaintData.dateCreated)}</p>
                        <p>Category: {displayValue(complaintData.category)}</p>
                        <p>Sub-category: {displayValue(complaintData.subCategory)}</p>
                        <p>Phone Number: {displayValue(complaintData.phone)}</p>

                        {/* SECOND COLUMN */}
                        <p>Hostel: {displayValue(complaintData.hostel)}</p>
                        <p>Building and Room Number: {displayValue(complaintData.buildingRoom)}</p>
                        {/* <p>Attachments: {displayValue(complaintData.attachments)}</p> */}
                        <div className="attachments-section">
                            <p><strong>Attachments:</strong></p>

                            {complaintData.attachments && complaintData.attachments.length > 0 ? (
                                <ul className="attachments-list">
                                {complaintData.attachments.map((a, index) => (
                                    <li key={index}>
                                    <a
                                        href={a.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="attachment-link"
                                    >
                                        View Attachment {index + 1}
                                    </a>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                        <p>Staff: {displayValue(complaintData.staff)}</p> 
                    </div>
                    
                    {/* Placeholder for description/comments */}
                    <div className="description-section">
                        <h4>Description:</h4>
                        <div className="description-box">
                            {displayValue(complaintData.description || 'No description provided.')}
                        </div>
                    </div>
                </div>

                <div className="modal-footer-student">
                    <button className="btn btn-close-modal" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;