import Footer from '@/app/components/Footer';
import React, { ReactNode } from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - LabTesto',
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/about") || "https://labtesto.vercel.app/about",
    },
}

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}

export default Layout;