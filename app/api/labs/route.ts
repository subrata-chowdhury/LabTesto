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
            filter.name = { $regex: `^${filter.name}`, $options: 'i' };
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

export async function POST(req: NextRequest) {
    const body = await req.json();

    await dbConnect();

    // validation logic
    if (!body) {
        return new NextResponse('Request body is missing', { status: 400 });
    }
    if (!body.name) {
        return new NextResponse('Name is required', { status: 400 });
    }
    if (!body.location || !body.location.address || !body.location.location) {
        return new NextResponse('Complete location information is required', { status: 400 });
    }

    const existingLab = await Lab.findOne({ name: body.name });
    if (existingLab) {
        return new NextResponse('Lab with this name already exists', { status: 400 });
    }

    const labData = {
        name: body.name,
        location: body.location,
        certification: body.certification,
        prices: body.prices,
        packagesInclude: body.packagesInclude,
        ranges: body.ranges
    }

    const lab = new Lab(labData);

    try {
        await lab.save();
    } catch(e) {
        console.log(e)
        return new NextResponse('Error saving lab', { status: 500 });
    }
    return NextResponse.json({ message: 'Lab saved successfully' }, { status: 200 });
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}
