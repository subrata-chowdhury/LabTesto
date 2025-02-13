import dbConnect from '@/config/db';
import User from '@/models/User';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = await req.cookies.get('userId')?.value;

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findById(id);
        user.password = "";

        return NextResponse.json(user, { status: 200 });
    } catch {
        return new NextResponse('Error fetching user details', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const id = await req.cookies.get('userId')?.value;
    const reqBody = await req.json();

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findByIdAndUpdate({
            _id: id
        }, {
            name: reqBody.name,
            email: reqBody.email,
            phone: reqBody.phone,
            patientDetails: reqBody.patientDetails
        }, { new: true });

        user.password = "";

        return NextResponse.json(user, { status: 200 });
    } catch {
        return new NextResponse('Error updating user details', { status: 500 });
    }
}