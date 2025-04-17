import dbConnect from '@/config/db';
import Collector, { ICollector } from '@/models/Collector';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Order, { IOrder } from '@/models/Order';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');
    if (!pin) {
        return NextResponse.json({ error: 'Pin is required' }, { status: 400 });
    }
    await dbConnect();
    const currentTime = new Date();

    // Find collectors whose reachableAreas contain the pin
    const collectors = await Collector.find({ reachableAreas: { $in: [pin] } }).lean<ICollector[]>();

    if (!collectors.length) {
        return NextResponse.json({ error: 'No collectors found for the given pin' }, { status: 404 });
    }

    const collectorIds = collectors.map((collector) => (collector._id as string).toString());
    const totalCollectors = collectorIds.length;

    // Find orders with the specified conditions
    const orders = await Order.find({
        collector: { $in: collectorIds },
        'sampleTakenDateTime.start': { $gt: currentTime },
        status: { $in: ['Ordered', 'Out for Sample Collection'] },
    })
        .select('user collector sampleTakenDateTime.start')
        .lean() as unknown as IOrder[];

    // Filter orders to only include the first order for each unique user
    const uniqueOrders = Array.from(
        orders.reduce((map, order) => {
            const userId = order.user.toString();
            if (!map.has(userId)) {
                map.set(userId, order);
            }
            return map;
        }, new Map<string, IOrder>()).values()
    );

    const times: { [key: string]: string[] } = {};
    for (let i = 0; i <= 12; i++) {
        const time = new Date(0, 0, 0, 6 + i, 0, 0, 0).toTimeString().split(' ')[0];
        times[time] = [];
        collectorIds.forEach((collectorId) => {
            let orderCount = 0;
            uniqueOrders.forEach((order) => {
                if (order.collector?.toString() === collectorId && order.sampleTakenDateTime.start?.toTimeString().split(' ')[0] === time)
                    orderCount++;
            });
            if (orderCount >= 2)
                if (!times[time].includes(collectorId)) times[time].push(collectorId);
        })
    }

    // Remove properties with empty arrays
    Object.keys(times).forEach((key) => {
        if (times[key].length === 0) delete times[key];
        else if (times[key].length !== totalCollectors) delete times[key];
    });

    const results = Object.keys(times)

    return NextResponse.json(results, { status: 200 });
}