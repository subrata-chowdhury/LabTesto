'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';
import TrashBinIcon from '@/assets/reactIcon/TrashBin';

const Users = () => {
    const [userData, setUserData] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<{ totalUsers: number, clients: number, admins: number }>({ totalUsers: 0, clients: 0, admins: 0 });
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState('Clients');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    // const navigate = useRouter();

    useEffect(() => {
        getAnalytics();
    }, [])

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const filterData: { type?: string, email?: string } = { type, email: name };
        if (type === 'Clients') {
            delete filterData.type;
            if (name === '') delete filterData.email;

            const res = await fetcher.get<{ users: User[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/users?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
            if (res.status !== 200) return;
            if (res.body) {
                setUserData(res.body.users);
                setTotalPages(res.body.pagination.totalPages || 1);
                setCurrentPage(res.body.pagination.currentPage);
                setLimit(res.body.pagination.pageSize);
            }
        } else {
            delete filterData.type;
            if (name === '') delete filterData.email;

            const res = await fetcher.get<{ users: User[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/users/admins?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
            if (res.status !== 200) return;
            if (res.body) {
                setUserData(res.body.users);
                setTotalPages(res.body.pagination.totalPages || 1);
                setCurrentPage(res.body.pagination.currentPage);
                setLimit(res.body.pagination.pageSize);
            }
        }
        setLoading(false);
    }, [type, name, currentPage, limit])

    useEffect(() => {
        fetchUsers();
    }, [type, name, currentPage, limit, fetchUsers]);

    async function getAnalytics() {
        const res = await fetcher.get<{ totalUsers: number, clients: number, admins: number }>('/admin/users/analytics');
        if (res.status !== 200) return;
        if (res.body) {
            setAnalytics({
                totalUsers: res.body.totalUsers || 0,
                admins: res.body.admins || 0,
                clients: res.body.clients || 0,
            });
        };
    }

    async function deleteUser(id: string) {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        const res = type === 'Clients' ? await fetcher.delete(`/admin/users/${id}`) : await fetcher.delete(`/admin/users/admins/${id}`);
        if (res.status !== 200) return;
        await fetchUsers();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Clients' value={analytics.clients} className='mr-3 mt-3' />
                    <Card label='Total Admins' value={analytics.admins} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    {/* <Card label='Total Urine' value={analytics.urine} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' /> */}
                    {/* <Card label='Total Stool' value={analytics.stool} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' /> */}
                </div>
                <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => toast.warn('Feature not available yet')}>
                    <div>New User</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<User>
                    name='Users'
                    loading={loading}
                    table={{
                        config: [
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Email / Ph no.', selector: 'email' },
                            { heading: 'Created At', selector: 'createdAt', component: ({ data }) => <div>{new Date(data.createdAt).toDateString()}</div> },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => toast.warn('Feature not available yet')}>View</button>|
                                    <button className='text-blue-500' onClick={() => toast.warn('Feature not available yet')} >Edit</button>|
                                    <button className='text-[#ff5d76]' onClick={() => deleteUser(data._id as string)} ><TrashBinIcon /></button>
                                </div>
                            }
                        ],
                        data: userData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['Clients', 'Admins'], onTagChange: (tag) => { setType(tag) } }} />
            </div>
        </>
    )
}

export default Users;


type User = {
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
}