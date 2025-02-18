import Image from 'next/image';
import React from 'react'
import facebookIcon from '@/assets/Footer/facebook.png'
import instagramIcon from '@/assets/Footer/social.png'
import linkedinIcon from '@/assets/Footer/linkedin.png'
import youtubeIcon from '@/assets/Footer/youtube.png'
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-orange-50 text-orange-500 py-6 pt-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
                    <div className='mr-4'>
                        <h1 className="text-xl font-bold mb-2"><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.</p>
                        <div className='flex gap-3 mt-4'>
                            <Link href='#'>
                                <Image src={facebookIcon} width={24} height={24} alt="facebook" />
                            </Link>
                            <Link href='#'>
                                <Image src={instagramIcon} width={24} height={24} alt="instagram" />
                            </Link>
                            <Link href='#'>
                                <Image src={linkedinIcon} width={24} height={24} alt="linkedin" />
                            </Link>
                            <Link href='#'>
                                <Image src={youtubeIcon} height={24} alt="youtube" />
                            </Link>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        <div className='inline-flex flex-col'>
                            <h1 className="text-base font-semibold mb-2">Footer</h1>
                            <ul>
                                {['Link 1', 'Link 2', 'Link 3'].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href="#" className="hover:text-gray-400">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h1 className="text-base font-semibold mb-2">Group 2</h1>
                            <ul>
                                {['Link 4', 'Link 5', 'Link 6'].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href="#" className="hover:text-gray-400">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h1 className="text-base font-semibold mb-2">Group 3</h1>
                            <ul>
                                {['Link 7', 'Link 8', 'Link 9'].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href="#" className="hover:text-gray-400">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-orange-500 mt-5 pt-4 text-center flex justify-between text-xs">
                    <p>Privacy Policy | Terms of Service</p>
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;