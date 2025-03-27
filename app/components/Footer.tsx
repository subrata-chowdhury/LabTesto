import React from 'react'
import Link from 'next/link';
import FacebookIcon from '@/assets/reactIcon/footer/Facebook';
import InstagramIcon from '@/assets/reactIcon/footer/Instagram';
import LinkedinIcon from '@/assets/reactIcon/footer/Linkedin';
import YoutubeIcon from '@/assets/reactIcon/footer/Youtube';

const Footer = () => {
    return (
        <footer className="bg-primary bg-opacity-10 py-6 pt-5" role="contentinfo">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
                    <div className='mr-4'>
                        <h1 className="text-xl font-bold mb-2"><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                        <p className="text-sm">A well known trusted blood collection website to book any tests from any lab by user&#39;s choice.</p>
                        <div className='flex gap-3 mt-4'>
                            <Link href='#' aria-label="Facebook">
                                <FacebookIcon />
                            </Link>
                            <Link href='#' aria-label="Instagram">
                                <InstagramIcon />
                            </Link>
                            <Link href='#' aria-label="LinkedIn">
                                <LinkedinIcon />
                            </Link>
                            <Link href='#' aria-label="YouTube">
                                <YoutubeIcon />
                            </Link>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        <div className='inline-flex flex-col'>
                            <h2 className="text-base font-semibold mb-2">Footer</h2>
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
                            <h2 className="text-base font-semibold mb-2">Group 2</h2>
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
                            <h2 className="text-base font-semibold mb-2">Group 3</h2>
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

                <div className="border-t border-[#3987ba] mt-5 pt-4 text-center flex justify-between text-xs">
                    <p><a href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</a> | <a href="/terms-of-service" className="hover:text-gray-400">Terms of Service</a></p>
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;