'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useState } from 'react';
import user from '@/assets/user.png';
import Link from 'next/link';
import SelectTest from './SelectTest';
import { useRouter } from 'next/navigation';
import CartIcon from '@/assets/cart.svg'
import fetcher from '@/lib/fetcher';
import logout from '@/assets/Menubar/logout.svg'
import { useItemCountContext } from '../contexts/ItemCountContext';

const Menubar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { itemCount, setItemCount } = useItemCountContext();
    const navigate = useRouter();

    useEffect(() => {
        fetcher.get<{ items: number }>('/cart/count').then(res => {
            if (res.status === 200 && res.body) {
                setItemCount(res.body.items || 0)
            };
        })
    }, [])

    return (
        <nav className="bg-[#fff] shadow-md shadow-[#3986ba16] p-3 px-6" role="navigation" aria-label="Main Navigation">
            <div className="mx-auto flex justify-between items-center">
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-[#3987ba] menu focus:outline-none" aria-label="Toggle Menu">
                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
                <div className="text-white text-lg font-bold mr-0 md:mr-16">
                    <Link href={'/'} onClick={() => setIsOpen(false)} className=''><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></Link>
                </div>
                <div className="hidden md:flex space-x-6 mr-auto">
                    <Link href="/tests" className="text-[#3987ba] menu">Book</Link>
                    <Link href="#" className="text-[#3987ba] menu">About</Link>
                    <Link href="/order" className="text-[#3987ba] menu">Orders</Link>
                    <Link href="/contact" className="text-[#3987ba] menu">Contact</Link>
                </div>
                <div className='hidden ms-6 md:block mr-5'>
                    <SearchBar onSelect={(test) => navigate.push('/tests/' + test._id)} active={true} />
                </div>
                <Link
                    className='relative mr-0 md:mr-4 cursor-pointer'
                    href={'/cart'}
                    onClick={() => setIsOpen(false)}
                    aria-label="View Cart"
                >
                    {(itemCount || 0) > 0 && <div className='absolute -right-1 -top-1 px-[6px] py-[2px] rounded-full text-xs text-white font-medium bg-primary'>{(itemCount || 0) > 9 ? '9+' : itemCount}</div>}
                    <Image
                        src={CartIcon}
                        alt="Cart Icon"
                        width={28}
                        height={28} />
                </Link>
                <Link className="hidden md:flex items-center space-x-4 cursor-pointer" href='/profile' aria-label="View Profile">
                    <Image src={user} alt="User Avatar" width={40} height={40} className="rounded-full p-2 bg-primary bg-opacity-20" />
                </Link>
            </div>
            {isOpen && (
                <div className="md:hidden fixed left-0 top-14 w-full text-lg sm:w-2/5 px-10 z-20 bg-white h-screen">
                    <Link className="flex flex-col gap-2 justify-center items-center cursor-pointer py-5 pb-7" href={'/profile'} onClick={() => setIsOpen(false)} aria-label="View Profile">
                        <Image src={user} alt="User Avatar" width={80} height={80} className="rounded-full p-4 bg-primary bg-opacity-20" />
                        <div className="text-[#3987ba] menu">Profile</div>
                    </Link>
                    <Link href="/tests" className="block text-[#3987ba] menu py-2" onClick={() => setIsOpen(false)}>Book a Test</Link>
                    <Link href="#" className="block text-[#3987ba] menu py-2" onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/order" className="block text-[#3987ba] menu py-2" onClick={() => setIsOpen(false)}>Orders</Link>
                    <Link href="/contact" className="block text-[#3987ba] menu py-2" onClick={() => setIsOpen(false)}>Contact</Link>
                    <div
                        className={`cursor-pointer flex justify-start gap-3 p-3 px-0 mt-40 items-center rounded-lg text-primary`}
                        onClick={() => {
                            document.cookie = 'token=; Max-Age=0; path=/;';
                            window.location.href = '/';
                        }}
                        aria-label="Log Out"
                    >
                        <Image src={logout} alt='Logout Icon' width={20} height={20} style={{ width: 20, height: 20 }} />
                        <p>Log Out</p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Menubar;

export function SearchBar({ active = false, className = '', onSelect = () => { } }: { active?: boolean, className?: string, onSelect?: (value: { name: string, _id: string }) => void }) {
    const [showSearchBar, setShowSearchBar] = useState(active);

    return (
        <div className={"relative text-sm text-primary z-10 flex gap-3 items-center justify-between px-4 py-2 border-primary border-opacity-50 border-2 outline-none w-full rounded-full " + className}>
            {showSearchBar && <SelectTest
                onSelect={onSelect}
                optionElement={(option, index, onClick) => (
                    <Link href={'/tests/' + option._id} key={index}>
                        <div key={index} className='px-3 py-2 border-b-2 hover:bg-gray-100' onClick={() => { onClick(); onSelect(option) }}>
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