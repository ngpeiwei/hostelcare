import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import userImg from '../../assets/user.jpg';
import './Dashboard.css';
import ComplaintModal from '../../modules/complaints/components/ComplaintModal';

const sampleComplaints = [
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

export default function Dashboard() {
	const [complaints, setComplaints] = useState([]);
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// try to read logged-in user's name from localStorage (inferred key: 'user' or 'userName')
	const userName = (() => {
		try {
			const u = JSON.parse(localStorage.getItem('user'));
			if (u && (u.name || u.fullName || u.displayName)) return u.name || u.fullName || u.displayName;
		} catch (e) {
			// ignore parse errors
		}
		return localStorage.getItem('userName') || 'Student';
	})();

	useEffect(() => {
		// TODO: replace with real API call (complaintService.getByUser or similar)
		setComplaints(sampleComplaints);
	}, []);

	const total = complaints.length;
	const resolved = complaints.filter((c) => c.status === 'Resolved').length;
	const pending = complaints.filter((c) => c.status === 'Pending').length;

	return (
		<div className={`student-dashboard container ${isModalOpen ? 'blurred' : ''}`}>
			<div className="dashboard-topbar">
				<div className="topbar-left">
					<img src={logo} alt="HostelCare" className="topbar-logo" />
					<div className="topbar-title">
						<div className="app-name">Hostel Facilities Management System</div>
						<div className="app-sub">Track and manage your complaints</div>
					</div>
				</div>
				<div className="topbar-right">
					{/* show logged-in user's name to the left of the user avatar */}
					<div className="login-name">{userName}</div>
					<div className="user-wrap">
						<button
							className="user-avatar"
							onClick={() => setMenuOpen((s) => !s)}
							aria-haspopup="true"
							aria-expanded={menuOpen}
							type="button"
						>
							{/* user photo from assets */}
							<img src={userImg} alt="User avatar" className="avatar-image" />
							<span className="avatar-caret" aria-hidden>▾</span>
						</button>
						{menuOpen && (
							<div className="user-menu">
								<button className="menu-item" onClick={() => { localStorage.removeItem('token'); navigate('/auth/login'); }}>Logout</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<h2 className="page-title">Dashboard</h2>

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

			<div className="cta-banner">
				<div className="cta-text">
					<h3>Have an Issue to Report?</h3>
					<p>Help make your hostel better by reporting issues</p>
				</div>
				<button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Submit A Ticket</button>
			</div>

			<ComplaintModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

			<h3 className="section-title">Your Complaints</h3>

			<div className="complaint-list">
				{complaints.map((c) => (
					<div key={c.id} className="complaint-card">
						<div className="complaint-main">
							<div className="complaint-title">{c.title}</div>
							<div className="complaint-id">#{c.id}</div>
						</div>
						<div className="complaint-actions">
							<div className={`pill status-${c.status.toLowerCase()}`}>{c.status}</div>
							<button className="btn btn-ghost">View Details</button>
							<button className="btn btn-primary outline">Track Progress</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
