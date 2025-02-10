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

        // const { test: testId, lab: labId } = body.product;
        // const existingItemIndex = existingOrder.items.findIndex((item: { product: { test: string, lab: string } }) => item.product.test.toString() === testId && item.product.lab.toString() === labId);
        // if (existingItemIndex === -1) {
        //     return new NextResponse('Item not found in order', { status: 404 });
        // }

        // const existingItem = existingOrder.items[existingItemIndex];
        // existingItem.quantity = body.quantity || existingItem.quantity;
        existingOrder.status = body.status || existingOrder.status;
        // existingItem.date = new Date();
        // existingItem.patientDetails = body.patientDetails || existingItem.patientDetails || [];
        // if (existingItem.patientDetails.length > body.quantity) {
        //     existingItem.patientDetails = existingItem.patientDetails.slice(0, body.quantity);
        // }

        // existingOrder.items[existingItemIndex] = existingItem;
        await existingOrder.save();

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating order', { status: 500 });
    }
}