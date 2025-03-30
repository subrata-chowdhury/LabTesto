import dbConnect from '@/config/db';
import Lab from '@/models/Lab';
import Test from '@/models/Test';
// import User from '@/models/User';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get('labId');
    const limit = searchParams.get('limit') || '10';
    try {
        const labs = await Lab.find(labId ? { _id: new ObjectId(labId) } : {}).limit(parseInt(limit, 10));
        const tests = await Test.find().lean();

        const labsWithMissingPrices = labs.map(lab => {
            const labDetails = lab.toJSON();
            const missingTests: { test: { _id: ObjectId; name: string }; testName: string }[] = [];

            tests.forEach(test => {
                const labTestDetails = test.labsDetails?.[lab._id.toString()];
                if (!labTestDetails || labTestDetails.price === undefined) {
                    missingTests.push({
                        test: { _id: test._id as ObjectId, name: test.name },
                        testName: test.name
                    });
                }
            });

            return {
                lab: labDetails,
                missingTests: missingTests
            };
        }).filter(lab => lab.missingTests.length > 0);

        return NextResponse.json(labsWithMissingPrices, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}