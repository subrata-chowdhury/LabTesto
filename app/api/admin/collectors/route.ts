import dbConnect from '@/config/db';
import Collector from '@/models/Collector';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.email) {
            filter.email = { $regex: `^${filter.email}`, $options: 'i' };
        } else {
            delete filter.email;
        }

        const collectors = await Collector.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        collectors.forEach(collector => {
            collector.password = '';
        });
        const totalCollectors = await Collector.countDocuments(filter);
        const totalPages = Math.ceil(totalCollectors / limit);

        return NextResponse.json({
            collectors,
            pagination: {
                totalCollectors,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching collectors', { status: 500 });
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
    if (!body.email) {
        return new NextResponse('Email is required', { status: 400 });
    }
    if (!body.password) {
        return new NextResponse('Password is required', { status: 400 });
    }

    const existingCollector = await Collector.findOne({ email: body.email });
    if (existingCollector) {
        return new NextResponse('Collector with this email already exists', { status: 400 });
    }

    const collectorData = {
        name: body.name,
        email: body.email,
        password: await hash(body.password, 10),
        phone: body.phone,
        adhaar: body.adhaar,
        experience: body.experience,
        qualification: body.qualification,
        reachableAreas: body.reachableAreas,
        chatId: body.chatId,
        // verified: body.verified,
        // otp: body.otp,
        // otpExpiry: body.otpExpiry,
    };

    const collector = new Collector(collectorData);

    try {
        await collector.save();
    } catch {
        return new NextResponse('Error saving collector', { status: 500 });
    }
    return NextResponse.json({ message: 'Collector saved successfully' }, { status: 200 });
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}
