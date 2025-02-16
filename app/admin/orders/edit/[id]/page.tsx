"use client"
import React, { useEffect, useState } from 'react'
import OrderForm, { OrderDetails } from '../../components/OrderForm';
import { useParams } from 'next/navigation';
import fetcher from '@/lib/fetcher';

const Page = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        items: [],
        user: '',
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

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getOrderDetails(id);
    }, [id])

    const handleSave = () => {
        // Implement save logic here
        console.log('Order details saved:', orderDetails);
    };

    async function getOrderDetails(id: string) {
        const res = await fetcher.get<OrderDetails>(`/admin/orders/${id}`);
        if (res.body && res.status === 200)
            setOrderDetails({
                items: res.body.items,
                user: res.body.user,
                status: res.body.status,
                sampleTakenDateTime: res.body.sampleTakenDateTime,
                reportDeliverTime: res.body.reportDeliverTime
            });
    }

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