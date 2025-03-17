import { NextResponse } from 'next/server';
// import Test from '@/models/Test';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';

export async function GET() {
    try {
        const clients = await User.countDocuments();
        const admins = await AdminUser.countDocuments();
        const response = {
            totalUsers: clients + admins,
            clients,
            admins,
        };

        return NextResponse.json(response, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
