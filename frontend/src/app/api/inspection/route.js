import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QualityInspection from '@/models/QualityInspection';
import Alert from '@/models/Alert';
import Batch from '@/models/Batch';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin', 'quality_inspector');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        const body = await request.json();
        
        const batch = await Batch.findById(body.batch);
        if (!batch) return NextResponse.json({ message: 'Batch not found' }, { status: 404 });

        const inspection = await QualityInspection.create(body);

        // Auto-create alert if inspection fails
        if (inspection.inspectionStatus === 'fail') {
            await Alert.create({
                batch: inspection.batch,
                message: `Batch ${batch.batchId} FAILED quality inspection. Inspector: ${inspection.inspectorName}. Surface defects: ${inspection.surfaceDefects}.`,
                severity: 'critical',
            });
        }

        return NextResponse.json(inspection, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const skip = (page - 1) * limit;

        const inspections = await QualityInspection.find()
            .populate('batch', 'batchId productionLine')
            .sort({ inspectionDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await QualityInspection.countDocuments();

        return NextResponse.json({ inspections, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
