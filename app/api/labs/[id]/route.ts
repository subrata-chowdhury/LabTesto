import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Lab from '@/models/Lab';
import Test from '@/models/Test';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Lab ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const lab = await Lab.findById(id).populate({ path: 'prices.test', model: Test }).populate({ path: 'packagesInclude.test', model: Test }).populate({ path: 'ranges.test', model: Test }).populate({ path: 'resultTimes.test', model: Test });

        if (!lab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json(lab, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error fetching lab', { status: 500 });
    }
}