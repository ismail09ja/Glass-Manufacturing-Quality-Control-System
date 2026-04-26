const Batch = require('../models/Batch');
const Inspection = require('../models/Inspection');
const Defect = require('../models/Defect');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard KPIs and summary data
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Total counts
    const [totalBatches, totalInspections, totalDefects] = await Promise.all([
        Batch.countDocuments({ createdBy: userId }),
        Inspection.countDocuments({ createdBy: userId }),
        Defect.countDocuments({ createdBy: userId })
    ]);

    // Batch status distribution
    const batchStatusDist = await Batch.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Inspection pass/fail/conditional
    const inspectionResults = await Inspection.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$result', count: { $sum: 1 } } }
    ]);

    // Calculate pass rate
    const passCount = inspectionResults.find(r => r._id === 'pass')?.count || 0;
    const passRate = totalInspections > 0 ? ((passCount / totalInspections) * 100).toFixed(1) : 0;

    // Open defects count
    const openDefects = await Defect.countDocuments({ createdBy: userId, status: 'open' });

    // Defect severity distribution
    const defectSeverityDist = await Defect.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Defect type distribution
    const defectTypeDist = await Defect.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$defectType', count: { $sum: 1 } } }
    ]);

    // Recent activity (last 10 items)
    const [recentBatches, recentInspections, recentDefects] = await Promise.all([
        Batch.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5).select('batchNumber status createdAt'),
        Inspection.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5)
            .populate('batch', 'batchNumber').select('result createdAt batch'),
        Defect.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5)
            .populate('batch', 'batchNumber').select('defectType severity status createdAt batch')
    ]);

    // Inspections today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inspectionsToday = await Inspection.countDocuments({
        createdBy: userId,
        createdAt: { $gte: today }
    });

    res.status(200).json({
        kpis: {
            totalBatches,
            totalInspections,
            totalDefects,
            openDefects,
            passRate: parseFloat(passRate),
            inspectionsToday
        },
        distributions: {
            batchStatus: batchStatusDist,
            inspectionResults,
            defectSeverity: defectSeverityDist,
            defectType: defectTypeDist
        },
        recentActivity: {
            batches: recentBatches,
            inspections: recentInspections,
            defects: recentDefects
        }
    });
});

// @route   GET /api/analytics/defect-trends
// @desc    Get defect trends over time (last 30 days)
// @access  Private
const getDefectTrends = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const days = parseInt(req.query.days);
    const { from, to } = req.query;

    let startDate;
    let endDate = new Date();

    if (from) {
        startDate = new Date(from);
    } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - (days || 30));
    }
    
    if (to) {
        endDate = new Date(to);
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const trends = await Defect.aggregate([
        {
            $match: {
                createdBy: userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    severity: '$severity'
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.date': 1 } }
    ]);

    // Also get production trends
    const productionTrends = await Batch.aggregate([
        {
            $match: {
                createdBy: userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ defectTrends: trends, productionTrends });
});

// @route   GET /api/analytics/export
// @desc    Export data to CSV
// @access  Private
const exportData = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const userId = req.user._id;
    let data = [];
    let fields = [];
    let filename = `export_${type || 'data'}_${new Date().getTime()}.csv`;

    if (type === 'batches') {
        data = await Batch.find({ createdBy: userId }).sort({ createdAt: -1 });
        fields = ['batchNumber', 'glassType', 'quantity', 'status', 'createdAt'];
    } else if (type === 'inspections') {
        data = await Inspection.find({ createdBy: userId }).populate('batch', 'batchNumber').sort({ createdAt: -1 });
        fields = ['batch.batchNumber', 'result', 'parameters.clarity.score', 'createdAt'];
    } else if (type === 'defects') {
        data = await Defect.find({ createdBy: userId }).populate('batch', 'batchNumber').sort({ createdAt: -1 });
        fields = ['batch.batchNumber', 'defectType', 'severity', 'status', 'createdAt'];
    } else {
        return res.status(400).json({ message: 'Invalid export type. Use batches, inspections, or defects.' });
    }

    // Simple CSV generation
    const csvRows = [];
    // Header
    csvRows.push(fields.join(','));

    // Body
    for (const item of data) {
        const values = fields.map(field => {
            const val = field.split('.').reduce((obj, key) => obj?.[key], item);
            const stringVal = val === undefined || val === null ? '' : String(val);
            // Escape quotes and commas
            return `"${stringVal.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.status(200).send(csvContent);
});

module.exports = { getDashboard, getDefectTrends, exportData };
