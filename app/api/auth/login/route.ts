import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User'; // Assuming you have a User model defined
import { SignJWT } from 'jose';
import dbConnect from '@/config/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new NextResponse('Email and password are required', { status: 400 });
    }

    await dbConnect();

    async function findByEmail(email: string) {
        const collections = [User];

        const promises = collections.map((collection) =>
            (collection as typeof User).findOne({ email }).exec().then((result: InstanceType<typeof User> | null) => ({ model: collection.modelName, data: result }))
        );

        const results = await Promise.all(promises);

        const user = results.find(result => result.data !== null);
        if (user) {
            return { ...user.data.toObject(), type: user.model };
        }
        return null;
    }

    const user = await findByEmail(email);

    if (!user) {
        return new NextResponse('Invalid email or password', { status: 406 });
    }

    const buffer = Buffer.from(password, 'base64');
    if (!process.env.PRIVATE_KEY) {
        throw new Error('PRIVATE_KEY is not defined in environment variables');
    }
    const decryptedPassword = crypto.privateDecrypt(process.env.PRIVATE_KEY, buffer).toString('utf8');

    const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);

    if (!isPasswordValid) {
        return new NextResponse('Invalid email or password', { status: 406 });
    }

    // Assuming you have a function to generate a token
    const token = await new SignJWT({
        id: user._id,
        verified: user.verified,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(Math.floor(Date.now() / 1000) + 3 * 30 * 24 * 60 * 60) // 6 months
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return NextResponse.json({ message: 'Login successful', user: { verified: user.verified, name: user.name, email: user.email }, token });
}