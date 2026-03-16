import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Alert from '@/models/Alert';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function PUT(request, { params }) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        const roleError = checkRole(auth.user, 'admin');
        if (roleError) return NextResponse.json({ message: roleError.error }, { status: roleError.status });

        await connectDB();
        
        const alert = await Alert.findByIdAndUpdate(
            params.id,
            { isResolved: true },
            { new: true }
        );
        
        if (!alert) {
            return NextResponse.json({ message: 'Alert not found' }, { status: 404 });
        }
        
        return NextResponse.json(alert);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
