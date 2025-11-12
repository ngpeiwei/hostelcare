import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png'; // can replace this with your staff avatar
import complaintService from '../../modules/complaints/services/complaintService';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('Assigned Tickets');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadTickets();
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      let status;
      if (activeTab === 'Assigned Tickets') status = 'Assigned';
      else if (activeTab === 'Pending Tickets') status = 'Pending';
      else if (activeTab === 'Resolved Tickets') status = 'Resolved';
      else status = 'All';

      const response = await complaintService.getAllComplaints(status);
      if (response.data) setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateProgress = (ticketId) => {
    navigate(`/staff/ticket/${ticketId}/update`);
  };

  const handleViewDetails = (ticketId) => {
    navigate(`/staff/ticket/${ticketId}`);
  };

  const getStatusBadge = (status) => {
    if (status === 'Assigned') {
      return <span className="status-badge status-assigned">Assigned</span>;
    } else if (status === 'Pending') {
      return <span className="status-badge status-pending">Pending</span>;
    } else if (status === 'Resolved') {
      return <span className="status-badge status-resolved">Resolved</span>;
    }
    return null;
  };

  const renderActionButton = (ticket) => {
    if (ticket.status === 'Assigned') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-primary"
            onClick={() => handleUpdateProgress(ticket.id)}
          >
            Start Work
          </button>
        </>
      );
    } else if (ticket.status === 'Pending') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-primary"
            onClick={() => handleUpdateProgress(ticket.id)}
          >
            Update Progress
          </button>
        </>
      );
    } else if (ticket.status === 'Resolved') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-secondary"
            onClick={() => handleViewDetails(ticket.id)}
          >
            View Details
          </button>
        </>
      );
    }
    return null;
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/LoginStaff');
  };

  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === 'Pending').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;
  const assigned = tickets.filter((t) => t.status === 'Assigned').length;

  return (
    <div className="staff-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
          </div>
          <div className="header-title">
            <h2 className="main-title">Hostel Facilities Management System</h2>
            <p className="subtitle">Track and manage assigned maintenance tickets</p>
          </div>
        </div>
        <div className="header-right" ref={dropdownRef}>
          <div className="user-profile-container" onClick={handleDropdownToggle}>
            <img src={userImage} alt="Staff" className="user-profile" />
            <span className="dropdown-arrow">▼</span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Summary */}
      <div className="content-section">
        <h3 className="section-title">Dashboard</h3>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Assigned Tickets</div>
            <div className="stat-value">{assigned}</div>
            <div className="stat-badge">Assigned</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value orange">{pending}</div>
            <div className="stat-badge active">Active</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Resolved</div>
            <div className="stat-value green">{resolved}</div>
            <div className="stat-badge done">✓ Done</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`tab-button ${activeTab === 'Assigned Tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('Assigned Tickets')}
        >
          Assigned Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'Pending Tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('Pending Tickets')}
        >
          Pending Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'Resolved Tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('Resolved Tickets')}
        >
          Resolved Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'All Tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('All Tickets')}
        >
          All Tickets
        </button>
      </div>

      {/* Ticket List */}
      <div className="content-section">
        <h3 className="section-title">{activeTab}</h3>
        {loading ? (
          <div className="empty-state">
            <p className="empty-state-text">Loading...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No tickets found</p>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-info">
                  <div className="ticket-description">{ticket.description}</div>
                  <div className="ticket-id">#{ticket.id}</div>
                </div>
                <div className="ticket-actions">
                  {renderActionButton(ticket)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;