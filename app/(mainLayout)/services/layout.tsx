import Footer from '@/app/components/Footer';
import React, { ReactNode } from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Services - LabTesto',
    description: 'Explore the various services offered by LabTesto for your diagnostic needs.',
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/services") || "https://labtesto.vercel.app/services",
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