import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import InProgressSuccess from './InProgressSuccess';
import './InProgressDetails.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';

/* ===============================
   HEADER
================================ */
const Header = () => (
  <div className="update-page-header">
    <div className="header-left">
      <img src={logoImage} alt="Logo" className="logo-icon" />
      <div>
        <h2>Hostel Facilities Management System</h2>
        <p>Track and manage complaints</p>
      </div>
    </div>
    <div className="header-right">
      <img src={userImage} alt="Admin" className="user-profile" />
    </div>
  </div>
);

/* ===============================
   MAIN COMPONENT
================================ */
const InProgressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [latestLog, setLatestLog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        /* --- Complaint --- */
        const { data: complaint, error: cErr } = await supabase
          .from('complaints')
          .select('*')
          .eq('id', id)
          .single();

        if (cErr) throw cErr;
        setTicket(complaint);

        /* --- Status logs (latest only) --- */
        const { data: logs } = await supabase
          .from('ticket_status_logs')
          .select('status, comment, created_at, updated_by')
          .eq('complaint_id', id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (logs && logs.length) {
          setLatestLog(logs[0]);
          setComment(logs[0].comment || '');
        }

        /* --- Attachments --- */
        const { data: files } = await supabase
          .from('complaint_attachments')
          .select('*')
          .eq('complaint_id', id);

        setAttachments(files || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) return <div className="loading-state">Loading Ticket...</div>;
  if (!ticket) return <div className="loading-state">Ticket not found.</div>;

  /* ===============================
     PROGRESS BAR
  ================================ */
  const ProgressBar = ({ status }) => {
    const stages = ['Pending', 'In Progress', 'Resolved'];
    const current = stages.indexOf(status);

    return (
      <div className="progress-container">
        <div className="progress-line">
          {stages.map((s, i) => (
            <div key={s} className={`progress-step ${i <= current ? 'completed' : ''}`}>
              <div className="progress-dot">{i < current ? '✓' : s[0]}</div>
              <div className="progress-label">{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ===============================
     CONFIRM ACTION
  ================================ */
  const handleConfirm = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    let newStatus = ticket.status;
    if (confirmAction === 'resolve') newStatus = 'Resolved';
    if (confirmAction === 'reopen') newStatus = 'In Progress';

    /* --- Insert status log --- */
    await supabase.from('ticket_status_logs').insert({
      complaint_id: ticket.id,
      status: newStatus,
      comment,
      updated_by: userId
    });

    /* --- Update complaint --- */
    await supabase
      .from('complaints')
      .update({ status: newStatus })
      .eq('id', ticket.id);

    setTicket(prev => ({ ...prev, status: newStatus }));
    setLatestLog({
      status: newStatus,
      comment,
      created_at: new Date().toISOString(),
      updated_by: 'Admin'
    });

    setConfirmOpen(false);
    setSuccessMessage(
      confirmAction === 'resolve'
        ? 'Ticket resolved successfully!'
        : 'Progress updated successfully!'
    );
    setSuccessOpen(true);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="admin-update-page">
      <Header />

      <div className="page-content-wrapper">
        <button className="btn-back-dashboard" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>

        <h3 className="section-title-update">Ticket Status: {ticket.status}</h3>

        <ProgressBar status={ticket.status} />

        <div className="ticket-details-block">
          <div className="ticket-info-summary">
            <div className="title-pill">{ticket.issue_title}</div>

            <div className="info-grid">
              <p>Name: {ticket.user_name ?? 'Aina Zawani'}</p>
              <p>Created: {ticket.created_at?.split('T')[0]}</p>
              <p>Category: {ticket.category}</p>
              <p>Sub-category: {ticket.sub_category}</p>
              <p>Hostel: {ticket.hostel}</p>
              <p>Room: {ticket.building_room_number}</p>
            </div>
          </div>

          {/* STATUS TIMELINE */}
          {latestLog && (
            <div className="update-info-text">
              Latest Update: <b>{latestLog.status}</b> <br />
              By: {latestLog.updated_by} <br />
              At: {new Date(latestLog.created_at).toLocaleString()}
            </div>
          )}

          {/* ATTACHMENTS */}
          <div className="attachments-section">
            <h4>Attachments</h4>
            {attachments.length === 0 ? (
              <p>N/A</p>
            ) : (
              attachments.map(a => (
                <a key={a.id} href={a.file_url} target="_blank" rel="noreferrer">
                  {a.file_type.toUpperCase()}
                </a>
              ))
            )}
          </div>

          <div className="comments-section">
            <label>Admin Comment</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add update notes here..."
            />
          </div>

          <div className="action-footer">
            <button className="btn-save-progress" onClick={() => { setConfirmAction('save'); setConfirmOpen(true); }}>
              Save
            </button>

            {ticket.status === 'Resolved' ? (
              <button className="btn-reopen-ticket" onClick={() => { setConfirmAction('reopen'); setConfirmOpen(true); }}>
                Reopen Ticket
              </button>
            ) : (
              <button className="btn-resolve-ticket" onClick={() => { setConfirmAction('resolve'); setConfirmOpen(true); }}>
                Resolve Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        message="Confirm this action?"
        confirmText="Confirm"
      />

      <InProgressSuccess
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default InProgressDetails;
