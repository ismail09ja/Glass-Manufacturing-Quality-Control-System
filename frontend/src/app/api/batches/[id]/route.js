import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Batch from '@/models/Batch';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function DELETE(request, { params }) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        const batch = await Batch.findByIdAndDelete(params.id);
        
        if (!batch) {
            return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Batch deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
