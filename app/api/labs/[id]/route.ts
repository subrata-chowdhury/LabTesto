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
        const lab = await Lab.findById(id).populate({ path: 'prices.test', model: Test }).populate({ path: 'packagesInclude.test', model: Test }).populate({ path: 'ranges.test', model: Test });

        if (!lab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json(lab, { status: 200 });
    } catch (e) {
        console.log(e);
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
    if (body.certification && !body.certification.organization) {
        return new NextResponse('Certification organization is required', { status: 400 });
    }

    const labData: Partial<{
        name: string;
        location: string;
        certification: {
            organization: string;
            date: Date;
        };
        prices: Array<{
            test: string;
            price: number;
        }>;
        packagesInclude: Array<{
            test: string;
            included: boolean;
        }>;
        ranges: Array<{
            test: string;
            range: string;
        }>;
    }> = {};

    if (body.name) labData.name = body.name;
    if (body.location) labData.location = body.location;
    if (body.certification) labData.certification = body.certification;
    if (body.prices) labData.prices = body.prices;
    if (body.packagesInclude) labData.packagesInclude = body.packagesInclude;
    if (body.ranges) labData.ranges = body.ranges;

    try {
        const updatedLab = await Lab.findByIdAndUpdate(id, labData, { new: true, runValidators: true });

        if (!updatedLab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Lab updated successfully' }, { status: 200 });
    } catch (e) {
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
