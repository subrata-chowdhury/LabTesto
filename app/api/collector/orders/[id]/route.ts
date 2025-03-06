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