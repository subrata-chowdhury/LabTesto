import Footer from '@/app/components/Footer';
import React, { ReactNode } from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - LabTesto',
    description: "Get in touch with LabTesto for any inquiries or support.",
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/contact") || "https://labtesto.vercel.app/contact",
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