import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Cart from '@/models/Cart';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Cart ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const cart = await Cart.findById(id).populate('items.product').populate('user');

        if (!cart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        return NextResponse.json(cart, { status: 200 });
    } catch {
        return new NextResponse('Error fetching cart', { status: 500 });
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
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return new NextResponse('Items are required', { status: 400 });
    }
    if (!body.user) {
        return new NextResponse('User is required', { status: 400 });
    }

    const cartData = {
        items: body.items,
        user: body.user,
    }

    try {
        const updatedCart = await Cart.findByIdAndUpdate(id, cartData, { new: true, runValidators: true });

        if (!updatedCart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 });
    } catch(e) {
        console.log(e);

        return new NextResponse('Error updating cart', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Cart ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const deletedCart = await Cart.findByIdAndDelete(id);

        if (!deletedCart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Cart deleted successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting cart', { status: 500 });
    }
}
