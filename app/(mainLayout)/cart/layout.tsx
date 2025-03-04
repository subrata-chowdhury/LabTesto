import React, { ReactNode } from 'react'
import { cookies } from 'next/headers';
import verifyToken from '@/lib/tokenVerify';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: ReactNode }) => {
    const token = (await cookies()).get('token')?.value;
    const isValid = await verifyToken<{ id: string }>(token, 'user');

    if (!isValid) {
        redirect('/login?redirect=/cart'); // Redirect to login if the token is invalid
    }

    return isValid && (
        <>
            {children}
        </>
    )
}

export default Layout;