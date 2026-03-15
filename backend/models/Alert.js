const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: [true, 'Batch reference is required'],
    },
    message: {
        type: String,
        required: [true, 'Alert message is required'],
    },
    severity: {
        type: String,
        enum: ['warning', 'critical'],
        default: 'critical',
    },
    isResolved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

alertSchema.index({ isResolved: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
