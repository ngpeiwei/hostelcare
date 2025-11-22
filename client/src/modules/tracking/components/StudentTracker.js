// client/pages/Student/StudentTracker.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logoImage from '../../../assets/logo.png';
import userImage from '../../../assets/admin.png';
import './StudentTracker.css';

// --- MOCK DATA ---
const fetchStudentTicketDetails = (id) => {
    // This is the source of truth for all student ticket data.
    const allStudentTickets = [
        {
            id: 'C005', title: 'Corridor Lamp spoil', status: 'New', dateCreated: '2025-07-12', 
            category: 'Shared', subCategory: 'Lamp', hostel: 'Desasiswa Tekun', 
            phone: '+60102355511', buildingRoom: 'L5-03-12', attachments: 'N/A', description: 'The corridor lamp is not turning on',
            progressHistory: [{ status: 'New', date: '2025-07-12 10:00 AM' }]
        },
        {
            id: 'C004', title: 'Mattress old and spoiled', status: 'Pending', dateCreated: '2025-07-14', 
            category: 'Individual', subCategory: 'Mattress', hostel: 'Desasiswa Tekun', 
            phone: '+60102355511', buildingRoom: 'L5-03-07', attachments: 'N/A', description: 'The mattress is very dirty and old',
            progressHistory: [{ status: 'New', date: '2025-07-14 09:00 AM' }, { status: 'Pending', date: '2025-07-14 11:00 AM' }]
        },
        {
            id: 'C003', title: 'Aircond not functioning', status: 'In Progress', dateCreated: '2025-07-10', 
            category: 'Individual', subCategory: 'Air Conditioner', hostel: 'Desasiswa Tekun', 
            phone: '+60102355511', buildingRoom: 'M04-09-12A', attachments: 'N/A', description: 'Aircon cannot turn on',
            progressHistory: [{ status: 'New', date: '2025-07-10 12:00 PM' }, { status: 'Pending', date: '2025-07-10 1:00 PM' }, { status: 'In Progress', date: '2025-07-11 09:00 AM' }]
        },
        // Resolved tickets don't typically use this page, but include them for full data consistency
        { id: 'C002', title: 'Washing machine is broken', status: 'Resolved', dateCreated: '2025-07-09', category: 'Shared', subCategory: 'Washing Machine', hostel: 'Desasiswa Tekun', phone: '+60102355511', buildingRoom: 'M04-09-12A', attachments: 'N/A', progressHistory: [{ status: 'New', date: '2025-07-09 09:00 AM' }, { status: 'Resolved', date: '2025-07-12 09:00 AM' }] },
        { id: 'C001', title: 'Drying rack wire is loose', status: 'Resolved', dateCreated: '2025-07-08', category: 'Shared', subCategory: 'Drying Rack', hostel: 'Desasiswa Tekun', phone: '+60102355511', buildingRoom: 'L5-03-03', attachments: 'N/A', progressHistory: [{ status: 'New', date: '2025-07-08 09:00 AM' }, { status: 'Resolved', date: '2025-07-10 09:00 AM' }] },
    ];
    return allStudentTickets.find(t => t.id === id);
};
// ------------------------------------------

// --- Reusable Header Component ---
const Header = ({ navigate }) => {
    return (
        <div className="tracker-page-header">
            {/* Header structure matching StudentDashboard */}
            <div className="header-left">
                <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                <div className="header-title">
                    <h2 className="main-title">Hostel Facilities Management System</h2>
                    <p className="subtitle">Track and manage your complaints</p>
                </div>
            </div>
            <div className="header-right">
                <img src={userImage} alt="User" className="user-profile" />
                {/* Simplified profile placeholder */}
            </div>
        </div>
    );
};

// --- Progress Bar (4 Statuses) ---
const ProgressBar = ({ history, currentStatus }) => {
    // 🔑 ADDED 'New' status
    const stages = ['New', 'Pending', 'In Progress', 'Resolved'];
    const currentStageIndex = stages.findIndex(s => s === currentStatus);
    
    const lastUpdate = history.length > 0 ? history[history.length - 1] : null;

    return (
        <div className="progress-container">
            <div className="progress-line progress-4-steps">
                {stages.map((stage, index) => (
                    <div key={stage} className={`progress-step ${index <= currentStageIndex ? 'completed' : ''}`}>
                        {/* Icons: Checkmark for previous, 'i' for current, letter for future */}
                        <div className="progress-dot">{index < currentStageIndex ? '✓' : (index === currentStageIndex ? 'i' : '')}</div>
                        <div className="progress-label">{stage}</div>
                    </div>
                ))}
            </div>
            {/* Displaying last update info */}
            {lastUpdate && (
                <div className="update-info-text">
                    Update: {lastUpdate.comment || `Status changed to ${lastUpdate.status} on ${lastUpdate.date}`}
                </div>
            )}
        </div>
    );
};

const StudentTracker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const data = fetchStudentTicketDetails(id);
        setTicket(data);
    }, [id]);

    if (!ticket) {
        return <div className="loading-state">Loading Complaint #{id}...</div>;
    }

    return (
        <div className="student-tracker-page">
            <Header navigate={navigate} />

            <div className="page-content-wrapper">
                {/* Back Button (Simplified, matching the Staff Update Page design logic) */}
                <button 
                    className="btn-back-dashboard" onClick={() => navigate('/student/dashboard')}>
                    ← Back to Dashboard
                </button>
                
                <h3 className="section-title-update">Tracking Complaint: #{ticket.id}</h3>

                {/* ONE unified block */}
                <div className="ticket-details-block">

                    {/* Progress Bar */}
                    <ProgressBar 
                        history={ticket.progressHistory} 
                        currentStatus={ticket.status} 
                    />

                    {/* Ticket Info */}
                    <div className="ticket-info-summary">
                        <div className="title-pill">{ticket.title}</div>

                        <div className="info-grid">
                            <p>Created: {ticket.dateCreated || 'N/A'}</p> 
                            <p>Category: {ticket.category || 'N/A'}</p>
                            <p>Sub-category: {ticket.subCategory || 'N/A'}</p>
                            <p>Phone Number: {ticket.phone || 'N/A'}</p>

                            <p>Hostel: {ticket.hostel || 'N/A'}</p>
                            <p>Building and Room Number: {ticket.buildingRoom || 'N/A'}</p>
                            <p>Attachments: {ticket.attachments || 'N/A'}</p>
                        </div>

                        {/* Description Box */}
                        <div className="comments-section">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={ticket.description || ''}
                                readOnly
                            ></textarea>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    );
};

export default StudentTracker;