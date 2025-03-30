import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import dbConnect from '@/config/db';
import AdminUser from '@/models/AdminUser';
import crypto from 'crypto';

export async function GET() {
    return NextResponse.json({ message: 'GET request received' });
}

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new NextResponse('Email and password are required', { status: 400 });
    }

    await dbConnect();

    try {
        async function findByEmail(email: string) {
            const collections = [AdminUser];

            const promises = collections.map((collection) =>
                (collection as typeof AdminUser).findOne({ email }).exec().then((result: InstanceType<typeof AdminUser> | null) => ({ model: collection.modelName, data: result }))
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
            .setExpirationTime('8h')
            .sign(new TextEncoder().encode(process.env.ADMIN_JWT_SECRET));

        return NextResponse.json({ message: 'Login successful', user: { verified: user.verified }, token });
    } catch (error) {
        console.log(error)
        return new NextResponse('Unable to login', { status: 500 });
    }
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE() {
    return NextResponse.json({ message: 'DELETE request received' });
}