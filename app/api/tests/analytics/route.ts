import { NextResponse } from 'next/server';
import Test from '@/models/Test';

export async function GET() {
    try {
        const tests = await Test.aggregate([
            { $group: { _id: { $toLower: "$sampleType" }, count: { $sum: 1 } } }
        ]);

        const groupedData = tests.reduce((acc: Record<string, number>, test: { _id: string, count: number }) => {
            acc[test._id] = test.count;
            return acc;
        }, {});

        return NextResponse.json(groupedData, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
