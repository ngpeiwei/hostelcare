exports.submitComplaint = (req, res) => {
  const { issue, description } = req.body;
  console.log('New complaint:', issue, description);
  res.json({ message: 'Complaint submitted successfully' });
};

exports.getAllComplaints = (req, res) => {
  res.json([
    { id: 1, issue: 'Water Leakage', status: 'Pending' },
    { id: 2, issue: 'Broken Chair', status: 'Resolved' }
  ]);
};
