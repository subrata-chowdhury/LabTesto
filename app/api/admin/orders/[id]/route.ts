import dbConnect from "@/config/db";
import Collector from "@/models/Collector";
import Lab from "@/models/Lab";
// import Lab from "@/models/Lab";
import Order from "@/models/Order";
import Test from "@/models/Test";
import User from "@/models/User";
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

export async function DELETE(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();

        await Order.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Order deleted' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting order', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();
        const data = await req.json();

        // Verification logic
        if (!data.user) {
            return new NextResponse('User ID is required', { status: 400 });
        }
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
            return new NextResponse('At least one item is required', { status: 400 });
        }
        for (const item of data.items) {
            if (!item.product || !item.product.test || !item.product.lab || !item.product.price) {
                return new NextResponse('Each item must have a product with test, lab, and price', { status: 400 });
            }
            if (item.patientDetails?.length > 0)
                for (const patient of item.patientDetails) {
                    if (!patient.name || !patient.gender || !patient.age) {
                        return new NextResponse('Each patient detail must have name, gender, and age', { status: 400 });
                    }
                }
        }
        if (!data.address || !data.address.pin || !data.address.city || !data.address.district || !data.address.phone) {
            return new NextResponse('Address must have pin, city, district, and phone', { status: 400 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
        if (!updatedOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }
        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error updating order', { status: 500 });
    }
}