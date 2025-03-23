'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image';

import user from '@/assets/user.png';
import logout from '@/assets/Menubar/logout.svg'
// import teachers from '@/assets/Menubar/teachers.svg'
import dashboard from '@/assets/Menubar/dashboard.svg'
// import students from '@/assets/Menubar/students.svg'
import form from '@/assets/Menubar/form.svg'
// import sheet from '@/assets/Menubar/attendance.svg'
// import cart from '@/assets/cart.svg'

function Menubar() {
    const [menubarHovered, setMenubarHovered] = useState(false);
    const currentPath = usePathname();

    return (
        <div className='relative bg-white flex flex-col gap-2 z-20 px-2 sm:px-4 py-4 sm:py-6 shadow h-full transition-all' onMouseEnter={() => setMenubarHovered(true)} onMouseLeave={() => setMenubarHovered(false)}>
            <div className='flex flex-col gap-2 flex-1 transition-all'>
                <Menu name='Dashboard' image={dashboard} link='/collector' active={currentPath === '/collector'} menubarHovered={menubarHovered} />
                {/* <Menu name='Tests' image={form} link='/admin/tests' active={currentPath.includes('/admin/tests')} menubarHovered={menubarHovered} /> */}
                {/* <Menu name='Labs' image={sheet} link='/admin/labs' active={currentPath.includes('/admin/labs')} menubarHovered={menubarHovered} /> */}
                {/* <Menu name='Collectors' image={students} link='/admin/collectors' active={currentPath.includes('/admin/collectors')} menubarHovered={menubarHovered} /> */}
                {/* <Menu name='Carts' image={cart} link='/admin/carts' active={currentPath.includes('/admin/carts')} menubarHovered={menubarHovered} /> */}
                <Menu name='Orders' image={form} link='/collector/orders' active={currentPath.includes('/collector/orders')} menubarHovered={menubarHovered} />
                {/* <Menu name='Data Misses' image={form} link='/admin/warnings' active={currentPath.includes('/admin/warnings')} menubarHovered={menubarHovered} /> */}
            </div>
            <Link className={"cursor-pointer flex justify-start gap-3 items-center mb-2 rounded-lg" + (menubarHovered ? " mx-1.5" : " mx-auto")} href='/collector/profile' aria-label="View Profile">
                <Image src={user} alt="User Avatar" width={40} height={40} className="rounded-full p-2 bg-primary bg-opacity-20" />
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
                {/* <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}>Log Out</button> */}
            </div>
        </div>
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
            <div className={`flex justify-start gap-3 p-2 sm:p-3 items-center rounded-lg transition-all text-sm sm:text-base ${active ? 'bg-blue-200' : ''}`}>
                <Image src={image} alt='' width={24} height={24} className='w-5 h-5 sm:w-6 sm:h-6 ' />
                {menubarHovered && <p>{name}</p>}
            </div>
            {/* <div className={'p-2 px-4 rounded' + (active ? ' bg-blue-500 text-white' : '')}>{name}</div> */}
        </Link>
    )
}