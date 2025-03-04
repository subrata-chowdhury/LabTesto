import dbConnect from "@/config/db";
import Lab from "@/models/Lab";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    await dbConnect();

    // validation logic
    if (!body) {
        return new NextResponse('Request body is missing', { status: 400 });
    }
    if (!body.name) {
        return new NextResponse('Name is required', { status: 400 });
    }
    if (!body.location || !body.location.address || !body.location.location) {
        return new NextResponse('Complete location information is required', { status: 400 });
    }

    const existingLab = await Lab.findOne({ name: body.name });
    if (existingLab) {
        return new NextResponse('Lab with this name already exists', { status: 400 });
    }

    const labData = {
        name: body.name,
        location: body.location,
        rating: body.rating || 0,
        certification: body.certification,
        prices: body.prices,
        packagesInclude: body.packagesInclude,
        ranges: body.ranges,
        description: body.description,
    }

    const lab = new Lab(labData);

    try {
        await lab.save();
    } catch (e) {
        console.log(e)
        return new NextResponse('Error saving lab', { status: 500 });
    }
    return NextResponse.json({ message: 'Lab saved successfully' }, { status: 200 });
}