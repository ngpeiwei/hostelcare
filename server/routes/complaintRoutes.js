const express = require('express');
const router = express.Router();
const { submitComplaint, getAllComplaints } = require('../controllers/complaintController');

// POST new complaint
router.post('/', submitComplaint);

// GET all complaints
router.get('/', getAllComplaints);

module.exports = router;
