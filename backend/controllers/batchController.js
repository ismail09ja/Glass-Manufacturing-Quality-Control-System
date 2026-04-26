const Batch = require('../models/Batch');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/batches
// @desc    Get all batches for current user
// @access  Private
const getBatches = asyncHandler(async (req, res) => {
    const { status, glassType, search, page = 1, limit = 20 } = req.query;

    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (glassType) query.glassType = glassType;
    if (search) {
        query.$or = [
            { batchNumber: { $regex: search, $options: 'i' } },
            { notes: { $regex: search, $options: 'i' } }
        ];
    }

    const total = await Batch.countDocuments(query);
    const batches = await Batch.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.status(200).json({
        data: batches,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    });
});

// @route   POST /api/batches
// @desc    Create a new batch
// @access  Private
const createBatch = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user._id;
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
});

// @route   GET /api/batches/:id
// @desc    Get single batch with inspections and defects
// @access  Private
const getBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findOne({ _id: req.params.id, createdBy: req.user._id })
        .populate('inspections')
        .populate('defects');

    if (!batch) {
        return res.status(404).json({ error: 'Batch not found' });
    }

    res.status(200).json(batch);
});

// @route   PUT /api/batches/:id
// @desc    Update a batch
// @access  Private
const updateBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!batch) {
        return res.status(404).json({ error: 'Batch not found' });
    }

    res.status(200).json(batch);
});

// @route   DELETE /api/batches/:id
// @desc    Delete a batch
// @access  Private
const deleteBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!batch) {
        return res.status(404).json({ error: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch deleted successfully' });
});

module.exports = { getBatches, createBatch, getBatch, updateBatch, deleteBatch };
