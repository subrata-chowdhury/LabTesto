import React, { ReactNode } from 'react'
import Menubar from '../components/Menubar';
import Footer from '../components/Footer';

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Menubar />
            {children}
            <Footer />
        </>
    )
}

export default Layout;