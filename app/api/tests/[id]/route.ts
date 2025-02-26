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
    if (!body.sampleType) {
        return new NextResponse('Sample type is required', { status: 400 });
    }
    if (!body.tubeType) {
        return new NextResponse('Tube type is required', { status: 400 });
    }
    // if (!body.description) {
    //     return new NextResponse('Description is required', { status: 400 });
    // }
    // if (!body.fastingRequired) {
    //     return new NextResponse('Fasting requirement is required', { status: 400 });
    // }
    // if (!body.overview) {
    //     return new NextResponse('Overview is required', { status: 400 });
    // }
    // if (!body.testResultInterpretation) {
    //     return new NextResponse('Test result interpretation is required', { status: 400 });
    // }
    // if (!body.riskAssesment) {
    //     return new NextResponse('Risk assessment is required', { status: 400 });
    // }
    // if (!body.resultTime) {
    //     return new NextResponse('Result time is required', { status: 400 });
    // }
    const testData = {} as Record<string, unknown>;

    if (body.name) testData.name = body.name;
    if (body.otherTerms) testData.otherTerms = body.otherTerms;
    if (body.sampleType) testData.sampleType = body.sampleType;
    if (body.tubeType) testData.tubeType = body.tubeType;
    if (body.description) testData.description = body.description;
    if (body.fastingRequired) testData.fastingRequired = body.fastingRequired;
    if (body.overview) testData.overview = body.overview;
    if (body.testResultInterpretation) testData.testResultInterpretation = body.testResultInterpretation;
    if (body.riskAssesment) testData.riskAssesment = body.riskAssesment;
    if (body.resultTime) testData.resultTime = body.resultTime;

    try {
        const updatedTest = await Test.findByIdAndUpdate(id, testData, { new: true, runValidators: true });

        if (!updatedTest) {
            return new NextResponse('Test not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Test updated successfully' }, { status: 200 });
    } catch(e) {
        console.log(e);
        return new NextResponse('Error updating test', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Test ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const deletedTest = await Test.findByIdAndDelete(id);

        if (!deletedTest) {
            return new NextResponse('Test not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Test deleted successfully' }, { status: 200 });
    } catch {
        return new NextResponse('Error deleting test', { status: 500 });
    }
}
