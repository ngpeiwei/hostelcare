// Updated StaffUpdatePage.js
// client/pages/Maintenance Staff/StaffUpdatePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal';
import './StaffUpdatePage.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';

// --- Mock Data / Service Call Simulation ---
const fetchTicketDetails = (id) => {
    if (id === "00001") {
        return {
            id: id,
            title: "Toilet tap has been leaking for 2 days",
            name: "Alyssa Hamdan",
            dateCreated: "2025-11-10",
            category: "Shared",
            subCategory: "Sink",
            hostel: "Desasiswa Tekun",
            buildingRoom: "M06-06-20",
            phone: "+60102362610",
            attachments: "N/A",
            staff: "Nazrul Hakim",
            status: "In Progress",
            progressHistory: [
                { status: "Pending", date: "2025-11-10 08:30 AM" },
                { status: "In Progress", date: "2025-11-10 11:15 AM", comment: "Work started by staff." }
            ]
        };
    }

    if (id === "00002") {
        return {
            id: id,
            title: "Ceiling fan speed slow",
            name: "Amir bin Ahmad",
            dateCreated: "2025-07-11",
            category: "Individual",
            subCategory: "Ceiling Fan",
            hostel: "Desasiswa Tekun",
            buildingRoom: "L5-03-13",
            phone: "+60102355511",
            attachments: "N/A",
            staff: "N/A",
            status: "In Progress",
            progressHistory: [
                { status: "Pending", date: "2025-11-03 10:00 AM" },
                { status: "In Progress", date: "2025-11-03 1:40 PM", comment: "You have updated the ticket at 1:40 PM" }
            ]
        };
    }

    return null;
};
// ------------------------------------------

// --- Header Component ---
const Header = ({ navigate }) => {
    return (
        <div className="update-page-header">
            <div className="header-left">
                <div className="logo-container">
                    <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                </div>
                <div className="header-title">
                    <h2 className="main-title">Hostel Facilities Management System</h2>
                    <p className="subtitle">Track and manage assigned maintenance tickets</p>
                </div>
            </div>
            <div className="header-right">
                <img src={userImage} alt="Staff" className="user-profile" />
            </div>
        </div>
    );
};

const StaffUpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comment, setComment] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    // Success Modal state
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const data = fetchTicketDetails(id);
        setTicket(data);
    }, [id]);

    if (!ticket) {
        return <div className="loading-state">Loading Ticket #{id}...</div>;
    }

    // --- Button Handlers ---
    const handleSaveClick = () => {
        setConfirmAction('save');
        setIsConfirmOpen(true);
    };

    const handleResolveClick = () => {
        setConfirmAction('resolve');
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = () => {
        setIsConfirmOpen(false);

        if (confirmAction === 'resolve') {
            console.log(`Resolving Ticket ${id} with comment: ${comment}`);

            // TODO: API CALL → Mark as resolved

            // Show success modal
            setSuccessMessage(`Ticket #${id} has been resolved successfully!`);
            setIsSuccessOpen(true);
        }
        else if (confirmAction === 'save') {
            console.log(`Saving progress on Ticket ${id} with comment: ${comment}`);
            // TODO: API save progress
            alert(`Progress saved for Ticket #${id}.`);
        }
    };

    // After clicking OK on success modal
    const handleSuccessClose = () => {
        setIsSuccessOpen(false);

        // Redirect to Resolved Tickets tab
        navigate('/staff/dashboard?tab=resolved');
    };

    // --- Progress Bar ---
    const ProgressBar = ({ history, currentStatus }) => {
        const stages = ['Pending', 'In Progress', 'Resolved'];
        const currentStageIndex = stages.findIndex(s => s === currentStatus);
        
        return (
            <div className="progress-container">
                <div className="progress-line">
                    {stages.map((stage, index) => (
                        <div key={stage} className={`progress-step ${index <= currentStageIndex ? 'completed' : ''}`}>
                            <div className="progress-dot">{index < currentStageIndex ? '✓' : (index === currentStageIndex ? 'i' : stage.charAt(0))}</div>
                            <div className="progress-label">{stage}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- Update Info ---
    const UpdateInfo = ({ history }) => {
        const lastUpdate = history.length > 0 ? history[history.length - 1] : null;
        if (!lastUpdate) return null;
        
        return (
            <div className="update-info-text">
                Update: {lastUpdate.comment || `You have updated the ticket at ${new Date(lastUpdate.date).toLocaleTimeString()}`}
            </div>
        );
    };

    return (
        <div className="staff-update-page">
            <Header navigate={navigate} />

            <div className="page-content-wrapper">
                <button className="btn-back-dashboard" onClick={() => navigate('/staff/dashboard')}>
                    ← Back to Dashboard
                </button>
                
                <h3 className="section-title-update">Ticket Status: In Progress</h3>
                
                <ProgressBar history={ticket.progressHistory} currentStatus={ticket.status} />
                                             
                <div className="ticket-details-block">
                    <div className="ticket-info-summary">
                        <div className="title-pill">{ticket.title}</div>
                        
                        <div className="info-grid">
                            <p>Name: {ticket.name || 'N/A'}</p>
                            <p>Created: {ticket.dateCreated || 'N/A'}</p>
                            <p>Category: {ticket.category || 'N/A'}</p>
                            <p>Sub-category: {ticket.subCategory || 'N/A'}</p>
                            <p>Phone Number: {ticket.phone || 'N/A'}</p>

                            <p>Hostel: {ticket.hostel || 'N/A'}</p>
                            <p>Building and Room Number: {ticket.buildingRoom || 'N/A'}</p>
                            <p>Attachments: {ticket.attachments || 'N/A'}</p>
                            <p>Staff: {ticket.staff || 'N/A'}</p>
                        </div>
                    </div>

                    <UpdateInfo history={ticket.progressHistory} />
                    
                    <div className="comments-section">
                        <label htmlFor="comments">No Comments</label>
                        <textarea 
                            id="comments"
                            placeholder="Add notes or update details here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="action-footer">
                        <button className="btn-save-progress" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn-resolve-ticket" onClick={handleResolveClick}>
                            Resolve Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                message={
                    confirmAction === 'resolve'
                        ? `Are you sure you want to update the ticket #${ticket.id} - Resolved?`
                        : `Are you sure you want to save the current progress for ticket #${ticket.id}?`
                }
                confirmText={confirmAction === 'resolve' ? "Confirm Resolve" : "Confirm Save"}
            />

            {/* Success Modal */}
            <SuccessMessageModal
                open={isSuccessOpen}
                onClose={handleSuccessClose}
                message={successMessage}
            />
        </div>
    );
};

export default StaffUpdatePage;