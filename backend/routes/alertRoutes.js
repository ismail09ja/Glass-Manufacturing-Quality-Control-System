const express = require('express');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/alerts - Get all alerts
router.get('/', protect, async (req, res) => {
    try {
        const alerts = await Alert.find()
            .populate('batch', 'batchId productionLine')
            .sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/alerts/:id/resolve - Resolve an alert
router.put('/:id/resolve', protect, authorize('admin'), async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { isResolved: true },
            { new: true }
        );
        if (!alert) return res.status(404).json({ message: 'Alert not found' });
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
