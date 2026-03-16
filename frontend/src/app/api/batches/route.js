import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin', 'production_manager');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        const body = await request.json();
        const batch = await Batch.create(body);
        
        return NextResponse.json(batch, { status: 201 });
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

        const batches = await Batch.find()
            .sort({ productionDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Batch.countDocuments();

        return NextResponse.json({ batches, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
