"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';
import Title from '@/components/Title';
import Input from '@/components/Inputs/Input';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';
import informationIcon from '@/assets/information.svg'

const Page = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        items: [],
        user: {
            _id: '',
            name: ''
        },
        collector: {
            _id: '',
            name: ''
        },
        status: 'Ordered',
        sampleTakenDateTime: {
            start: new Date(new Date().setHours(6, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(6, 0, 0)).toISOString()
        },
        reportDeliverTime: {
            start: new Date(new Date().setHours(6, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(6, 0, 0)).toISOString()
        },
        address: {
            pin: '',
            city: '',
            district: '',
            phone: ''
        }
    });
    const maxPrice = orderDetails.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getOrderDetails(id);
    }, [id])

    const handleSave = async () => {
        const res = await fetcher.post(`/collector/orders/${id}`, {
            status: orderDetails.status,
            paid: orderDetails.paid
        });
        if (res.status === 200)
            toast.success('Order updated successfully');
        else
            toast.error(res.error || 'Error updating order');
    };

    async function getOrderDetails(id: string) {
        const res = await fetcher.get<OrderDetails>(`/collector/orders/${id}`);
        if (res.body && res.status === 200)
            setOrderDetails({
                items: res.body.items,
                user: res.body.user,
                status: res.body.status,
                sampleTakenDateTime: res.body.sampleTakenDateTime,
                reportDeliverTime: res.body.reportDeliverTime,
                address: res.body.address
            });
    }

    return (

        <div className='bg-white dark:bg-[#172A46] mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Order Form
                <Title title={<p className='text-nowrap font-medium dark:text-black'>You can only change status on 1 hour interval</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title>
            </div>
            <div className='pb-4 font-semibold'>Order Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Status</p>
                    <Dropdown options={['Ordered', 'Sample Collected', 'Report Generated', 'Report Delivered', 'Canceled']} value={orderDetails.status} onChange={(val) => setOrderDetails({ ...orderDetails, status: val.value as 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled' })} width={'100%'} />
                </div>
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Payment Information
            </div>
            <Input label='Paid' value={orderDetails?.paid?.toString() || '0'} min={0} max={maxPrice} type='number' onChange={val => setOrderDetails({ ...orderDetails, paid: Math.min(Number(val), maxPrice) })} />
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Total Amount: ₹{maxPrice}
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await handleSave(); }}>Save</div>
            </div>
        </div>
    )
}

export type OrderDetails = {
    items: Item[];
    user: { _id: string, name: string };
    collector?: { _id: string, name: string };
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled';
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
    resultTimes: {
        test: string;
        resultTime: string;
    }[];
    prices: {
        test: string;
        price: number;
        offer?: number;
        expenses?: number;
    }[];
    packagesInclude?: {
        test: string;
        packages: string[];
    }[];
    ranges?: {
        test: string;
        ranges: object[];
    }[];
    rating: number;
    rated: number;
    contractDetails?: {
        email?: string[],
        phone?: string[]
    }
}

export default Page;