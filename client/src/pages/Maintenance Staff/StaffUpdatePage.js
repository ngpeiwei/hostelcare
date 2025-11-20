// client/pages/Maintenance Staff/StaffUpdatePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import './StaffUpdatePage.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';

// --- Mock Data / Service Call Simulation ---
const fetchTicketDetails = (id) => {
    // Simulating fetching a ticket that is 'In Progress'
    return {
        id: id,
        title: "Ceiling fan speed slow",
        dateFiled: '2025-11-03',
        status: 'In Progress', // Current status
        location: 'Desasiswa Saujana, M04',
        progressHistory: [
            { status: 'Pending', date: '2025-11-03 10:00 AM' },
            { status: 'In Progress', date: '2025-11-03 1:40 PM', comment: 'You have updated the ticket at 1:40 PM' },
        ],
    };
};
// ------------------------------------------

// --- Reusable Header Component (Matching StaffDashboard structure) ---
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

    useEffect(() => {
        const data = fetchTicketDetails(id);
        setTicket(data);
    }, [id]);

    if (!ticket) {
        return <div className="loading-state">Loading Ticket #{id}...</div>;
    }

    // Handlers for Save and Resolve
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
            // TODO: Send API request to update status to 'Resolved'
            navigate('/staff/dashboard', { state: { successMessage: `Ticket #${id} resolved!` } });
        } else if (confirmAction === 'save') {
            console.log(`Saving progress on Ticket ${id} with comment: ${comment}`);
            // TODO: Send API request to save comment/progress history without changing status
            // Show a temporary success message (optional)
            alert(`Progress saved for Ticket #${id}.`); 
        }
    };

    // --- Progress Bar Component ---
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

    // --- Update Info Component ---
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
                
                {/* 1. & 2. Back Button using the size container of Resolve Ticket */}
                <button 
                    className="btn-back-dashboard" // 🔑 NEW CLASS for styling
                    onClick={() => navigate('/staff/dashboard')}
                >
                    {/* 🔑 Arrow Icon: Assumes Font Awesome is linked globally */}
                    <i className="fa-sharp fa-solid fa-angle-left"></i>
                    <span>Back to Dashboard</span>
                </button>
                
                <h3 className="section-title-update">Ticket Status: In Progress</h3>
                
                <ProgressBar history={ticket.progressHistory} currentStatus={ticket.status} />
                
                {/* 3. Update Text is moved HERE, BELOW the ticket info summary */}
                
                <div className="ticket-details-block">
                    <div className="ticket-info-summary">
                        <div className="title-pill">{ticket.title}</div>
                        
                        <div className="info-grid">
                            <p>Filed: {ticket.dateFiled}</p>
                            <p>Hostel: {ticket.location}</p>
                            <p>Category: Individual</p>
                            <p>Attachment: N/A</p>
                            <p>Sub-category: Ceiling Fan</p>
                            <p>Staff: N/A</p>
                        </div>
                    </div>
                    
                    {/* 3. Update text placed here */}
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
        </div>
    );
};

export default StaffUpdatePage;