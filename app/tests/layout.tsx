import React, { ReactNode } from 'react'
import Menubar from '../components/Menubar'
import Footer from '../components/Footer'
// import { cookies } from 'next/headers';
// import verifyToken from '@/lib/tokenVerify';
// import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Menubar />
            {children}
            <Footer />
        </>
    )
}

export default Layout;