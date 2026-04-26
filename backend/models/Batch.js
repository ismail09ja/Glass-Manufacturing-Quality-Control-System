const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true
    },
    glassType: {
        type: String,
        required: [true, 'Glass type is required'],
        enum: ['tempered', 'laminated', 'float', 'coated', 'insulated', 'other'],
        default: 'float'
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    status: {
        type: String,
        enum: ['in-production', 'inspection', 'completed', 'rejected'],
        default: 'in-production'
    },
    productionDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for unique batch number per user
batchSchema.index({ batchNumber: 1, createdBy: 1 }, { unique: true });

// Virtual: get inspections for this batch
batchSchema.virtual('inspections', {
    ref: 'Inspection',
    localField: '_id',
    foreignField: 'batch',
    justOne: false
});

// Virtual: get defects for this batch
batchSchema.virtual('defects', {
    ref: 'Defect',
    localField: '_id',
    foreignField: 'batch',
    justOne: false
});

module.exports = mongoose.model('Batch', batchSchema);
