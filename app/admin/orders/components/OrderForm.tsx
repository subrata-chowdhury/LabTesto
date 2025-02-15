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
import Model from '@/components/Model'
import PatientDetailsPopup, { PatientDetails } from "@/app/components/popups/PatientDetailsPopup";
import SelectTest from '@/app/components/SelectTest'
import trashBin from '@/assets/trash-bin.svg'
import SelectLab from '@/app/components/SelectLab'

type Props = {
    orderDetails: OrderDetails,
    error?: { field: string, msg: string } | null,
    onChange: {
        orderDetails: (orderDetails: OrderDetails) => void,
    },
    onSave: () => void
}

const OrderForm = ({ orderDetails, error, onChange, onSave = () => { } }: Props) => {
    const [showOrderPopup, setShowOrderPopup] = useState<{ index: number } | null>(null)

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
                <Input label='User *' name='user' placeholder='Enter user' value={orderDetails.user} onChange={(val) => onChange.orderDetails({ ...orderDetails, user: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'user' ? error.msg : ""} />
                <Input label='Collector' name='collector' placeholder='Enter collector' value={orderDetails.collector || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, collector: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'collector' ? error.msg : ""} />
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Status</p>
                    <Dropdown options={['Ordered', 'Sample Collected', 'Report Generated', 'Report Delivered', 'Canceled']} value={orderDetails.status} onChange={(val) => onChange.orderDetails({ ...orderDetails, status: val.value as 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' })} width={'100%'} />
                </div>
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Time Information
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <Input label='Sample Taken Start Date' name='sampleTakenStartDate' placeholder='Enter sample taken start date' value={orderDetails.sampleTakenDateTime.date.start?.toISOString().split('T')[0] || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, sampleTakenDateTime: { date: { ...orderDetails.sampleTakenDateTime.date, start: new Date(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'sampleTakenStartDate' ? error.msg : ""} />
                <Input label='Sample Taken End Date' name='sampleTakenEndDate' placeholder='Enter sample taken end date' value={orderDetails.sampleTakenDateTime.date.end?.toISOString().split('T')[0] || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, sampleTakenDateTime: { date: { ...orderDetails.sampleTakenDateTime.date, end: new Date(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'sampleTakenEndDate' ? error.msg : ""} />
                <Input label='Report Deliver Start Date' name='reportDeliverStartDate' placeholder='Enter report deliver start date' value={orderDetails.reportDeliverTime.date.start?.toISOString().split('T')[0] || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, reportDeliverTime: { date: { ...orderDetails.reportDeliverTime.date, start: new Date(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'reportDeliverStartDate' ? error.msg : ""} />
                <Input label='Report Deliver End Date' name='reportDeliverEndDate' placeholder='Enter report deliver end date' value={orderDetails.reportDeliverTime.date.end?.toISOString().split('T')[0] || ''} onChange={(val) => onChange.orderDetails({ ...orderDetails, reportDeliverTime: { date: { ...orderDetails.reportDeliverTime.date, end: new Date(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'reportDeliverEndDate' ? error.msg : ""} />
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Items Information
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowOrderPopup({ index: orderDetails.items?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<Item>
                    config={[
                        {
                            heading: 'Test', selector: 'product', component: ({ data }) => {
                                return (
                                    <div>{data.product.test}</div>
                                )
                            }
                        },
                        {
                            heading: 'Price', selector: 'quantity', component: ({ data }) => {
                                return (
                                    <div>{data.product.test}</div>
                                )
                            }
                        },
                        {
                            heading: 'Offer', selector: 'product', component: ({ data }) => {
                                return (
                                    <div>{data.product.test}</div>
                                )
                            }
                        },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setShowOrderPopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                // onClick={() => {
                                //     const newPrices = [...labDetails.prices];
                                //     newPrices.splice(index, 1);
                                //     onChange.labDetails({ ...labDetails, prices: newPrices });
                                // }}><Image src={trashBin} alt="" width={20} height={20} />
                                >
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
                    }}
                    onClose={() => setShowOrderPopup(null)} />}
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
}

export type Item = {
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
}

export function OrderPopup({ item, onSave, onClose }: { item: Item, onSave: (item: Item) => void, onClose: () => void }) {
    const [itemData, setItemData] = useState<Item>(item || { product: { test: '', lab: '', price: 0 }, patientDetails: [], quantity: 0 });
    const [showPatientPopup, setShowPatientPopup] = useState<boolean>(false);
    const [patientIndex, setPatientIndex] = useState<number | null>(null);

    return (
        <Model heading='Item Details' onClose={onClose}>
            <div className='px-7 py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium'>Test</label>
                        <SelectTest onSelect={val => setItemData({ ...itemData, product: { ...itemData?.product, test: val._id } })} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium'>Lab</label>
                        <SelectLab onSelect={val => setItemData({ ...itemData, product: { ...itemData.product, lab: val._id } })} />
                    </div>
                    {/* <Input label='Test' value={itemData?.product.test || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, test: val } })} /> */}
                    {/* <Input label='Lab' value={itemData?.product.lab || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, lab: val } })} /> */}
                    <Input label='Price' type='number' value={String(itemData?.product.price) || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, price: Number(val) } })} />
                    <Input label='Quantity' type='number' value={String(itemData?.quantity) || ''} onChange={val => setItemData({ ...itemData, quantity: Number(val) })} />
                </div>
                <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                    Patient Details
                    <div
                        className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                        onClick={() => {
                            setPatientIndex(itemData?.patientDetails.length);
                            setShowPatientPopup(true);
                        }}>
                        <div>New Patient</div>
                        <Image src={plusIcon} alt='' width={20} height={20} />
                    </div>
                </div>
                <div className='border-2 border-t-0 rounded'>
                    <MainTable<PatientDetails>
                        config={[
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Phone', selector: 'phone' },
                            { heading: 'City', selector: 'address', component: ({ data }) => <div>{data.address.city}</div> },
                            {
                                heading: 'Actions',
                                component: ({ index }) => (
                                    <div className='flex items-center gap-1'>
                                        <button className='text-blue-500' onClick={() => {
                                            setPatientIndex(index);
                                            setShowPatientPopup(true);
                                        }}>
                                            Edit
                                        </button>|
                                        <button onClick={() => {
                                            const newPatients = [...itemData.patientDetails];
                                            newPatients.splice(index, 1);
                                            setItemData({ ...itemData, patientDetails: newPatients });
                                        }}><Image src={trashBin} alt="" width={20} height={20} /></button>
                                    </div>
                                )
                            }
                        ]}
                        data={itemData?.patientDetails}
                        className='rounded text-sm border-0' />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave(itemData);
                    }}>Save</div>
                </div>
                {showPatientPopup && patientIndex !== null && (
                    <PatientDetailsPopup
                        patientDetails={itemData.patientDetails[patientIndex]}
                        onClose={() => setShowPatientPopup(false)}
                        onSave={(patientDetails) => {
                            const newPatients = [...itemData.patientDetails];
                            newPatients[patientIndex] = patientDetails;
                            setItemData({ ...itemData, patientDetails: newPatients });
                            setShowPatientPopup(false);
                        }}
                    />
                )}
            </div>
        </Model>
    )
}