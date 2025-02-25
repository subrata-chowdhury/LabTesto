'use client'
import Card from '@/components/Card'
import fetcher from '@/lib/fetcher'
import React, { useEffect, useState } from 'react'
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
    }[]>([])

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
                {financeData.length > 0 && <div className='mt-5 bg-white p-5 rounded-lg shadow w-fit'>
                    <div className='text-xl font-medium mb-3'>Total Price vs Expenses of {new Date().getFullYear()} (monthly)</div>
                    <div className="w-full overflow-x-auto">
                        <BarChart width={730} height={250} data={financeData} className="min-w-[730px]">
                            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleString('default', { month: 'short' })} tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                            <Bar dataKey="totalPrice" name="Total Price" fill="#8884d8" barSize={10} radius={[10, 10, 0, 0]} />
                            <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" barSize={10} radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </div>
                </div>}
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