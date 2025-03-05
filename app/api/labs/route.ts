import dbConnect from '@/config/db';
import Lab from '@/models/Lab';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.name) {
            filter.name = { $regex: `${filter.name}`, $options: 'i' };
        } else {
            delete filter.name;
        }

        const labs = await Lab.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalLabs = await Lab.countDocuments(filter);
        const totalPages = Math.ceil(totalLabs / limit);

        return NextResponse.json({
            labs,
            pagination: {
                totalLabs,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching labs', { status: 500 });
    }
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}
