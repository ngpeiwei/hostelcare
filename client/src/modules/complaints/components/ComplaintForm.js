import React, { useState } from 'react';
import complaintService from '../services/complaintService';

export default function ComplaintForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [hostel, setHostel] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !category || !hostel || !room) {
      setError('Please fill required fields.');
      return;
    }
    setLoading(true);
    const payload = { title, category, subCategory, description, hostel, room };
    try {
      // Try to send to backend; if backend missing this will still fail gracefully
      const res = await complaintService.createComplaint(payload);
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
          <option value="">Select</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
        </select>
      </label>

      <label>
        Sub-Category
        <input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g., Light fixture" />
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please describe the issue in detail..." />
      </label>

      <label>
        Hostel *
        <select value={hostel} onChange={(e) => setHostel(e.target.value)}>
          <option value="">Select</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>

      <label>
        Room Number *
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g., M04-09-12A" />
      </label>

      <div className="complaint-form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onSuccess && onSuccess()} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
      </div>
    </form>
  );
}
