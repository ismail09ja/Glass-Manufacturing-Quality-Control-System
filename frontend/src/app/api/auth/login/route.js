import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password } = body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json(
            { message: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
