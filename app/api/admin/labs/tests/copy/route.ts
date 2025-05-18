import Test, { ITest } from '@/models/Test';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(res: NextRequest) {
    const { targetId, copyId } = await res.json();
    const tests = await Test.find({ [`labsDetails.${copyId}`]: { $exists: true } });
    const session = await Test.startSession();
    let success = false;
    try {
        await session.startTransaction();
        await Promise.all(
            tests.map(async (test) => {
                test.labsDetails.set(targetId, test.labsDetails.get(copyId));
                await test.save({ session });
            })
        );
        await session.commitTransaction();
        success = true;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error('Error copying test details:', error);
        return new NextResponse('Unable to Copy', { status: 500 });
    } finally {
        await session.endSession();
    }
    return NextResponse.json({ success }, { status: 200 });
}