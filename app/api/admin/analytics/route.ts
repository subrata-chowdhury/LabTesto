import dbConnect from '@/config/db';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';
import Collector from '@/models/Collector';
import Test from '@/models/Test';
import Lab from '@/models/Lab';
import { NextResponse } from 'next/server';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();

        const totalUsers = await User.countDocuments();
        const totalAdmins = await AdminUser.countDocuments();
        const totalCollectors = await Collector.countDocuments();
        const totalTests = await Test.countDocuments();
        const totalLabs = await Lab.countDocuments();
        const totalOrders = await Order.countDocuments();

        const analytics = {
            totalTests,
            totalLabs,
            totalCollectors,
            totalUsers,
            totalAdmins,
            totalOrders
        };

        return NextResponse.json(analytics, { status: 200 });
    } catch {
        return new NextResponse('Error fetching analytics', { status: 500 });
    }
}
