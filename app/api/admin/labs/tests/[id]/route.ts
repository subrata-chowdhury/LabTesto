import { NextResponse } from 'next/server';
import Lab from '@/models/Lab';
import Test, { ITest } from '@/models/Test';

// id here we are getting as params is the Lab ID

export type LabTestDetails = {
    name?: string;
    details?: TestsDetails[];
};

type TestsDetails = {
    test: string;
    name?: string;
    price: number;
    offer?: number;
    expenses?: number;
    resultTime: string;
    packages?: string[];
    ranges?: Map<string, string>;
};

export async function GET(req: Request) {
    const id = req.url.split('/').pop();

    try {
        const lab = await Lab.findById(id);

        const tests = await Test.find({ [`labsDetails.${lab._id}`]: { $exists: true } }).lean() as unknown as ITest[];

        const details: TestsDetails[] = tests.map((test: ITest) => {
            const labDetails = (test.labsDetails || {})[lab._id];
            return {
                test: test._id.toString(),
                name: test.name,
                price: labDetails.price,
                offer: labDetails.offer,
                expenses: labDetails.expenses,
                resultTime: labDetails.resultTime,
                packages: labDetails.packages,
                ranges: labDetails.ranges,
            };
        });

        return NextResponse.json({
            name: lab.name,
            details,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch lab test details' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const id = req.url.split('/').pop();
        const labDetails: LabTestDetails = await req.json();

        if (!id || !labDetails || !labDetails.details) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const lab = await Lab.findById(id);
        if (!lab) {
            return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
        }

        for (const detail of labDetails.details) {
            const test = await Test.findById(detail.test);
            if (!test) {
                return NextResponse.json({ error: `Test with ID ${detail.test} not found` }, { status: 404 });
            }

            test.labsDetails.set(id, {
                lab: lab._id,
                name: lab.name,
                image: lab.image,
                price: detail.price,
                offer: detail.offer || 0,
                expenses: detail.expenses || 0,
                resultTime: detail.resultTime,
                packages: detail.packages || [],
                ranges: detail.ranges || new Map(),
            })

            await test.save();
        }

        return NextResponse.json({ message: 'Lab test details saved successfully' });
    } catch (error) {
        console.error(error);
        return new NextResponse('Failed to save lab test details', { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const id = req.url.split('/').pop();
        const body = await req.json();
        const test = await Test.findById(body.test);
        if (!test) {
            return new NextResponse(`Test with ID ${body.test} not found`, { status: 404 });
        }
        if (test.labsDetails.has(id)) {
            test.labsDetails.delete(id);
            await test.save();
            return NextResponse.json({ messege: 'Lab test details deleted successfully' }, { status: 200 });
        } else {
            return new NextResponse('Lab test details not found', { status: 404 });
        }
    } catch (e) {
        console.log(e)
        return new NextResponse('Failed to delete lab test details', { status: 500 });
    }
}