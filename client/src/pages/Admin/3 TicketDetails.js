import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetails.css';
import { supabase } from '../../supabaseClient';
import userImage from '../../assets/admin.png';
import logoImage from '../../assets/logo.png';

const TicketDetails = () => {
  const { id } = useParams();
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
    navigate('/auth/LoginAdmin');
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const convertDateToInputFormat = (dateString) => {
    if (!dateString) return '';
    // Backend stores dates as YYYY-MM-DD, which is perfect for date inputs
    // If somehow we get DD-MM-YYYY, convert it
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts[0].length === 2 && parts.length === 3) {
        // DD-MM-YYYY format
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }
      // Already YYYY-MM-DD format
      return dateString;
    }
    return dateString;
  };

  const loadTicket = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading ticket with ID:', id);
      
      // Fetch ticket with related data
      // Note: If you have multiple foreign keys to users, specify which one to use
      const { data, error } = await supabase
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
      
      // Fetch user data separately if needed
      let userData = null;
      if (data && data.user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('name, email, phone')
          .eq('id', data.user_id)
          .single();
        userData = user;
      }

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Ticket data:', data);

      // Map Supabase data to UI format
      const mappedTicket = {
        id: data.id,
        description: data.issue_title || data.description || 'No description',
        detailedDescription: data.detailed_description || data.description,
        dateCreated: data.created_at,
        name: userData?.name || 'N/A',
        email: userData?.email || 'N/A',
        phoneNumber: userData?.phone || 'N/A',
        category: data.category || 'N/A',
        subCategory: data.sub_category || 'N/A',
        hostel: data.hostel || 'Desasiswa Tekun',
        buildingRoom: data.building_room_number || 'N/A',
        attachments: data.complaint_attachments?.map(att => att.file_url) || [],
        staffInCharge: data.staff_in_charge || '',
        actionsToBeTaken: data.actions_to_be_taken || '',
        estimatedServiceDate: data.estimated_service_date || '',
        status: data.status || 'New'
      };

      setTicket(mappedTicket);
      setFormData({
        staffInCharge: mappedTicket.staffInCharge,
        actionsToBeTaken: mappedTicket.actionsToBeTaken,
        estimatedServiceDate: convertDateToInputFormat(mappedTicket.estimatedServiceDate),
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
      // Validation: Make sure staff is assigned
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

      console.log('💾 Saving ticket assignment:', formData);
      console.log('📝 Ticket ID:', id);
      
      // First, update the complaint status
      const { data: complaintData, error: complaintError } = await supabase
        .from('complaints')
        .update({
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (complaintError) {
        console.error('❌ Error updating complaint:', complaintError);
        throw complaintError;
      }

      console.log('✅ Complaint updated:', complaintData);

      // Get the user_id from the complaint
      const userId = complaintData.user_id;

      // Insert into ticket_assignment table
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('ticket_assignment')
        .insert({
          user_id: userId,
          complaint_id: id,
          staff_id: formData.staffInCharge, // Assuming this is the staff ID or use a separate staffId field
          staffName: formData.staffInCharge, // The staff name selected
          assigned_at: new Date().toISOString()
        })
        .select();

      if (assignmentError) {
        console.error('❌ Error creating assignment:', assignmentError);
        throw assignmentError;
      }

      console.log('✅ Assignment created successfully:', assignmentData);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('💥 Error saving ticket assignment:', error);
      alert(`Failed to save assignment: ${error.message}. Please try again.`);
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
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert('File not available');
    }
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

  const staffOptions = ['Nazrul Hakim', 'Muqtadir Syabil', 'Siti Aminah', 'Mohd Razif'];
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
                <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
            {/* Left Column - Complaint Details */}
            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date created
              </label>
              <input
                type="text"
                className="form-input"
                value={formatDate(ticket.dateCreated)}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ticket ID
              </label>
              <input
                type="text"
                className="form-input"
                value={`#${ticket.id}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Name
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Category
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.category}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Sub-category
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.subCategory}
                disabled
              />
            </div>

            {/* Middle Column - Location & Description */}
            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Hostel
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.hostel}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Phone Number
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.phoneNumber}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Building and Room Number
              </label>
              <input
                type="text"
                className="form-input"
                value={ticket.buildingRoom}
                disabled
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Description
              </label>
              <textarea
                className="form-textarea"
                value={ticket.detailedDescription || ticket.description || 'No description provided'}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attachments
              </label>
              {ticket.attachments && ticket.attachments.length > 0 ? (
                <div className="attachment-group">
                  {ticket.attachments.map((fileUrl, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <span className="attachment-name">Attachment {index + 1}</span>
                      <button
                        type="button"
                        className="download-button"
                        onClick={() => handleDownload(fileUrl)}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="attachment-name">No attachments</span>
              )}
            </div>

            {/* Right Column - Resolution & Status */}
            <div className="form-group">
              <label className="form-label required">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Staff-In-Charge
              </label>
              <select
                name="staffInCharge"
                className="form-select editable"
                value={formData.staffInCharge}
                onChange={handleInputChange}
              >
                <option value="">Choose Staff-In-Charge</option>
                {staffOptions.map(staff => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label required">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Actions to be taken
              </label>
              <textarea
                name="actionsToBeTaken"
                className="form-textarea editable"
                value={formData.actionsToBeTaken}
                onChange={handleInputChange}
                placeholder="Insert actions to be taken here..."
              />
            </div>

            <div className="form-group">
              <label className="form-label required">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Estimated Service Date
              </label>
              <input
                type="date"
                name="estimatedServiceDate"
                className="form-input editable"
                value={formData.estimatedServiceDate}
                onChange={handleInputChange}
                placeholder="Input Service Date"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">
                <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Ticket Status
              </label>
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
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>

            {showSuccess && (
              <div className="success-message">
                Changes successfully saved!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;