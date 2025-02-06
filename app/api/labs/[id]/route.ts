import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Lab from '@/models/Lab';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Lab ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const lab = await Lab.findById(id);

        if (!lab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json(lab, { status: 200 });
    } catch {
        return new NextResponse('Error fetching lab', { status: 500 });
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
    if (!body.location || !body.location.address || !body.location.location || !body.location.location.lat || !body.location.location.lang) {
        return new NextResponse('Complete location details are required', { status: 400 });
    }
    if (body.certification && !body.certification.organization) {
        return new NextResponse('Certification organization is required', { status: 400 });
    }
    if (!body.prices || !Array.isArray(body.prices) || body.prices.length === 0) {
        return new NextResponse('Prices are required', { status: 400 });
    }

    const labData = {
        name: body.name,
        location: body.location,
        certification: body.certification,
        prices: body.prices,
        packagesInclude: body.packagesInclude,
        ranges: body.ranges,
    }

    try {
        const updatedLab = await Lab.findByIdAndUpdate(id, labData, { new: true, runValidators: true });

        if (!updatedLab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Lab updated successfully' }, { status: 200 });
    } catch(e) {
        console.log(e);

        return new NextResponse('Error updating lab', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Lab ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const deletedLab = await Lab.findByIdAndDelete(id);

        if (!deletedLab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Lab deleted successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting lab', { status: 500 });
    }
}
