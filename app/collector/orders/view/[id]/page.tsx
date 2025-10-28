'use client'
import React, { useCallback, useEffect, useState } from 'react'
// import { Order } from '../page';
import fetcher from '@/lib/fetcher';
import { PatientDetails } from '@/app/components/popups/PatientDetailsPopup';
import Model from '@/components/Model';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ReviewForm, { ReviewType } from '@/app/components/ReviewForm';
import Loading from './loading';
import ConfirmationModel from '@/app/components/popups/ConfirmationModel';
import Link from 'next/link';

function OrderPage() {
    const [order, setOrder] = useState<Order>();
    const [showPatientPopup, setShowPatientPopup] = useState<{ itemIndex: number, patientIndex: number } | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ orderId: string, item: { test: string, lab: string }, index: number } | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);
    const { id } = useParams();

    const fetchOrderDetails = useCallback(async () => {
        try {
            const response = await fetcher.get<Order>('/collector/orders/' + id);
            if (response.status !== 200) {
                throw new Error('Failed to fetch order');
            }
            if (response.body) {
                return (response.body);
            }
        } catch {
            toast.error("Unable to fetch data")
        }
    }, [id])

    useEffect(() => {
        async function startUp() {
            setOrder(await fetchOrderDetails())
        }
        startUp()
    }, [fetchOrderDetails])

    if (!order) return <Loading />

    return (
        <div className='flex-1 flex flex-col gap-4 pt-2'>
            <div className='text-sm'>Order ID: {order?._id.toUpperCase()}</div>
            {order?.items.map((item, index) => (
                <div className='bg-white dark:bg-black rounded shadow-md' key={index}>
                    <div className='flex justify-between p-3 px-4'>
                        <div className='flex flex-col gap-2 justify-between h-full'>
                            <div>
                                <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address.pin}</div>
                            </div>
                            <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                        </div>
                    </div>
                    <div className='bg-primary/5 dark:bg-white/5 flex gap-2 p-2 text-xs'>
                        {
                            order.items[index]?.patientDetails?.length > 0 && Array(item.quantity).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className='bg-primary text-white dark:bg-white/20 px-3 py-1 rounded-full cursor-pointer'
                                    onClick={() =>
                                        setShowPatientPopup({ itemIndex: index, patientIndex: i })}>
                                    {order.items[index]?.patientDetails[i]?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
            <Link href={`/collector/orders/edit/${order._id}`} className='ms-auto px-4 py-2 bg-primary dark:bg-white/15 text-white rounded font-medium'>Edit Order</Link>
            <div className='bg-white text-sm flex flex-col dark:bg-black px-6 py-4 rounded'>
                <div className='py-2.5 flex gap-2'>
                    <div>
                        1.
                    </div>
                    <div>
                        <div className='font-semibold'>Ordered</div>
                        {new Date(order.createdAt).toDateString()}, {new Date(order.createdAt).toTimeString()}
                    </div>
                </div>
                {order.statusRecords.map((e, index) => (
                    <div className='py-2.5 flex gap-2' key={e.date}>
                        <div>
                            {index + 2}.
                        </div>
                        <div>
                            <div className='font-semibold'>{e.status}</div>
                            {new Date(e.date).toDateString()}, {new Date(e.date).toTimeString()}
                        </div>
                    </div>
                ))}
            </div>
            <div className='bg-white dark:bg-black px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Sample Taken Time </div>
                <div><span className='font-medium'>Start:</span> {new Date(order?.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                <div><span className='font-medium'>End:</span> {new Date(order?.sampleTakenDateTime?.end || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.end || '').toTimeString().split(' ')[0]}</div>
            </div>
            {!(order.status === 'Report Delivered' || order.status === 'Canceled') && <div className='bg-white dark:bg-black px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Collector Details</div>
                <div><span className='font-medium'>Name:</span> {order?.collector?.name}</div>
                <div><span className='font-medium'>Email:</span> {order?.collector?.email}</div>
                <div><span className='font-medium'>Phone Number:</span> {order?.collector?.phone}</div>
            </div>}
            <div className='bg-white dark:bg-black px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Report Delivery Address</div>
                <div><span className='font-medium'>City:</span> {order?.address?.city}</div>
                <div><span className='font-medium'>District:</span> {order?.address?.district}</div>
                <div><span className='font-medium'>Pin:</span> {order?.address?.pin}</div>
                <div><span className='font-medium'>Phone:</span> {order?.address?.phone}</div>
            </div>
            <div className='bg-white dark:bg-black px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>User Details</div>
                <div><span className='font-medium'>Name:</span> {order?.user?.name}</div>
                <div><span className='font-medium'>Email / Phone:</span> {order?.user?.email}</div>
            </div>
            {(showPatientPopup?.itemIndex != null) &&
                <PatientDetailsPopup
                    patientDetails={order?.items[showPatientPopup?.itemIndex || 0].patientDetails[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                />}
            {
                showReviewModel && <ReviewModel
                    reviewDetails={order.review[showReviewModel.index]}
                    onSave={async review => {
                        const res = await fetcher.put<{ product: { test: string, lab: string }, review: ReviewType }, { message: string } | string>("/orders/" + showReviewModel.orderId, {
                            product: showReviewModel.item,
                            review: review
                        })
                        if (res.status === 200) {
                            toast.success('Review Saved');
                            setOrder(await fetchOrderDetails());
                            setShowReviewModel(null);
                        }
                    }}
                    onClose={() => setShowReviewModel(null)} />
            }
            {showConfirmPopup && <ConfirmationModel
                msg={
                    <div className='px-6 pt-6'>
                        Are you sure you want to cancel this order? <br />This action <span className='text-red-500'>cannot be undone.</span>
                    </div>
                }
                onDecline={() => setShowConfirmPopup(false)}
                onApprove={async () => {
                    const res = await fetcher.put<{ status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' }, { message: string } | string>("/orders/" + order._id, {
                        status: 'Canceled'
                    })
                    if (res.status === 200) {
                        toast.success('Order Canceled')
                        setOrder(await fetchOrderDetails())
                    }
                }} />}
        </div>
    )
}

export default OrderPage

function PatientDetailsPopup({ patientDetails, onClose }: { patientDetails?: PatientDetails, onSave?: (patientDetails: PatientDetails) => void, onClose: () => void }) {
    return (
        <Model heading='Patient Details' onClose={onClose}>
            <div className='px-7 pb-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='font-normal'>Name: <span className='font-semibold'>{patientDetails?.name}</span></div>
                <div className='font-normal'>Age: <span className='font-semibold'>{patientDetails?.age}</span></div>
                <div className='font-normal'>Gender: <span className='font-semibold'>{patientDetails?.gender}</span></div>
            </div>
        </Model>
    )
}

function ReviewModel({ reviewDetails, onClose = () => { }, onSave = () => { } }: { reviewDetails?: ReviewType, onClose: () => void, onSave: (review: ReviewType) => void }) {
    return (
        <Model heading='Review' className='w-[400px]' onClose={onClose}>
            <ReviewForm reviewDetails={reviewDetails} onSave={onSave} />
        </Model>
    )
}

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

    user: {
        name: string;
        email: string;
        // password: string;
    };
    collector?: {
        name: string;
        email: string;
        // password: string;
        phone?: string;
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
    review: {
        test: string;
        lab: string;
        labRating: number,
        collectorRating: number,
        platformRating: number,
        reviewText: string
    }[];
    statusRecords: {
        status: 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled',
        date: string
    }[];
    createdAt: string;
    updatedAt: string;
}