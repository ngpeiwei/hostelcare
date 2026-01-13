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
import { supabase } from '../../supabaseClient';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => setShowDropdown((s) => !s);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('lastActivity');
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
        fetchComplaints(); // refresh list
    };

    const handleFeedbackSuccess = (feedbackData) => {
        console.log("Feedback data received:", feedbackData);
        if (!feedbackData || !feedbackData.complaintId) {
          console.error("Invalid feedbackData:", feedbackData);
          return;
        }
        setComplaints(currentComplaints => currentComplaints.map(c =>
            c.id === feedbackData.complaintId ? { ...c, feedback: feedbackData } : c));
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
        const status = c.status;
        
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

    const fetchComplaints = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
            .from('complaints')
            .select(`
                id,
                issue_title,
                category,
                sub_category,
                hostel,
                building_room_number,
                status,
                created_at,
                complaint_attachments (
                file_url,
                file_type
                ),
                feedback:feedback!feedback_complaint_id_fkey (
                id,
                overall_rating,
                timeliness_rating,
                effectiveness_rating,
                ease_of_use_rating,
                comment,
                created_at
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB → UI format
            const mapped = data.map(c => ({
                id: c.id,
                title: c.issue_title,
                category: c.category,
                subCategory: c.sub_category,
                hostel: c.hostel,
                buildingRoom: c.building_room_number,
                status: c.status.replace(/\s/g, '').toLowerCase(),
                dateCreated: c.created_at,
                attachments: c.complaint_attachments,
                feedback: c.feedback && c.feedback.length > 0
                    ? {
                        id: c.feedback[0].id,
                        overall_rating: c.feedback[0].overall_rating,
                        timeliness_rating: c.feedback[0].timeliness_rating,
                        effectiveness_rating: c.feedback[0].effectiveness_rating,
                        ease_of_use_rating: c.feedback[0].ease_of_use_rating,
                        comment: c.feedback[0].comment,
                        created_at: c.feedback[0].created_at,
                    }
                    : null,
            }));            
            setComplaints(mapped);

        } catch (err) {
            console.error('Failed to fetch complaints:', err);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const total = complaints.length;
    const newticket = complaints.filter(c => c.status === 'new').length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'inprogress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    
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

                    {complaints.length === 0 ? (
                        <p className="no-complaints-message">
                            You haven’t submitted any tickets yet.
                        </p>
                    ) : (
                        complaints.map((c) => (
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
                                        #{c.id.slice(0, 8).toUpperCase()}
                                    </div>
                                </div>
                                <div className="complaint-actions">
                                    <div className={`pill status-${c.status}`}>
                                        {c.status === 'inprogress'
                                            ? 'In Progress'
                                            : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                    </div>

                                    {renderActionButtons(c)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;