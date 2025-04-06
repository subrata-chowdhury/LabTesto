'use client'
import Card from '@/components/Card'
import fetcher from '@/lib/fetcher'
import Order from '@/models/Order'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'

function Page() {
    const [analytics, setAnalytics] = useState<Analytics>({
        totalTests: 0,
        totalLabs: 0,
        totalCollectors: 0,
        totalUsers: 0,
        totalAdmins: 0,
        totalOrders: 0
    })
    const [financeData, setFinanceData] = useState<{
        date: Date,
        totalPrice: number,
        expenses: number
    }[]>(Array.from({ length: 12 }, (_, index) => ({
        date: new Date(new Date().getFullYear(), index, 1),
        totalPrice: 0,
        expenses: 0
    })))
    const [outdatedOrders, setOutdatedOrders] = useState<Order[]>([]);

    useEffect(() => {
        startUp()
    }, [])

    async function startUp() {
        const res = await fetcher.get<Analytics>('/admin/analytics');
        if (res.status === 200 && res.body) {
            setAnalytics(res.body);
        }
        const res2 = await fetcher.get<{
            date: Date,
            totalPrice: number,
            expenses: number
        }[]>('/admin/analytics/finance');
        if (res2.status === 200 && res2.body) {
            while (res2.body.length < 12) {
                res2.body.push({
                    date: new Date(new Date().setMonth(res2.body.length + 1)),
                    totalPrice: 0,
                    expenses: 0
                });
            }
            setFinanceData(res2.body);
        }
        fetchOutdatedOrders();
    }

    async function fetchOutdatedOrders() {
        const res3 = await fetcher.get<{ orders: Order[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/orders?filter=${JSON.stringify({ "sampleTakenDateTime.end": { $lt: new Date() }, status: { $in: ['Ordered', 'Out for Sample Collection'] } })}&limit=${9999}`);
        if (res3.status === 200 && res3.body) {
            setOutdatedOrders(res3.body.orders);
        }
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Tests' value={analytics.totalTests} className='mr-3 mt-3' />
                    <Card label='Total Labs' value={analytics.totalLabs} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    <Card label='Total Collectors' value={analytics.totalCollectors} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Users' value={analytics.totalUsers} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' />
                    <Card label='Total Admins' value={analytics.totalAdmins} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' />
                    <Card label='Total Orders' value={analytics.totalOrders} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' />
                </div>
                <div className='flex flex-wrap gap-4 justify-start items-center'>
                    {financeData.length > 0 && <div className='mt-5 bg-white p-5 rounded-lg shadow w-fit'>
                        <div className='text-xl font-medium mb-3'>Total Price vs Expenses of {new Date().getFullYear()} (monthly)</div>
                        <div className="w-full overflow-x-auto">
                            <BarChart width={730} height={250} data={financeData}>
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleString('default', { month: 'short' })} tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                                <Bar dataKey="totalPrice" name="Total Price" fill="#8884d8" barSize={10} radius={[10, 10, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" barSize={10} radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </div>
                    </div>}
                    <div className='mt-5 bg-white px-5 py-4 rounded-lg shadow w-fit'>
                        <div className='text-lg font-medium pb-2.5 border-b-2'>Outdated Orders</div>
                        <div className="w-full flex flex-col gap-2 overflow-x-auto mt-3 min-w-96 h-60 overflow-y-auto">
                            {outdatedOrders.filter(order => order.status === 'Ordered').length > 0 && <h3 className='font-medium text-base'>Ordered</h3>}
                            {outdatedOrders.filter(order => order.status === 'Ordered').map((order) => (
                                <div key={order._id} className="flex items-center gap-4 justify-between px-4 py-2 bg-gray-100 rounded-md shadow">
                                    <div>
                                        <div className="font-medium text-sm">ID: {order._id}</div>
                                        <div className="text-xs text-orange-600">Date: {new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                                    </div>
                                    <div className="flex text-sm space-x-2">
                                        <Link href={'/admin/orders/view/' + order._id} className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600">
                                            View
                                        </Link>
                                        <button className="bg-orange-500 text-white px-2 py-0.5 rounded hover:bg-orange-600" onClick={async () => {
                                            await fetcher.post<{ id: string }, string>('/admin/orders/' + order._id + '/pass', { id: order._id }).then(res => {
                                                if (res.status === 200 && res.body) {
                                                    toast.success(res.body || 'Successfully Passed to another collector');
                                                } else {
                                                    toast.warning(res.body || 'Unable to Pass')
                                                }
                                            })
                                        }}>
                                            Pass
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {outdatedOrders.filter(order => order.status === 'Out for Sample Collection').length > 0 && <h3 className='font-medium text-base'>Out for Collection</h3>}
                            {outdatedOrders.filter(order => order.status === 'Out for Sample Collection').map((order) => (
                                <div key={order._id} className="flex items-center gap-4 justify-between px-4 py-2 bg-gray-100 rounded-md shadow">
                                    <div>
                                        <div className="font-medium text-sm">ID: {order._id}</div>
                                        <div className="text-xs text-orange-600">Date: {new Date(order.sampleTakenDateTime?.start || '').toDateString()}, {new Date(order?.sampleTakenDateTime?.start || '').toTimeString().split(' ')[0]}</div>
                                    </div>
                                    <div className="flex text-sm space-x-2">
                                        <Link href={'/admin/orders/view/' + order._id} className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600">
                                            View
                                        </Link>
                                        <button className="bg-orange-500 text-white px-2 py-0.5 rounded hover:bg-orange-600" onClick={async () => {
                                            await fetcher.post<{ id: string }, string>('/admin/orders/' + order._id + '/pass', { id: order._id }).then(res => {
                                                if (res.status === 200 && res.body) {
                                                    toast.success(res.body || 'Successfully Passed to another collector');
                                                } else {
                                                    toast.warning(res.body || 'Unable to Pass')
                                                }
                                            })
                                        }}>
                                            Pass
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {outdatedOrders.length === 0 && <div className="text-center my-auto text-gray-500">No outdated orders</div>}
                        </div>
                    </div>
                </div>
                {/* <HalfDonutChart /> */}
            </div>
        </>
    )
}

export default Page;

type Analytics = {
    totalTests: number,
    totalLabs: number,
    totalCollectors: number,
    totalUsers: number,
    totalAdmins: number,
    totalOrders: number,
}

// const data = [
//     { name: "Completed", value: 70 },
//     { name: "Remaining", value: 30 },
// ];

// const COLORS = ["#00C49F", "#FFBB28"];

// const HalfDonutChart = () => {
//     return (
//         <div className="flex justify-center items-center">
//             <PieChart width={400} height={200}>
//                 <Pie
//                     data={data}
//                     cx="50%"
//                     cy="100%"
//                     startAngle={180}
//                     endAngle={0}
//                     innerRadius={80}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                     cornerRadius={10}
//                 >
//                     {data.map((_, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                     ))}
//                 </Pie>
//             </PieChart>
//         </div>
//     );
// };


type Order = {
    items: {
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
    }[];
    user: {
        _id: string;
        name: string;
        email: string;
    };
    collector?: {
        _id: string;
        name: string;
        email: string;
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
    _id: string;
}