'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image';

import logout from '@/assets/Menubar/logout.svg'
// import teachers from '@/assets/Menubar/teachers.svg'
import dashboard from '@/assets/Menubar/dashboard.svg'
import students from '@/assets/Menubar/students.svg'
import form from '@/assets/Menubar/form.svg'
import sheet from '@/assets/Menubar/attendance.svg'
import cart from '@/assets/cart.svg'

function Menubar() {
    const [menubarHovered, setMenubarHovered] = useState(false);
    const currentPath = usePathname();

    return (
        <div className='absolute sm:relative bg-white flex flex-col gap-2 px-4 py-6 shadow h-full transition-all' onMouseEnter={() => setMenubarHovered(true)} onMouseLeave={() => setMenubarHovered(false)}>
            <div className='flex flex-col gap-2 flex-1 transition-all'>
                <Menu name='Dashboard' image={dashboard} link='/admin' active={currentPath === '/admin'} menubarHovered={menubarHovered} />
                <Menu name='Tests' image={form} link='/admin/tests' active={currentPath === '/admin/tests'} menubarHovered={menubarHovered} />
                <Menu name='Labs' image={sheet} link='/admin/labs' active={currentPath === '/admin/labs'} menubarHovered={menubarHovered} />
                <Menu name='Collectors' image={students} link='/admin/collectors' active={currentPath === '/admin/collectors'} menubarHovered={menubarHovered} />
                <Menu name='Carts' image={cart} link='/admin/carts' active={currentPath === '/admin/carts'} menubarHovered={menubarHovered} />
                <Menu name='Orders' image={form} link='/admin/orders' active={currentPath === '/admin/orders'} menubarHovered={menubarHovered} />
            </div>
            <div className=''>
                <div
                    className={`cursor-pointer flex justify-start gap-3 p-3 items-center rounded-lg`}
                    onClick={() => {
                        document.cookie = 'adminToken=; Max-Age=0; path=/;';
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
            <div className={`flex justify-start gap-3 p-3 items-center rounded-lg transition-all ${active ? 'bg-blue-200' : ''}`}>
                <Image src={image} alt='' width={24} height={24} style={{ width: 24, height: 24 }} />
                {menubarHovered && <p>{name}</p>}
            </div>
            {/* <div className={'p-2 px-4 rounded' + (active ? ' bg-blue-500 text-white' : '')}>{name}</div> */}
        </Link>
    )
}