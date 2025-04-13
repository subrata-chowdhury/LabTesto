'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import SelectTest from './SelectTest';
import fetcher from '@/lib/fetcher';
import logout from '@/assets/Menubar/logout.svg'
import { useItemCountContext } from '../contexts/ItemCountContext';
import { CartIcon } from '@/assets/reactIcon/Cart';
import LabIcon from '@/assets/reactIcon/test/Lab';
import { FilledCartIcon } from '@/assets/reactIcon/menubar/FilledCart';
import { OrderIcon } from '@/assets/reactIcon/menubar/Orders';
import { AboutIcon } from '@/assets/reactIcon/menubar/About';
import { ContactIcon } from '@/assets/reactIcon/menubar/Contact';
import { NotificationIcon } from '@/assets/reactIcon/menubar/Notification';
import UserIcon from '@/assets/reactIcon/User';

const Menubar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [active, setActive] = useState(false);
    const { itemCount, setItemCount } = useItemCountContext();

    useEffect(() => {
        fetcher.get<{ items: number }>('/cart/count').then(res => {
            if (res.status === 200 && res.body) {
                setItemCount(res.body.items || 0);
                setIsLoggedIn(JSON.parse(localStorage.getItem('isLoggedIn') || 'false'));
                setUserName(localStorage.getItem('userName') || '');
                setUserEmail(localStorage.getItem('userEmail') || '');
            } else if (res.status === 400) {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                setIsLoggedIn(false);
            };
        })
        const handleScroll = () => {
            if (window.scrollY > 5) {
                setActive(true);
            } else if (window.scrollY <= 5) {
                setActive(false);
            }
        }
        window.addEventListener('wheel', handleScroll);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        <nav className={`bg-white dark:bg-[#09192F] px-6 z-20 fixed w-screen transition-all ${active ? 'p-3 shadow-md shadow-sky-100 dark:shadow-black dark:shadow-md' : 'p-4'}`} role="navigation" aria-label="Main Navigation">
            <div className="mx-auto flex justify-between items-center">
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-primary menu focus:outline-none" aria-label="Toggle Menu">
                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
                <div className="text-white text-lg font-bold mr-0 md:mr-16">
                    <Link href={'/'} onClick={() => setIsOpen(false)} className=''><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></Link>
                </div>
                <div className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 xl:ml-5 mr-auto">
                    <Link href="/tests" className="text-primary menu flex">Book&nbsp;<span className='hidden lg:block'>a Test</span></Link>
                    <Link href="/about" className="text-primary menu flex">About&nbsp;<span className='hidden lg:block'>Us</span></Link>
                    <Link href="/order" className="text-primary menu flex">Orders&nbsp;<span className='hidden lg:block'></span></Link>
                    <Link href="/contact" className="text-primary menu flex">Contact&nbsp;<span className='hidden lg:block'>Us</span></Link>
                </div>
                <div className='hidden ms-6 md:block mr-5'>
                    <SearchBar active={true} />
                </div>
                {isLoggedIn ?
                    <>
                        <Link
                            className='relative mr-0 md:mr-4 cursor-pointer text-primary'
                            href={'/cart'}
                            onClick={() => setIsOpen(false)}
                            aria-label="View Cart"
                        >
                            {(itemCount || 0) > 0 && <div className='absolute -right-1 -top-1 px-[6px] py-[2px] rounded-full text-xs text-white font-medium bg-primary'>{(itemCount || 0) > 9 ? '9+' : itemCount}</div>}
                            <CartIcon size={28} />
                        </Link>
                        <div className="hidden relative md:flex items-center space-x-4 cursor-pointer text-primary">
                            {/* <Link href='/profile' aria-label="View Profile"> */}
                            <span onClick={() => setShowProfilePopup(val => !val)}><UserIcon size={40} className="rounded-full p-2 bg-primary bg-opacity-20" /></span>
                            {/* </Link> */}
                            {showProfilePopup && <ProfilePopup isLoggedIn={isLoggedIn} userEmail={userEmail} userName={userName} onPopupClose={() => { setShowProfilePopup(false); setIsOpen(false) }} />}
                        </div>
                    </> :
                    <>
                        <Link href={'/signup'} className='px-3 sm:px-5 py-1.5 text-white font-medium bg-primary rounded-md text-sm sm:text-base'>Register</Link>
                    </>}
            </div>
            {isOpen && <MobileMenubar onClose={() => setIsOpen(false)} userEmail={userEmail} userName={userName} isLoggedIn={isLoggedIn} />}
        </nav>
    );
};

export default Menubar;


export function SearchBar({ active = false, className = '', onSelect = () => { } }: { active?: boolean, className?: string, onSelect?: (value: { name: string, _id: string }) => void }) {
    const [showSearchBar, setShowSearchBar] = useState(active);

    return (
        <div className={"relative text-sm z-10 text-primary flex gap-3 items-center justify-between px-4 py-2 border-primary bg-gray-500 bg-opacity-5 border-opacity-50 border outline-none w-full rounded-full " + className}>
            {showSearchBar && <SelectTest
                onSelect={onSelect}
                optionElement={(option, index, onClick) => (
                    <Link href={'/tests/' + option._id} key={index}>
                        <div key={index} className='px-3 py-2 border-b-2 dark:bg-[#172A46] hover:bg-gray-100' onClick={() => { onClick(); onSelect(option) }}>
                            <div className='text-base font-medium'>{option.name}</div>
                            <div className='text-xs'>{option.sampleType}</div>
                        </div>
                    </Link>
                )}
                className='rounded-full'
                style={{ border: 'none', padding: 0, borderRadius: 0, marginRight: 12 }}
                placeholder='Search Test' />}
            <button type="submit" className={(showSearchBar ? "relative right-0 top-0" : "bg-white p-3 rounded-full")} onClick={() => setShowSearchBar(true)}>
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px"
                    viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                    <path d="M55.146,51.887L41.588,38.329c3.486-4.191,5.377-9.479,5.377-14.979C46.965,10.478,36.486,0,23.482,0
                                C10.479,0,0,10.478,0,23.482c0,13.004,10.479,23.482,23.482,23.482c5.5,0,10.788-1.891,14.979-5.377l13.558,13.558
                                c1.219,1.219,3.195,1.219,4.414,0C56.365,55.082,56.365,53.106,55.146,51.887z M23.482,41.965
                                c-10.214,0-18.482-8.268-18.482-18.482S13.268,5,23.482,5s18.482,8.268,18.482,18.482S33.696,41.965,23.482,41.965z"/>
                </svg>
            </button>
        </div>
    )
}

function MobileMenubar({ onClose = () => { }, isLoggedIn, userName = '', userEmail = '' }: { onClose?: () => void, isLoggedIn?: boolean, userName?: string, userEmail?: string }) {
    return (
        <div className="md:hidden flex flex-col gap-2 fixed left-0 top-0 w-full text-base sm:w-auto px-10 z-20 bg-white dark:bg-[#0A192F] h-screen shadow-2xl">
            <div className='flex relative top-4 mb-6 justify-center items-center'>
                <button onClick={() => onClose()} className="text-primary absolute left-0 menu focus:outline-none">
                    <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={"M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                </button>
                <div className="text-white text-lg font-bold mr-0 md:mr-16">
                    <Link href={'/'} onClick={() => onClose()} className=''><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></Link>
                </div>
            </div>
            <Link className="flex flex-col gap-2 justify-center items-center cursor-pointer py-5 pb-8 text-primary" href={'/profile'} onClick={() => onClose()} aria-label="View Profile">
                <UserIcon size={80} className="rounded-full p-4 bg-primary bg-opacity-20" />
                <div className='text-center'>
                    <div className="text-primary text-lg font-bold menu">{userName ? userName : 'Profile'}</div>
                    <div className="text-primary text-xs font-medium menu">{userEmail ? userEmail : ''}</div>
                </div>
            </Link>
            <Link href="/profile" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><UserIcon size={18} />Account</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/tests" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><LabIcon size={18} />Book a Test</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/cart" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><FilledCartIcon size={20} />Cart</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/order" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><OrderIcon size={18} />Orders</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/notifications" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><NotificationIcon size={18} />Notification</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/contact" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><ContactIcon size={16} />Contact Us</span> <span className='ml-12'>❯</span>
            </Link>
            <Link href="/about" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2" onClick={() => onClose()}>
                <span className='flex items-center gap-2'><AboutIcon size={18} />About Us</span> <span className='ml-12'>❯</span>
            </Link>
            {isLoggedIn && <div
                className={`cursor-pointer flex justify-start gap-3 bg-primary bg-opacity-10 hover:bg-opacity-15 px-4 rounded-xl p-3 mt-auto mb-9 items-center text-primary`}
                onClick={() => {
                    document.cookie = 'token=; Max-Age=0; path=/;';
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                }}
                aria-label="Log Out"
            >
                <Image src={logout} alt='Logout Icon' width={18} height={18} style={{ width: 18, height: 18 }} />
                <p>Log Out</p>
            </div>}
        </div>
    )
}

function ProfilePopup({ onPopupClose, userName, userEmail, isLoggedIn }: { onPopupClose: () => void, userName?: string, userEmail?: string, isLoggedIn?: boolean }) {
    return (
        <div className='flex flex-col gap-1 px-5 py-4 rounded-lg bg-white dark:bg-[#09192F] shadow-md dark:shadow-black mt-5 border border-primary border-opacity-25 absolute top-full -right-3 text-primary'>
            <UserIcon size={80} className="rounded-full p-4 mx-auto bg-primary bg-opacity-20" />
            <div className='text-center mb-4'>
                <div className="text-primary text-lg font-bold menu text-nowrap px-2">{userName ? userName : 'Profile'}</div>
                <div className="text-primary text-xs mt-1 font-medium menu">{userEmail ? userEmail : ''}</div>
            </div>
            <Link href='/profile' onClick={() => onPopupClose()} aria-label="View Account" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2">
                <span className='flex items-center gap-2'><UserIcon size={16} />Account</span> <span className='ml-10'>❯</span>
            </Link>
            <Link href='/notifications' onClick={() => onPopupClose()} aria-label="View Notifications" className="flex justify-between bg-primary bg-opacity-10 hover:bg-opacity-15 px-5 rounded-xl text-primary menu py-2">
                <span className='flex items-center gap-2'><NotificationIcon size={16} />Notification</span> <span className='ml-10'>❯</span>
            </Link>
            {isLoggedIn && <div
                className={`cursor-pointer flex justify-start gap-3 mt-4 bg-primary bg-opacity-10 hover:bg-opacity-15 px-4 rounded-xl p-2 items-center text-primary`}
                onClick={() => {
                    document.cookie = 'token=; Max-Age=0; path=/;';
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                }}
                aria-label="Log Out"
            >
                <Image src={logout} alt='Logout Icon' width={18} height={18} style={{ width: 18, height: 18 }} />
                <p>Log Out</p>
            </div>}
        </div>
    )
}