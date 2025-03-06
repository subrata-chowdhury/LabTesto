import React, { ReactNode } from 'react'
import Menubar from './components/Menubar'
import verifyToken from '@/lib/tokenVerify';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function layout({ children }: { children: ReactNode }) {
    const token = (await cookies()).get('collectorToken')?.value;
    const isValid = await verifyToken<{ id: string }>(token, 'collector');

    if (!isValid) redirect('/login/collector'); // Redirect to login if the token is invalid

    return (
        <>
            <div className="flex h-screen transition-all">
                <Menubar />
                <div className='w-full h-full flex-1 overflow-y-auto p-2 sm:p-6 pt-1 transition-all bg-[rgba(239,246,255,0.5)]'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default layout