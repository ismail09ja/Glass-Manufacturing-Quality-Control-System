const express = require('express');
const Batch = require('../models/Batch');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/batches - Create new batch
router.post('/', protect, authorize('admin', 'production_manager'), async (req, res) => {
    try {
        const batch = await Batch.create(req.body);
        res.status(201).json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/batches - Get all batches
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const batches = await Batch.find()
            .sort({ productionDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Batch.countDocuments();

        res.json({ batches, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/batches/:id - Delete batch (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const batch = await Batch.findByIdAndDelete(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        res.json({ message: 'Batch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
