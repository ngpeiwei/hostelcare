import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';
import { submitComplaint } from '../../modules/complaints/components/complaintService';
import ViewFeedbackModal from '../../modules/feedback/components/ViewFeedback';
import './AdminDashboard.css';
import { supabase } from '../../supabaseClient';

const NoFeedbackModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-content feedback-modal view-feedback">
        <button className="fb-modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <h2 className="fb-modal-title">Feedback Details</h2>
        
        <div className="feedback-form">
          <div className="form-group">
            <textarea
                id="feedback-comments-empty"
                className="no-comments-display"
                value="No Reviews Yet"
                readOnly
                rows="4"
            />
          </div>

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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [noFeedback, setNoFeedback] = useState(false);
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
      console.log('📊 Supabase client:', supabase ? 'Connected' : 'Not connected');
      
      // Build the query
      let query = supabase
        .from('complaints')
        .select('*');

      // Filter by status based on active tab
      // Database might store "New", "Pending", "In Progress", "Resolved"
      // We need to query the actual DB format, then normalize to lowercase
      if (activeTab !== 'All Tickets' && activeTab !== 'all') {
        console.log('🔎 Filtering by status:', activeTab);
        
        // Map our lowercase tabs to potential database formats
        let dbStatus = activeTab;
        if (activeTab === 'new') dbStatus = 'New';
        if (activeTab === 'pending') dbStatus = 'Pending';
        if (activeTab === 'inprogress') dbStatus = 'In Progress';
        if (activeTab === 'resolved') dbStatus = 'Resolved';
        
        console.log('🔎 Querying database with status:', dbStatus);
        query = query.eq('status', dbStatus);
      }

      // Order by created date
      query = query.order('created_at', { ascending: false });

      console.log('🚀 Executing query...');
      const { data, error: fetchError } = await query;

      console.log('📦 Supabase response:', { 
        dataCount: data?.length, 
        hasError: !!fetchError,
        error: fetchError 
      });

      if (fetchError) {
        console.error('❌ Supabase error:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!data) {
        console.log('⚠️ No data returned from Supabase');
        setTickets([]);
        return;
      }

      console.log('✅ Raw data from Supabase:', data);
      console.log('📝 Sample ticket structure:', data[0]);

      // Map Supabase column names to your UI expectations
      const mappedTickets = data.map(ticket => {
        const mapped = {
          id: ticket.id,
          description: ticket.issue_title || ticket.description || 'No description available',
          status: ticket.status ? ticket.status.replace(/\s/g, '').toLowerCase() : 'new',
          staffInCharge: ticket.staff_in_charge || ticket.staffInCharge || null,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          category: ticket.category,
          location: ticket.location,
          priority: ticket.priority,
          userId: ticket.user_id
        };
        return mapped;
      });

      console.log('✨ Mapped tickets:', mappedTickets);
      console.log('📊 Number of tickets to display:', mappedTickets.length);
      
      setTickets(mappedTickets);
    } catch (error) {
      console.error('💥 Error loading tickets:', error);
      setError(error.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
      console.log('✅ Loading complete');
    }
  };

  const handleTabClick = (tab) => {
    console.log('📑 Tab clicked:', tab);
    setActiveTab(tab);
  };

  const handleOpenTicket = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleAssignStaff = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleViewInProgress = (ticketId) => {
    navigate(`/admin/inprogress/${ticketId}`);
  };

  const handleViewProgress = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    if (statusLower === 'new') {
      return <span className="status-badge status-new">New</span>;
    } else if (statusLower === 'pending') {
      return <span className="status-badge status-pending">Pending</span>;
    } else if (statusLower === 'inprogress' || statusLower === 'in progress') {
      return <span className="status-badge status-inprogress">In Progress</span>;
    } else if (statusLower === 'resolved') {
      return <span className="status-badge status-resolved">Resolved</span>;
    }
    return <span className="status-badge">{status}</span>;
  };

  const renderActionButton = (ticket) => {
    if (ticket.status === 'Open') {
      return (
        <>
          {getStatusBadge(ticket.status)}
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
            onClick={() => handleViewInProgress(ticket.id)}
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
            onClick={() => {
              const sampleFeedback = {
                satisfaction: 4, professionalism: 5, effectiveness: 3, easeOfUse: 5,
                comments: 'The staff was very polite and fixed the issue quickly.'
              };
              setViewFeedback(sampleFeedback);
            }}
          >
            View Feedback
          </button>
          <button
            className="action-button button-primary"
            onClick={() => setNoFeedback(true)}
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

  // Summary stats for admin dashboard
  const total = tickets.length;
  const newticket = tickets.filter((c) => c.status?.toLowerCase() === 'new').length;
  const pending = tickets.filter((c) => c.status?.toLowerCase() === 'pending').length;
  const inProgress = tickets.filter((c) => {
    const status = c.status?.toLowerCase();
    return status === 'inprogress' || status === 'in progress';
  }).length;
  const resolved = tickets.filter((c) => c.status?.toLowerCase() === 'resolved').length;

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

          {/* Dashboard */}
          <div className="content-section">
              <h3 className="section-title">Dashboard</h3>
              <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total Complaints Received</div>
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
              </div>
        
        {/* Navigation Tabs */}
          <div className="navigation-tabs">
            <button
              className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => handleTabClick('new')}
            >
              New Tickets
            </button>
            <button
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => handleTabClick('pending')}
            >
              Pending Tickets
            </button>
            <button
              className={`tab-button ${activeTab === 'inprogress' ? 'active' : ''}`}
              onClick={() => handleTabClick('inprogress')}
            >
              In Progress Tickets
            </button>
            <button
              className={`tab-button ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => handleTabClick('resolved')}
            >
              Resolved Tickets
            </button>
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabClick('all')}
            >
              All Tickets
            </button>
          </div>

        {/* Content Section */}
        <div className="content-section">
          <h3 className="section-title">
            {activeTab === 'all' || activeTab === 'All Tickets' 
              ? 'All Tickets' 
              : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tickets`}
          </h3>
          
          {/* Debug Info */}
          <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
            <strong>Debug Info:</strong> 
            Loading: {loading ? 'Yes' : 'No'} | 
            Error: {error || 'None'} | 
            Tickets Count: {tickets.length} | 
            Active Tab: {activeTab}
          </div>

          {loading ? (
            <div className="empty-state">
              <p className="empty-state-text">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p className="empty-state-text" style={{ color: 'red' }}>
                ❌ Error: {error}
                <br />
                <small>Check console for details (Press F12)</small>
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">
                📭 No {activeTab !== 'all' ? activeTab : ''} tickets found
                <br />
                <small>Try selecting a different tab or check your database</small>
              </p>
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

        {/* Modals */}
        
        <ViewFeedbackModal 
          open={!!viewFeedback} 
          feedback={viewFeedback}
          onClose={() => setViewFeedback(null)} 
        />
        <NoFeedbackModal
          open={noFeedback}
          onClose={() => setNoFeedback(false)}
        />
      </div>
  );
};

export default AdminDashboard;