import { NextResponse } from 'next/server';
import Collector from '@/models/Collector';

export async function GET() {
    try {
        const collectors = await Collector.aggregate([
            { $group: { _id: { $toLower: "$sampleType" }, count: { $sum: 1 } } }
        ]);

        const groupedData = collectors.reduce((acc: Record<string, number>, collector: { _id: string, count: number }) => {
            acc[collector._id] = collector.count;
            return acc;
        }, {});

        const response = {
            totalCollectors: collectors.reduce((sum, collector) => sum + collector.count, 0),
            blood: groupedData['blood'] || 0,
            urine: groupedData['urine'] || 0,
            stool: groupedData['stool'] || 0
        };

        return NextResponse.json(response, { status: 200 });
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
