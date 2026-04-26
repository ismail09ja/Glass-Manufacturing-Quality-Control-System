const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: [true, 'Batch reference is required']
    },
    inspection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inspection'
    },
    defectType: {
        type: String,
        enum: ['crack', 'bubble', 'scratch', 'discoloration', 'dimensional', 'other'],
        required: [true, 'Defect type is required']
    },
    severity: {
        type: String,
        enum: ['critical', 'major', 'minor'],
        required: [true, 'Severity is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['open', 'under-review', 'resolved', 'accepted'],
        default: 'open'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

defectSchema.index({ batch: 1, createdBy: 1 });
defectSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('Defect', defectSchema);
