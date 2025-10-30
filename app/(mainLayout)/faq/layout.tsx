import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'FAQ - LabTesto',
    description: 'Frequently Asked Questions about LabTesto services and features.',
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/faq") || "https://labtesto.vercel.app/faq",
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