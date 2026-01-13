// client/pages/Student/StudentTracker.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import logoImage from '../../../assets/logo.png';
import userImage from '../../../assets/admin.png';
import './StudentTracker.css';

// --- Header Component ---
const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <div className="tracker-page-header">
            <div className="header-left">
                <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                <div className="header-title">
                    <h2 className="main-title">Hostel Facilities Management System</h2>
                    <p className="subtitle">Track and manage your complaints</p>
                </div>
            </div>
            <div className="header-right">
                <img src={userImage} alt="User" className="user-profile" />
                <span
                    className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    ▼
                </span>
            </div>
        </div>
    );
};

// --- Progress Bar ---
const ProgressBar = ({ history, currentStatus }) => {
    const stages = ['New', 'Pending', 'In Progress', 'Resolved'];
    const currentStageIndex = stages.indexOf(currentStatus);

    return (
        <div className="progress-container">
            <div className="progress-line progress-4-steps">
                {stages.map((stage, index) => (
                    <div
                        key={stage}
                        className={`progress-step ${index <= currentStageIndex ? 'completed' : ''}`}
                    >
                        <div className="progress-dot">
                            {index < currentStageIndex ? '✓' : index === currentStageIndex ? 'i' : ''}
                        </div>
                        <div className="progress-label">{stage}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StudentTracker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: complaint, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(error);
                return;
            }

            const { data: logs } = await supabase
                .from('ticket_status_logs')
                .select('*')
                .eq('complaint_id', id)
                .order('created_at', { ascending: true });

            setTicket(complaint);
            setHistory(logs || []);
        };

        fetchData();
    }, [id]);

    if (!ticket) return <div className="loading-state">Loading Complaint...</div>;

    return (
        <div className="student-tracker-page">
            <Header />

            <div className="page-content-wrapper">
                <button className="btn-back-dashboard" onClick={() => navigate('/student/dashboard')}>
                    ← Back to Dashboard
                </button>

                <h3 className="section-title-update">Tracking Complaint: #{ticket.id}</h3>

                <div className="ticket-details-block">
                    <ProgressBar history={history} currentStatus={ticket.status} />

                    <div className="ticket-info-summary">
                        <div className="title-pill">{ticket.issue_title}</div>

                        <div className="info-grid">
                            <p>Created: {ticket.created_at?.split('T')[0]}</p>
                            <p>Category: {ticket.category}</p>
                            <p>Sub-category: {ticket.sub_category}</p>
                            <p>Hostel: {ticket.hostel}</p>
                            <p>Room: {ticket.building_room_number}</p>
                        </div>

                        <div className="comments-section">
                            <label>Description</label>
                            <textarea value={ticket.description || ''} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTracker;