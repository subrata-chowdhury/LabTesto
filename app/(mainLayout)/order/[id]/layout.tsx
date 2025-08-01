import React, { ReactNode } from 'react'
import Script from "next/script";

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            {children}
        </>
    )
}

export default Layout;