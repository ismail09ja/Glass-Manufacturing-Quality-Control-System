const Inspection = require('../models/Inspection');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/inspections
// @desc    Get all inspections for current user
// @access  Private
const getInspections = asyncHandler(async (req, res) => {
    const { batch, result, page = 1, limit = 20 } = req.query;

    const query = { createdBy: req.user._id };
    if (batch) query.batch = batch;
    if (result) query.result = result;

    const total = await Inspection.countDocuments(query);
    const inspections = await Inspection.find(query)
        .populate('batch', 'batchNumber glassType status')
        .populate('inspector', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json({
        data: inspections,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    });
});

// @route   POST /api/inspections
// @desc    Create inspection
// @access  Private
const createInspection = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user._id;
    req.body.inspector = req.user._id;
    const inspection = await Inspection.create(req.body);

    const populated = await Inspection.findById(inspection._id)
        .populate('batch', 'batchNumber glassType status')
        .populate('inspector', 'name email');

    res.status(201).json(populated);
});

// @route   GET /api/inspections/:id
// @desc    Get single inspection
// @access  Private
const getInspection = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findOne({ _id: req.params.id, createdBy: req.user._id })
        .populate('batch', 'batchNumber glassType status quantity')
        .populate('inspector', 'name email');

    if (!inspection) {
        return res.status(404).json({ error: 'Inspection not found' });
    }

    res.status(200).json(inspection);
});

// @route   PUT /api/inspections/:id
// @desc    Update inspection
// @access  Private
const updateInspection = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        req.body,
        { new: true, runValidators: true }
    ).populate('batch', 'batchNumber glassType status')
     .populate('inspector', 'name email');

    if (!inspection) {
        return res.status(404).json({ error: 'Inspection not found' });
    }

    res.status(200).json(inspection);
});

// @route   DELETE /api/inspections/:id
// @desc    Delete inspection
// @access  Private
const deleteInspection = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!inspection) {
        return res.status(404).json({ error: 'Inspection not found' });
    }

    res.status(200).json({ message: 'Inspection deleted successfully' });
});

module.exports = { getInspections, createInspection, getInspection, updateInspection, deleteInspection };
