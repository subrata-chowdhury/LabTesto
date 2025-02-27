'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Order } from '../page';
import fetcher from '@/lib/fetcher';
import { PatientDetails } from '@/app/components/popups/PatientDetailsPopup';
import Input from '@/components/Inputs/Input';
import Model from '@/components/Model';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import ReviewForm, { ReviewType } from '@/app/components/ReviewForm';
import Loading from './loading';

function OrderPage() {
    const [order, setOrder] = useState<Order>();
    const [showPatientPopup, setShowPatientPopup] = useState<{ itemIndex: number, patientIndex: number } | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ orderId: string, item: { test: string, lab: string } } | null>(null);
    const { id } = useParams();

    const fetchOrderDetails = useCallback(async () => {
        try {
            const response = await fetcher.get<Order>('/orders/' + id);
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
        <div className='flex-1 flex flex-col gap-4 bg-gray-100 px-5 py-4'>
            <div className='text-sm'>Order ID: {order?._id.toUpperCase()}</div>
            {order?.items.map((item, index) => (
                <div className='bg-white rounded shadow-md' key={index}>
                    <div className='flex justify-between p-3 px-4'>
                        <div className='flex flex-col gap-2 justify-between h-full'>
                            <div>
                                <div className="text-2xl font-semibold">{item.product.test.name}</div>
                                <div className='text-sm'>{item.product.lab.name}, {item.product.lab.location.address.pin}</div>
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
                                    if (res.status === 200) setOrder(await fetchOrderDetails())
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
                                    if (res.status === 200) setOrder(await fetchOrderDetails())
                                }}>Delivered</button>}
                            {(order.status === 'Report Delivered') && <button
                                className="bg-[#3986ba] text-white px-3 py-1 rounded"
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
                    <div className='bg-[rgba(57,134,186,0.08)] flex gap-2 p-2 text-xs'>
                        {
                            Array(item.quantity).fill(0).map((_, i) => (
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
            <div className='bg-white px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Collector Details</div>
                <div><span className='font-medium'>Name:</span> {order?.collector?.name}</div>
                <div><span className='font-medium'>Email:</span> {order?.collector?.email}</div>
                <div><span className='font-medium'>Phone Number:</span> {order?.collector?.phone}</div>
            </div>
            <div className='bg-white px-6 py-4 rounded'>
                <div className='text-lg font-semibold'>Report Delivery Address</div>
                <div><span className='font-medium'>City:</span> {order?.address?.city}</div>
                <div><span className='font-medium'>District:</span> {order?.address?.district}</div>
                <div><span className='font-medium'>Pin:</span> {order?.address?.pin}</div>
                <div><span className='font-medium'>Phone:</span> {order?.address?.phone}</div>
            </div>
            {(showPatientPopup?.itemIndex != null) &&
                <PatientDetailsPopup
                    patientDetails={order?.items[showPatientPopup?.itemIndex || 0].patientDetails[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                />}
            {
                showReviewModel && <ReviewModel
                    onSave={async review => {
                        const res = await fetcher.put<{ product: { test: string, lab: string }, review: ReviewType }, { message: string } | string>("/orders/" + showReviewModel.orderId, {
                            product: showReviewModel.item,
                            review: review
                        })
                        if (res.status === 200) setOrder(await fetchOrderDetails())
                    }}
                    onClose={() => setShowReviewModel(null)} />
            }
        </div>
    )
}

export default OrderPage

function PatientDetailsPopup({ patientDetails, onClose }: { patientDetails?: PatientDetails, onSave?: (patientDetails: PatientDetails) => void, onClose: () => void }) {
    return (
        <Model heading='Patient Details' onClose={onClose}>
            <div className='px-7 pb-6 py-4'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-4'>
                    <Input label='Name' value={patientDetails?.name || ''} onChange={() => { }} />
                    <Input label='Age' value={String(patientDetails?.age) || ''} onChange={() => { }} />
                    <Input label='Gender' value={String(patientDetails?.gender) || ''} onChange={() => { }} />
                </div>
            </div>
        </Model>
    )
}

function ReviewModel({ onClose = () => { }, onSave = () => { } }: { onClose: () => void, onSave: (review: ReviewType) => void }) {
    return (
        <Model heading='Review' className='w-[400px]' onClose={onClose}>
            <ReviewForm onSave={onSave} />
        </Model>
    )
}