"use client"
import React, { useState } from 'react'
import OrderForm, { OrderDetails } from '../components/OrderForm';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';

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
            date: {
                start: new Date(new Date().setHours(6, 0, 0)).toISOString(),
                end: new Date(new Date().setHours(6, 0, 0)).toISOString()
            }
        },
        reportDeliverTime: {
            date: {
                start: new Date(new Date().setHours(6, 0, 0)).toISOString(),
                end: new Date(new Date().setHours(6, 0, 0)).toISOString()
            }
        },
        address: {
            pin: '',
            city: '',
            district: '',
            phone: ''
        }
    });

    const handleSave = async () => {
        const res = await fetcher.post<OrderDetailsUnPopulated, OrderDetailsUnPopulated>('/admin/orders', {
            ...orderDetails,
            user: orderDetails.user._id,
            collector: orderDetails.collector?._id,
            items: orderDetails.items.map(e => ({ ...e, product: { test: e.product.test._id, lab: e.product.lab._id, price: e.product.price } }))
        });
        if (res.status === 200) {
            toast.success('Order saved successfully');
            console.log('Order details saved:', orderDetails);
        } else {
            toast.error('Error saving order');
            console.error('Error saving order:', res.body);
        }
    };

    return (
        <OrderForm
            orderDetails={orderDetails}
            onChange={{
                orderDetails: setOrderDetails
            }}
            onSave={handleSave}
        />
    )
}


export type OrderDetailsUnPopulated = {
    items: ItemUnPopulated[];
    user: string;
    collector?: string;
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        date: {
            start?: string;
            end?: string;
        };
    };
    reportDeliverTime: {
        date: {
            start?: string;
            end?: string;
        };
    };
    address: {
        pin: string;
        city: string;
        district: string;
        other?: string; // road details
        phone: string;
    };
}

export type ItemUnPopulated = {
    product: {
        test: string;
        lab: string;
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


export default Page;