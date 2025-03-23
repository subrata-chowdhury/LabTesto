'use client'
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../loading';

const CollectorDashboard = () => {
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [orderReportDeliveryData, setOrderReportDeliveryData] = useState<Order[]>([]);
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

    const fetchReportDeliveryOrders = useCallback(async () => {
        setLoading(true);
        const filterData: { status?: string, date?: string, name?: string } = { status: 'Report Generated' };

        const res = await fetcher.get<{ orders: Order[], pagination: { totalOrders: number, currentPage: number, pageSize: number, totalPages: number } }>(`/collector/orders?filter=${JSON.stringify(filterData)}&limit=999&page=1`);
        if (res.status !== 200) return;
        if (res.body) {
            setOrderReportDeliveryData(res.body.orders);
        }
        setLoading(false);
    }, [])

    useEffect(() => {
        fetchOrders();
        fetchReportDeliveryOrders();
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className='text-xl font-semibold mx-4 mb-2'>Notifications</h1>
            {orderData.length <= 0 && orderReportDeliveryData.length <= 0 && <div className='flex justify-center items-center h-32'>
                <h2 className='text-lg text-gray-500 my-auto'>No Notifications</h2>
            </div>}
            <div className='grid grid-rows-2 h-full mx-4'>
                {orderData.length > 0 && <div>
                    <h2 className='text-lg mb-1.5 font-medium'>Orders</h2>
                    <div className='flex flex-col gap-2'>
                        {
                            orderData.map(order => (
                                <div key={order._id} className='flex justify-between items-center flex-col sm:flex-row gap-2 rounded-md border-2 bg-white p-2 px-3'>
                                    {/* <div>{order._id}</div> */}
                                    <div className='text-xs flex flex-col font-medium text-gray-600'>
                                        <div>{order._id.toUpperCase()}</div>
                                        <div className='text-sm text-gray-800'>{new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/view/' + order._id)}>View</Link>
                                        <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/edit/' + order._id)}>Edit</Link>
                                        <button
                                            className='px-2.5 py-1 bg-orange-500 text-white rounded text-sm font-medium'
                                            onClick={async () => {
                                                const res = await fetcher.put<{ id: string }, Order>(`/collector/orders/${order._id}`, { id: order._id });
                                                if (res.body && res.status === 200) {
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
                </div>}
                {orderReportDeliveryData.length > 0 && <div>
                    <h2 className='text-lg mb-1.5 font-medium'>Report to be Delivered</h2>
                    <div className='flex flex-col gap-2'>
                        {
                            orderReportDeliveryData.map(order => (
                                <div key={order._id} className='flex justify-between items-center flex-col sm:flex-row gap-2 rounded-md border-2 bg-white p-2 px-3'>
                                    {/* <div>{order._id}</div> */}
                                    <div className='text-xs flex flex-col font-medium text-gray-600'>
                                        <div>{order._id.toUpperCase()}</div>
                                        <div className='text-sm text-gray-800'>{new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/view/' + order._id)}>View</Link>
                                        <Link className='px-2.5 py-1 bg-primary text-white rounded text-sm font-medium' href={('/collector/orders/edit/' + order._id)}>Edit</Link>
                                    </div>
                                    {/* <h3>{order.sampleTakenDateTime.date.start}</h3> */}
                                </div>
                            ))
                        }
                    </div>
                </div>}
            </div>
        </>
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
        start?: string;
        end?: string;
    };
    reportDeliverTime: {
        date: {
            start?: Date;
            end?: Date;
        };
    };
    _id: string;
}