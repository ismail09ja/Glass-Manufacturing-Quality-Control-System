const express = require('express');
const Batch = require('../models/Batch');
const QualityInspection = require('../models/QualityInspection');
const Defect = require('../models/Defect');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/stats - Aggregated dashboard statistics
router.get('/stats', protect, authorize('admin', 'production_manager'), async (req, res) => {
    try {
        // Total counts
        const totalBatches = await Batch.countDocuments();
        const totalInspections = await QualityInspection.countDocuments();
        const totalDefects = await Defect.countDocuments();
        const unresolvedAlerts = await Alert.countDocuments({ isResolved: false });

        // Pass vs Fail
        const passCount = await QualityInspection.countDocuments({ inspectionStatus: 'pass' });
        const failCount = await QualityInspection.countDocuments({ inspectionStatus: 'fail' });
        const defectRate = totalInspections > 0 ? ((failCount / totalInspections) * 100).toFixed(2) : 0;

        // Batches per day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const batchesPerDay = await Batch.aggregate([
            { $match: { productionDate: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$productionDate' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Defects by type
        const defectsByType = await Defect.aggregate([
            { $group: { _id: '$defectType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Defects by severity
        const defectsBySeverity = await Defect.aggregate([
            { $group: { _id: '$severity', count: { $sum: 1 } } },
        ]);

        // Inspector performance (inspections and pass rate per inspector)
        const inspectorPerformance = await QualityInspection.aggregate([
            {
                $group: {
                    _id: '$inspectorName',
                    totalInspections: { $sum: 1 },
                    passCount: {
                        $sum: { $cond: [{ $eq: ['$inspectionStatus', 'pass'] }, 1, 0] },
                    },
                    failCount: {
                        $sum: { $cond: [{ $eq: ['$inspectionStatus', 'fail'] }, 1, 0] },
                    },
                },
            },
            {
                $addFields: {
                    passRate: {
                        $round: [{ $multiply: [{ $divide: ['$passCount', '$totalInspections'] }, 100] }, 2],
                    },
                },
            },
            { $sort: { totalInspections: -1 } },
        ]);

        // Production efficiency (pass rate)
        const productionEfficiency = totalInspections > 0
            ? ((passCount / totalInspections) * 100).toFixed(2)
            : 0;

        // Recent alerts
        const recentAlerts = await Alert.find()
            .populate('batch', 'batchId productionLine')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalBatches,
            totalInspections,
            totalDefects,
            unresolvedAlerts,
            passCount,
            failCount,
            defectRate: parseFloat(defectRate),
            productionEfficiency: parseFloat(productionEfficiency),
            batchesPerDay,
            defectsByType,
            defectsBySeverity,
            inspectorPerformance,
            recentAlerts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
