import dbConnect from '@/config/db';
import Test from '@/models/Test';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.name) {
            filter.name = { $regex: `^${filter.name}`, $options: 'i' };
        } else {
            delete filter.name;
        }
        const tests = await Test.find(filter, 'name tubeType otherTerms sampleType fastingRequired')
            .limit(limit)
            .skip((page - 1) * limit);

        const totalTests = await Test.countDocuments(filter);
        const totalPages = Math.ceil(totalTests / limit);

        return NextResponse.json({
            tests,
            pagination: {
                totalTests,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch(e) {
        console.log(e)
        return new NextResponse('Error fetching tests', { status: 500 });
    }
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}
