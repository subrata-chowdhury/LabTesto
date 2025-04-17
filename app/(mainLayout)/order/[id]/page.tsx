'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Order } from '../page';
import fetcher from '@/lib/fetcher';
import { PatientDetails } from '@/app/components/popups/PatientDetailsPopup';
import Model from '@/components/Model';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ReviewForm, { ReviewType } from '@/app/components/ReviewForm';
import Loading from './loading';
import ConfirmationModel from '@/app/components/popups/ConfirmationModel';

function OrderPage() {
    const [order, setOrder] = useState<Order>();
    const [showPatientPopup, setShowPatientPopup] = useState<{ itemIndex: number, patientIndex: number } | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ orderId: string, item: { test: string, lab: string }, index: number } | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetcher.get<Order>('/orders/' + id);
            if (response.status !== 200) {
                toast.error(response.error || 'Unable to fetch order details')
            }
            if (response.status === 200) setLoading(false)
            if (response.body) {
                return (response.body);
            }
        } catch {
            toast.error("Unable to fetch data")
        }
        setLoading(false)
    }, [id])

    useEffect(() => {
        async function startUp() {
            setOrder(await fetchOrderDetails())
        }
        startUp()
    }, [fetchOrderDetails])

    if (loading) return <Loading />
    if (!order) return <div className='flex justify-center items-center h-screen text-red-500'>Order Not Found</div>

    return (
        <div className='flex-1 flex flex-col gap-4 bg-gray-100 dark:bg-[#0A192F] px-5 py-4'>
            <div className='text-sm'>Order ID: {order?._id.toUpperCase()}</div>
            {order?.items.map((item, index) => (
                <div className='bg-white dark:bg-[#172A46] rounded shadow-md' key={index}>
                    <div className='flex justify-between p-3 px-4'>
                        <div className='flex flex-col gap-2 justify-between h-full'>
                            <div>
                                <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address.pin}</div>
                            </div>
                            <div className='mt-auto font-medium text-xl'>₹{(item.product.price || 0) * item.quantity}</div>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center text-sm'>
                            <div className='flex gap-2'>
                                <div>Quantity:</div>
                                <div>{item.quantity}</div>
                            </div>
                            {(order.status === 'Report Delivered') && <button
                                className="bg-primary text-white px-4 py-2 rounded"
                                onClick={async () => {
                                    setShowReviewModel({
                                        orderId: order._id,
                                        item: {
                                            test: item.product.test._id,
                                            lab: item.product.lab._id
                                        },
                                        index: index
                                    })
                                }}>Review</button>}
                        </div>
                    </div>
                    <div className='bg-[rgba(57,134,186,0.08)] flex gap-2 p-2 text-xs'>
                        {
                            order.items[index]?.patientDetails?.length > 0 && Array(item.quantity).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className='bg-[rgba(57,134,186,0.25)] px-3 py-1 rounded-full cursor-pointer'
                                    onClick={() =>
                                        setShowPatientPopup({ itemIndex: index, patientIndex: i })}>
                                    {order.items[index]?.patientDetails[i]?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
            <div className='flex justify-end'>
                {(order.status === 'Ordered') && <button
                    className="bg-orange-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setShowConfirmPopup(true)
                    }}>Cancel Order</button>}
                {(order.status === 'Report Generated') && <button
                    className="bg-orange-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        const res = await fetcher.put<{ status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' }, { message: string } | string>("/orders/" + order._id, {
                            status: 'Report Delivered'
                        })
                        if (res.status === 200) setOrder(await fetchOrderDetails())
                    }}>Delivered</button>}
            </div>
            <div className='bg-white text-sm flex flex-col dark:bg-[#172A46] px-6 py-4 rounded'>
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
            <div className='bg-white dark:bg-[#172A46] px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Sample Taken Time </div>
                <div><span className='font-medium'>Start:</span> {new Date(order?.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                <div><span className='font-medium'>End:</span> {new Date(order?.sampleTakenDateTime?.end || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.end || '').toTimeString().split(' ')[0]}</div>
            </div>
            {!(order.status === 'Report Delivered' || order.status === 'Canceled') && <div className='bg-white dark:bg-[#172A46] px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Collector Details</div>
                <div><span className='font-medium'>Name:</span> {order?.collector?.name}</div>
                <div><span className='font-medium'>Email:</span> {order?.collector?.email}</div>
                <div><span className='font-medium'>Phone Number:</span> {order?.collector?.phone}</div>
            </div>}
            <div className='bg-white dark:bg-[#172A46] px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Report Delivery Address</div>
                <div><span className='font-medium'>City:</span> {order?.address?.city}</div>
                <div><span className='font-medium'>District:</span> {order?.address?.district}</div>
                <div><span className='font-medium'>Pin:</span> {order?.address?.pin}</div>
                <div><span className='font-medium'>Phone:</span> {order?.address?.phone}</div>
            </div>
            {/* {!(order.status === 'Report Delivered' || order.status === 'Canceled') && <div className='bg-white dark:bg-[#172A46] px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>User Details</div>
                <div><span className='font-medium'>Name:</span> {order?.user?.name}</div>
                <div><span className='font-medium'>Email / Phone:</span> {order?.user?.email}</div>
            </div>} */}
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
                    const res = await fetcher.put<{ status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled' }, { message: string } | string>("/orders/" + order._id, {
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