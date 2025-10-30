import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: "Terms and Conditions - LabTesto",
    description: "Review the terms and conditions for using LabTesto's services.",
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/terms-and-conditions") || "https://labtesto.vercel.app/terms-and-conditions"
    }
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