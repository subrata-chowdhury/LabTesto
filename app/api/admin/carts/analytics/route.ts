import { NextResponse } from 'next/server';
import Cart from '@/models/Cart';

export async function GET() {
    try {
        // const labs = await Lab.aggregate([
        //     { $unwind: "$prices" },
        //     { $group: { _id: { $toLower: "$location.address" }, count: { $sum: 1 } } }
        // ]);

        // const groupedData = labs.reduce((acc: Record<string, number>, lab: { _id: string, count: number }) => {
        //     acc[lab._id] = lab.count;
        //     return acc;
        // }, {});

        return NextResponse.json({ totalCarts: await Cart.countDocuments() }, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
