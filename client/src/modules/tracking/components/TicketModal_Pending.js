// client/modules/tracking/components/TicketModal_Pending.js

import React, { useState } from 'react';
import './TicketModal_Pending.css';
import ConfirmationModal from './ConfirmationModal'; // We'll create this next

// Helper component for status badge (uses styles from StaffDashboard.css)
const StatusBadge = ({ status }) => {
    const statusClass = status.toLowerCase().replace(/\s/g, '');
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
};

// Assuming this component receives ticketData and update handlers
const TicketModal_Pending = ({ open, onClose, ticketData, onUpdateStatus }) => {
    // State to manage the confirmation modal visibility
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    if (!open || !ticketData) return null;

    // Handler for clicking the 'Start Work' button
    const handleStartWorkClick = () => {
        setIsConfirmOpen(true);
    };

    // Handler for confirming the status change
    const handleConfirmUpdate = () => {
        // 1. Close the confirmation modal
        setIsConfirmOpen(false);
        
        // 2. Close the detail modal
        onClose(); 
        
        // 3. Trigger the status update logic in the parent (StaffDashboard)
        // We pass the new status 'In Progress' and the ticket ID
        onUpdateStatus(ticketData.id, 'In Progress'); 
    };

    return (
        <div className="modal-backdrop-staff">
            <div className="modal-content-staff detail-modal">
                <div className="modal-header-staff">
                    <h3 className="modal-title-staff">Ticket Details</h3>
                    <button className="close-btn-staff" onClick={onClose}>&times;</button>
                </div>

                <div className="ticket-modal-body">
                    <div className="ticket-header-pill">
                        {/* Title pill at the top */}
                        {ticketData.title}
                    </div>

                    <div className="detail-grid-staff">
                        {/* Row 1 */}
                        <div className="detail-group">
                            <label>Date created</label>
                            <input type="text" value={ticketData.dateReported || ''} readOnly />
                        </div>
                        <div className="detail-group">
                            <label>Hostel</label>
                            <input type="text" value={ticketData.location?.split(' - ')[0] || 'Desasiswa Tekun'} readOnly />
                        </div>
                        
                        {/* Row 2 */}
                        <div className="detail-group">
                            <label>Ticket ID</label>
                            <input type="text" value={`#${ticketData.id}`} readOnly />
                        </div>
                        <div className="detail-group">
                            <label>Phone Number</label>
                            <input type="text" value={ticketData.location?.split(' - ')[1] || '+60102355511'} readOnly />
                        </div>

                        {/* Row 3 */}
                        <div className="detail-group">
                            <label>Name</label>
                            <input type="text" value={ticketData.reporter || 'N/A'} readOnly />
                        </div>
                        <div className="detail-group">
                            <label>Building and Room Number</label>
                            <input type="text" value={'M04-09-12A'} readOnly />
                        </div>

                        {/* Row 4 */}
                        <div className="detail-group">
                            <label>Email</label>
                            <input type="text" value={'syakiilaati@student.usm.my'} readOnly /> {/* Mocked value */}
                        </div>
                        <div className="detail-group span-2">
                            <label>Description</label>
                            <textarea rows="3" value={ticketData.description} readOnly />
                        </div>
                        
                        {/* Row 5 */}
                        <div className="detail-group">
                            <label>Category</label>
                            <input type="text" value={'Individual'} readOnly />
                        </div>
                        <div className="detail-group">
                            <label>Attachments</label>
                            <div className="attachment-container">
                                <input type="text" value={'IMG0002.png'} readOnly />
                                <button className="action-button button-secondary">Download</button>
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div className="detail-group">
                            <label>Sub-category</label>
                            <input type="text" value={'Table lamp'} readOnly />
                        </div>
                        <div className="detail-group required">
                            <label>Staff-in-Charge *</label>
                            {/* Staff should select themselves, but for this view, it's a dropdown */}
                            <select defaultValue={'Nazrul Hakim'}>
                                <option>Nazrul Hakim</option>
                            </select>
                        </div>

                        {/* Row 7 - Actions to be taken (Input/Textarea) */}
                        <div className="detail-group span-2 required">
                            <label>Actions to be taken *</label>
                            <textarea rows="2" placeholder="e.g., Bring new light bulb from stock" />
                        </div>

                        {/* Row 8 */}
                        <div className="detail-group required">
                            <label>Estimated Service Date *</label>
                            <input type="date" defaultValue={'2025-07-20'} />
                        </div>
                        <div className="detail-group">
                            <label>Ticket Status *</label>
                            <select defaultValue={ticketData.status}>
                                <option>{ticketData.status}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer-staff">
                    <button 
                        className="action-button button-primary start-work-btn"
                        onClick={handleStartWorkClick}
                    >
                        Start Work
                    </button>
                </div>
            </div>
            
            {/* Confirmation Modal Component */}
            <ConfirmationModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                message={`Are you sure you want to start work on ticket #${ticketData.id}?`}
                confirmText="Confirm Start"
            />
        </div>
    );
};

export default TicketModal_Pending;