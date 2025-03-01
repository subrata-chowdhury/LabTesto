import dbConnect from "@/config/db";
import Collector from "@/models/Collector";
import Lab from "@/models/Lab";
import Order from "@/models/Order";
import Test from "@/models/Test";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        const userId = await req.cookies.get('userId')?.value;

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, user: userId }).populate({ path: 'items.product.test', model: Test }).populate({ path: 'items.product.lab', model: Lab }).populate({ path: 'collector', model: Collector });

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const body = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const existingOrder = await Order.findById(req.url.split('/').pop());

        if (!existingOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }

        existingOrder.status = body.status || existingOrder.status;

        if (body.review) {
            existingOrder.review = body.review;

            const { labRating, collectorRating } = body.review;

            if (collectorRating) {
                const collector = await Collector.findById(existingOrder.collectorId);
                if (collector) {
                    collector.rating = ((collector.rating * collector.rated) + collectorRating) / (collector.rated + 1);
                    collector.rated += 1;
                    await collector.save();
                }
            }

            if (labRating) {
                const lab = await Lab.findById(existingOrder.labId);
                if (lab) {
                    lab.rating = ((lab.rating * lab.rated) + labRating) / (lab.rated + 1);
                    lab.rated += 1;
                    await lab.save();
                }
            }
        }
        await existingOrder.save();

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating order', { status: 500 });
    }
}