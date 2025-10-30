import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: "Testimonials - LabTesto",
    description: "Read testimonials from our satisfied customers who have experienced reliable and convenient diagnostic services with LabTesto.",
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/testimonials") || "https://labtesto.vercel.app/testimonials"
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