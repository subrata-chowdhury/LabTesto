import React, { ReactNode } from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - LabTesto",
    description: "Create your LabTesto account to access secure and convenient diagnostic services, including NABL-certified lab tests and professional home sample collection.",
    alternates: {
        canonical: (process.env.NEXT_PUBLIC_APP_URL + "/signup") || "https://labtesto.vercel.app/signup"
    }
}

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
        </>
    )
}

export default Layout;