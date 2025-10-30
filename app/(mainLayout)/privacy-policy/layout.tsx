import Footer from '@/app/components/Footer';
import React, { ReactNode } from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - LabTesto',
    description: 'Review the privacy policy for using LabTesto\'s services.',
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/privacy-policy") || "https://labtesto.vercel.app/privacy-policy",
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