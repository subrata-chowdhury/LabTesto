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
        const cart = await Cart.findOne({ user: id }).populate({ path: 'items.product.test', model: Test }).populate({ path: 'items.product.lab', model: Lab }).populate({ path: 'user', model: User });

        if (!cart) {
            const cartData = {
                user: id,
                items: []
            };

            const cart = new Cart(cartData);

            try {
                await cart.save();
                return NextResponse.json([], { status: 200 });
            } catch (e) {
                console.log(e);
                return new NextResponse('Error creating cart', { status: 500 });
            }
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

    if (!labId) {
        return new NextResponse('LabId is missing: ' + labId)
    }

    if (existingCart) {
        try {
            existingCart.items.push({ product: { test: testId, lab: labId }, quantity: 1, date: new Date() });

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

export async function PUT(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const body = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    if (!body || !body.product) {
        return new NextResponse('Product is required', { status: 400 });
    }

    await dbConnect();

    try {
        const existingCart = await Cart.findOne({ user: userId });

        if (!existingCart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        const { test: testId, lab: labId } = body.product;
        const existingItemIndex = existingCart.items.findIndex((item: { product: { test: string, lab: string } }) => item.product.test.toString() === testId && item.product.lab.toString() === labId);

        if (existingItemIndex === -1) {
            return new NextResponse('Item not found in cart', { status: 404 });
        }

        const existingItem = existingCart.items[existingItemIndex];
        existingItem.quantity = body.quantity;
        existingItem.date = new Date();
        existingItem.patientDetails = body.patientDetails || existingItem.patientDetails || [];
        if (existingItem.patientDetails.length > body.quantity) {
            existingItem.patientDetails = existingItem.patientDetails.slice(0, body.quantity);
        }

        existingCart.items[existingItemIndex] = existingItem;
        // if (body.address) existingCart.address = body.address;
        await existingCart.save();

        return NextResponse.json({ message: 'Cart updated successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating cart', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = await req.cookies.get('userId')?.value;
    const productDetails = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    if (!productDetails) {
        return new NextResponse('Product Details is required', { status: 400 });
    }

    await dbConnect();

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return new NextResponse('Cart not found', { status: 404 });
        }

        const itemIndex = cart.items.findIndex((item: { product: { test: string, lab: string } }) => (item.product.test.toString() === productDetails.test && item.product.lab.toString() === productDetails.lab));

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