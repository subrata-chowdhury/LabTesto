import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Collector from '@/models/Collector';

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
    if (!body.sampleType) {
        return new NextResponse('Sample type is required', { status: 400 });
    }
    if (!body.tubeType) {
        return new NextResponse('Tube type is required', { status: 400 });
    }
    if (!body.description) {
        return new NextResponse('Description is required', { status: 400 });
    }
    if (!body.fastingRequired) {
        return new NextResponse('Fasting requirement is required', { status: 400 });
    }
    if (!body.overview) {
        return new NextResponse('Overview is required', { status: 400 });
    }
    if (!body.collectorResultInterpretation) {
        return new NextResponse('Collector result interpretation is required', { status: 400 });
    }
    if (!body.riskAssesment) {
        return new NextResponse('Risk assessment is required', { status: 400 });
    }
    if (!body.resultTime) {
        return new NextResponse('Result time is required', { status: 400 });
    }

    const collectorData = {
        name: body.name,
        sampleType: body.sampleType,
        tubeType: body.tubeType,
        description: body.description,
        fastingRequired: body.fastingRequired,
        overview: body.overview,
        collectorResultInterpretation: body.collectorResultInterpretation,
        riskAssesment: body.riskAssesment,
        resultTime: body.resultTime,
    }

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
