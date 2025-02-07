// url /api/order
import dbConnect from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.name) filter.name = { $regex: `^${filter.name}`, $options: 'i' };

        const labs = await Order.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalLabs = await Order.countDocuments(filter);
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
    if (!body.tests || !Array.isArray(body.tests) || body.tests.length === 0) {
        return new NextResponse('Tests are required', { status: 400 });
    }
    if (!body.user) {
        return new NextResponse('User is required', { status: 400 });
    }
    if (!body.phone) {
        return new NextResponse('Phone number is required', { status: 400 });
    }
    if (!body.address || !body.address.pin || !body.address.city || !body.address.district) {
        return new NextResponse('Complete address information is required', { status: 400 });
    }

    const orderData = {
        name: body.name,
        tests: body.tests,
        user: body.user,
        status: body.status || 'Ordered',
        phone: body.phone,
        address: body.address,
        sampleTakenDateTime: body.sampleTakenDateTime || { date: { start: new Date(), end: new Date() } },
        reportDeliverTime: body.reportDeliverTime || { date: { start: new Date(), end: new Date() } }
    };

    const order = new Order(orderData);

    try {
        await order.save();
    } catch (e) {
        console.log(e);
        return new NextResponse('Error saving order', { status: 500 });
    }
    return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
}


export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE() {
    return NextResponse.json({ message: 'DELETE request received' });
}