import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/user.jpg';
import './StudentDashboard.css';
import ComplaintModal from '../../modules/complaints/components/ComplaintForm';
import FeedbackModal from '../../modules/feedback/components/FeedbackForm'; 
import SuccessModal from '../../modules/feedback/components/FeedbackSuccess';

const sampleComplaints = [
    {
        id: 'C005',
        title: 'Basin tap leaking',
        status: 'New',
        feedback: null,
    },
    {
        id: 'C004',
        title: 'Ceiling fan not functioning',
        status: 'Pending',
        feedback: null,
    },
	{
        id: 'C003',
        title: 'Mirror Broken',
        status: 'InProgress',
        feedback: null,
    },
    {
        id: 'C002',
        title: 'Table lamp is not working',
        status: 'Resolved',
        feedback: null,
    },
    {
        id: 'C001',
        title: 'Toilet basin tap leaking',
        status: 'Resolved',
        feedback: null,
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
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [viewingFeedback, setViewingFeedback] = useState(null);

    const handleFeedbackSuccess = (feedbackData) => {setComplaints(currentComplaints => currentComplaints.map(c =>
            c.id === feedbackData.complaintId ? { ...c, feedback: feedbackData }  : c));
        setIsFeedbackOpen(null); 
        setIsSuccessOpen(true);   
    };

    useEffect(() => {setComplaints(sampleComplaints);}, []);

    const total = complaints.length;
    const newticket = complaints.filter((c) => c.status === 'New').length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;

    return (
        <div className={`student-dashboard`}>
            {/* Header (No changes here) */}
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
                    
                <ComplaintModal open={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
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
                                    <button className="btn btn-viewDetails">View Details</button>
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
                                    <button className="btn btn-trackProgress">Track Progress</button>
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

const DisplayStarRating = ({ rating }) => {
    return (
        <div className="star-rating read-only">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={ratingValue}
                        className={`star-button ${ratingValue <= rating ? 'filled' : ''}`}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

const ViewFeedbackModal = ({ open, feedback, onClose }) => {
    if (!open || !feedback) return null;

    return (
        <div className="fb-modal-overlay">
            <div className="fb-modal-content feedback-modal view-feedback">
                <button className="fb-modal-close-btn" onClick={onClose} aria-label="Close modal">
                    &times;
                </button>
                
                <h2 className="fb-modal-title">Your Feedback</h2>
                
                <div className="feedback-form">
                    <div className="form-group">
                        <label>Your satisfaction with the service:</label>
                        <DisplayStarRating rating={feedback.satisfaction} />
                    </div>
                    <div className="form-group">
                        <label>Staff professionalism and communication:</label>
                        <DisplayStarRating rating={feedback.professionalism} />
                    </div>
                    <div className="form-group">
                        <label>Effectiveness of the resolution:</label>
                        <DisplayStarRating rating={feedback.effectiveness} />
                    </div>
                    <div className="form-group">
                        <label>Ease of using the HostelCare system:</label>
                        <DisplayStarRating rating={feedback.easeOfUse} />
                    </div>
                    
                    {feedback.comments && (
                        <div className="form-group">
                            <label>Additional comments:</label>
                            <p className="feedback-comments-display">
                                {feedback.comments}
                            </p>
                            
                        </div>
                    )}

                    <div className="feedback-form-actions">
                        <button type="button" className="btn btn-submit" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};