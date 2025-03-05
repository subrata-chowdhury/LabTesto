import dbConnect from '@/config/db';
import Order from '@/models/Order';
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

        await dbConnect();

        const orders = await Order.find({ ...filter, collector: id })
            .limit(limit)
            .skip((page - 1) * limit);

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
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}
