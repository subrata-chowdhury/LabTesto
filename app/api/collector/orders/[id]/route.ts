import dbConnect from "@/config/db";
import Collector, { ICollector } from "@/models/Collector";
import Lab from "@/models/Lab";
import Order from "@/models/Order";
import Test from "@/models/Test";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        const userId = await req.headers.get('x-user');

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, collector: userId })
                .populate({ path: 'items.product.test', model: Test, select: 'name' })
                .populate({ path: 'items.product.lab', model: Lab, select: 'name location' })
                .populate({ path: 'user', model: User })
                .populate({ path: 'collector', model: Collector });

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        const userId = await req.headers.get('x-user');
        const { status, paid } = await req.json();

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, collector: userId });

            if (!order) {
                return new NextResponse('Order not found', { status: 404 });
            }

            // const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            // if (order.updatedAt > oneHourAgo) {
            //     return new NextResponse('Order was updated less than an hour ago', { status: 400 });
            // }

            const validStatusTransitions = {
                'Ordered': 'Out for Sample Collection',
                'Out for Sample Collection': 'Sample Collected',
                'Sample Collected': 'Report Delivered to Lab',
                'Report Delivered to Lab': 'Report Generated',
                'Report Generated': 'Out for Report Delivery',
                'Out for Report Delivery': 'Report Delivered'
            };

            const canChangeStatus = validStatusTransitions[order.status as keyof typeof validStatusTransitions] === status || status === 'Canceled';

            if (!canChangeStatus) {
                return new NextResponse('Invalid status change', { status: 400 });
            }

            if (status) order.status = status;
            if (paid && paid >= 0) order.paid = paid;
            if (status) order.statusRecords.push({ status, date: new Date() });
            await order.save();

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e);
            return new NextResponse('Error updating order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error updating order', { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        const userId = await req.headers.get('x-user');

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, collector: userId, status: 'Ordered' });

            if (!order) {
                return new NextResponse('Order not found', { status: 404 });
            }

            if (order.exceptCollectors && order.exceptCollectors.includes(userId)) {
                return new NextResponse('Collector already excluded', { status: 400 });
            }

            order.exceptCollectors.push(userId);

            const newCollector = await Collector.find({
                _id: { $nin: order.exceptCollectors },
                reachableAreas: { $in: [order.address.pin] }
            }).lean() as unknown as ICollector[];
            if (newCollector.length === 0) {
                return new NextResponse('No verified collectors available', { status: 500 });
            }
            const randomCollector = newCollector[Math.floor(Math.random() * newCollector.length)];

            if (!randomCollector) {
                return new NextResponse('No available collectors', { status: 404 });
            }

            order.collector = randomCollector._id;
            await order.save();

            if (!order) {
                return new NextResponse('Order not found', { status: 404 });
            }

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e);
            return new NextResponse('Error updating order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error updating order', { status: 500 });
    }
}