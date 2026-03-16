import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Defect from '@/models/Defect';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin', 'quality_inspector');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        const body = await request.json();
        const defect = await Defect.create(body);
        
        return NextResponse.json(defect, { status: 201 });
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

        const defects = await Defect.find()
            .populate('batch', 'batchId productionLine')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Defect.countDocuments();

        return NextResponse.json({ defects, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
