import dbConnect from '@/config/db';
import Collector from '@/models/Collector';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = await req.headers.get('x-user');

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await Collector.findById(id).select('-password -otp -otpExpiry');

        return NextResponse.json(user, { status: 200 });
    } catch (e) {
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

        const newUserDetails = {
            name: reqBody.name,
            email: reqBody.email,
            phone: reqBody.phone,
            reachableAreas: reqBody.reachableAreas,
        }

        const user = await Collector.findByIdAndUpdate(id, newUserDetails, { new: true, runValidators: true })
            .select('-password -otp -otpExpiry');

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating user details', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = await req.headers.get('x-user');

    if (!id) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    try {
        await dbConnect();

        const user = await Collector.findById(id);

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        user.isDeleted = true;
        await user.save();

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error deleting user', { status: 500 });
    }
}