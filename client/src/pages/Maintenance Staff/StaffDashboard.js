import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';
import './StaffDashboard.css';
import { supabase } from '../../supabaseClient';

// Modals
import TicketModal_Pending from '../../modules/tracking/components/TicketModal_Pending';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal';

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('Pending Tickets');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const navigate = useNavigate();

    /* ---------------------------------
       LOAD TICKETS FROM SUPABASE
    ----------------------------------*/
    const loadTickets = async () => {
        setLoading(true);

        let statusFilter = null;
        if (activeTab === 'Pending Tickets') statusFilter = 'Pending';
        else if (activeTab === 'In Progress Tickets') statusFilter = 'In Progress';
        else if (activeTab === 'Resolved Tickets') statusFilter = 'Resolved';

        let query = supabase
            .from('complaints')
            .select(`
                id,
                issue_title,
                description,
                status,
                created_at
            `)
            .order('created_at', { ascending: false });

        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error loading tickets:', error);
            setTickets([]);
        } else {
            setTickets(
                data.map(c => ({
                    id: c.id,
                    title: c.issue_title,
                    description: c.description,
                    status: c.status,
                    dateReported: c.created_at
                }))
            );
        }

        setLoading(false);
    };

    useEffect(() => {
        loadTickets();
    }, [activeTab]);

    /* ---------------------------------
       UI HANDLERS
    ----------------------------------*/
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleViewDetails = (ticketId) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) setSelectedTicket(ticket);
    };

    const handleCloseDetailModal = () => {
        setSelectedTicket(null);
    };

    const handleUpdateProgress = (ticketId) => {
        navigate(`/staff/ticket/${ticketId}/update`);
    };

    const handleUpdateStatus = async (ticketId, newStatus) => {
        const { error } = await supabase
            .from('complaints')
            .update({ status: newStatus })
            .eq('id', ticketId);

        if (error) {
            console.error('Status update failed:', error);
            return;
        }

        setIsSuccessOpen(true);
        setSelectedTicket(null);
        loadTickets();
    };


    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('lastActivity');
        navigate('/auth/login');
    };

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

    /* ---------------------------------
       STATUS BADGES & COUNTS
    ----------------------------------*/
    const getStatusBadge = (status) => {
        if (status === 'Pending') return <span className="status-badge status-pending">Pending</span>;
        if (status === 'In Progress') return <span className="status-badge status-inprogress">In Progress</span>;
        if (status === 'Resolved') return <span className="status-badge status-resolved">Resolved</span>;
        return null;
    };

    const total = tickets.length;
    const pendingCount = tickets.filter(t => t.status === 'Pending').length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

    const renderActionButton = (ticket) => {
        let buttonText;
        let buttonAction;

        if (ticket.status === 'Pending') {
            buttonText = 'View Details';
            buttonAction = () => handleViewDetails(ticket.id);
        } else if (ticket.status === 'In Progress') {
            buttonText = 'Update Progress';
            buttonAction = () => handleUpdateProgress(ticket.id);
        } else {
            buttonText = 'View Details';
            buttonAction = () => handleViewDetails(ticket.id);
        }

        return (
            <div className="ticket-actions">
                {getStatusBadge(ticket.status)}
                <button className="action-button" onClick={buttonAction}>
                    {buttonText}
                </button>
            </div>
        );
    };

    /* ---------------------------------
       ORIGINAL RETURN (UNCHANGED)
    ----------------------------------*/
    return (
        <div className="mainstaff-dashboard">
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="logo-container">
                        <img src={logoImage} alt="HostelCare Logo" className="logo-icon" />
                    </div>
                    <div className="header-title">
                        <h2 className="main-title">Hostel Facilities Management System</h2>
                        <p className="subtitle">Track and manage your assigned maintenance tickets</p>
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

            <div className="content-section">
                <h3 className="section-title">Dashboard</h3>
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total Assigned Tickets</div>
                        <div className="stat-value">{total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pending Tickets</div>
                        <div className="stat-value pending-value">{pendingCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">In Progress</div>
                        <div className="stat-value inprogress-value">{inProgressCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Resolved</div>
                        <div className="stat-value resolved-value">{resolvedCount}</div>
                    </div>
                </div>
            </div>

            <div className="navigation-tabs">
                <button
                    className={`tab-button ${activeTab === 'Pending Tickets' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Pending Tickets')}
                >
                    Pending Tickets
                </button>
                <button
                    className={`tab-button ${activeTab === 'In Progress Tickets' ? 'active' : ''}`}
                    onClick={() => handleTabClick('In Progress Tickets')}
                >
                    In Progress Tickets
                </button>
                <button
                    className={`tab-button ${activeTab === 'Resolved Tickets' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Resolved Tickets')}
                >
                    Resolved Tickets
                </button>
            </div>

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
                                    <div className="ticket-description">{ticket.title}</div>
                                    <div className="ticket-id">#{ticket.id}</div>
                                </div>
                                {renderActionButton(ticket)}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TicketModal_Pending
                open={!!selectedTicket}
                onClose={handleCloseDetailModal}
                ticketData={selectedTicket}
                onUpdateStatus={handleUpdateStatus}
            />

            <SuccessMessageModal
                open={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message="You have started working on the ticket successfully!"
            />
        </div>
    );
};

export default StaffDashboard;