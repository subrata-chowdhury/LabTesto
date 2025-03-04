import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import User from '@/models/User';
import { SignJWT } from 'jose';
import dbConnect from '@/config/db';
import Cart from '@/models/Cart';

export async function GET() {
    return NextResponse.json({ message: 'GET request received' });
}

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return new NextResponse('Username, Phone no and password are required', { status: 400 });
    }

    await dbConnect();

    const hashedPassword = await hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse('User already exists. Please log in.', { status: 400 });
    }

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        
        const id = newUser._id;
        const cartData = {
            user: id,
            items: []
        };

        const cart = new Cart(cartData);
        cart.save();
    } catch {
        return new NextResponse('Error saving user', { status: 500 });
    }

    const token = await new SignJWT({
        id: newUser._id,
        type: newUser.type
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return NextResponse.json({ message: 'User signed up successfully', user: { type: 'admin', verified: false }, token });
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE() {
    return NextResponse.json({ message: 'DELETE request received' });
}