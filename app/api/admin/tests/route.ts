import dbConnect from "@/config/db";
import Test from "@/models/Test";
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
    if (!body.sampleType) {
        return new NextResponse('Sample Type is required', { status: 400 });
    }
    if (!body.tubeType) {
        return new NextResponse('Tube Type is required', { status: 400 });
    }

    const existingTest = await Test.findOne({ name: body.name });
    if (existingTest) {
        return new NextResponse('Test with this name already exists', { status: 400 });
    }

    const testData = {
        name: body.name,
        sampleType: body.sampleType,
        otherTerms: body.otherTerms,
        tubeType: body.tubeType,
        description: body.description,
        fastingRequired: body.fastingRequired,
        overview: body.overview,
        testResultInterpretation: body.testResultInterpretation,
        riskAssesment: body.riskAssesment,
        resultTime: body.resultTime
    }

    const test = new Test(testData);

    try {
        await test.save();
    } catch {
        return new NextResponse('Error saving test', { status: 500 });
    }
    return NextResponse.json({ message: 'Test saved successfully' }, { status: 200 });
}