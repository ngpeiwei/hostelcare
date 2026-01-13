import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewTicket.css';
import { supabase } from '../../supabaseClient';
import userImage from '../../assets/admin.png';
import logoImage from '../../assets/logo.png';

const ViewTicket = () => {
  const [activeTab, setActiveTab] = useState('New');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
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
      setError(null);
      
      console.log('🔍 Loading tickets for tab:', activeTab);
      
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by status based on active tab
      if (activeTab !== 'All Tickets') {
        console.log('🔎 Filtering by status:', activeTab);
        query = query.eq('status', activeTab);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Map Supabase column names to your UI expectations
      const mappedTickets = data.map(ticket => ({
        id: ticket.id,
        description: ticket.issue_title || ticket.description || 'No description available',
        status: ticket.status,
        staffInCharge: ticket.staff_in_charge || ticket.staffInCharge || null,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        category: ticket.category,
        location: ticket.location,
        priority: ticket.priority,
        userId: ticket.user_id
      }));

      setTickets(mappedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenTicket = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleAssignStaff = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleViewProgress = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleViewFeedback = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const getStatusBadge = (status) => {
    if (status === 'Open' || status === 'New') {
      return <span className="status-badge status-open">New</span>;
    } else if (status === 'Pending') {
      return <span className="status-badge status-pending">Pending</span>;
    } else if (status === 'In Progress') {
      return <span className="status-badge status-inprogress">In Progress</span>;
    } else if (status === 'Resolved') {
      return <span className="status-badge status-resolved">Resolved</span>;
    }
    return null;
  };

  const renderActionButton = (ticket) => {
    if (ticket.status === 'Open' || ticket.status === 'New') {
      return (
        <>
          <button
            className="action-button button-secondary"
            onClick={() => handleOpenTicket(ticket.id)}
          >
            Open
          </button>
          <button
            className="action-button button-primary"
            onClick={() => handleAssignStaff(ticket.id)}
          >
            Assign Staff
          </button>
        </>
      );
    } else if (ticket.status === 'Pending') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-primary"
            onClick={() => handleViewProgress(ticket.id)}
          >
            {ticket.staffInCharge ? 'View Progress' : 'View Details'}
          </button>
        </>
      );
    } else if (ticket.status === 'In Progress') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-primary"
            onClick={() => handleViewProgress(ticket.id)}
          >
            View Progress
          </button>
        </>
      );
    } else if (ticket.status === 'Resolved') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button
            className="action-button button-primary"
            onClick={() => handleViewFeedback(ticket.id)}
          >
            View Feedback
          </button>
        </>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('lastActivity');
    navigate('/auth/LoginAdmin');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
          </div>
          <div className="header-title">
            <h2 className="main-title">Hostel Facilities Management System</h2>
            <p className="subtitle">Track and manage your complaints</p>
          </div>
        </div>
        <div className="header-right" ref={dropdownRef}>
          <div className="user-profile-container" onClick={handleDropdownToggle}>
            <img src={userImage} alt="User" className="user-profile" />
            <span className="dropdown-arrow">▼</span>
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

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`tab-button ${activeTab === 'New' ? 'active' : ''}`}
          onClick={() => handleTabClick('New')}
        >
          New Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
          onClick={() => handleTabClick('Pending')}
        >
          Pending Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'In Progress' ? 'active' : ''}`}
          onClick={() => handleTabClick('In Progress')}
        >
          In Progress Tickets
        </button>
        <button
          className={`tab-button ${activeTab === 'Resolved' ? 'active' : ''}`}
          onClick={() => handleTabClick('Resolved')}
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

      {/* Content Section */}
      <div className="content-section">
        <h3 className="section-title">
          {activeTab === 'New' ? 'New Tickets' : activeTab === 'All Tickets' ? 'All Tickets' : `${activeTab} Tickets`}
        </h3>
        {loading ? (
          <div className="empty-state">
            <p className="empty-state-text">Loading...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p className="empty-state-text" style={{ color: 'red' }}>Error: {error}</p>
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
                  <div className="ticket-id">
                    <svg
                      className="ticket-id-icon"
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
                    #{ticket.id}
                  </div>
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

export default ViewTicket;