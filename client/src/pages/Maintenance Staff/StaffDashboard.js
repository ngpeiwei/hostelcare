import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';
import complaintService from '../../modules/complaints/services/complaintService';
import './StaffDashboard.css';

// Import the modal components
import TicketModal_Pending from '../../modules/tracking/components/TicketModal_Pending';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal'; 

const initialMockData = [
    { id: '00005', title: "Mattress old and spoiled", description: "Mattress old and spoiled", dateReported: "2025-11-12", status: "Pending", reporter: "Syakila", hostel: "Desasiswa Tekun", phone: "+60102355511" },
    { id: '00008', title: "Bed frame is loosed", description: "Bed frame is loosed", dateReported: "2025-11-12", status: "Pending", reporter: "Student Y", hostel: "Desasasiswa Saujana", phone: "+60104566778" },
    { id: '00001', title: "Toilet tap has been leaking for 2 days", description: "Toilet tap has been leaking for 2 days", dateReported: "2025-11-10", status: "In Progress", reporter: "Student A", hostel: "Desasiswa Tekun", phone: "+60102362610" },
    { id: '00002', title: "Ceiling fan speed slow", description: "The ceiling fan in my room is very slow", dateReported: "2025-11-09", status: "In Progress", reporter: "Student B", hostel: "Desasasiswa Bakti Permai", phone: "+60103456789" },
    { id: '00003', title: "Window broken", description: "Window glass shattered", dateReported: "2025-11-08", status: "Resolved", reporter: "Student C", hostel: "Desasiswa Aman Damai", phone: "+60107654321" }
];


const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('Pending Tickets');
    // State to hold the tickets visible on the current tab
    const [tickets, setTickets] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // 🔑 FIX 1: New state to manage ALL mock data persistently across the session
    const [allMockTickets, setAllMockTickets] = useState(initialMockData); 

    useEffect(() => {
        loadTickets();
    }, [activeTab, allMockTickets]); // Re-run loadTickets when tab or persistent data changes

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

    // 🔑 FIX 2: loadTickets now filters the persistent state (allMockTickets)
    const loadTickets = async () => {
        setLoading(true);
        let statusFilter;
        
        if (activeTab === 'Pending Tickets') statusFilter = 'Pending';
        else if (activeTab === 'In Progress Tickets') statusFilter = 'In Progress';
        else if (activeTab === 'Resolved Tickets') statusFilter = 'Resolved';
        else statusFilter = 'All';

        try {
            // Attempt real API call (assuming it fails for now)
            // let response = await complaintService.getAllComplaints(statusFilter);

            // 💡 Use persistent mock state instead of API or hardcoded mock array
            const filteredTickets = allMockTickets.filter(t => {
                if (statusFilter === 'All') return true;
                return t.status === statusFilter;
            });
            
            setTickets(filteredTickets);
            
        } catch (error) {
            console.error('Error loading tickets:', error);
            // On API error, still filter the mock tickets (already handled above)
            const filteredTickets = allMockTickets.filter(t => {
                if (statusFilter === 'All') return true;
                return t.status === statusFilter;
            });
            setTickets(filteredTickets);
            
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
        const ticket = allMockTickets.find(t => t.id === ticketId); // Use persistent state here
        if (ticket) {
            setSelectedTicket(ticket);
        }
    };

    const handleCloseDetailModal = () => {
        setSelectedTicket(null);
    };

    // 🔑 FIX 3: Updates the persistent state, triggering the useEffect hook and loadTickets
    const handleUpdateStatus = (ticketId, newStatus) => {
        // 1. Update the persistent mock state (Fixes bug 1 & 3)
        setAllMockTickets(prevTickets =>
            prevTickets.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            )
        );

        // 2. Show success popup
        setIsSuccessOpen(true);

        // 3. Automatically move user to the correct tab (Fixes bug 1, part 2)
        if (newStatus === 'In Progress') {
            setActiveTab('In Progress Tickets');
        } else if (newStatus === 'Resolved') {
            setActiveTab('Resolved Tickets');
        }

        // Note: loadTickets will be called automatically via useEffect due to the change in allMockTickets/activeTab
    };


    const getStatusBadge = (status) => {
        if (status === 'Pending') {
            return <span className="status-badge status-pending">Pending</span>;
        } else if (status === 'In Progress') {
            return <span className="status-badge status-inprogress">In Progress</span>;
        } else if (status === 'Resolved') {
            return <span className="status-badge status-resolved">Resolved</span>;
        }
        return null;
    };

    // 🔑 FIX 4: Single button logic confirmed
    const renderActionButton = (ticket) => {
        let buttonText;
        let buttonAction;

        if (ticket.status === 'Pending') {
            // Pending -> View Details (Opens Modal)
            buttonText = 'View Details';
            buttonAction = () => handleViewDetails(ticket.id);
        } else if (ticket.status === 'In Progress') {
            // In Progress -> Update Progress (Navigates to the update form)
            buttonText = 'Update Progress';
            buttonAction = () => handleUpdateProgress(ticket.id);
        } else if (ticket.status === 'Resolved') {
            // Resolved -> View Details
            buttonText = 'View Details';
            buttonAction = () => handleViewDetails(ticket.id);
        } else {
            return null;
        }

        return (
            <div className="ticket-actions">
                {getStatusBadge(ticket.status)}
                <button
                    className="action-button"
                    onClick={buttonAction}
                >
                    {buttonText}
                </button>
            </div>
        );
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/LoginStaff');
    };

    // Calculate counts based on the PERSISTENT state (allMockTickets)
    const total = allMockTickets.length;
    const pendingCount = allMockTickets.filter((t) => t.status === 'Pending').length;
    const inProgressCount = allMockTickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = allMockTickets.filter((t) => t.status === 'Resolved').length;

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

            {/* Modals */}
            <TicketModal_Pending
                open={!!selectedTicket}
                onClose={handleCloseDetailModal}
                ticketData={selectedTicket}
                onUpdateStatus={handleUpdateStatus} // This handles the status change
            />

            <SuccessMessageModal
                open={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={`You have started working on the ticket successfully !`}
            />

        </div>
    );
};

export default StaffDashboard;