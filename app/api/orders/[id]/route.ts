import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Order ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const order = await Order.findById(id).populate('tests').populate('user');

        if (!order) {
            return new NextResponse('Order not found', { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch {
        return new NextResponse('Error fetching order', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const id = req.url.split('/').pop();

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
        return new NextResponse('Phone is required', { status: 400 });
    }
    if (!body.address || !body.address.pin || !body.address.city || !body.address.district) {
        return new NextResponse('Complete address details are required', { status: 400 });
    }

    const orderData = {
        name: body.name,
        tests: body.tests,
        user: body.user,
        status: body.status || 'Ordered',
        phone: body.phone,
        address: body.address,
        sampleTakenDateTime: body.sampleTakenDateTime,
        reportDeliverTime: body.reportDeliverTime,
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true, runValidators: true });

        if (!updatedOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch(e) {
        console.log(e);

        return new NextResponse('Error updating order', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Order ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting order', { status: 500 });
    }
}
