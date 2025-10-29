'use client'
import Model from '@/components/Model';
import fetcher from '@/lib/fetcher';
import React, { useEffect, useState } from 'react'
import ReviewForm, { ReviewType } from '../../components/ReviewForm';
import { useRouter } from 'next/navigation';
import OrdersLoading from './loading';
import Pagination from '@/components/Pagination';

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewModel, setShowReviewModel] = useState<{ orderId: string, item: { test: string, lab: string } } | null>(null)
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState('All');
    const navigate = useRouter();

    useEffect(() => {
        fetchOrder();
    }, [status, currentPage]);

    async function fetchOrder() {
        try {
            const filterData: { status?: string, date?: string, name?: string } = { status: status };
            if (status === 'All') delete filterData.status;
            const response = await fetcher.get<{ orders: Order[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/orders?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch order');
            }
            if (response.body) {
                const sortedOrders = response.body.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(sortedOrders);
                setTotalPages(response.body.pagination.totalPages || 1);
                setCurrentPage(response.body.pagination.currentPage);
                setLimit(response.body.pagination.pageSize);
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

    if (loading) return <OrdersLoading />

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Please Reload Your Page Or Click &nbsp;<button onClick={() => window.location.reload()}>Reload</button></div>;
    }

    return (
        <div className="flex-1 flex flex-col p-4 bg-hiwte/0 dark:bg-white/0 min-h-screen">
            <h1 className="text-2xl font-bold">Ordered Items</h1>
            <div className='flex flex-wrap justify-center sm:justify-normal gap-2 mb-4 mt-3 opacity-80'>
                {['All', 'Ordered', 'Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled'].map((e, index) => (
                    <button
                        key={index}
                        className={`px-3.5 py-1.5 rounded-lg cursor-pointer text-sm font-semibold ${status === e ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-primary/15 text-primary dark:bg-white/10 dark:text-white'}`}
                        onClick={() => {
                            setStatus(e);
                        }}
                    >
                        {e}
                    </button>
                ))}
            </div>
            {
                (orders?.length <= 0) ? <div className="flex justify-center items-center h-screen">No items in the order</div> :
                    <>
                        <ul className="space-y-3 h-fit">
                            {orders.map((order, outerIndex) => (
                                <li
                                    key={outerIndex}
                                    onClick={() => navigate.push('/order/' + order._id)}
                                    className="bg-white dark:bg-black border-2 border-primary/10 dark:border-white/20 rounded-lg shadow-md shadow-primary/5 dark:shadow-black cursor-pointer p-3 px-4 flex justify-between items-center">
                                    <div>
                                        <div className="text-lg font-semibold text-primary dark:text-white">{order.items.map(e => e.product.test.name).join(', ')}</div>
                                        <div className='text-sm text-gray-800 dark:text-white/60'><span className={order.status === "Canceled" ? 'text-red-500' : (order.status === 'Report Delivered' ? 'text-green-600' : '')}>{order.status}</span>, {new Date(order.updatedAt).toDateString()}</div>
                                    </div>
                                    <div>
                                        ❯
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='mt-4'>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
                        </div>
                    </>
            }
            {
                showReviewModel && <ReviewModel
                    onSave={async review => {
                        const res = await fetcher.put<{ product: { test: string, lab: string }, review: ReviewType }, { message: string } | string>("/orders/" + showReviewModel.orderId, {
                            product: showReviewModel.item,
                            review: review
                        })
                        if (res.status === 200) fetchOrder()
                    }}
                    onClose={() => setShowReviewModel(null)} />
            }
        </div>
    );
}

export default OrderPage;

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
    collector?: {
        name: string;
        email: string;
        // password: string;
        phone?: string;
    };
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
    statusRecords: {
        status: 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled',
        date: string
    }[];
    paid: number;
    createdAt: string;
    updatedAt: string;
}

function ReviewModel({ onClose = () => { }, onSave = () => { } }: { onClose: () => void, onSave: (review: ReviewType) => void }) {
    return (
        <Model heading='Review' className='w-[400px]' onClose={onClose}>
            <ReviewForm onSave={onSave} />
        </Model>
    )
}