import dbConnect from '@/config/db';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();
        
        const totalOrders = await Order.countDocuments({});
        const canceled = await Order.countDocuments({ status: 'Canceled' });
        const ordered = await Order.countDocuments({ status: 'Ordered' });
        const sampleCollected = await Order.countDocuments({ status: 'Sample Collected' });

        return new Response(JSON.stringify({
            totalOrders,
            canceled,
            ordered,
            sampleCollected
        }), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), { status: 500 });
    }
}