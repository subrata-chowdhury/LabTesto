'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const Menubar = () => {
    const currentPath = usePathname();

    return (
        <div className='text-sm pr-1.5 sm:pr-5 lg:pr-12 sm:text-base flex flex-col gap-2'>
            {[
                { label: 'Profile', href: '/profile' },
                // { label: 'Account', href: '/profile/account' },
                { label: 'Addresses', href: '/profile/addresses' },
                { label: 'Patients', href: '/profile/patients' },
                { label: 'Settings', href: '/profile/settings' },
                // { label: 'Reports', href: '/reports' },
                // { label: 'Logout', href: '/logout' }
            ].map((item) => (
                <Link key={item.href} href={item.href} className={`bg-primary font-medium ${currentPath === item.href ? 'bg-opacity-15 text-primary' : 'bg-opacity-0 text-gray-500 dark:text-gray-400'} px-4 sm:px-6 py-1.5 rounded`}>{item.label}</Link>
            ))}
            <div
                className={`bg-primary bg-opacity-0 text-gray-500 dark:text-gray-400 px-4 sm:px-6 py-1.5 rounded-md`}
                onClick={() => {
                    document.cookie = 'token=; Max-Age=0; path=/;';
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                }}
                aria-label="Log Out">Log Out</div>
        </div>
    )
}

export default Menubar