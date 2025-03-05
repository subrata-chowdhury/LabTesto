import dbConnect from '@/config/db';
import User from '@/models/User';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = await req.headers.get('x-user');

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findById(id).select('-password -otp -otpExpiry');

        return NextResponse.json(user, { status: 200 });
    } catch(e) {
        console.log(e)
        return new NextResponse('Error fetching user details', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const id = await req.headers.get('x-user');
    const reqBody = await req.json();

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findById(id);

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        user.name = reqBody.name || user.name;
        user.email = reqBody.email || user.email;
        user.phone = reqBody.phone || user.phone;
        user.patientDetails = reqBody.patientDetails || user.patientDetails;
        user.address = reqBody.address || user.address;

        await user.save();

        user.password = "";

        return NextResponse.json(user, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating user details', { status: 500 });
    }
}