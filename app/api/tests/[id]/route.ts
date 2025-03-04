import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Test from '@/models/Test';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Test ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const test = await Test.findById(id);

        if (!test) {
            return new NextResponse('Test not found', { status: 404 });
        }

        return NextResponse.json(test, { status: 200 });
    } catch {
        return new NextResponse('Error fetching test', { status: 500 });
    }
}