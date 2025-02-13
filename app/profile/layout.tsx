import React, { ReactNode } from 'react'
import { cookies } from 'next/headers';
import verifyToken from '@/lib/tokenVerify';
import { redirect } from 'next/navigation';
import Menubar from '../components/Menubar';
// import Footer from '../components/Footer';

const Layout = async ({ children }: { children: ReactNode }) => {
    const token = (await cookies()).get('token')?.value;
    const isValid = await verifyToken<{ id: string }>(token);

    if (!isValid) {
        redirect('/login?redirect=/profile'); // Redirect to login if the token is invalid
    }

    return isValid && (
        <>
            <Menubar />
            {children}
            {/* <Footer /> */}
        </>
    )
}

export default Layout;