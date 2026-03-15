const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema({
    defectType: {
        type: String,
        required: [true, 'Defect type is required'],
        enum: ['crack', 'bubble', 'scratch', 'discoloration', 'thickness_variation', 'contamination', 'other'],
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: [true, 'Severity level is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: [true, 'Batch reference is required'],
    },
    correctiveAction: {
        type: String,
        default: '',
    },
    resolutionStatus: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open',
    },
}, { timestamps: true });

defectSchema.index({ batch: 1 });
defectSchema.index({ severity: 1 });
defectSchema.index({ resolutionStatus: 1 });

module.exports = mongoose.model('Defect', defectSchema);
