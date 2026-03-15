const express = require('express');
const Defect = require('../models/Defect');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/defects - Create defect
router.post('/', protect, authorize('admin', 'quality_inspector'), async (req, res) => {
    try {
        const defect = await Defect.create(req.body);
        res.status(201).json(defect);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/defects - Get all defects
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const defects = await Defect.find()
            .populate('batch', 'batchId productionLine')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Defect.countDocuments();

        res.json({ defects, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/defects/:id - Update defect resolution
router.put('/:id', protect, authorize('admin', 'quality_inspector'), async (req, res) => {
    try {
        const defect = await Defect.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!defect) return res.status(404).json({ message: 'Defect not found' });
        res.json(defect);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
