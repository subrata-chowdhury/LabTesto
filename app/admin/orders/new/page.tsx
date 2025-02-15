"use client"
import React, { useState } from 'react'
import OrderForm, { OrderDetails } from '../components/OrderForm';
import fetcher from '@/lib/fetcher';

const Page = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        items: [],
        user: '',
        collector: '',
        status: 'Ordered',
        sampleTakenDateTime: {
            date: {
                start: new Date(),
                end: new Date()
            }
        },
        reportDeliverTime: {
            date: {
                start: new Date(),
                end: new Date()
            }
        }
    });

    const handleSave = async () => {
        const res = await fetcher.post('/orders', orderDetails);
        if (res.status === 200) {
            alert('Order saved successfully');
            console.log('Order details saved:', orderDetails);
        } else {
            alert('Error saving order');
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

export default Page;