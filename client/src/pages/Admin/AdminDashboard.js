import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';
import ViewFeedbackModal from '../../modules/feedback/components/ViewFeedback';
import './AdminDashboard.css';
import { supabase } from '../../supabaseClient';

/* -------------------- No Feedback Modal -------------------- */
const NoFeedbackModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-content feedback-modal view-feedback">
        <button className="fb-modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="fb-modal-title">Feedback Details</h2>
        <textarea className="no-comments-display" value="No Reviews Yet" readOnly rows="4" />
        <button className="btn btn-submit" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

/* ==================== Admin Dashboard ==================== */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState('New');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewFeedback, setViewFeedback] = useState(null);
  const [noFeedback, setNoFeedback] = useState(false);

  /* -------------------- Load Tickets -------------------- */
  const loadTickets = async () => {
    try {
      setLoading(true);

      let query = supabase.from('complaints').select('*');

      if (activeTab !== 'All') {
        query = query.eq('status', activeTab);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [activeTab]);

  /* -------------------- Realtime INSERT -------------------- */
  useEffect(() => {
    const channel = supabase
      .channel('admin-complaints-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'complaints' },
        (payload) => {
          if (payload.new.status === activeTab) {
            setTickets((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [activeTab]);

  /* -------------------- UI Handlers -------------------- */
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleAssignStaff = (id) => navigate(`/admin/ticket/${id}`);
  const handleViewProgress = (id) => navigate(`/admin/ticket/${id}`);
  const handleViewInProgress = (id) => navigate(`/admin/inprogress/${id}`);

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('lastActivity');
    navigate('/auth/login');
  };

  /* -------------------- Status Badge -------------------- */
  const getStatusBadge = (status) => (
    <span className={`status-badge status-${status.toLowerCase().replace(' ', '')}`}>
      {status}
    </span>
  );

  const renderActionButton = (ticket) => {
    if (ticket.status === 'New') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button className="action-button button-primary" onClick={() => handleAssignStaff(ticket.id)}>
            Assign Staff
          </button>
        </>
      );
    }

    if (ticket.status === 'Pending') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button className="action-button button-primary" onClick={() => handleViewProgress(ticket.id)}>
            View Details
          </button>
        </>
      );
    }

    if (ticket.status === 'In Progress') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button className="action-button button-primary" onClick={() => handleViewInProgress(ticket.id)}>
            View Progress
          </button>
        </>
      );
    }

    if (ticket.status === 'Resolved') {
      return (
        <>
          {getStatusBadge(ticket.status)}
          <button className="action-button button-primary" onClick={() => setNoFeedback(true)}>
            View Feedback
          </button>
        </>
      );
    }
    return null;
  };

  /* -------------------- Summary Counts -------------------- */
  const total = tickets.length;
  const newticket = tickets.filter(t => t.status === 'New').length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;

  /* ==================== Return Function ==================== */
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

            {/* Summary Cards */}
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
          className={`tab-button ${activeTab === 'Open' ? 'active' : ''}`}
          onClick={() => handleTabClick('Open')}
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
      </div>

      {/* Content Section */}
      <div className="content-section">
      <h3 className="section-title">
      {activeTab === 'All Tickets' ? 'All Tickets' : `${activeTab === 'Open' ? 'New' : activeTab} Tickets`}
      </h3>
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
                  {/* Title */}
                  <div className="ticket-description">
                    {ticket.issue_title}
                  </div>

                  {/* Short Ticket ID */}
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
                    #{ticket.id.slice(0, 8).toUpperCase()}
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
          onClose={() => setViewFeedback(null)} />
      <NoFeedbackModal
          open={noFeedback}
          onClose={() => setNoFeedback(false)}/>
    </div>
  );
};

export default AdminDashboard;


/* previous code version */
// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logoImage from '../../assets/logo.png';
// import userImage from '../../assets/admin.png';
// import { submitComplaint } from '../../modules/complaints/components/complaintService';
// import ViewFeedbackModal from '../../modules/feedback/components/ViewFeedback';
// import './AdminDashboard.css';
// import { supabase } from '../../supabaseClient';

// const NoFeedbackModal = ({ open, onClose }) => {
//   if (!open) return null;

//   return (
//     <div className="fb-modal-overlay">
//       <div className="fb-modal-content feedback-modal view-feedback">
//         <button className="fb-modal-close-btn" onClick={onClose} aria-label="Close modal">
//           &times;
//         </button>
        
//         <h2 className="fb-modal-title">Feedback Details</h2>
        
//         <div className="feedback-form">
//           <div className="form-group">
//             <textarea
//                 id="feedback-comments-empty"
//                 className="no-comments-display"
//                 value="No Reviews Yet"
//                 readOnly
//                 rows="4"
//             />
//           </div>

//           <div className="feedback-form-actions">
//             <button type="button" className="btn btn-submit" onClick={onClose}>
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('Open');
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [viewFeedback, setViewFeedback] = useState(null);
//   const [noFeedback, setNoFeedback] = useState(false);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     loadTickets();
//   }, [activeTab]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     if (showDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showDropdown]);

//   const loadTickets = async () => {
//     try {
//       setLoading(true);
//       const status = activeTab === 'Open' ? 'Open' : activeTab === 'All Tickets' ? 'All' : activeTab;
//       const response = await submitComplaint.getAllComplaints(status);
//       if (response.data) {
//         // Use response directly; remove any hardcoded exclusions so all matching
//         // tickets are shown for the selected status.
//         const results = response.data;
//         setTickets(results);
//       }
//     } catch (error) {
//       console.error('Error loading tickets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const handleOpenTicket = (ticketId) => {
//     navigate(`/admin/ticket/${ticketId}`);
//   };

//   const handleAssignStaff = (ticketId) => {
//     navigate(`/admin/ticket/${ticketId}`);
//   };

//   const handleViewInProgress = (ticketId) => {
//     navigate(`/admin/inprogress/${ticketId}`);
//   };

//   const handleViewProgress = (ticketId) => {
//     navigate(`/admin/ticket/${ticketId}`);
//   };

//   const getStatusBadge = (status) => {
//     if (status === 'Open') {
//       return <span className="status-badge status-new">New</span>;
//     } else if (status === 'Pending') {
//       return <span className="status-badge status-pending">Pending</span>;
//     } else if (status === 'In Progress') {
//       return <span className="status-badge status-inprogress">In Progress</span>;
//     } else if (status === 'Resolved') {
//       return <span className="status-badge status-resolved">Resolved</span>;
//     }
//     return null;
//   };

//   const renderActionButton = (ticket) => {
//     if (ticket.status === 'Open') {
//       return (
//         <>
//           {getStatusBadge(ticket.status)}
//           <button
//             className="action-button button-primary"
//             onClick={() => handleAssignStaff(ticket.id)}
//           >
//             Assign Staff
//           </button>
//         </>
//       );
//     } else if (ticket.status === 'Pending') {
//       return (
//         <>
//           {getStatusBadge(ticket.status)}
//           <button
//             className="action-button button-primary"
//             onClick={() => handleViewProgress(ticket.id)}
//           >
//             {ticket.staffInCharge ? 'View Progress' : 'View Details'}
//           </button>
//         </>
//       );
//     } else if (ticket.status === 'In Progress') {
//       return (
//         <>
//           {getStatusBadge(ticket.status)}
//           <button
//             className="action-button button-primary"
//             onClick={() => handleViewInProgress(ticket.id)}
//           >
//             View Progress
//           </button>
//         </>
//       );
//     } else if (ticket.status === 'Resolved') {
//       return (
//         <>
//           {getStatusBadge(ticket.status)}
//           <button
//             className="action-button button-primary"
//             onClick={() => {
//               const sampleFeedback = {
//                 satisfaction: 4, professionalism: 5, effectiveness: 3, easeOfUse: 5,
//                 comments: 'The staff was very polite and fixed the issue quickly.'
//               };
//               setViewFeedback(sampleFeedback);
//             }}
//           >
//             View Feedback
//           </button>
//           <button
//             className="action-button button-primary"
//             onClick={() => setNoFeedback(true)}
//           >
//             View Feedback
//           </button>
//         </>
//       );
//     }
//     return null;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const handleDropdownToggle = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('lastActivity');
//   };

//   // Summary stats for admin dashboard
//   const total = tickets.length;
//   const newticket = tickets.filter((c) => c.status === 'Open').length;
//   const pending = tickets.filter((c) => c.status === 'Pending').length;
//   const inProgress = tickets.filter((c) => c.status === 'In Progress').length;
//   const resolved = tickets.filter((c) => c.status === 'Resolved').length;
  

//   return (
//     <div className="admin-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-left">
//           <div className="logo-container">
//             <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
//           </div>
//           <div className="header-title">
//             <h2 className="main-title">Hostel Facilities Management System</h2>
//             <p className="subtitle">Track and manage your complaints</p>
//           </div>
//         </div>
//         <div className="header-right" ref={dropdownRef}>
//           <div className="user-profile-container" onClick={handleDropdownToggle}>
//             <img src={userImage} alt="User" className="user-profile" />
//             <span className="dropdown-arrow">▼</span>
//           </div>
//           {showDropdown && (
//             <div className="dropdown-menu">
//               <button className="dropdown-item" onClick={handleLogout}>
//                 <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//         {/* Dashboard */}
//         <div className="content-section">
//             <h3 className="section-title">Dashboard</h3>
//             <div className="stats-row">
//                   <div className="stat-card">
//                       <div className="stat-label">Total Complaints Received</div>
//                       <div className="stat-value">{total}</div>
//                   </div>
//                   <div className="stat-card">
//                       <div className="stat-label">New</div>
//                       <div className="stat-value blue">{newticket}</div>
//                   </div>
//                   <div className="stat-card">
//                       <div className="stat-label">Pending</div>
//                       <div className="stat-value yellow">{pending}</div>
//                   </div>
//                   <div className="stat-card">
//                       <div className="stat-label">In Progress</div>
//                       <div className="stat-value orange">{inProgress}</div>
//                   </div>
//                   <div className="stat-card">
//                       <div className="stat-label">Resolved</div>
//                       <div className="stat-value green">{resolved}</div>
//                   </div>
//               </div>
//         </div>

//       {/* Navigation Tabs */}
//       <div className="navigation-tabs">
//         <button
//           className={`tab-button ${activeTab === 'Open' ? 'active' : ''}`}
//           onClick={() => handleTabClick('Open')}
//         >
//           New Tickets
//         </button>
//         <button
//           className={`tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
//           onClick={() => handleTabClick('Pending')}
//         >
//           Pending Tickets
//         </button>
//         <button
//           className={`tab-button ${activeTab === 'In Progress' ? 'active' : ''}`}
//           onClick={() => handleTabClick('In Progress')}
//         >
//           In Progress Tickets
//         </button>
//         <button
//           className={`tab-button ${activeTab === 'Resolved' ? 'active' : ''}`}
//           onClick={() => handleTabClick('Resolved')}
//         >
//           Resolved Tickets
//         </button>
//       </div>

//       {/* Content Section */}
//       <div className="content-section">
//       <h3 className="section-title">
//       {activeTab === 'All Tickets' ? 'All Tickets' : `${activeTab === 'Open' ? 'New' : activeTab} Tickets`}
//       </h3>
//         {loading ? (
//           <div className="empty-state">
//             <p className="empty-state-text">Loading...</p>
//           </div>
//         ) : tickets.length === 0 ? (
//           <div className="empty-state">
//             <p className="empty-state-text">No tickets found</p>
//           </div>
//         ) : (
//           <div className="tickets-list">
//             {tickets.map((ticket) => (
//               <div key={ticket.id} className="ticket-card">
//                 <div className="ticket-info">
//                   <div className="ticket-description">{ticket.description}</div>
//                   <div className="ticket-id">
//                     <svg
//                       className="ticket-id-icon"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                     #{ticket.id}
//                   </div>
//                 </div>
//                 <div className="ticket-actions">
//                   {renderActionButton(ticket)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <ViewFeedbackModal 
//           open={!!viewFeedback} 
//           feedback={viewFeedback}
//           onClose={() => setViewFeedback(null)} />
//       <NoFeedbackModal
//           open={noFeedback}
//           onClose={() => setNoFeedback(false)}/>
//     </div>
//   );
// };

// export default AdminDashboard;