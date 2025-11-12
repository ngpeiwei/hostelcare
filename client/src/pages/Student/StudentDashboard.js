import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/user.jpg';
import './StudentDashboard.css';
import ComplaintModal from '../../modules/complaints/components/ComplaintForm';
import FeedbackModal from '../../modules/feedback/components/FeedbackForm'; 

const sampleComplaints = [
	{
		id: 'C003',
		title: 'Mirror Broken',
		status: 'Resolved',
	},
	{
		id: 'C002',
		title: 'Table lamp is not working',
		status: 'Pending',
	},
	{
		id: 'C001',
		title: 'Toilet basin tap leaking',
		status: 'Pending',
	},
];


const StudentDashboard = () => {
	const [complaints, setComplaints] = useState([]);
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const [showDropdown, setShowDropdown] = useState(false);

	const handleDropdownToggle = () => setShowDropdown((s) => !s);

	const handleLogout = () => {
		// Clear any stored authentication tokens (if used)
		localStorage.removeItem('token');
		// Navigate to the student login route defined in App.js
		navigate('/auth/login');
	};

	const [isComplaintOpen, setIsComplaintOpen] = useState(false);
	const [isFeedbackOpen, setIsFeedbackOpen] = useState(null);

	useEffect(() => {
		// TODO: replace with real API call (complaintService.getByUser)
		setComplaints(sampleComplaints);
	}, []);

	const total = complaints.length;
	const resolved = complaints.filter((c) => c.status === 'Resolved').length;
	const pending = complaints.filter((c) => c.status === 'Pending').length;

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
						{/* <span className="user-name">{userName}</span> */}
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

			{/* Content Section */}
			<div className="content-section">
				{/* Dashboard */}
				<h3 className="section-title">Dashboard</h3>
				<div className="stats-row">
					<div className="stat-card">
						<div className="stat-label">Complaints Filed</div>
						<div className="stat-value">{total}</div>
						<div className="stat-badge">Total</div>
					</div>

					<div className="stat-card">
						<div className="stat-label">Resolved</div>
						<div className="stat-value green">{resolved}</div>
						<div className="stat-badge done">✓ Done</div>
					</div>

					<div className="stat-card">
						<div className="stat-label">Pending</div>
						<div className="stat-value orange">{pending}</div>
						<div className="stat-badge active">Active</div>
					</div>
				</div>

				{/* Submit Ticket Banner */}
				<div className="cta-banner">
					<div className="cta-text">
						<h3>Have an Issue to Report?</h3>
						<p>Help make your hostel better by reporting issues</p>
					</div>
					<button className="btn btn-submitTicket" onClick={() => setIsComplaintOpen(true)}> + Submit A Ticket</button>
				</div>
					
				{/* Modal */}
				<ComplaintModal open={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
				<FeedbackModal open={!!isFeedbackOpen} onClose={() => setIsFeedbackOpen(null)}
             		complaintId={isFeedbackOpen}/>

				{/* Complaint List */}
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
								<div className={`pill status-${c.status.toLowerCase()}`}>{c.status}</div>
								<button className="btn btn-viewDetails">View Details</button>
								{c.status.toLowerCase() === 'resolved'? (
									<button className="btn btn-feedback" onClick={() => setIsFeedbackOpen(c.id)}> Give Feedback</button>
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