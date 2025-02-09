// url /api/cart
import dbConnect from '@/config/db';
import Cart from '@/models/Cart';
import { NextRequest, NextResponse } from 'next/server';
import Lab from '@/models/Lab';
import Test from '@/models/Test';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    const id = await req.cookies.get('userId')?.value;

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const cart = await Cart.findOne({ user: id }).populate({ path: 'items.product.test', model: Test }).populate('items.product.lab').populate({ path: 'user', model: User });

        if (!cart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        return NextResponse.json(cart, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching cart', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const body = await req.json();

    await dbConnect();

    // validation logic
    if (!body) {
        return new NextResponse('Request body is missing', { status: 400 });
    }
    if (!body.product) {
        return new NextResponse('Items are required', { status: 400 });
    }
    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    const existingCart = await Cart.findOne({ user: userId });

    const testId = body.product.test;
    const labId = body.product.lab;
    if (existingCart) {
        try {

            const existingItemIndex = existingCart.items.findIndex((item: { product: { test: string } }) => item.product.test.toString() === testId);
            const existingItem = existingItemIndex === -1 ? null : existingCart.items[existingItemIndex];

            if (existingItem.product.lab.toString() === labId) {
                existingItem.quantity += 1;
                existingCart.items[existingItemIndex] = existingItem;
                existingCart.items[existingItemIndex].date = new Date();
                await existingCart.save();
                return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 });
            }

            const lab = await Lab.findById(labId);
            const priceDetails: { test: string, price: number, offer: number } = lab.prices.filter((price: { test: string, price: string }) => price.test.toString() === testId)[0];
            const price = (priceDetails.price - (priceDetails.price * (priceDetails.offer / 100))).toFixed(2);

            if (existingCart.items[existingItemIndex].product.lab.toString() === labId) {
                existingCart.items[existingItemIndex] = { product: { test: testId, lab: labId, price }, quantity: body.quantity || 1, date: new Date() };
            }
            else existingCart.items.push({ product: { test: testId, lab: labId, price }, quantity: 1, date: new Date() });

            await existingCart.save();
            return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 });
        } catch (e) {
            console.log(e);
            return new NextResponse('Error updating cart', { status: 500 });
        }
    }

    const lab = await Lab.findById(labId);
    const priceDetails: { test: string, price: number, offer: number } = lab.prices.find((price: { test: string, price: string }) => price.test.toString() === testId)[0];
    const price = (priceDetails.price - (priceDetails.price * (priceDetails.offer / 100))).toFixed(2);

    const cartData = {
        user: userId,
        items: [{ product: { test: testId, lab: labId, price }, quantity: 1, date: new Date() }]
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

export async function DELETE(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const { productId } = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    if (!productId) {
        return new NextResponse('Product ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        const itemIndex = cart.items.findIndex((item: { product: { test: string } }) => item.product.test.toString() === productId);

        if (itemIndex === -1) {
            return new NextResponse('Item not found in cart', { status: 404 });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        return NextResponse.json({ message: 'Item removed successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error removing item from cart', { status: 500 });
    }
}