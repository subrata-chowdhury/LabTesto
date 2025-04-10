'use client'
import Card from '@/components/Card'
import fetcher from '@/lib/fetcher'
import React, { useEffect, useState } from 'react'
import MonthlyPriceBarChart from './components/dashboard-charts/MonthlyPriceBarChart'
import DonutChart from './components/dashboard-charts/DonutChart'
import OutdatedOrders from './components/OutdatedOrders'

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

    useEffect(() => {
        startUp()
    }, [])

    async function startUp() {
        const res = await fetcher.get<Analytics>('/admin/analytics');
        if (res.status === 200 && res.body) {
            setAnalytics(res.body);
        }
        getFinanceData();
    }

    async function getFinanceData() {
        const res = await fetcher.get<{
            date: Date,
            totalPrice: number,
            expenses: number
        }[]>('/admin/analytics/finance');
        if (res.status === 200 && res.body) {
            while (res.body.length < 12) {
                res.body.push({
                    date: new Date(new Date().setMonth(res.body.length + 1)),
                    totalPrice: 0,
                    expenses: 0
                });
            }
            setFinanceData(res.body);
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
                    <MonthlyPriceBarChart financeData={financeData} />
                    <OutdatedOrders />
                    <DonutChart
                        data={[
                            { name: 'Admins', value: analytics.totalAdmins },
                            { name: 'Users', value: analytics.totalUsers },
                            { name: 'Collectors', value: analytics.totalCollectors }
                        ]} />
                </div>
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