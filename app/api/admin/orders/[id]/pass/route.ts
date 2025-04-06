import dbConnect from "@/config/db";
import Collector, { ICollector } from "@/models/Collector";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, status: 'Ordered' });

            if (!order) {
                return new NextResponse('Order not found', { status: 404 });
            }

            if (order.exceptCollectors && order.exceptCollectors.includes(order.collector)) {
                return new NextResponse('Collector already excluded', { status: 400 });
            }

            order.exceptCollectors.push(order.collector);

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