// client/modules/tracking/components/TicketModal_Pending.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './TicketModal_Pending.css';
import ConfirmationModal from './ConfirmationModal';

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusClass = (status || '').toLowerCase().replace(/\s/g, '');
  return <span className={`status-badge status-${statusClass}`}>{status}</span>;
};

const TicketModal_Pending = ({ open, onClose, ticketData, onUpdateStatus }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: fetch full ticket details for modal display
  const [fullTicket, setFullTicket] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFullTicket = async () => {
      if (!open || !ticketData?.id) return;

      try {
        setFetching(true);

        // 1) complaint + student (users)
        const { data: complaint, error: complaintError } = await supabase
          .from('complaints')
          .select(`
            id,
            user_id,
            staff_id,
            issue_title,
            description,
            category,
            sub_category,
            hostel,
            building_room_number,
            status,
            actions_taken,
            estimated_service_date,
            created_at,
            updated_at,
            user:users!complaints_user_id_fkey (
              id,
              name,
              email,
              phone
            ),
            staff:users!complaints_staff_id_fkey (
                id,
                name,
                email,
                phone
            )
          `)
          .eq('id', ticketData.id)
          .single();

        if (complaintError) throw complaintError;

        // 2) attachments (complaint_attachments)
        const { data: attachments, error: attError } = await supabase
          .from('complaint_attachments')
          .select('id, file_url, file_type, created_at')
          .eq('complaint_id', ticketData.id)
          .order('created_at', { ascending: false });

        if (attError) throw attError;

        if (isMounted) {
          setFullTicket({
            ...complaint,
            attachments: attachments || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch ticket details:', err);
        if (isMounted) setFullTicket(null);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchFullTicket();

    return () => {
      isMounted = false;
    };
  }, [open, ticketData?.id]);

  if (!open || !ticketData) return null;

  // Prefer fetched data, fallback to whatever parent passed
  const t = fullTicket || ticketData;
  const student = t.user || {};

  // -------------------------------
  // Start Work (Pending → In Progress)
  // -------------------------------
  const handleConfirmUpdate = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1️⃣ Update complaint status + assign staff
      const { error: updateError } = await supabase
        .from('complaints')
        .update({
          status: 'In Progress',
          staff_id: user.id,
          updated_at: new Date()
        })
        .eq('id', ticketData.id);

      if (updateError) throw updateError;

      // 2️⃣ Insert status log
      const { error: logError } = await supabase
        .from('ticket_status_logs')
        .insert({
          complaint_id: ticketData.id,
          status: 'In Progress',
          updated_by: user.id,
          role: 'staff'
        });

      if (logError) throw logError;

      // 3️⃣ Close modals & refresh parent list
      setIsConfirmOpen(false);
      onClose();

      if (onUpdateStatus) onUpdateStatus(ticketData.id, 'In Progress');
    } catch (err) {
      console.error('Start work failed:', err);
      alert('Failed to start work. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-staff">
      <div className="modal-content-staff detail-modal">
        <div className="modal-header-staff">
          <h3 className="modal-title-staff">Ticket Details</h3>
          <button className="close-btn-staff" onClick={onClose}>&times;</button>
        </div>

        <div className="ticket-modal-body">
          <div className="ticket-header-pill">
            {/* ✅ DB column is issue_title */}
            {t.issue_title || t.title || ''}
          </div>

          <div className="detail-grid-staff">
            {/* Row 1 */}
            <div className="detail-group">
              <label>Date created</label>
              <input
                type="text"
                value={t.created_at ? String(t.created_at).split('T')[0] : ''}
                readOnly
              />
            </div>

            <div className="detail-group">
              <label>Hostel</label>
              <input type="text" value={t.hostel || 'N/A'} readOnly />
            </div>

            {/* Row 2 */}
            <div className="detail-group">
              <label>Ticket ID</label>
              <input type="text" value={`#${t.id}`} readOnly />
            </div>

            <div className="detail-group">
              <label>Phone Number</label>
              <input type="text" value={student.phone || 'N/A'} readOnly />
            </div>

            {/* Row 3 */}
            <div className="detail-group">
              <label>Name</label>
              <input type="text" value={student.name || 'N/A'} readOnly />
            </div>

            <div className="detail-group">
              <label>Building and Room Number</label>
              <input type="text" value={t.building_room_number || 'N/A'} readOnly />
            </div>

            {/* Row 4 */}
            <div className="detail-group">
              <label>Email</label>
              <input type="text" value={student.email || 'N/A'} readOnly />
            </div>

            <div className="detail-group span-2">
              <label>Description</label>
              <textarea rows="3" value={t.description || ''} readOnly />
            </div>

            {/* Row 5 */}
            <div className="detail-group">
              <label>Category</label>
              <input type="text" value={t.category || 'N/A'} readOnly />
            </div>

            <div className="detail-group">
              <label>Attachments</label>
              <input
                type="text"
                value={(t.attachments && t.attachments.length)
                  ? `${t.attachments.length} file(s)`
                  : 'None'}
                readOnly
              />
            </div>

            {/* Row 6 */}
            <div className="detail-group">
              <label>Sub-category</label>
              <input type="text" value={t.sub_category || 'N/A'} readOnly />
            </div>

            <div className="detail-group required">
              <label>Staff-in-Charge *</label>
              <select disabled value={t.staff?.name ? t.staff.name : ''}>
                <option value="">
                    {t.staff?.name ? t.staff.name : 'Ali Hamdan'}
                </option>
                </select>
            </div>

            {/* Row 7 */}
            <div className="detail-group span-2 required">
              <label>Actions to be taken *</label>
              {/* ✅ show DB value if exists */}
              <textarea
                rows="2"
                value={t.actions_taken || 'N/A'}
                readOnly
              />
            </div>

            {/* Row 8 */}
            <div className="detail-group required">
              <label>Estimated Service Date *</label>
              <input
                type="date"
                value={t.estimated_service_date || ''}
                readOnly
              />
            </div>

            <div className="detail-group">
              <label>Ticket Status *</label>
              <select disabled>
                <option>{t.status}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer-staff">
          {t.status === 'Pending' && (
            <button
              className="action-button button-primary start-work-btn"
              onClick={() => setIsConfirmOpen(true)}
              disabled={loading || fetching}
            >
              {loading ? 'Starting...' : (fetching ? 'Loading...' : 'Start Work')}
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmUpdate}
        message="Confirm start work for this ticket?"
        confirmText="Start"
      />
    </div>
  );
};

export default TicketModal_Pending;
