import React, { useState } from 'react';
import complaintService from '../services/complaintService';

export default function ComplaintForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [hostel, setHostel] = useState('');
  const [room, setRoom] = useState('');
  // attachments stored as { file: File, preview: string }
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const withPreview = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setAttachments((prev) => [...prev, ...withPreview]);
    // reset input value so same file can be re-selected if removed
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => {
      const item = prev[index];
      if (item && item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !category || !hostel || !room) {
      setError('Please fill required fields.');
      return;
    }
    setLoading(true);
    // prepare payload; if attachments present, send as FormData
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
          // backend should accept multiple files under 'attachments' key
          form.append('attachments', a.file, a.file.name);
        });
        res = await complaintService.createComplaint(form);
      } else {
        const payload = { title, category, subCategory, description, hostel, room };
        res = await complaintService.createComplaint(payload);
      }

      // if API returned ok-ish response, call onSuccess
      if (res && (res.ok || res.status === 201 || res.status === 200)) {
        onSuccess && onSuccess();
      } else {
        // fallback: still close and log
        console.warn('Complaint create returned:', res);
        onSuccess && onSuccess();
      }
    } catch (err) {
      console.error('create complaint failed', err);
      setError('Failed to submit complaint. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label>
        Issue Title *
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Broken Door"
          autoFocus
        />
      </label>

      <label>
        Category *
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled hidden>Pls Select</option>
          <option value="individual">Individual</option>
          <option value="public">Public</option>
        </select>
      </label>

      <label>
        Sub-Category *
        <input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g., Light fixture" />
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe the issue in detail..." />
      </label>

      <label>
        Hostel *
        <select value={hostel} onChange={(e) => setHostel(e.target.value)}>
          <option value="" disabled hidden>Pls Select</option>
          <option value="Restu">Restu</option>
          <option value="Saujana">Saujana</option>
          <option value="Tekun">Tekun</option>
          <option value="Fajar Harapan">Fajar Harapan</option>
          <option value="Aman Damai">Aman Damai</option>
          <option value="Bakti Permai">Bakti Permai</option>
          <option value="Cahaya Gemilang">Cahaya Gemilang</option>
           <option value="Indah Kembara">Indah Kembara</option>
        </select>
      </label>

      <label>
        Room Number *
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g., M04-09-12A" />
      </label>

      <label>
        Attachments
        <div style={{ marginTop: 8 }}>
          <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        {attachments && attachments.length > 0 && (
          <div className="attachments-preview" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {attachments.map((a, idx) => (
              <div key={idx} className="attachment-item" style={{ width: 120, border: '1px solid #e5e7eb', padding: 6, borderRadius: 6 }}>
                {a.file.type.startsWith('image/') ? (
                  <img src={a.preview} alt={a.file.name} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                  <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.file.name}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <small style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.file.name}</small>
                  <button type="button" onClick={() => removeAttachment(idx)} style={{ background: 'transparent', border: 0, color: '#d33', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </label>

      <div className="complaint-form-actions">
        <button type="button" className="btn btn-cancel" onClick={() => onSuccess && onSuccess()} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
      </div>
    </form>
  );
}
