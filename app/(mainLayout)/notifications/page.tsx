'use client'
import fetcher from '@/lib/fetcher';
import React, { useEffect, useState, JSX } from 'react'
import { useRouter } from 'next/navigation';
import NotificationLoading from './loading';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useRouter();

    useEffect(() => {
        fetchOrder();
    }, []);

    async function fetchOrder() {
        try {
            const filter = { status: { $in: ['Out for Sample Collection', 'Out for Report Delivery'] } }
            const response = await fetcher.get<{ orders: Order[] }>(`/orders?filter=${JSON.stringify(filter)}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch order');
            }
            if (response.body) {
                const sortedOrders = response.body.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setNotifications(sortedOrders.map(e => ({
                    heading: 'Collector is ' + e.status,
                    type: 'warning',
                    subText: <p>Collector is {e.status} for {e.items.map(e => e.product.test.name).join(', ')}. Be prepare</p>,
                    link: { href: '/order/' + e._id, as: 'View Order' }
                })));
            }
        } catch (err) {
            console.log(err)
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <NotificationLoading />

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Please Reload Your Page Or Click &nbsp;<button onClick={() => window.location.reload()}>Reload</button></div>;
    }

    if (notifications?.length <= 0) {
        return <div className="flex justify-center items-center h-screen">No Notifications</div>;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-gray-100 dark:bg-[#0A192F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <ul className="space-y-3 flex-1 overflow-y-scroll">
                {notifications.map((notification, outerIndex) => (
                    <li
                        key={outerIndex}
                        onClick={() => notification.link?.href ? navigate.push(notification.link.href) : ''}
                        className={`bg-white dark:bg-[#172A46] border ${notification.type === 'warning' ? 'border-orange-200' : (notification.type === 'success' ? 'border-green-400' : (notification.type === 'danger' ? 'border-red-400' : ''))} rounded-xl shadow-md shadow-indigo-100 dark:shadow-black ${notification.link?.href ? 'cursor-pointer' : ''} p-3 px-4 pr-5 flex justify-between items-center`}>
                        <div className='flex-1'>
                            <div className={`font-semibold ${notification.type === 'warning' ? 'text-orange-400' : (notification.type === 'success' ? 'text-green-400' : (notification.type === 'danger' ? 'text-red-400' : 'text-primary'))}`}>{notification.heading}</div>
                            <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>{notification.subText}</div>
                        </div>
                        <div className='bg-primary text-white text-sm rounded px-3.5 py-1.5 flex gap-2 justify-center items-center'>
                            Details
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationPage;

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
        email: string;
        name: string;
    };
    collector?: string;
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
    createdAt: string;
    updatedAt: string;
}

type Notification = {
    heading: string;
    subText?: JSX.Element;
    type: 'warning' | 'danger' | 'normal' | 'success',
    link?: {
        href: string;
        as?: string;
    }
}