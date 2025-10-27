'use client';
import React from 'react'
import Link from 'next/link';
import FacebookIcon from '@/assets/reactIcon/footer/Facebook';
import InstagramIcon from '@/assets/reactIcon/footer/Instagram';
import LinkedinIcon from '@/assets/reactIcon/footer/Linkedin';
import YoutubeIcon from '@/assets/reactIcon/footer/Youtube';
import { PhoneIcon } from '@/assets/reactIcon/contact/Phone';
import { MailIcon } from '@/assets/reactIcon/contact/Mail';
import { LocationIcon } from '@/assets/reactIcon/contact/Location';
import useIsVisible from '@/lib/isVisibileHook';

const Footer = () => {
    const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.1, once: true });

    return (
        <footer ref={ref} className="bg-primary/10 py-6 pt-12" role="contentinfo">
            <div className="mx-auto px-14">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
                    <div className='mr-4 max-w-md'>
                        <h1 className={"text-xl font-bold mb-2 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                        <p className={"text-sm mt-2" + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.3s` }}>A trusted diagnostic platform offering seamless test bookings from accredited labs of your choice, with certified home sample collection and secure payment options.</p>
                        <div className='flex gap-5 mt-6'>
                            <Link href='#' className={isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6"} style={{ transition: `all 0.5s ease 0.5s` }} aria-label="Facebook">
                                <FacebookIcon size={20} />
                            </Link>
                            <Link href='#' className={isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6"} style={{ transition: `all 0.5s ease 0.7s` }} aria-label="Instagram">
                                <InstagramIcon size={20} />
                            </Link>
                            <Link href='#' className={isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6"} style={{ transition: `all 0.5s ease 0.9s` }} aria-label="LinkedIn">
                                <LinkedinIcon size={20} />
                            </Link>
                            <Link href='#' className={isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6"} style={{ transition: `all 0.5s ease 1.1s` }} aria-label="YouTube">
                                <YoutubeIcon size={20} />
                            </Link>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-4 flex-1'>
                        <div className='inline-flex flex-col'>
                            <h2 className={"text-base font-semibold mb-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Platform Details</h2>
                            <ul className='flex flex-col gap-1'>
                                {[{ label: 'About Us', href: "/about" },
                                { label: 'Services', href: "/services" },
                                { label: 'FAQs', href: "/faq" },
                                { label: 'Testimonials', href: "/testimonials" },
                                { label: 'Privacy Policy', href: "/privacy-policy" },
                                { label: 'Terms & Conditions', href: "/terms-and-conditions" }].map((link, index) => (
                                    <li key={index} className={"mb-1 text-sm" + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease ${0.3 + index * 0.1}s` }}>
                                        <Link href={link.href} className="text-gray-700 hover:text-gray-500">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h2 className={"text-base font-semibold mb-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Popular Tests</h2>
                            <ul className='flex flex-col gap-1'>
                                {[{ label: 'Complete Blood Count', href: "/tests/67a38ddca80c243e83d518ed" },
                                { label: 'Fasting Blood Sugar', href: "/tests/67a44ab70daa8b678a7fa330" },
                                { label: 'Thyroid Stimulating Hormone', href: "/tests/67b9667ee39bde2a012634ca" },
                                { label: 'Random Blood Sugar', href: "/tests/67bd7997eb03aecfeb2f2331" },
                                { label: 'Urine Examination', href: "/tests/67bd6412266fe37d1fb4e7a8" }].map((link, index) => (
                                    <li key={index} className={"mb-1 text-sm" + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease ${0.3 + index * 0.1}s` }}>
                                        <Link href={link.href} className="text-gray-700 hover:text-gray-500">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h2 className={"text-base font-semibold mb-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Contact Us</h2>
                            <ul className='text-sm text-gray-600d dark:text-gray-400 font-medium flex flex-col gap-1'>
                                <li className={'mb-2 text-gray-700 hover:text-gray-500 dark:text-gray-300 flex gap-2 items-center ' + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.3s` }}><PhoneIcon size={18} /> +91 82507 11212</li>
                                <li className={'mb-2 text-gray-700 hover:text-gray-500 dark:text-gray-300 flex gap-2 items-center ' + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.4s` }}><MailIcon size={18} /> sayan825071das@gmail.com</li>
                                <li className={'mb-2 text-gray-700 hover:text-gray-500 dark:text-gray-300 flex gap-2 items-center ' + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.5s` }}><LocationIcon size={18} /> Kadasole more, Bankura, <br />Pin. 722202 - West Bengal</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#3987ba] mt-5 pt-4 text-center flex flex-col sm:flex-row justify-between text-xs">
                    <div className='flex gap-3 mx-auto mb-4 sm:mx-0 sm:mb-0'><Link href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</Link> | <Link href="/terms-and-conditions" className="hover:text-gray-400">Terms of Service</Link></div>
                    <p className='text-center sm:text-right'>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;