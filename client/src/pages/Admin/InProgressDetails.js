import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import InProgressSuccess from './InProgressSuccess';
import './InProgressDetails.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png'; 

// When true, actions (Resolve/Save/Reopen) only change local state for UI preview
const LOCAL_PREVIEW = true;

const fetchTicketDetails = (id) => {
    if (id === "00015") {
        return {
            id: '00015',
            title: 'Aircond not functioning',
            description: 'Aircond not functioning',
            status: 'In Progress',
            dateCreated: '2025-07-10',
            name: 'Ahmad bin Ali',
            email: 'ahmad@student.usm.my',
            category: 'Individual',
            subCategory: 'Air Conditioner',
            hostel: 'Desasiswa Tekun',
            phoneNo: '+60102355511',
            floorAndRoom: 'M04-09-12A',
            attachments: [],
            staffInCharge: 'Nazrul Hakim',
            actionsToBeTaken: 'Replaced aircond unit',
            estimatedServiceDate: '2025-07-12',
            feedback: 'Fixed successfully',
            progressHistory: [
                { status: 'Pending', date: '2025-07-10 09:00 AM' },
                { status: 'In Progress', date: '2025-07-10 11:00 AM', comment: 'Assigned to Nazrul Hakim' }
            ]
        };
    }
    return null;
};
// ------------------------------------------

// --- Header Component ---
const Header = () => {
    return (
        <div className="update-page-header">
            <div className="header-left">
                <div className="logo-container">
                    <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                </div>
                <div className="header-title">
                    <h2 className="main-title">Hostel Facilities Management System</h2>
                    <p className="subtitle">Track and manage your complaints</p>
                </div>
            </div>
            <div className="header-right">
                <img src={userImage} alt="Admin" className="user-profile" /> 
            </div>
        </div>
    );
};

const InProgressDetails = () => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comment, setComment] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const data = fetchTicketDetails(id);
        setTicket(data);
    }, [id]);

    useEffect(() => {
        if (!ticket) return;
        const latest = ticket.progressHistory && ticket.progressHistory.length ? ticket.progressHistory[ticket.progressHistory.length - 1].comment : '';
        setComment(latest || '');
    }, [ticket]);

    if (!ticket) {
        return <div className="loading-state">Loading Ticket #{id}...</div>;
    }
    
    // Get the latest comment for display
    const safeHistory = ticket.progressHistory || [];
    const latestComment = safeHistory.length ? safeHistory[safeHistory.length - 1].comment || '' : '';

    // Handlers for Save and Resolve (admin can update comments)
    const handleSaveClick = () => {
        setConfirmAction('save');
        setIsConfirmOpen(true);
    };

    const handleResolveClick = () => {
        setConfirmAction('resolve');
        setIsConfirmOpen(true);
    };

    const handleReopenClick = () => {
        setConfirmAction('reopen');
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = () => {
        setIsConfirmOpen(false);

        const timestamp = new Date().toLocaleString();

        let finalStatus = ticket.status || 'In Progress';
        if (confirmAction === 'resolve') {
            if (LOCAL_PREVIEW) {
                // keep existing status for preview
                finalStatus = ticket.status || 'In Progress';
            } else {
                finalStatus = 'Resolved';
            }
        } else if (confirmAction === 'reopen') {
            finalStatus = 'In Progress';
        }

        const newEntry = {
            status: finalStatus,
            date: timestamp,
            comment: comment
        };

        const updatedHistory = [ ...(ticket.progressHistory || []), newEntry ];

        // Update local state only — no backend interaction from this view
        setTicket({ ...ticket, progressHistory: updatedHistory, status: finalStatus });

        // Show a success modal with an appropriate message (indicate Preview when active)
        if (confirmAction === 'resolve') {
            setSuccessMessage(LOCAL_PREVIEW ? `This ticket has been resolved successfully!` : `Ticket #${ticket.id} has been updated.`);
            setSuccessOpen(true);
        } else {
            setSuccessMessage(LOCAL_PREVIEW ? 'Your current progress was saved successfully!' : 'Your current progress for this ticket was saved successfully!');
            setSuccessOpen(true);
        }
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        setConfirmAction(null);
    };

    // --- Progress Bar (3 Statuses) ---
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
        const safeHistory = history || [];
        const lastUpdate = safeHistory.length > 0 ? safeHistory[safeHistory.length - 1] : null;
        if (!lastUpdate) return null;
        
        return (
            <div className="update-info-text">
                Update: {lastUpdate.comment || `You have updated the ticket at ${new Date(lastUpdate.date).toLocaleTimeString()}`}
            </div>
        );
    };

    return (
        <div className="admin-update-page"> 
            <Header />

            <div className="page-content-wrapper">
                <button 
                    className="btn-back-dashboard" 
                    onClick={() => navigate('/admin/dashboard')} // <--- Navigate to Admin Dashboard
                >
                    ← Back to Dashboard
                </button>
                
                <h3 className="section-title-update">Ticket Status: {ticket.status}</h3>
                
                <ProgressBar history={ticket.progressHistory} currentStatus={ticket.status} />
                
                <div className="ticket-details-block">
                    <div className="ticket-info-summary">
                        <div className="title-pill">{ticket.title}</div>
                        
                        <div className="info-grid">
                            <p>Name: {ticket.name || 'N/A'}</p>
                            <p>Created: {ticket.dateCreated || 'N/A'}</p>
                            <p>Category: {ticket.category || 'N/A'}</p>
                            <p>Sub-category: {ticket.subCategory || 'N/A'}</p>
                            <p>Phone Number: {ticket.phoneNo || 'N/A'}</p>

                            <p>Hostel: {ticket.hostel || 'N/A'}</p>
                            <p>Building and Room Number: {ticket.floorAndRoom || ticket.buildingAndRoom || ticket.buildingRoom || 'N/A'}</p>
                            <p>Attachments: {Array.isArray(ticket.attachments) ? (ticket.attachments.length ? ticket.attachments.join(', ') : 'N/A') : (ticket.attachments || 'N/A')}</p>
                            <p>Staff: {ticket.staff || ticket.staffInCharge || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <UpdateInfo history={ticket.progressHistory} />
                    
                    <div className="comments-section">
                        <label htmlFor="comments">Staff Progress Comments</label>
                        <textarea 
                            id="comments"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add notes or update details here..."
                        ></textarea>
                    </div>

                    <div className="action-footer">
                        <button className="btn-save-progress" onClick={handleSaveClick}>
                            Save
                        </button>
                        {ticket.status === 'Resolved' ? (
                            <button className="btn-reopen-ticket" onClick={handleReopenClick}>
                                Reopen Ticket
                            </button>
                        ) : (
                            <button className="btn-resolve-ticket" onClick={handleResolveClick}>
                                Resolve Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation modal shown when Save/Resolve clicked */}
            <ConfirmationModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                message={confirmAction === 'resolve' 
                    ? 'Are you sure you want to mark this ticket as Resolved?' 
                    : 'Save current progress for this ticket?'
                }
                confirmText={confirmAction === 'resolve' ? 'Resolve' : 'Save'}
            />

            {/* Success modal shown after update completes */}
            <InProgressSuccess open={successOpen} onClose={handleSuccessClose} message={successMessage} />
        </div>
    );
};

export default InProgressDetails;