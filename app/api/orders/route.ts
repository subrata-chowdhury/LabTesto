// url /api/order
import dbConnect from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Cart from '@/models/Cart';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const orders = await Order.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        return NextResponse.json({
            orders,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const body = await req.json();

    await dbConnect();

    // validation logic
    if (!body || !Array.isArray(body) || body.length === 0) {
        return new NextResponse('Request body is missing or invalid', { status: 400 });
    }

    for (const item of body) {
        if (!item.product || !item.product.test || !item.product.lab) {
            return new NextResponse('Product test and lab are required', { status: 400 });
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            return new NextResponse('Quantity must be a positive number', { status: 400 });
        }
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return new NextResponse('Cart not found for user', { status: 404 });
    }

    const orderItems = body.map(item => {
        const cartItem = cart.items.find((cartItem: { product: { test: string, lab: string } }) =>
            cartItem.product.test.toString() === item.product.test &&
            cartItem.product.lab.toString() === item.product.lab
        );

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        return {
            product: {
                test: cartItem.product.test,
                lab: cartItem.product.lab,
                price: cartItem.product.price,
            },
            patientDetails: cartItem.patientDetails,
            quantity: item.quantity,
            date: new Date()
        };
    });

    const orderData = {
        items: orderItems,
        user: userId,
        status: 'Ordered',
        sampleTakenDateTime: { date: { start: new Date(), end: new Date() } },
        reportDeliverTime: { date: { start: new Date(), end: new Date() } }
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
