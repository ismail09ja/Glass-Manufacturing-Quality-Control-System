import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Alert from '@/models/Alert';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await verifyAuth(request);
        if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

        await connectDB();
        
        const alerts = await Alert.find()
            .populate('batch', 'batchId productionLine')
            .sort({ createdAt: -1 });
            
        return NextResponse.json(alerts);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
