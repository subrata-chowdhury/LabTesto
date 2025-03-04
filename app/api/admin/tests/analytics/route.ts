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

        const response = {
            totalTests: tests.reduce((sum, test) => sum + test.count, 0),
            blood: groupedData['blood'] || 0,
            urine: groupedData['urine'] || 0,
            stool: groupedData['stool'] || 0
        };

        return NextResponse.json(response, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
