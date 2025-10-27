"use client"
import Dropdown from '@/components/Dropdown'
import Input from '@/components/Inputs/Input'
import React, { useState } from 'react'
import Image from 'next/image'
// import CheckBox from '@/components/Inputs/CheckBox'
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'
import { MainTable } from '@/components/Table'
import plusIcon from '@/assets/blue-plus.svg'
import SelectCollector from '@/app/components/SelectCollector'
import SelectUser from '@/app/components/SelectUser'
import DateInput from '@/components/Inputs/DateInput'
import OrderPopup from './OrderPopup'
import TrashBinIcon from '@/assets/reactIcon/TrashBin'
import OrderTimeSelector from '@/app/(mainLayout)/cart/component/OrderTimeSelector'

type Props = {
    orderDetails: OrderDetails,
    error?: { field: string, msg: string } | null,
    onChange: {
        orderDetails: (orderDetails: OrderDetails) => void,
    },
    onSave: () => void
}

const OrderForm = ({ orderDetails, error, onChange, onSave = () => { } }: Props) => {
    const [showOrderPopup, setShowOrderPopup] = useState<{ index: number } | null>(null);
    const [showScheduleOrderTimesModel, setShowScheduleOrderTimesModel] = useState<boolean>(false)

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Order Form
                <Title title={<p className='text-nowrap font-medium'>Fill in the details for the order</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title>
            </div>
            <div className='pb-4 font-semibold'>Order Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <div className='flex flex-col gap-1'>
                    <div className='font-medium flex items-center gap-2'>
                        User
                        <Title title={<p className='text-nowrap font-medium'>Search using email</p>}>
                            <Image src={informationIcon} alt="" width={16} height={16} />
                        </Title>
                    </div>
                    <SelectUser onSelect={(val) => onChange.orderDetails({ ...orderDetails, user: val })} />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='font-medium flex items-center gap-2'>
                        Collector
                        <Title title={<p className='text-nowrap font-medium'>Search using email</p>}>
                            <Image src={informationIcon} alt="" width={16} height={16} />
                        </Title>
                    </div>
                    <SelectCollector onSelect={(val) => onChange.orderDetails({ ...orderDetails, collector: val })} />
                </div>
                {/* <Input label='Collector' name='collector' placeholder='Enter collector' value={orderDetails.collector || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, collector: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'collector' ? error.msg : ""} /> */}
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Status</p>
                    <Dropdown options={['Ordered', 'Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled']} value={orderDetails.status} onChange={(val) => onChange.orderDetails({ ...orderDetails, status: val.value as 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' })} width={'100%'} />
                </div>
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Address Information
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm pb-4'>
                <Input label='City *' value={orderDetails.address.city} onChange={val => onChange.orderDetails({ ...orderDetails, address: { ...orderDetails.address, city: val } })} />
                {/* <div className='text-sm flex flex-col gap-1'>
                        <label className='font-medium'>Gender *</label>
                        <Dropdown options={['Male', 'Female', 'Other']} width={'100%'} value={'Male'} onChange={({ value }) => setValues({ ...values, gender: value as 'Male' | 'Female' | 'Other' })} />
                    </div> */}
                <Input label='District *' value={orderDetails.address.district} onChange={val => onChange.orderDetails({ ...orderDetails, address: { ...orderDetails.address, district: val } })} />
                <Input label='Pin *' value={orderDetails.address.pin} onChange={val => onChange.orderDetails({ ...orderDetails, address: { ...orderDetails.address, pin: val } })} />
                <Input label='Phone *' value={orderDetails.address.phone} onChange={val => onChange.orderDetails({ ...orderDetails, address: { ...orderDetails.address, phone: val } })} />
            </div>
            <div className='text-sm flex flex-col gap-1 pt-2'>
                <label className='font-medium'>Landmark / Any Other details</label>
                <textarea className='border-2 border-gray-300/50 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Other Details' value={orderDetails.address.other} onChange={(e) => onChange.orderDetails({ ...orderDetails, address: { ...orderDetails.address, other: e.target.value } })}></textarea>
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Items Information
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowOrderPopup({ index: orderDetails.items?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-gray-300/50 border-t-0 rounded'>
                <MainTable<Item>
                    config={[
                        {
                            heading: 'Test', selector: 'product', component: ({ data }) => {
                                return (
                                    <div>{data.product.test.name}</div>
                                )
                            }
                        },
                        { heading: 'Patients', selector: 'quantity' },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setShowOrderPopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newItems = [...orderDetails.items];
                                        newItems.splice(index, 1);
                                        onChange.orderDetails({ ...orderDetails, items: newItems });
                                    }}><TrashBinIcon />
                                </button>
                            </div>)
                        }
                    ]}
                    data={orderDetails.items}
                    className='rounded text-sm border-0' />
                {showOrderPopup && showOrderPopup.index !== null && <OrderPopup
                    item={orderDetails?.items[showOrderPopup.index]}
                    onSave={(item) => {
                        const newItems = [...orderDetails.items];
                        newItems[showOrderPopup.index] = item;
                        onChange.orderDetails({ ...orderDetails, items: newItems });
                        setShowOrderPopup(null);
                    }}
                    onClose={() => setShowOrderPopup(null)} />}
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Time Information
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                {showScheduleOrderTimesModel && <OrderTimeSelector
                    onClose={() => setShowScheduleOrderTimesModel(false)}
                    onChange={(sampleTakenDateTime) => onChange.orderDetails({ ...orderDetails, sampleTakenDateTime: { start: sampleTakenDateTime.start.toISOString(), end: sampleTakenDateTime.end.toISOString() } })} />}
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Sample Taken Start Date</label>
                    <div className='px-3 py-2 border-2 border-gray-300/50 h-fit rounded' onClick={() => setShowScheduleOrderTimesModel(true)}>{new Date(orderDetails.sampleTakenDateTime?.start || '').toDateString()}, {new Date(orderDetails?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                </div>
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Sample Taken End Date</label>
                    <div className='px-3 py-2 border-2 border-gray-300/50 h-fit rounded' onClick={() => setShowScheduleOrderTimesModel(true)}>{new Date(orderDetails.sampleTakenDateTime?.end || '').toDateString()}, {new Date(orderDetails?.sampleTakenDateTime?.end || '').toTimeString().split(' ')[0]}</div>
                </div>
                {/* <DateInput label='Sample Taken Start Date' minTime={new Date(new Date().setHours(6, 0, 0))} maxTime={new Date(new Date().setHours(18, 0, 0))} value={new Date(orderDetails.sampleTakenDateTime.start || '')} onChange={(val) => onChange.orderDetails({ ...orderDetails, sampleTakenDateTime: { ...orderDetails.sampleTakenDateTime, start: new Date(val).toISOString() } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'sampleTakenStartDate' ? error.msg : ""} />
                <DateInput label='Sample Taken End Date' minTime={new Date(new Date().setHours(6, 0, 0))} maxTime={new Date(new Date().setHours(18, 0, 0))} value={new Date(orderDetails.sampleTakenDateTime.end || '')} onChange={(val) => onChange.orderDetails({ ...orderDetails, sampleTakenDateTime: { ...orderDetails.sampleTakenDateTime, end: new Date(val).toISOString() } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'sampleTakenEndDate' ? error.msg : ""} /> */}
                <DateInput label='Report Deliver Start Date' minTime={new Date(new Date().setHours(6, 0, 0))} maxTime={new Date(new Date().setHours(18, 0, 0))} value={new Date(orderDetails.reportDeliverTime.start || '')} onChange={(val) => onChange.orderDetails({ ...orderDetails, reportDeliverTime: { ...orderDetails.reportDeliverTime, start: new Date(val).toISOString() } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'reportDeliverStartDate' ? error.msg : ""} />
                <DateInput label='Report Deliver End Date' minTime={new Date(new Date().setHours(6, 0, 0))} maxTime={new Date(new Date().setHours(18, 0, 0))} value={new Date(orderDetails.reportDeliverTime.end || '')} onChange={(val) => onChange.orderDetails({ ...orderDetails, reportDeliverTime: { ...orderDetails.reportDeliverTime, end: new Date(val).toISOString() } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'reportDeliverEndDate' ? error.msg : ""} />
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Payment Information
            </div>
            <Input label='Paid *' value={orderDetails?.paid?.toString() || '0'} type='number' onChange={val => onChange.orderDetails({ ...orderDetails, paid: Number(val) })} />
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Total Amount: ₹{orderDetails.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)}
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }}>Save</div>
            </div>
        </div>
    )
}

export default OrderForm;

export type OrderDetails = {
    items: Item[];
    user: { _id: string, name: string };
    collector?: { _id: string, name: string };
    status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        start?: string;
        end?: string;
    };
    reportDeliverTime: {
        start?: string;
        end?: string;
    };
    address: {
        pin: string;
        city: string;
        district: string;
        other?: string; // road details
        phone: string;
    };
    paid?: number;
}

export type Item = {
    product: {
        test: { _id: string, name: string };
        lab: { _id: string, name: string } | Lab;
        price: number;
    };
    patientDetails: {
        name: string;
        // phone: string;
        age: number;
        gender: 'Male' | 'Female' | 'Other';
        other?: string;
    }[];
    address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
    };
    quantity: number;
    date?: Date;
}

export type Lab = {
    _id: string;
    name: string;
    description?: string;
    location: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string, // road details
        };
        location: {
            lat: number;
            lang: number;
        };
    };
    certification?: {
        organization: string;
        year?: number;
        imageUrl?: string;
    }[];
    rating: number;
    rated: number;
    contractDetails?: {
        email?: string[],
        phone?: string[]
    }
}