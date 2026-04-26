const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: [true, 'Batch reference is required']
    },
    inspector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inspectionDate: {
        type: Date,
        default: Date.now
    },
    result: {
        type: String,
        enum: ['pass', 'fail', 'conditional'],
        required: [true, 'Inspection result is required']
    },
    parameters: {
        thickness: {
            value: { type: Number },
            unit: { type: String, default: 'mm' },
            withinSpec: { type: Boolean, default: true }
        },
        clarity: {
            score: { type: Number, min: 0, max: 100 },
            withinSpec: { type: Boolean, default: true }
        },
        strength: {
            value: { type: Number },
            unit: { type: String, default: 'MPa' },
            withinSpec: { type: Boolean, default: true }
        },
        dimensions: {
            width: { type: Number },
            height: { type: Number },
            unit: { type: String, default: 'mm' },
            withinSpec: { type: Boolean, default: true }
        }
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

inspectionSchema.index({ batch: 1, createdBy: 1 });

module.exports = mongoose.model('Inspection', inspectionSchema);
