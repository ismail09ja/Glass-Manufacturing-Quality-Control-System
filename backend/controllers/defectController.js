const Defect = require('../models/Defect');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/defects
// @desc    Get all defects for current user
// @access  Private
const getDefects = asyncHandler(async (req, res) => {
    const { batch, severity, status, defectType, page = 1, limit = 20 } = req.query;

    const query = { createdBy: req.user._id };
    if (batch) query.batch = batch;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (defectType) query.defectType = defectType;

    const total = await Defect.countDocuments(query);
    const defects = await Defect.find(query)
        .populate('batch', 'batchNumber glassType')
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json({
        data: defects,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    });
});

// @route   POST /api/defects
// @desc    Create defect
// @access  Private
const createDefect = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user._id;
    req.body.reportedBy = req.user._id;
    const defect = await Defect.create(req.body);

    const populated = await Defect.findById(defect._id)
        .populate('batch', 'batchNumber glassType')
        .populate('reportedBy', 'name email');

    res.status(201).json(populated);
});

// @route   GET /api/defects/:id
// @desc    Get single defect
// @access  Private
const getDefect = asyncHandler(async (req, res) => {
    const defect = await Defect.findOne({ _id: req.params.id, createdBy: req.user._id })
        .populate('batch', 'batchNumber glassType status')
        .populate('inspection')
        .populate('reportedBy', 'name email');

    if (!defect) {
        return res.status(404).json({ error: 'Defect not found' });
    }

    res.status(200).json(defect);
});

// @route   PUT /api/defects/:id
// @desc    Update defect
// @access  Private
const updateDefect = asyncHandler(async (req, res) => {
    const defect = await Defect.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        req.body,
        { new: true, runValidators: true }
    ).populate('batch', 'batchNumber glassType')
     .populate('reportedBy', 'name email');

    if (!defect) {
        return res.status(404).json({ error: 'Defect not found' });
    }

    res.status(200).json(defect);
});

// @route   DELETE /api/defects/:id
// @desc    Delete defect
// @access  Private
const deleteDefect = asyncHandler(async (req, res) => {
    const defect = await Defect.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!defect) {
        return res.status(404).json({ error: 'Defect not found' });
    }

    res.status(200).json({ message: 'Defect deleted successfully' });
});

module.exports = { getDefects, createDefect, getDefect, updateDefect, deleteDefect };
