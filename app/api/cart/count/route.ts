// url /api/cart
import dbConnect from '@/config/db';
import verifyToken from '@/lib/tokenVerify';
import Cart from '@/models/Cart';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const user = await verifyToken<{ id: string, institution: string, type: string }>((await cookies()).get('token')?.value, 'user');
    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const id = user?.id;
    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const cart = await Cart.findOne({ user: id });
        if (!cart) {
            const cartData = {
                user: id,
                items: []
            };

            const cart = new Cart(cartData);

            try {
                await cart.save();
                return NextResponse.json({ items: 0 }, { status: 200 });
            } catch (e) {
                console.log(e);
                return new NextResponse('Error creating cart', { status: 500 });
            }
        }

        return NextResponse.json({ items: cart.items.length }, { status: 200 });
    } catch (e) {
        console.log(e)
        return new NextResponse('Error fetching cart', { status: 500 });
    }
}