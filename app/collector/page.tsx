'use client'
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const CollectorDashboard = () => {
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const filterData: { status?: string, date?: string, name?: string } = { status: 'Ordered' };

        const res = await fetcher.get<{ orders: Order[], pagination: { totalOrders: number, currentPage: number, pageSize: number, totalPages: number } }>(`/collector/orders?filter=${JSON.stringify(filterData)}&limit=999&page=1`);
        if (res.status !== 200) return;
        if (res.body) {
            setOrderData(res.body.orders);
        }
        setLoading(false);
    }, [])

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div>
            <div className='flex flex-col gap-2 mx-4'>
                {
                    orderData.map(order => (
                        <div key={order._id} className='flex justify-between gap-2 rounded-md border-2 bg-white p-2 px-3'>
                            {/* <div>{order._id}</div> */}
                            <div>{order.status}</div>
                            <div className='flex gap-2'>
                                <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/view/' + order._id)}>View</Link>
                                <button
                                    className='px-2.5 py-1 bg-orange-500 text-white rounded text-sm font-medium'
                                    onClick={async () => {
                                        const res = await fetcher.put<{}, Order>(`/collector/orders/${order._id}`, {});
                                        if(res.body && res.status === 200) {
                                            setOrderData(prev => prev.filter(o => o._id !== order._id));
                                            toast.success('Order Passed to another collector');
                                        }
                                    }}>Pass</button>
                            </div>
                            {/* <h3>{order.sampleTakenDateTime.date.start}</h3> */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CollectorDashboard;


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
    user: string;
    collector?: string;
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        date: {
            start?: Date;
            end?: Date;
        };
    };
    reportDeliverTime: {
        date: {
            start?: Date;
            end?: Date;
        };
    };
    _id: string;
}