import fetcher from "@/lib/fetcher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function OutdatedOrders() {
    const [outdatedOrders, setOutdatedOrders] = useState<Order[]>([]);
    useEffect(() => {
        async function fetchOutdatedOrders() {
            const res = await fetcher.get<{ orders: Order[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/orders?filter=${JSON.stringify({ "sampleTakenDateTime.end": { $lt: new Date() }, status: { $in: ['Ordered', 'Out for Sample Collection'] } })}&limit=${9999}`);
            if (res.status === 200 && res.body) {
                setOutdatedOrders(res.body.orders);
            }
        }
        fetchOutdatedOrders()
    }, []);

    return (
        <div className='mt-5 bg-white px-5 py-4 rounded-lg border-2 border-gray-300/50 w-fit'>
            <div className='text-lg font-semibold pb-2.5 border-b-2 border-gray-300/50'>Outdated Orders</div>
            <div className="w-full flex flex-col gap-2 overflow-x-auto mt-3 min-w-96 h-60 overflow-y-auto">
                {outdatedOrders.filter(order => order.status === 'Ordered').length > 0 && <h3 className='text-base'>Ordered</h3>}
                {outdatedOrders.filter(order => order.status === 'Ordered').map((order) => <OutdatedOrderCard order={order} key={order._id} />)}
                {outdatedOrders.filter(order => order.status === 'Out for Sample Collection').length > 0 && <h3 className='text-base mt-5'>Out for Collection</h3>}
                {outdatedOrders.filter(order => order.status === 'Out for Sample Collection').map((order) => <OutdatedOrderCard order={order} key={order._id} />)}
                {outdatedOrders.length === 0 && <div className="text-center my-auto text-gray-500">No outdated orders</div>}
            </div>
        </div>
    )
}

function OutdatedOrderCard({ order }: { order: Order }) {
    return (
        <div key={order._id} className="flex items-center gap-4 justify-between px-4 py-2 bg-gray-50 border-2 border-gray-300/50 rounded-md">
            <div>
                <div className="text-sm">ID: {order._id}</div>
                <div className="text-xs font-semibold text-orange-600">Date: {new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
            </div>
            <div className="flex text-sm space-x-2">
                <Link href={'/admin/orders/view/' + order._id} className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600">
                    View
                </Link>
                <button className="bg-orange-500 text-white px-2 py-0.5 rounded hover:bg-orange-600" onClick={async () => {
                    await fetcher.post<{ id: string }, string>('/admin/orders/' + order._id + '/pass', { id: order._id }).then(res => {
                        if (res.status === 200 && res.body) {
                            toast.success(res.body || 'Successfully Passed to another collector');
                        } else {
                            toast.warning(res.body || 'Unable to Pass')
                        }
                    })
                }}>
                    Pass
                </button>
            </div>
        </div>
    )
}


type Order = {
    items: {
        product: {
            test: string;
            lab: string;
            price: number;
        };
        patientDetails: {
            name: string;
            phone: string;
            address: {
                pin: number;
                city: string;
                district: string;
                other?: string; // road details
            };
        }[];
        quantity: number;
        date?: Date;
    }[];
    user: {
        _id: string;
        name: string;
        email: string;
    };
    collector?: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        start?: string;
        end?: string;
    };
    reportDeliverTime: {
        start?: string;
        end?: string;
    };
    _id: string;
}