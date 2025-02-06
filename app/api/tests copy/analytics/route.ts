import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Test from '@/models/Test';

export async function GET() {
    const cookieStore = await cookies();
    const institution = cookieStore.get('institution')?.value;

    if (!institution) {
        return new NextResponse('Institution not found in cookies', { status: 400 });
    }
    try {
        const tests = await Test.aggregate([
            { $match: { institution } },
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
