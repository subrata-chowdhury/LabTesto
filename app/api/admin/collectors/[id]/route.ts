import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Collector from '@/models/Collector';
import { hash } from 'bcryptjs';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Collector ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const collector = await Collector.findById(id);
        collector.password = '';

        if (!collector) {
            return new NextResponse('Collector not found', { status: 404 });
        }

        return NextResponse.json(collector, { status: 200 });
    } catch {
        return new NextResponse('Error fetching collector', { status: 500 });
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
    if (!body.name) {
        return new NextResponse('Name is required', { status: 400 });
    }
    if (!body.email) {
        return new NextResponse('Email is required', { status: 400 });
    }
    if (!body.password) {
        return new NextResponse('Password is required', { status: 400 });
    }

    const collectorData = {
        name: body.name,
        email: body.email,
        password: body.password ? await hash(body.password, 10) : '',
        phone: body.phone,
        adhaar: body.adhaar,
        experience: body.experience,
        qualification: body.qualification,
        // verified: body.verified,
        // otp: body.otp,
        // otpExpiry: body.otpExpiry,
        // rating: body.rating,
        // rated: body.rated,
    };

    try {
        const updatedCollector = await Collector.findByIdAndUpdate(id, collectorData, { new: true, runValidators: true });

        if (!updatedCollector) {
            return new NextResponse('Collector not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Collector updated successfully' }, { status: 200 });
    } catch(e) {
        console.log(e);

        return new NextResponse('Error updating collector', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Collector ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const deletedCollector = await Collector.findByIdAndDelete(id);

        if (!deletedCollector) {
            return new NextResponse('Collector not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Collector deleted successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting collector', { status: 500 });
    }
}
