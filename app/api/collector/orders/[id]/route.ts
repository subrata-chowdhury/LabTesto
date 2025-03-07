import dbConnect from "@/config/db";
import Collector from "@/models/Collector";
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
                .populate({ path: 'items.product.test', model: Test })
                .populate({ path: 'items.product.lab', model: Lab })
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
            const order = await Order.findOneAndUpdate(
                { _id: id, collector: userId },
                { status, paid },
                { new: true }
            );

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

            if (order.exceptCollectors && order.exceptCollectors.includes(userId)) {
                return new NextResponse('Collector already excluded', { status: 400 });
            }

            order.exceptCollectors.push(userId);

            const newCollector = await Collector.findOne({
                _id: { $nin: order.exceptCollectors }
            });

            if (!newCollector) {
                return new NextResponse('No available collectors', { status: 404 });
            }

            order.collector = newCollector._id;
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