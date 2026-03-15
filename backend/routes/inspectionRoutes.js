const express = require('express');
const QualityInspection = require('../models/QualityInspection');
const Alert = require('../models/Alert');
const Batch = require('../models/Batch');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/inspection - Create inspection & auto-alert on fail
router.post('/', protect, authorize('admin', 'quality_inspector'), async (req, res) => {
    try {
        const batch = await Batch.findById(req.body.batch);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        const inspection = await QualityInspection.create(req.body);

        // Auto-create alert if inspection fails
        if (inspection.inspectionStatus === 'fail') {
            await Alert.create({
                batch: inspection.batch,
                message: `Batch ${batch.batchId} FAILED quality inspection. Inspector: ${inspection.inspectorName}. Surface defects: ${inspection.surfaceDefects}.`,
                severity: 'critical',
            });
        }

        res.status(201).json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/inspection - Get all inspections
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const inspections = await QualityInspection.find()
            .populate('batch', 'batchId productionLine')
            .sort({ inspectionDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await QualityInspection.countDocuments();

        res.json({ inspections, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/inspection/:id - Update inspection
router.put('/:id', protect, authorize('admin', 'quality_inspector'), async (req, res) => {
    try {
        const inspection = await QualityInspection.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
        res.json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
