import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Defect from '@/models/Defect';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function PUT(request, { params }) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin', 'quality_inspector');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        const body = await request.json();
        
        const defect = await Defect.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        
        if (!defect) {
            return NextResponse.json({ message: 'Defect not found' }, { status: 404 });
        }
        
        return NextResponse.json(defect);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
