'use client'
import Input from '@/components/Inputs/Input';
import Model from '@/components/Model';
import fetcher from '@/lib/fetcher';
import React, { useEffect, useState } from 'react'
import ReviewForm from '../components/ReviewForm';

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPatientPopup, setShowPatientPopup] = useState<{ orderIndex: number, cartIndex: number, patientIndex: number } | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ index: number } | null>(null)

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
                setOrders(response.body); // Assuming you want the first order
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

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (orders?.length <= 0) {
        return <div className="flex justify-center items-center h-screen">No items in the order</div>;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Ordered Items</h1>
            <ul className="space-y-4 flex-1 overflow-y-scroll">
                {orders.map((order, outerIndex) => (
                    order.items.map((item, index) => (
                        <li key={index} className="bg-white rounded drop-shadow-md flex flex-col">
                            <div className='p-4 flex justify-between items-center'>
                                <div className='flex flex-col gap-4 justify-between h-full'>
                                    <div>
                                        <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                        <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address}</div>
                                        <div className='text-sm font-semibold'>{order.status} | {order.createdAt}</div>
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
                                            // const res = await fetcher.put<{
                                            //     product: { test: string, lab: string },
                                            //     review?: {
                                            //         labRating: number,
                                            //         collectorRating: number,
                                            //         platformRating: number,
                                            //         reviewText: string
                                            //     }
                                            // }, { message: string } | string>("/orders/" + order._id, {
                                            //     product: {
                                            //         test: item.product.test._id,
                                            //         lab: item.product.lab._id
                                            //     }
                                            // })
                                            // if (res.status === 200) fetchOrder()
                                            setShowReviewModel({ index })
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
                            </div>
                        </li>
                    ))
                ))}
            </ul>
            {(showPatientPopup?.cartIndex != null) &&
                <PatientDetailsPopup
                    patientDetails={orders[showPatientPopup?.orderIndex || 0].items[showPatientPopup?.cartIndex || 0].patientDetails[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                />}
            {
                showReviewModel && <ReviewModel />
            }
        </div>
    );
}

export default OrderPage;

function PatientDetailsPopup({ patientDetails, onClose }: { patientDetails?: PatientDetails, onSave?: (patientDetails: PatientDetails) => void, onClose: () => void }) {
    return (
        <Model heading='Patient Details' onClose={onClose}>
            <div className='px-7 pb-6 py-4'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-4'>
                    <Input label='Name' value={patientDetails?.name || ''} onChange={() => { }} />
                    <Input label='Phone' value={patientDetails?.phone || ''} onChange={() => { }} />
                </div>
                <div className='pb-2 font-semibold'>Address Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-2'>
                    <Input label='Pin' value={String(patientDetails?.address.pin)} onChange={() => { }} />
                    <Input label='City' value={patientDetails?.address.city || ''} onChange={() => { }} />
                    <Input label='District' value={patientDetails?.address.district || ''} onChange={() => { }} />
                    <Input label='Other' value={patientDetails?.address.other || ''} onChange={() => { }} />
                </div>
            </div>
        </Model>
    )
}

type PatientDetails = {
    name: string;
    phone: string;
    address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
    };
};

type Order = {
    _id: string;
    items: {
        product: {
            test: { name: string, _id: string };
            lab: { name: string, _id: string, location: { address: string } };
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
    createdAt: string;
}

function ReviewModel() {
    return (
        <Model heading='Review' onClose={() => { }}>
            <ReviewForm />
        </Model>
    )
}