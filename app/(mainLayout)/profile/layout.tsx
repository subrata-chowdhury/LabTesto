import React, { ReactNode } from 'react'
import { cookies } from 'next/headers';
import verifyToken from '@/lib/tokenVerify';
import { redirect } from 'next/navigation';
import Menubar from './components/Menubar';

const Layout = async ({ children }: { children: ReactNode }) => {
    const token = (await cookies()).get('token')?.value;
    const isValid = await verifyToken<{ id: string }>(token, 'user');

    if (!isValid) {
        redirect('/login?redirect=/profile'); // Redirect to login if the token is invalid
    }

    return isValid && (
        <>
            <div className='flex flex-col sm:flex-row gap-2 px-4 h-screen sm:px-10 lg:px-28 py-3 pt-4 bg-gray-50 dark:bg-[#0A192F]'>
                <Menubar />
                <div className='sm:border-l-2 border-gray-300/70 dark:border-gray-500 w-full flex justify-center pl-2.5 sm:pl-5 lg:pl-12'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;