import mongoose from 'mongoose';

const qualityInspectionSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: [true, 'Batch reference is required'] },
    thickness: { type: Number, required: [true, 'Thickness measurement is required'] },
    transparencyLevel: { type: Number, required: [true, 'Transparency level is required'], min: 0, max: 100 },
    surfaceDefects: { type: String, enum: ['none', 'minor', 'moderate', 'severe'], default: 'none' },
    strengthTestResult: { type: Number, required: [true, 'Strength test result is required'] },
    inspectionStatus: { type: String, enum: ['pass', 'fail'], required: [true, 'Inspection status is required'] },
    inspectorName: { type: String, required: [true, 'Inspector name is required'] },
    inspectionDate: { type: Date, default: Date.now },
}, { timestamps: true });

qualityInspectionSchema.index({ batch: 1 });
qualityInspectionSchema.index({ inspectionStatus: 1 });
qualityInspectionSchema.index({ inspectionDate: -1 });

export default mongoose.models.QualityInspection || mongoose.model('QualityInspection', qualityInspectionSchema);
