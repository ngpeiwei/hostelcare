import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetails.css';
import { supabase } from '../../supabaseClient';
import userImage from '../../assets/admin.png';
import logoImage from '../../assets/logo.png';

const TicketDetails = () => {
  const [staffList, setStaffList] = useState([]);
  const { id } = useParams(); // This is complaints.id
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    status: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
    loadTicket();
    loadStaff();
  }, [id]);

  const loadStaff = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('role', 'Staff');

    if (error) {
      console.error('❌ Error loading staff:', error);
      return;
    }

    setStaffList(data);
  };

  const convertDateToInputFormat = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts[0].length === 2 && parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }
      return dateString;
    }
    return dateString;
  };

  const loadTicket = async () => {
    try {
      setLoading(true);

      // Fetch complaint + attachments
      const { data: complaintData, error } = await supabase
        .from('complaints')
        .select(`
          *,
          complaint_attachments (
            file_url,
            file_type
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch user info
      let userData = null;
      if (complaintData && complaintData.user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('name, email, phone')
          .eq('id', complaintData.user_id)
          .single();
        userData = user;
      }

      const mappedTicket = {
        id: complaintData.id,
        description: complaintData.issue_title || complaintData.description || 'No description',
        detailedDescription: complaintData.detailed_description || complaintData.description,
        dateCreated: complaintData.created_at,
        name: userData?.name || 'N/A',
        email: userData?.email || 'N/A',
        phoneNumber: userData?.phone || 'N/A',
        category: complaintData.category || 'N/A',
        subCategory: complaintData.sub_category || 'N/A',
        hostel: complaintData.hostel || 'Desasiswa Tekun',
        buildingRoom: complaintData.building_room_number || 'N/A',
        attachments: complaintData.complaint_attachments?.map(att => att.file_url) || [],
        status: complaintData.status || 'New'
      };

      setTicket(mappedTicket);
      setFormData({
        staffInCharge: '',
        actionsToBeTaken: '',
        estimatedServiceDate: '',
        status: mappedTicket.status
      });
    } catch (error) {
      console.error('💥 Error loading ticket:', error);
      alert('Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.staffInCharge) {
        alert('Please assign a Staff-In-Charge before saving.');
        return;
      }

      if (!formData.actionsToBeTaken) {
        alert('Please enter Actions to be taken before saving.');
        return;
      }

      if (!formData.estimatedServiceDate) {
        alert('Please select an Estimated Service Date before saving.');
        return;
      }

      // Update complaint status
      const { error: complaintError } = await supabase
        .from('complaints')
        .update({
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (complaintError) throw complaintError;

      // Insert assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('ticket_assignments')
        .insert({
          ticket_id: id, // Link to complaints.id
          staff_id: formData.staffInCharge,
          actions_to_be_taken: formData.actionsToBeTaken,
          estimated_service_date: formData.estimatedServiceDate,
          assigned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      console.error('💥 Error saving assignment:', err);
      alert(`Failed to save assignment: ${err.message}. Please try again.`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) window.open(fileUrl, '_blank');
    else alert('File not available');
  };

  if (loading) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-content">
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-content">
          <p>Ticket not found</p>
          <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const statusOptions = ['New', 'Pending', 'In Progress', 'Resolved'];

  return (
    <div className="ticket-details-page">
      {/* Header */}
      <div className="ticket-details-header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logoImage} alt="logoImage" className="logo-icon" />
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
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="ticket-details-content">
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="ticket-details-card">
          <h2 className="ticket-details-title">Ticket Details</h2>

          {/* Issue Banner */}
          <div className="issue-banner">
            <p className="issue-text">{ticket.description}</p>
          </div>

          {/* Ticket Form */}
          <form className="ticket-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

            {/* Left Column */}
            <div className="form-group">
              <label>Date created</label>
              <input type="text" className="form-input" value={formatDate(ticket.dateCreated)} disabled />
            </div>

            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" value={ticket.name} disabled />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-input" value={ticket.email} disabled />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-input" value={ticket.phoneNumber} disabled />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" className="form-input" value={ticket.category} disabled />
            </div>

            <div className="form-group">
              <label>Sub-category</label>
              <input type="text" className="form-input" value={ticket.subCategory} disabled />
            </div>

            <div className="form-group">
              <label>Hostel</label>
              <input type="text" className="form-input" value={ticket.hostel} disabled />
            </div>

            <div className="form-group">
              <label>Building & Room Number</label>
              <input type="text" className="form-input" value={ticket.buildingRoom} disabled />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea className="form-textarea" value={ticket.detailedDescription} disabled />
            </div>

            <div className="form-group">
              <label>Staff-In-Charge</label>
              <select
                name="staffInCharge"
                className="form-select editable"
                value={formData.staffInCharge}
                onChange={handleInputChange}
              >
                <option value="">Choose Staff-In-Charge</option>
                {staffList.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Actions to be taken</label>
              <textarea
                name="actionsToBeTaken"
                className="form-textarea editable"
                value={formData.actionsToBeTaken}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Estimated Service Date</label>
              <input
                type="date"
                name="estimatedServiceDate"
                className="form-input editable"
                value={formData.estimatedServiceDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Ticket Status</label>
              <select
                name="status"
                className="form-select editable"
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
            </div>

            {showSuccess && <div className="success-message">Changes successfully saved!</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
