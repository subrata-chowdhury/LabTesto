'use client'
import Model from '@/components/Model';
import fetcher from '@/lib/fetcher';
import React, { useEffect, useState } from 'react'
import ReviewForm, { ReviewType } from '../../components/ReviewForm';
import { useRouter } from 'next/navigation';
import OrdersLoading from './loading';

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ orderId: string, item: { test: string, lab: string } } | null>(null)
    const navigate = useRouter();

    useEffect(() => {
        fetchOrder();
    }, []);

    async function fetchOrder() {
        try {
            const response = await fetcher.get<Order[]>('/orders');
            if (response.status !== 200) {
                throw new Error('Failed to fetch order');
            }
            if (response.body) {
                const sortedOrders = response.body.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(sortedOrders);
            }
        } catch (err) {
            console.log(err)
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <OrdersLoading />

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Please Reload Your Page Or Click <button onClick={() => window.location.reload()}>Reload</button></div>;
    }

    if (orders?.length <= 0) {
        return <div className="flex justify-center items-center h-screen">No items in the order</div>;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Ordered Items</h1>
            <ul className="space-y-3 flex-1 overflow-y-scroll">
                {orders.map((order, outerIndex) => (
                    <li
                        key={outerIndex}
                        onClick={() => navigate.push('/order/' + order._id)}
                        className="bg-white rounded drop-shadow-md cursor-pointer p-3 px-4 flex justify-between items-center">
                        <div>
                            <div className="text-lg font-semibold">{order.items.map(e => e.product.test.name).join(', ')}</div>
                            <div className='text'>{order.status}, {new Date(order.updatedAt).toDateString()}</div>
                        </div>
                        <div>
                            ❯
                        </div>
                        {/* <div className='p-3 px-4 flex justify-between items-center'>
                                    <div className='flex flex-col gap-2 justify-between h-full'>
                                        <div>
                                            <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                            <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address}</div>
                                        </div>
                                        <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                                    </div>
                                    <div className='flex flex-col gap-2 text-sm'>
                                        <div className='flex gap-2'>
                                            <div>Quantity:</div>
                                            <div>{item.quantity}</div>
                                        </div>
                                        {(order.status === 'Ordered') && <button
                                            className="bg-orange-600 text-white px-3 py-1 rounded"
                                            onClick={async () => {
                                                const res = await fetcher.put<{ product: { test: string, lab: string }, status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' }, { message: string } | string>("/orders/" + order._id, {
                                                    product: {
                                                        test: item.product.test._id,
                                                        lab: item.product.lab._id
                                                    },
                                                    status: 'Canceled'
                                                })
                                                if (res.status === 200) fetchOrder()
                                            }}>Cancel</button>}
                                        {(order.status === 'Report Generated') && <button
                                            className="bg-orange-600 text-white px-3 py-1 rounded"
                                            onClick={async () => {
                                                const res = await fetcher.put<{ product: { test: string, lab: string }, status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' }, { message: string } | string>("/orders/" + order._id, {
                                                    product: {
                                                        test: item.product.test._id,
                                                        lab: item.product.lab._id
                                                    },
                                                    status: 'Report Delivered'
                                                })
                                                if (res.status === 200) fetchOrder()
                                            }}>Delivered</button>}
                                        {(order.status === 'Report Delivered') && <button
                                            className="bg-orange-600 text-white px-3 py-1 rounded"
                                            onClick={async () => {
                                                setShowReviewModel({
                                                    orderId: order._id,
                                                    item: {
                                                        test: item.product.test._id,
                                                        lab: item.product.lab._id
                                                    }
                                                })
                                            }}>Review</button>}
                                    </div>
                                </div>
                                <div className='bg-orange-50 flex gap-2 p-2 text-xs'>
                                    {
                                        Array(item.quantity).fill(0).map((_, i) => (
                                            <div
                                                key={i}
                                                className='bg-orange-200 px-3 py-1 rounded-full cursor-pointer'
                                                onClick={() =>
                                                    setShowPatientPopup({ orderIndex: outerIndex, cartIndex: index, patientIndex: i })}>
                                                {order.items[index]?.patientDetails[i]?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                                            </div>
                                        ))
                                    }
                                </div> */}
                    </li>
                ))}
            </ul>
            {
                showReviewModel && <ReviewModel
                    onSave={async review => {
                        const res = await fetcher.put<{ product: { test: string, lab: string }, review: ReviewType }, { message: string } | string>("/orders/" + showReviewModel.orderId, {
                            product: showReviewModel.item,
                            review: review
                        })
                        if (res.status === 200) fetchOrder()
                    }}
                    onClose={() => setShowReviewModel(null)} />
            }
        </div>
    );
}

export default OrderPage;

export type Order = {
    _id: string;
    items: {
        product: {
            test: { name: string, _id: string };
            lab: { name: string, _id: string, location: { address: { pin: string } } };
            price: number;
        };
        patientDetails: {
            name: string;
            // phone: string;
            gender: 'Male' | 'Female' | 'Other';
            age: number;
            other?: string;
        }[];
        quantity: number;
        date?: Date;
    }[];
    address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
        phone: string;
    };

    user: string;
    collector?: {
        name: string;
        email: string;
        // password: string;
        phone?: string;
    };
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
    createdAt: string;
    updatedAt: string;
}

function ReviewModel({ onClose = () => { }, onSave = () => { } }: { onClose: () => void, onSave: (review: ReviewType) => void }) {
    return (
        <Model heading='Review' className='w-[400px]' onClose={onClose}>
            <ReviewForm onSave={onSave} />
        </Model>
    )
}