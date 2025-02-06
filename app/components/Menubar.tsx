'use client'
import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
import user from '@/assets/user.png';
import Link from 'next/link';

const Menubar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#0e0e52] p-4 px-6">
            <div className="mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold mr-16">
                    <Link href={'/'}>Logo</Link>
                </div>
                <div className="hidden md:flex space-x-6 mr-auto">
                    <a href="#" className="text-white">Book</a>
                    {/* <a href="#" className="text-white">Home</a> */}
                    <a href="#" className="text-white">About</a>
                    <a href="#" className="text-white">Services</a>
                    <a href="#" className="text-white">Contact</a>
                </div>
                <div className='hidden md:block mr-8'>
                    <SearchBar />
                </div>
                <div className="hidden md:flex items-center space-x-4 cursor-pointer">
                    <div className="text-white">Profile</div>
                    <Image src={user} alt="avatar" width={40} height={40} className="rounded-full p-2 bg-gray-100" />
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="flex flex-col gap-2 justify-center items-center py-5">
                        <Image src={user} alt="avatar" width={40} height={40} className="rounded-full p-2 bg-gray-100" />
                        <div className="text-white">Profile</div>
                    </div>
                    <div className='py-1 pb-2'>
                        <SearchBar active={true} />
                    </div>
                    <a href="#" className="block text-white py-2">Book a Test</a>
                    {/* <a href="#" className="block text-white py-2">Home</a> */}
                    <a href="#" className="block text-white py-2">About</a>
                    <a href="#" className="block text-white py-2">Services</a>
                    <a href="#" className="block text-white py-2">Contact</a>
                </div>
            )}
        </nav>
    );
};

export default Menubar;

function SearchBar({ active = false }: { active?: boolean }) {
    const [search, setSearch] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(active);

    return (
        <div className="relative text-gray-600">
            {showSearchBar && <input
                type="search"
                // name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-white h-10 px-5 pr-10 rounded-full w-full text-sm focus:outline-none"
            />}
            <button type="submit" className={(showSearchBar ? "absolute right-0 top-0 mt-3 mr-4" : "bg-white p-3 rounded-full")} onClick={() => setShowSearchBar(true)}>
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px"
                    viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                    <path d="M55.146,51.887L41.588,38.329c3.486-4.191,5.377-9.479,5.377-14.979C46.965,10.478,36.486,0,23.482,0
                                C10.479,0,0,10.478,0,23.482c0,13.004,10.479,23.482,23.482,23.482c5.5,0,10.788-1.891,14.979-5.377l13.558,13.558
                                c1.219,1.219,3.195,1.219,4.414,0C56.365,55.082,56.365,53.106,55.146,51.887z M23.482,41.965
                                c-10.214,0-18.482-8.268-18.482-18.482S13.268,5,23.482,5s18.482,8.268,18.482,18.482S33.696,41.965,23.482,41.965z"/>
                </svg>
            </button>
            {
                search.length > 0 && <div className='flex flex-col rounded-lg bg-white w-full mt-1 shadow-md absolute overflow-hidden'>
                    {['a', 'b', 'c'].map(e => <div key={e} onClick={() => { setSearch(e) }} className='py-1 px-3 hover:bg-gray-200 cursor-pointer'>{e}</div>)}
                </div>
            }
        </div>
    )
}