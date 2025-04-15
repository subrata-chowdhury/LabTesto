import dbConnect from '@/config/db';
import Collector, { ICollector } from '@/models/Collector';
// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Order from '@/models/Order';

export async function GET() {
    await dbConnect();
    const collectors = await Collector.find({}, '_id').lean() as unknown as ICollector[];
    const collectorIds = collectors.map(collector => (collector._id as string).toString());

    const currentTime = new Date();

    const busyTimes = await Order.aggregate([
        {
            $match: {
                status: { $in: ['Ordered', 'Out for Sample Collection'] },
                'sampleTakenDateTime.start': { $gte: currentTime }
            }
        },
        {
            $group: {
                _id: '$sampleTakenDateTime.start',
                collectorsBusy: { $addToSet: '$collector' }
            }
        },
        {
            $project: {
                _id: 0,
                dateTime: '$_id',
                collectorsBusy: 1
            }
        },
        {
            $addFields: {
                noCollectorsAvailable: {
                    $eq: [{ $size: '$collectorsBusy' }, collectorIds.length]
                }
            }
        },
        {
            $match: {
                noCollectorsAvailable: true
            }
        }
    ]);

    return NextResponse.json(busyTimes, { status: 200 });
}