import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/user.jpg';
import './StudentDashboard.css';
import ComplaintModal from '../../modules/complaints/components/ComplaintForm';
import ComplaintSuccessModal from '../../modules/complaints/components/ComplaintSuccess';
import FeedbackModal from '../../modules/feedback/components/FeedbackForm'; 
import SuccessModal from '../../modules/feedback/components/FeedbackSuccess';
import ViewFeedbackModal from '../../modules/feedback/components/ViewFeedback';
import StudentDetailsModal from '../../modules/tracking/components/StudentDetailsModal';
import StudentTracker from '../../modules/tracking/components/StudentTracker';

const sampleComplaints = [
    {
        id: 'C005',
        title: 'Corridor Lamp spoil',
        status: 'New',
        feedback: null,
        dateCreated: '2025-07-12', category: 'Shared', subCategory: 'Lamp', hostel: 'Desasiswa Tekun',
        phone: '+60102355511', buildingRoom: 'L5-03-12', attachments: 'N/A', name: 'Student A',
    },
    {
        id: 'C004',
        title: 'Mattress old and spoiled',
        status: 'Pending',
        feedback: null,
        dateCreated: '2025-07-14', category: 'Individual', subCategory: 'Mattress', hostel: 'Desasiswa Tekun',
        phone: '+60102355511', buildingRoom: 'L5-03-07', attachments: 'N/A', name: 'Student B',
    },
    {
        id: 'C003',
        title: 'Aircond not functioning',
        status: 'InProgress',
        feedback: null,
        dateCreated: '2025-07-10', category: 'Individual', subCategory: 'Air Conditioner', hostel: 'Desasiswa Tekun',
        phone: '+60102355511', buildingRoom: 'M04-09-12A', attachments: 'N/A', name: 'Student C',
    },
    {
        id: 'C002',
        title: 'Washing machine is broken',
        status: 'Resolved',
        feedback: null,
        dateCreated: '2025-07-09', category: 'Shared', subCategory: 'Washing Machine', hostel: 'Desasiswa Tekun',
        phone: '+60102355511', buildingRoom: 'M04-09-12A', attachments: 'N/A', name: 'Student D',
    },
    {
        id: 'C001',
        title: 'Drying rack wire is loose',
        status: 'Resolved',
        feedback: null,
        dateCreated: '2025-07-08', category: 'Shared', subCategory: 'Drying Rack', hostel: 'Desasiswa Tekun',
        phone: '+60102355511', buildingRoom: 'L5-03-03', attachments: 'N/A', name: 'Student E',
    },
];


const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => setShowDropdown((s) => !s);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    };

    const [isComplaintOpen, setIsComplaintOpen] = useState(false);
    const [isComplaintSuccessOpen, setIsComplaintSuccessOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [viewingFeedback, setViewingFeedback] = useState(null);
    const [viewingDetails, setViewingDetails] = useState(null);

    const handleComplaintSuccess = () => {
        setIsComplaintOpen(false); 
        setIsComplaintSuccessOpen(true); 
    };

    const handleFeedbackSuccess = (feedbackData) => {setComplaints(currentComplaints => currentComplaints.map(c =>
            c.id === feedbackData.complaintId ? { ...c, feedback: feedbackData }  : c));
        setIsFeedbackOpen(null); 
        setIsSuccessOpen(true);   
    };

    const handleTrackProgress = (complaintId) => {
        navigate(`/student/complaint/${complaintId}/track`);
    };

    const handleViewDetails = (complaint) => {
        setViewingDetails(complaint);
    };

    // HANDLER: Close the details modal
    const handleCloseDetailsModal = () => {
        setViewingDetails(null);
    };

    const renderActionButtons = (c) => {
        const status = c.status.toLowerCase();
        
        if (status === 'resolved') {
            return (
                <>
                    {/* 1. View Details Button (opens modal) */}
                    <button 
                        className="btn btn-viewDetails"
                        onClick={() => handleViewDetails(c)} 
                    >
                        View Details
                    </button>

                    {/* 2. Feedback Button */}
                    {c.feedback ? (
                        <button 
                            className="btn btn-view-feedback"
                            onClick={() => setViewingFeedback(c.feedback)}
                        >
                            View Feedback
                        </button>
                    ) : (
                        <button 
                            className="btn btn-feedback" 
                            onClick={() => setIsFeedbackOpen(c.id)}
                        >
                            Give Feedback
                        </button>
                    )}
                </>
            );
        } else if (status === 'new' || status === 'pending' || status === 'inprogress') {
            // Track Progress button for all non-resolved statuses (redirects to page)
            return (
                <button 
                    className="btn btn-trackProgress"
                    onClick={() => handleTrackProgress(c.id)}
                >
                    Track Progress
                </button>

            );
        }
        return null;
    };

    useEffect(() => {setComplaints(sampleComplaints);}, []);

    const total = complaints.length;
    const newticket = complaints.filter((c) => c.status === 'New').length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'InProgress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;

    return (
        <div className={`student-dashboard`}>
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                    <div className="header-title">
                        <h2 className="main-title">Hostel Facilities Management System</h2>
                        <p className="subtitle">Track and manage your complaints</p>
                    </div>
                </div>
                <div className="header-right" ref={dropdownRef}>
                    <div className="user-profile-container" onClick={handleDropdownToggle}>
                        <img src={userImage} alt="User" className="user-profile" />
                        <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate('/student/StudentProfile')}>
                                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Profile
                            </button>
                            <button className="dropdown-item" onClick={handleLogout}>
                                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="content-section">
                <h3 className="section-title">Dashboard</h3>
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total Complaints Filed</div>
                        <div className="stat-value">{total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">New</div>
                        <div className="stat-value blue">{newticket}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value yellow">{pending}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">In Progress</div>
                        <div className="stat-value orange">{inProgress}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Resolved</div>
                        <div className="stat-value green">{resolved}</div>
                    </div>
                </div>

                <div className="cta-banner">
                    <div className="cta-text">
                        <h3>Have an Issue to Report?</h3>
                        <p>Help make your hostel better by reporting issues</p>
                    </div>
                    <button className="btn btn-submitTicket" onClick={() => setIsComplaintOpen(true)}> + Submit A Ticket</button>
                </div>
                    
                <ComplaintModal 
                    open={isComplaintOpen} 
                    onClose={() => setIsComplaintOpen(false)} 
                    onSubmitSuccess={handleComplaintSuccess} 
                />

                <ComplaintSuccessModal open={isComplaintSuccessOpen} onClose={() => setIsComplaintSuccessOpen(false)} />
                    
                <FeedbackModal 
                    open={!!isFeedbackOpen} 
                    onClose={() => setIsFeedbackOpen(null)} 
                    complaintId={isFeedbackOpen}
                    onSubmitSuccess={handleFeedbackSuccess} 
                />
                <SuccessModal open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />

                <ViewFeedbackModal 
                    open={!!viewingFeedback} 
                    feedback={viewingFeedback}
                    onClose={() => setViewingFeedback(null)} 
                />

                <StudentDetailsModal
                    open={!!viewingDetails}
                    onClose={handleCloseDetailsModal}
                    complaintData={viewingDetails}
                />

                <div className="complaint-list">
                    <h3 className="section-title">Your Complaints</h3>
                    {complaints.map((c) => (
                        <div key={c.id} className="complaint-card">
                            <div className="complaint-main">
                                <div className="complaint-title">{c.title}</div>
                                <div className="complaint-id">
                                    <svg
                                        className="complaint-id-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    #{c.id}
                                </div>
                            </div>
                            <div className="complaint-actions">
                                <div className={`pill status-${c.status.toLowerCase()}`}>
                                {c.status === 'InProgress' ? 'In Progress' : c.status}</div>
                                {c.status.toLowerCase() === 'resolved' && (
                                    <button 
                                        className="btn btn-viewDetails"
                                        onClick={() => handleViewDetails(c)}
                                    >
                                        View Details
                                    </button>
                                )}
                                
                                {c.status.toLowerCase() === 'resolved' ? (
                                    c.feedback ? (

                                        <button 
                                            className="btn btn-view-feedback"
                                            onClick={() => setViewingFeedback(c.feedback)}
                                        >
                                            View Feedback
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-feedback" 
                                            onClick={() => setIsFeedbackOpen(c.id)}
                                        >
                                            Give Feedback
                                        </button>
                                    )
                                ) : (
                                    <button 
                                        className="btn btn-trackProgress"
                                        onClick={() => handleTrackProgress(c.id)}
                                    >
                                        Track Progress
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;