import Footer from '@/app/components/Footer';
import React, { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}

export default Layout;