import { NextResponse } from 'next/server';
import Lab from '@/models/Lab';

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

        return NextResponse.json({ totalLabs: await Lab.countDocuments() }, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
