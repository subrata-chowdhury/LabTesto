import React, { ReactNode } from 'react'
import { cookies } from 'next/headers';
import verifyToken from '@/lib/tokenVerify';
import { redirect } from 'next/navigation';
import Menubar from './components/Menubar';

const Layout = async ({ children }: { children: ReactNode }) => {
    const token = (await cookies()).get('adminToken')?.value;
    const isValid = await verifyToken<{ id: string }>(token, 'admin');

    if (!isValid) redirect('/login/admin'); // Redirect to login if the token is invalid

    return isValid && (
        <>
            <div className="flex h-screen">
                <Menubar />
                <div className='w-full h-full flex-1 overflow-y-auto p-6 pt-1 bg-[rgba(239,246,255,0.5)] dark:bg-[#0A192F]'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;