import dbConnect from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const id = await req.headers.get('x-user');
        if (!id) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        if (filter.name) {
            if (isValidObjectId(filter.name)) {
                filter._id = filter.name
            } else {
                const totalOrders = await Order.countDocuments({ ...filter, collector: id });
                const totalPages = Math.ceil(totalOrders / limit);
                return NextResponse.json({
                    orders: [],
                    pagination: {
                        totalOrders,
                        totalPages,
                        currentPage: page,
                        pageSize: limit,
                    },
                });
            }
        }
        delete filter.name;

        if (filter.date) {
            const date = new Date(new Date(filter.date).setHours(0, 0, 0, 0));
            const nextDay = new Date(date);
            nextDay.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: date.toISOString(),
                $lt: nextDay.toISOString(),
            };
            delete filter.date;
        }

        await dbConnect();

        const orders = await Order.find({ ...filter, collector: id })
            .limit(limit)
            .skip((page - 1) * limit)
            .populate({ path: 'user', model: User });

        const totalOrders = await Order.countDocuments({ ...filter, collector: id });
        const totalPages = Math.ceil(totalOrders / limit);

        return NextResponse.json({
            orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}
