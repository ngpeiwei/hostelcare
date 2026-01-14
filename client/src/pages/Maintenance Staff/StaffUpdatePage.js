// client/pages/Maintenance Staff/StaffUpdatePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal';

import './StaffUpdatePage.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';

/* ---------------- HEADER ---------------- */
const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="update-page-header">
      <div className="header-left">
        <div className="logo-container">
          <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
        </div>
        <div className="header-title">
          <h2 className="main-title">Hostel Facilities Management System</h2>
          <p className="subtitle">Track and manage assigned maintenance tickets</p>
        </div>
      </div>

      <div className="header-right">
        <img src={userImage} alt="Staff" className="user-profile" />
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

/* ---------------- PROGRESS BAR ---------------- */
const ProgressBar = ({ currentStatus }) => {
  const stages = ['Pending', 'In Progress', 'Resolved'];
  const currentIndex = stages.indexOf(currentStatus);

  return (
    <div className="progress-container">
      <div className="progress-line">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`progress-step ${index <= currentIndex ? 'completed' : ''}`}
          >
            <div className="progress-dot">
              {index < currentIndex ? '✓' : stage.charAt(0)}
            </div>
            <div className="progress-label">{stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const StaffUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  /* -------- FETCH TICKET -------- */
  useEffect(() => {
    const fetchTicket = async () => {
        const { data, error } = await supabase
        .from('complaints')
        .select(`
            id,
            issue_title,
            category,
            sub_category,
            hostel,
            building_room_number,
            description,
            status,
            created_at
        `)
        .eq('id', id)
        .single();

        if (error) {
        console.error('Error fetching ticket:', error);
        return;
        }

        setTicket(data);
    };

    fetchTicket();
    }, [id]);

    const [statusLogs, setStatusLogs] = useState([]);

    useEffect(() => {
        const fetchStatusLogs = async () => {
            const { data, error } = await supabase
            .from('ticket_status_logs')
            .select('*')
            .eq('ticket_id', id)
            .order('created_at', { ascending: true });

            if (!error) setStatusLogs(data);
        };

    fetchStatusLogs();
    }, [id]);


  /* -------- ACTION HANDLERS -------- */
  const handleSaveClick = () => {
    setConfirmAction('save');
    setIsConfirmOpen(true);
  };

  const handleResolveClick = () => {
    setConfirmAction('resolve');
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const newStatus =
      confirmAction === 'resolve' ? 'Resolved' : 'In Progress';

    // 1️⃣ Update complaint
    await supabase
      .from('complaints')
      .update({ status: newStatus })
      .eq('id', id);

    // 2️⃣ Insert status log
    await supabase.from('ticket_status_logs').insert({
      complaint_id: id,
      status: newStatus,
      comment,
      updated_by: user.id,
      role: 'staff'
    });

    setSuccessMessage(
      confirmAction === 'resolve'
        ? 'The ticket has been resolved successfully!'
        : 'Progress has been saved successfully!'
    );

    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  // if (!ticket) {return <div className="loading-state">Loading Ticket #{id}...</div>;}
  if (!ticket) return null; // nothing shows while loading


  return (
    <div className="staff-update-page">
      <Header />

      <div className="page-content-wrapper">
        <button
          className="btn-back-dashboard"
          onClick={() => navigate('/staff/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <h3 className="section-title-update">
          Ticket Status: {ticket.status}
        </h3>

        <ProgressBar currentStatus={ticket.status} />

        <div className="ticket-details-block">
          <div className="ticket-info-summary">
            <div className="title-pill">{ticket.issue_title}</div>

            <div className="info-grid">
              <p>Category: {ticket.category || 'N/A'}</p>
              <p>Sub-category: {ticket.sub_category || 'N/A'}</p>
              <p>Hostel: {ticket.hostel || 'N/A'}</p>
              <p>Building & Room: {ticket.building_room_number || 'N/A'}</p>
            </div>
          </div>

          <div className="status-timeline">
            <h4>Status History</h4>

            {statusLogs.length === 0 ? (
                <p>No status changes yet.</p>
            ) : (
                statusLogs.map((log) => (
                <div key={log.id} className="timeline-item">
                    <div className="timeline-status">
                    {log.old_status} → <strong>{log.new_status}</strong>
                    </div>
                    <div className="timeline-meta">
                    Changed by {log.changed_by} •{" "}
                    {new Date(log.created_at).toLocaleString()}
                    </div>
                </div>
                ))
            )}
            </div>

          <div className="comments-section">
            <label htmlFor="comments">Add Comment</label>
            <textarea
              id="comments"
              placeholder="Add notes or update details here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="action-footer">
            <button
              className="btn-save-progress"
              onClick={handleSaveClick}
            >
              Save
            </button>

            <button
              className="btn-resolve-ticket"
              onClick={handleResolveClick}
            >
              Resolve Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        message={
          confirmAction === 'resolve'
            ? 'Are you sure you want to mark this ticket as Resolved?'
            : 'Save current progress for this ticket?'
        }
        confirmText={confirmAction === 'resolve' ? 'Resolve' : 'Confirm Save'}
      />

      {/* Success Modal */}
      <SuccessMessageModal
        open={isSuccessOpen}
        onClose={() => navigate('/staff/dashboard?tab=resolved')}
        message={successMessage}
      />
    </div>
  );
};

export default StaffUpdatePage;