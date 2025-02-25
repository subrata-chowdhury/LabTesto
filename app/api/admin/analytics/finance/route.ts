import dbConnect from '@/config/db';
import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const currentYear = new Date().getFullYear();
        const startDate = new Date(searchParams.get('start') || `01/01/${currentYear - 1}`);
        const endDate = new Date(searchParams.get('end') || new Date().toISOString());

        if (!startDate || !endDate) {
            return new NextResponse('Invalid date range', { status: 400 });
        }

        const financeData = await Order.aggregate([
            {
                $match: {
                    'items.date': { $gte: startDate, $lte: endDate },
                    'paid': { $gt: 0 }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$items.date' },
                        month: { $month: '$items.date' }
                    },
                    totalPrice: { $sum: { $multiply: ['$items.product.price', '$items.quantity'] } },
                    expenses: { $sum: { $multiply: ['$items.product.expenses', '$items.quantity'] } }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            },
            {
                $project: {
                    _id: 0,
                    totalPrice: 1,
                    expenses: 1,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: 1
                        }
                    }
                }
            }
        ]);

        return new NextResponse(JSON.stringify(financeData), { status: 200 });
    } catch {
        return new NextResponse('Error fetching analytics', { status: 500 });
    }
}
