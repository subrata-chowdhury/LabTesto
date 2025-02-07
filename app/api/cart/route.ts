// url /api/cart
import dbConnect from '@/config/db';
import Cart from '@/models/Cart';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.name) filter.name = { $regex: `^${filter.name}`, $options: 'i' };

        const labs = await Cart.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalLabs = await Cart.countDocuments(filter);
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
    if (!body.user) {
        return new NextResponse('User is required', { status: 400 });
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return new NextResponse('Items are required', { status: 400 });
    }

    const cartData = {
        user: body.user,
        items: body.items,
    };

    const cart = new Cart(cartData);

    try {
        await cart.save();
    } catch (e) {
        console.log(e);
        return new NextResponse('Error saving cart', { status: 500 });
    }
    return NextResponse.json({ message: 'Cart saved successfully' }, { status: 200 });
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE() {
    return NextResponse.json({ message: 'DELETE request received' });
}