import dbConnect from "@/config/db";
// import Lab from "@/models/Lab";
import Order from "@/models/Order";
// import Test from "@/models/Test";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = await req.url.split('/').pop();

        if (!id) {
            return new NextResponse('ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findById(id)
            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();

        const cart = await Order.findByIdAndDelete(id);
        if (!cart) {
            return new NextResponse('Order not found', { status: 404 });
        }
        return new NextResponse('Order deleted', { status: 204 });
    } catch {
        return new NextResponse('Error deleting order', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();
        const body = await req.json();
        const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });
        if (!updatedOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }
        return new NextResponse(JSON.stringify(updatedOrder), { status: 200 });
    } catch {
        return new NextResponse('Error updating order', { status: 500 });
    }
}