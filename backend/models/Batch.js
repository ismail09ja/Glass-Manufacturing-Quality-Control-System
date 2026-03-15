const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: [true, 'Batch ID is required'],
        unique: true,
        trim: true,
    },
    furnaceTemperature: {
        type: Number,
        required: [true, 'Furnace temperature is required'],
    },
    rawMaterialComposition: {
        type: String,
        required: [true, 'Raw material composition is required'],
    },
    productionDate: {
        type: Date,
        required: [true, 'Production date is required'],
        default: Date.now,
    },
    productionLine: {
        type: String,
        required: [true, 'Production line is required'],
    },
    shift: {
        type: String,
        enum: ['morning', 'afternoon', 'night'],
        required: [true, 'Shift is required'],
    },
    operatorName: {
        type: String,
        required: [true, 'Operator name is required'],
    },
}, { timestamps: true });

batchSchema.index({ productionDate: -1 });
batchSchema.index({ productionLine: 1 });

module.exports = mongoose.model('Batch', batchSchema);
