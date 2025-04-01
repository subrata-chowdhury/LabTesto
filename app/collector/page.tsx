'use client'
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../loading';
import { OrderDetailsCard } from './components/OrderDetailsCard';

const CollectorDashboard = () => {
    const [upComingOrderData, setUpComingOrderData] = useState<Order[]>([]);
    const [todaysOrderData, setTodaysOrderData] = useState<Order[]>([]);
    const [passedOrderData, setPassedOrderData] = useState<Order[]>([]);
    const [orderReportDeliveryData, setOrderReportDeliveryData] = useState<Order[]>([]);
    const [outForSampleCollectionData, setOutForSampleCollectionData] = useState<Order[]>([]);
    const [outForReportDeliveryData, setOutForReportDeliveryData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const filterData: { status?: string | { $in: string[] }, date?: string, name?: string } = { status: { $in: ['Ordered', 'Report Generated', 'Out for Sample Collection', 'Out for Report Delivery'] } };

        const res = await fetcher.get<{ orders: Order[], pagination: { totalOrders: number, currentPage: number, pageSize: number, totalPages: number } }>(`/collector/orders?filter=${JSON.stringify(filterData)}&limit=999&page=1`);
        if (res.status !== 200) return;
        if (res.body) {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            const upcomingOrders = res.body.orders.filter(order => {
                return order.status === 'Ordered' && new Date(order.sampleTakenDateTime?.start || '') > endOfDay;
            });

            const todaysOrders = res.body.orders.filter(order => {
                return order.status === 'Ordered' && new Date(order.sampleTakenDateTime?.start || '') >= startOfDay && new Date(order.sampleTakenDateTime?.start || '') <= endOfDay;
            });

            const passedOrders = res.body.orders.filter(order => {
                return order.status === 'Ordered' && new Date(order.sampleTakenDateTime?.start || '') < startOfDay;
            });
            console.log(upcomingOrders, todaysOrders, passedOrders)

            setUpComingOrderData(upcomingOrders);
            setTodaysOrderData(todaysOrders);
            setPassedOrderData(passedOrders);

            setOrderReportDeliveryData(res.body.orders.filter(order => {
                return order.status === 'Report Generated' && new Date(order.reportDeliverTime.date.start || '') <= endOfDay;
            }));
            setOutForSampleCollectionData(res.body.orders.filter(order => {
                return order.status === 'Out for Sample Collection';
            }));
            setOutForReportDeliveryData(res.body.orders.filter(order => {
                return order.status === 'Out for Report Delivery';
            }));
        }
        setLoading(false);
    }, [])

    useEffect(() => {
        fetchOrders();
    }, [])

    if (loading) return <Loading />

    return (
        <>
            {outForSampleCollectionData.length > 0 && <>
                <h1 className='text-xl font-semibold mx-4 mb-2 mt-4'>Out For Sample Collection</h1>
                <div className='flex flex-col gap-2 mx-4'>
                    {
                        outForSampleCollectionData.map(order => (
                            <OrderDetailsCard
                                key={order._id}
                                order={order}
                                onPass={(order) => {
                                    setPassedOrderData(prev => prev.filter(o => o._id !== order._id));
                                }} />
                        ))
                    }
                </div>
            </>}
            {outForReportDeliveryData.length > 0 && <>
                <h1 className='text-xl font-semibold mx-4 mb-2 mt-4'>Out For Report Delivery</h1>
                <div className='flex flex-col gap-2 mx-4'>
                    {
                        outForReportDeliveryData.map(order => (
                            <OrderDetailsCard
                                key={order._id}
                                order={order}
                                onPass={(order) => {
                                    setPassedOrderData(prev => prev.filter(o => o._id !== order._id));
                                }} />
                        ))
                    }
                </div>
            </>}
            {passedOrderData.length > 0 && <>
                <h1 className='text-xl font-semibold mx-4 mb-2 mt-4'>Passed</h1>
                <div className='flex flex-col gap-2 mx-4'>
                    {
                        passedOrderData.map(order => (
                            <OrderDetailsCard
                                key={order._id}
                                order={order}
                                onPass={(order) => {
                                    setPassedOrderData(prev => prev.filter(o => o._id !== order._id));
                                }} />
                        ))
                    }
                </div>
            </>}
            {todaysOrderData.length > 0 && <>
                <h1 className='text-xl font-semibold mx-4 mb-2 mt-4'>Today&#39;s</h1>
                <div className='flex flex-col gap-2 mx-4'>
                    {
                        todaysOrderData.map(order => (
                            <OrderDetailsCard
                                key={order._id}
                                order={order}
                                onPass={(order) => {
                                    setTodaysOrderData(prev => prev.filter(o => o._id !== order._id));
                                }} />
                        ))
                    }
                </div>
            </>}
            <h1 className='text-xl font-semibold mx-4 mb-2 mt-4'>Upcoming</h1>
            {upComingOrderData.length <= 0 && orderReportDeliveryData.length <= 0 && <div className='flex justify-center items-center h-32'>
                <h2 className='text-lg text-gray-500 my-auto'>No Upcoming Orders</h2>
            </div>}
            <div className='grid grid-rows-2 h-full mx-4'>
                {upComingOrderData.length > 0 && <>
                    <div className='flex flex-col gap-2'>
                        {
                            upComingOrderData.map(order => (
                                <OrderDetailsCard
                                    key={order._id}
                                    order={order}
                                    onPass={(order) => {
                                        setUpComingOrderData(prev => prev.filter(o => o._id !== order._id));
                                    }} />
                            ))
                        }
                    </div>
                </>}
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

export type Order = {
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
        name: string;
        email: string
    };
    collector?: string;
    status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled';
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