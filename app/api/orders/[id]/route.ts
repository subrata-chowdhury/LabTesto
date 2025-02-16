import dbConnect from "@/config/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

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

        if (body.review)
            existingOrder.review = body.review

        await existingOrder.save();

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating order', { status: 500 });
    }
}