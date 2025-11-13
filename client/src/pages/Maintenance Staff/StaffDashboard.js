import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import userImage from '../../assets/admin.png';
import complaintService from '../../modules/complaints/services/complaintService';
import './StaffDashboard.css';

// Import the modal components
import TicketModal_Pending from '../../modules/tracking/components/TicketModal_Pending';
import SuccessMessageModal from '../../modules/tracking/components/SuccessfulModal';

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('Pending Tickets');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

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
        setLoading(true);

        let statusFilter;
        
        try {
          //let statusFilter; // Renamed to avoid confusion with ticket.status
            if (activeTab === 'Pending Tickets') statusFilter = 'Pending';
            else if (activeTab === 'In Progress Tickets') statusFilter = 'In Progress';
            else if (activeTab === 'Resolved Tickets') statusFilter = 'Resolved';
            else statusFilter = 'All';

            let response = null;
            try {
                response = await complaintService.getAllComplaints(statusFilter);
            } catch (err) {
                console.warn("complaintService.getAllComplaints() failed, using mock data instead.");
            }

            if (!response || !response.data || response.data.length === 0) {
                console.log("Using mock ticket data for testing");

                const mockTickets = [
                    {
                        id: '00009',
                        title: "Mattress old and spoiled",
                        description: "Mattress old and spoiled",
                        dateReported: "2025-11-12",
                        status: "Pending", // Ensure initial mock status is Pending for testing
                        reporter: "Student X",
                        location: "Block C - Room 301"
                    },
                    {
                        id: '00008',
                        title: "Bed frame is loosed",
                        description: "Bed frame is loosed",
                        dateReported: "2025-11-12",
                        status: "Pending", // Ensure initial mock status is Pending for testing
                        reporter: "Student Y",
                        location: "Block C - Room 302"
                    },
                    // Add an 'In Progress' mock ticket for testing the new button behavior
                    {
                        id: '00001',
                        title: "Toilet basin tap leaking",
                        description: "Toilet tap has been leaking for 2 days",
                        dateReported: "2025-11-10",
                        status: "In Progress", 
                        reporter: "Student A",
                        location: "Block B - Room 101"
                    },
                     {
                        id: '00002',
                        title: "Ceiling fan speed slow",
                        description: "The ceiling fan in my room is very slow",
                        dateReported: "2025-11-09",
                        status: "In Progress", 
                        reporter: "Student B",
                        location: "Block B - Room 102"
                    },
                    // Add a 'Resolved' mock ticket for testing
                    {
                        id: '00003',
                        title: "Window broken",
                        description: "Window glass shattered",
                        dateReported: "2025-11-08",
                        status: "Resolved",
                        reporter: "Student C",
                        location: "Block A - Room 201"
                    }
                ];

                const filtered = mockTickets.filter(t => {
                    // Filter based on the selected tab
                    if (statusFilter === 'All') return true;
                    return t.status === statusFilter;
                });
                setTickets(filtered);
            } else {
                setTickets(response.data);
            }
        } catch (error) {
            console.error('Error loading tickets:', error);
            // Fallback to mock data on error if backend fails completely
            const mockTicketsOnError = [
                { id: '00009', title: "Mattress old and spoiled", description: "Mattress old and spoiled", dateReported: "2025-11-12", status: "Pending", reporter: "Student X", location: "Block C - Room 301" },
                { id: '00008', title: "Bed frame is loosed", description: "Bed frame is loosed", dateReported: "2025-11-12", status: "Pending", reporter: "Student Y", location: "Block C - Room 302" },
                { id: '00001', title: "Toilet basin tap leaking", description: "Toilet tap has been leaking for 2 days", dateReported: "2025-11-10", status: "In Progress", reporter: "Student A", location: "Block B - Room 101" },
                { id: '00002', title: "Ceiling fan speed slow", description: "The ceiling fan in my room is very slow", dateReported: "2025-11-09", status: "In Progress", reporter: "Student B", location: "Block B - Room 102" },
                { id: '00003', title: "Window broken", description: "Window glass shattered", dateReported: "2025-11-08", status: "Resolved", reporter: "Student C", location: "Block A - Room 201" }
            ];
            const filteredOnError = mockTicketsOnError.filter(t => {
                if (statusFilter === 'All') return true;
                return t.status === statusFilter;
            });
            setTickets(filteredOnError);
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
        // Find the full ticket data and set it to state to open the modal
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            setSelectedTicket(ticket);
        }
    };

    const handleCloseDetailModal = () => {
        setSelectedTicket(null);
    };

    // 🔑 UPDATED LOGIC: This function is called after "Confirm Start"
    const handleUpdateStatus = (ticketId, newStatus) => {
        // 1. Update the local state immediately
        setTickets(prevTickets =>
            prevTickets.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            )
        );

        // 2. Show success message (e.g., "You have successfully started your work!")
        setIsSuccessOpen(true);

        // 3. IMPORTANT: Update the activeTab if the current tab no longer makes sense
        // For example, if we were on 'Pending Tickets' and a ticket became 'In Progress',
        // we might want to switch to 'In Progress Tickets' tab or refresh the current one.
        // For now, let's just ensure loadTickets() is called after a delay.

        // 4. TODO: In a real app, call the API here to update the backend:
        // trackingService.updateStatus(ticketId, newStatus);

        // 5. Reload tickets after a brief delay to ensure dashboard totals and other tickets update
        // (This will also re-filter based on the current activeTab)
        setTimeout(() => {
            loadTickets(); 
            // If the tab was 'Pending Tickets', switching it will naturally hide the updated ticket.
            // If we want to automatically switch to 'In Progress Tickets' after starting work,
            // we could do: setActiveTab('In Progress Tickets');
            // For now, let's just refresh the current tab's data.
        }, 300); // Small delay for UX
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

    const renderActionButton = (ticket) => {
        let buttonText;
        let buttonAction;

        if (ticket.status === 'Pending' || ticket.status === 'Resolved') {
            // Pending -> View Details | Resolved -> View Details
            buttonText = 'View Details';
            buttonAction = () => handleViewDetails(ticket.id); // View Details opens the modal
        } else if (ticket.status === 'In Progress') {
            // In Progress -> Update Progress (Renaming 'Track Progress' back to 'Update Progress' for staff action)
            buttonText = 'Update Progress';
            buttonAction = () => handleUpdateProgress(ticket.id); // Update Progress navigates to the update form
        } else {
            return null; // Don't render anything if status is unknown
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

    // Calculate counts based on current tickets state
    const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
    const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

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
                        <div className="stat-label">Pending Tickets</div>
                        <div className="stat-value orange">{pendingCount}</div> {/* 🔑 Use calculated counts */}
                        <div className="stat-badge active">Pending</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">In Progress</div>
                        <div className="stat-value">{inProgressCount}</div> {/* 🔑 Use calculated counts */}
                        <div className="stat-badge">In Progress</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Resolved</div>
                        <div className="stat-value green">{resolvedCount}</div> {/* 🔑 Use calculated counts */}
                        <div className="stat-badge done">✓ Done</div>
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

            <TicketModal_Pending
                open={!!selectedTicket}
                onClose={handleCloseDetailModal}
                ticketData={selectedTicket}
                onUpdateStatus={handleUpdateStatus}
            />

            <SuccessMessageModal
                open={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                title="You have successfully started your work !"
                message="Status updated - In Progress !"
            />
        </div>
    );
};

export default StaffDashboard;