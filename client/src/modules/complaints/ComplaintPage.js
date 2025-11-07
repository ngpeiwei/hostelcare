import React, { useState } from 'react';
import './Complaint.css';

function ComplaintPage() {
  const [form, setForm] = useState({ issue: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // send data to backend (POST /api/complaints)
    console.log('Complaint submitted:', form);
  };

  return (
    <div className="complaint-page">
      <h2>Complaint Submission</h2>
      <form onSubmit={handleSubmit}>
        <label>Issue Type:</label>
        <input
          type="text"
          value={form.issue}
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
        />
        <label>Description:</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ComplaintPage;

// import React from 'react';

// function ComplaintSubmission() {
//   return (
//     <div className="page-container">
//       <h2>Complaint Submission</h2>
//       <form className="form">
//         <label>Problem Type</label>
//         <select>
//           <option>Water Issue</option>
//           <option>Electricity Issue</option>
//           <option>Furniture Problem</option>
//         </select>

//         <label>Description</label>
//         <textarea placeholder="Describe the issue..."></textarea>

//         <button type="submit">Submit Complaint</button>
//       </form>
//     </div>
//   );
// }

// export default ComplaintSubmission;