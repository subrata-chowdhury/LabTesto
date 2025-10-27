import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: "Tests - LabTesto",
    description: "Browse and book a wide range of diagnostic tests online with LabTesto. Access NABL-accredited labs, professional home sample collection, and reliable medical test results.",
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/tests") || "https://labtesto.vercel.app/tests"
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