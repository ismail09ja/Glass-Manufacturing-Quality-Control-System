import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import QualityInspection from '@/models/QualityInspection';
import Defect from '@/models/Defect';
import Alert from '@/models/Alert';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin', 'production_manager');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();

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

        return NextResponse.json({
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
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
