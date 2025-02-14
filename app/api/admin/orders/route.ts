import dbConnect from "@/config/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const orders = await Order.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalCarts = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalCarts / limit);

        return NextResponse.json({
            orders,
            pagination: {
                totalCarts,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching carts', { status: 500 });
    }
}