import dbConnect from '@/config/db';
import Test from '@/models/Test';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.name) {
            filter.name = { $regex: `^${filter.name}`, $options: 'i' };
        } else {
            delete filter.name;
        }

        const tests = await Test.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalTests = await Test.countDocuments(filter);
        const totalPages = Math.ceil(totalTests / limit);

        return NextResponse.json({
            tests,
            pagination: {
                totalTests,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch(e) {
        console.log(e)
        return new NextResponse('Error fetching tests', { status: 500 });
    }
}

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
    // if (!body.description) {
    //     return new NextResponse('Description is required', { status: 400 });
    // }
    // if (!body.fastingRequired) {
    //     return new NextResponse('Fasting Required is required', { status: 400 });
    // }
    // if (!body.overview) {
    //     return new NextResponse('Overview is required', { status: 400 });
    // }
    // if (!body.testResultInterpretation) {
    //     return new NextResponse('Test Result Interpretation is required', { status: 400 });
    // }
    // if (!body.riskAssesment) {
    //     return new NextResponse('Risk Assessment is required', { status: 400 });
    // }
    // if (!body.resultTime) {
    //     return new NextResponse('Result Time is required', { status: 400 });
    // }

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

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}
