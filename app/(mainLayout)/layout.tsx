import React, { ReactNode } from 'react'
import Menubar from '../components/Menubar';
import { ItemCountContextProvider } from '../contexts/ItemCountContext';
// import Footer from '../components/Footer';

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            <ItemCountContextProvider>
                <Menubar />
                {children}
                {/* <Footer /> */}
            </ItemCountContextProvider>
        </>
    )
}

export default Layout;