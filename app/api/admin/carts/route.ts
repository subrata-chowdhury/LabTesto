import dbConnect from "@/config/db";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const carts = await Cart.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalCarts = await Cart.countDocuments(filter);
        const totalPages = Math.ceil(totalCarts / limit);

        return NextResponse.json({
            carts,
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