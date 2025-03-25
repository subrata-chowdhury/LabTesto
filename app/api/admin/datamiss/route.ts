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
        const tests = await Test.find();

        const testMap = new Map(tests.map(test => [test._id.toString(), test.name]));
        const labsWithMissingPrices = labs.map(lab => {
            const testIdsWithPrices = new Set(Object.keys(lab.prices?.toJSON() || {}));
            const missingTests = [];
            for (const [testId, testName] of testMap) {
                if (!testIdsWithPrices.has(testId)) {
                    missingTests.push({ test: { _id: new ObjectId(testId) }, testName });
                }
            }
            return {
                lab: lab,
                missingTests: missingTests
            };
        }).filter(lab => lab.missingTests.length > 0);

        return NextResponse.json(labsWithMissingPrices, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}