'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image';

import logout from '@/assets/Menubar/logout.svg'
import dashboard from '@/assets/Menubar/dashboard.svg'
import form from '@/assets/Menubar/form.svg'
import UserIcon from '@/assets/reactIcon/User';

function Menubar() {
    const [menubarHovered, setMenubarHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const currentPath = usePathname();

    useEffect(() => {
        const autoOpenMenubar = () => {
            if (window.innerWidth > 640) setIsOpen(true);
            else setIsOpen(false);
        };
        autoOpenMenubar();
        window.addEventListener('resize', autoOpenMenubar);
        return () => window.removeEventListener('resize', autoOpenMenubar);
    }, [])

    return (
        <>
            <div className="sm:hidden fixed top-2 right-3 flex items-center">
                <button onClick={() => { setIsOpen(!isOpen); setMenubarHovered(true) }} className="text-[#3987ba] menu focus:outline-none bg-white rounded-md p-1 shadow-md" aria-label="Toggle Menu">
                    <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                    </svg>
                </button>
            </div>
            {isOpen && <div className='sm:relative shadow-2xl sm:shadow fixed left-0 top-0 bg-white dark:bg-[#172A46] flex flex-col gap-2 z-20 px-2 sm:px-4 py-4 sm:py-6 h-full transition-all' onMouseEnter={() => setMenubarHovered(true)} onMouseLeave={() => { if (window.innerWidth > 640) setMenubarHovered(false) }}>
                <div className='flex flex-col gap-2 flex-1 transition-all'>
                    <Menu name='Dashboard' image={dashboard} link='/collector' active={currentPath === '/collector'} menubarHovered={menubarHovered} />
                    <Menu name='Orders' image={form} link='/collector/orders' active={currentPath.includes('/collector/orders')} menubarHovered={menubarHovered} />
                </div>
                <Link className={"cursor-pointer flex justify-start gap-3 items-center mb-2 rounded-lg text-primary" + (menubarHovered ? " mx-1.5" : " mx-auto")} href='/collector/profile' aria-label="View Profile">
                    <UserIcon size={40} className="rounded-full p-2 bg-primary bg-opacity-20" />
                    {menubarHovered && <p>Profile</p>}
                </Link>
                <div className=''>
                    <div
                        className={`cursor-pointer flex justify-start gap-3 p-2 sm:p-3 items-center rounded-lg`}
                        onClick={() => {
                            document.cookie = 'collectorToken=; Max-Age=0; path=/;';
                            window.location.href = '/';
                        }}>
                        <Image src={logout} alt='' width={20} height={20} style={{ width: 20, height: 20 }} />
                        {menubarHovered && <p>Log Out</p>}
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Menubar

interface MenuProps {
    name: string;
    link: string;
    image: string | StaticImageData;
    active: boolean;
    menubarHovered: boolean;
}

const Menu: React.FC<MenuProps> = ({ name, link, active, image, menubarHovered }) => {
    return (
        <Link href={link}>
            <div className={`flex justify-start gap-3 p-3 items-center rounded-lg transition-all ${active ? 'bg-blue-200 dark:text-black' : ''}`}>
                <Image src={image} alt='' width={24} height={24} className='w-5 h-5 sm:w-6 sm:h-6 ' />
                {menubarHovered && <p>{name}</p>}
            </div>
        </Link>
    )
}