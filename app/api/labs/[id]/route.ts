import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Lab, { ILab } from '@/models/Lab';
import Test from '@/models/Test';
import { ObjectId } from 'mongoose';

export async function GET(req: NextRequest) {
    const id = req.url.split('/').pop();

    if (!id) {
        return new NextResponse('Lab ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const lab = await Lab.findById(id).lean() as unknown as ILab;

        if (!lab) {
            return new NextResponse('Lab not found', { status: 404 });
        }

        try {
            await Promise.all(
                Object.values(lab.prices || {}).map(async (price: { test: ObjectId }) => {
                    (lab.prices || {})[price.test.toString()].test = await Test.findById(price.test).select('name id').exec();
                })
            );

            await Promise.all(
                Object.values(lab.packagesInclude || {}).map(async (pkg: { test: ObjectId }) => {
                    (lab.packagesInclude || {})[pkg.test.toString()].test = await Test.findById(pkg.test).select('name id').exec();
                })
            );

            await Promise.all(
                Object.values(lab.ranges || {}).map(async (range: { test: ObjectId }) => {
                    (lab.ranges || {})[range.test.toString()].test = await Test.findById(range.test).select('name id').exec();
                })
            );

            await Promise.all(
                Object.values(lab.resultTimes || {}).map(async (res: { test: ObjectId }) => {
                    (lab.resultTimes || {})[res.test.toString()].test = await Test.findById(res.test).select('name id').exec();
                })
            );
        } catch (error) {
            console.log(error)
        }

        return NextResponse.json(lab, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error fetching lab', { status: 500 });
    }
}