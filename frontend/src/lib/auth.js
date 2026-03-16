import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from '../models/User';

export async function verifyAuth(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return { error: 'Not authorized, no token', status: 401 };
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await connectDB();
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return { error: 'User not found', status: 401 };
        return { user };
    } catch (error) {
        return { error: 'Not authorized, token failed', status: 401 };
    }
}

export function checkRole(user, ...roles) {
    if (!roles.includes(user.role)) {
        return { error: 'Not authorized for this role', status: 403 };
    }
    return null;
}
