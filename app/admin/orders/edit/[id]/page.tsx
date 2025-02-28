"use client"
import React, { useEffect, useState } from 'react'
import OrderForm, { OrderDetails } from '../../components/OrderForm';
import { useParams } from 'next/navigation';
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

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getOrderDetails(id);
    }, [id])

    const handleSave = async () => {
        const res = await fetcher.post(`/admin/orders/${id}`, {
            ...orderDetails,
            user: orderDetails.user._id,
            collector: orderDetails.collector?._id,
            items: orderDetails.items.map(e => ({ ...e, product: { test: e.product.test._id, lab: e.product.lab._id, price: e.product.price } }))
        });
        if (res.status === 200)
            toast.success('Order updated successfully');
        else
            toast.error(res.error || 'Error updating order');
    };

    async function getOrderDetails(id: string) {
        const res = await fetcher.get<OrderDetails>(`/admin/orders/${id}`);
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