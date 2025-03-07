import dbConnect from '@/config/db';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';
import Collector from '@/models/Collector';
import Test from '@/models/Test';
import Lab from '@/models/Lab';
import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        const match = year ? { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) } } : {};

        const totalUsers = await User.countDocuments(match);
        const totalAdmins = await AdminUser.countDocuments(match);
        const totalCollectors = await Collector.countDocuments(match);
        const totalTests = await Test.countDocuments(match);
        const totalLabs = await Lab.countDocuments(match);
        const totalOrders = await Order.countDocuments(match);

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
