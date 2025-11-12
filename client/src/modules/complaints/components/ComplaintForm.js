import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import ReactDOM from 'react-dom';
import complaintService from '../services/complaintService';
import '../ComplaintForm.css';


function ComplaintForm({ open, onClose }) { 
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [hostel, setHostel] = useState('');
  const [room, setRoom] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); 


  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const withPreview = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setAttachments((prev) => [...prev, ...withPreview]);
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => {
      const item = prev[index];
      if (item && item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Open preview for an attachment (object with {file, preview})
  const openPreview = (att) => {
    setPreview(att);
  };

  const closePreview = () => {
    setPreview(null);
  };

  // Close preview on Escape key when preview is open
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closePreview();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !category || !hostel || !room) {
      setError('Please fill required fields.');
      return;
    }
    setLoading(true);
    let res;
    try {
      if (attachments && attachments.length > 0) {
        const form = new FormData();
        form.append('title', title);
        form.append('category', category);
        form.append('subCategory', subCategory);
        form.append('description', description);
        form.append('hostel', hostel);
        form.append('room', room);
        attachments.forEach((a) => {
          form.append('attachments', a.file, a.file.name);
        });
        res = await complaintService.createComplaint(form);
      } else {
        const payload = { title, category, subCategory, description, hostel, room };
        res = await complaintService.createComplaint(payload);
      }

      if (res && (res.ok || res.status === 201 || res.status === 200)) {
        onClose && onClose();
        resetForm();
      } else {
        console.warn('Complaint create returned:', res);
        onClose && onClose();
      }
    } catch (err) {
      console.error('create complaint failed', err);
      setError('Failed to submit complaint. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setSubCategory('');
    setDescription('');
    setHostel('');
    setRoom('');
    attachments.forEach(a => URL.revokeObjectURL(a.preview));
    setAttachments([]);
    setError(null);
  };

  if (!open) return null;


  const modalContent = (
    <div
      className="complaint-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target.classList.contains('complaint-overlay')) onClose && onClose();
      }}
    >
      <div className="complaint-modal" role="dialog" aria-modal="true">
        <div className="complaint-modal-header">
          <h3>Complaint Ticket</h3>
          <button
            className="complaint-modal-close"
            aria-label="Close complaint form"
            onClick={() => onClose && onClose()} 
          >
            ✕
          </button>
        </div>

        <div className="complaint-modal-body">
          <form className="complaint-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Issue Title <span className="required">*</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Broken Door" autoFocus/>
            </label>
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Category <span className="required">*</span><select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled hidden>Pls Select</option>
              <option value="individual">Individual</option>
              <option value="public">Public</option></select>
            </label>
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Sub-Category <span className="required">*</span><input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g., Light fixture" />
            </label>
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe the issue in detail..." />
            </label>
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Hostel <span className="required">*</span><select value={hostel} onChange={(e) => setHostel(e.target.value)}>
              <option value="" disabled hidden>Pls Select</option>
              <option value="Restu">Restu</option>
              <option value="Saujana">Saujana</option>
              <option value="Tekun">Tekun</option>
              <option value="Fajar Harapan">Fajar Harapan</option>
              <option value="Aman Damai">Aman Damai</option>
              <option value="Bakti Permai">Bakti Permai</option>
              <option value="Cahaya Gemilang">Cahaya Gemilang</option>
              <option value="Indah Kembara">Indah Kembara</option></select>
            </label>
            <label>
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Room Number <span className="required">*</span><input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g., M04-09-12A" />
            </label>
            
            {/* Attachement */}
            <label className="attachments-label">
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attachments
              <div 
                className="file-upload-area" 
                onClick={(e) => {
                  e.preventDefault(); 
                  fileInputRef.current.click();
                }}
              >
                <div className="file-upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p>Upload photos or videos</p>
                <span className="btn-choose-file">Choose Files</span>
              </div>
              
              {/* Hidden actual file input, controlled by the ref */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Attachment Preview */}
              {attachments && attachments.length > 0 && (
                <div className="attachments-preview">
                  {attachments.map((a, idx) => (
                    <div key={idx} className="attachment-item">
                      {a.file.type.startsWith('image/') ? (
                        <img
                          src={a.preview}
                          alt={a.file.name}
                          className="attachment-thumbnail"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openPreview(a);
                          }}
                        />
                      ) : (
                        <div
                          className="attachment-thumbnail attachment-placeholder"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openPreview(a);
                          }}
                        >
                          {/* icon - could go here */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                      )}

                      <div className="attachment-info">
                        <button
                          type="button"
                          className="attachment-name-btn"
                          title="Click to preview"
                          aria-label={`Preview ${a.file.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openPreview(a);
                          }}
                        >
                          {a.file.name}
                        </button>
                        <button
                          type="button"
                            onClick={(e) => {
                            // 1. Stop the browser's default label action (this is the key fix)
                            e.preventDefault();
                            // 2. Stop the event from bubbling to other React handlers (good practice)
                            e.stopPropagation();
                            removeAttachment(idx);
                          }}
                          className="attachment-remove-btn"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </label>

            <div className="complaint-form-actions">
              <button type="button" className="btn btn-cancel" onClick={() => onClose && onClose()} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Preview portal for viewing attachment full-size (image/video or link) - thumbnail
  const previewPortal = preview ? (
    <div
      className="complaint-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target.classList.contains('complaint-overlay')) closePreview();
      }}
    >
      <div className="complaint-modal" role="dialog" aria-modal="true" style={{ maxWidth: '90%', padding: '12px' }}>
        <div className="complaint-modal-header">
          <h3 style={{ fontSize: '16px', margin: 0 }}>{preview.file.name}</h3>
          <button className="complaint-modal-close" aria-label="Close preview" onClick={closePreview}>✕</button>
        </div>
        <div className="complaint-modal-body" style={{ paddingTop: 8, textAlign: 'center' }}>
          {preview.file.type.startsWith('image/') ? (
            <img src={preview.preview} alt={preview.file.name} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 6 }} />
          ) : preview.file.type.startsWith('video/') ? (
            <video src={preview.preview} controls style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 6 }} />
          ) : (
            <div>
              <p>Preview not available for this file type.</p>
              <a href={preview.preview} target="_blank" rel="noreferrer">Open {preview.file.name}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return ReactDOM.createPortal(<>{modalContent}{previewPortal}</>, document.body);
}

export default ComplaintForm;
