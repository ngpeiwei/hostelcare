const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');

// GET all complaints (with optional status filter)
router.get('/', getAllComplaints);

// GET single complaint by ID
router.get('/:id', getComplaintById);

// POST new complaint
router.post('/', submitComplaint);

// PUT update complaint
router.put('/:id', updateComplaint);

// DELETE complaint
router.delete('/:id', deleteComplaint);

module.exports = router;
