// client/pages/Maintenance Staff/StaffUpdatePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ConfirmationModal from '../../modules/tracking/components/ConfirmationModal';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal';
import './StaffUpdatePage.css';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="update-page-header">
            <div className="header-left">
                <img src={logoImage} alt="Logo" className="logo-icon" />
                <div>
                    <h2>Hostel Facilities Management System</h2>
                    <p>Track and manage assigned tickets</p>
                </div>
            </div>
            <div className="header-right">
                <img src={userImage} alt="Staff" className="user-profile" />
                <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                      onClick={() => setShowDropdown(!showDropdown)}>
                    ▼
                </span>
            </div>
        </div>
    );
};

const StaffUpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comment, setComment] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            const { data } = await supabase
                .from('complaints')
                .select('*')
                .eq('id', id)
                .single();

            setTicket(data);
        };

        fetchTicket();
    }, [id]);

    const handleConfirm = async () => {
        const { data: user } = await supabase.auth.getUser();

        const newStatus = confirmAction === 'resolve' ? 'Resolved' : 'In Progress';

        await supabase.from('ticket_status_logs').insert({
            complaint_id: id,
            status: newStatus,
            comment,
            updated_by: user.user.id
        });

        await supabase
            .from('complaints')
            .update({ status: newStatus })
            .eq('id', id);

        setIsConfirmOpen(false);
        setIsSuccessOpen(true);
    };

    if (!ticket) return <div>Loading...</div>;

    return (
        <div className="staff-update-page">
            <Header />

            <div className="page-content-wrapper">
                <button onClick={() => navigate('/staff/dashboard')}>← Back</button>

                <h3>Ticket Status: {ticket.status}</h3>

                <div className="ticket-details-block">
                    <div className="title-pill">{ticket.issue_title}</div>

                    <div className="info-grid">
                        <p>Category: {ticket.category}</p>
                        <p>Sub-category: {ticket.sub_category}</p>
                        <p>Room: {ticket.building_room_number}</p>
                    </div>

                    <div className="comments-section">
                        <label>Add Comment</label>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} />
                    </div>

                    <div className="action-footer">
                        <button onClick={() => { setConfirmAction('save'); setIsConfirmOpen(true); }}>
                            Save
                        </button>
                        <button onClick={() => { setConfirmAction('resolve'); setIsConfirmOpen(true); }}>
                            Resolve
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirm}
                message="Confirm action?"
                confirmText="Confirm"
            />

            <SuccessMessageModal
                open={isSuccessOpen}
                onClose={() => navigate('/staff/dashboard?tab=resolved')}
                message="Ticket updated successfully"
            />
        </div>
    );
};

export default StaffUpdatePage;