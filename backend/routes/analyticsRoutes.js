const express = require('express');
const router = express.Router();
const { getDashboard, getDefectTrends, exportData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.get('/defect-trends', protect, getDefectTrends);
router.get('/export', protect, exportData);

module.exports = router;
