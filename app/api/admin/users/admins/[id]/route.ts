import dbConnect from '@/config/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();

        const user = await User.findById(id);
        if (!user) return new NextResponse('User not found', { status: 404 });

        await user.remove();
        return new NextResponse('User deleted', { status: 200 });
    } catch {
        return new NextResponse('Error deleting user', { status: 500 });
    }
}