import React from 'react'
import Link from 'next/link';
import FacebookIcon from '@/assets/reactIcon/footer/Facebook';
import InstagramIcon from '@/assets/reactIcon/footer/Instagram';
import LinkedinIcon from '@/assets/reactIcon/footer/Linkedin';
import YoutubeIcon from '@/assets/reactIcon/footer/Youtube';

const Footer = () => {
    return (
        <footer className="bg-primary bg-opacity-10 py-6 pt-5" role="contentinfo">
            <div className="mx-auto px-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
                    <div className='mr-4'>
                        <h1 className="text-xl font-bold mb-2"><span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                        <p className="text-sm">A trusted diagnostic platform offering seamless test bookings from accredited labs of your choice, with certified home sample collection and secure payment options.</p>
                        <h1 className='text-lg mt-2 text-blue-600 dark:text-primary font-semibold'>Contact Us</h1>
                        <div className='text-sm text-gray-600d dark:text-gray-400 font-medium mt-1'>
                            <p><span className='text-gray-800 dark:text-gray-300 font-normal'>Phone:</span> +91 82507 11212</p>
                            <p><span className='text-gray-800 dark:text-gray-300 font-normal'>Email:</span> sayan825071das@gmail.com</p>
                            <p><span className='text-gray-800 dark:text-gray-300 font-normal'>Address:</span> Kadasole more, Bankura, <br />Pin. 722202 - West Bengal</p>
                        </div>
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
                            <h2 className="text-base font-semibold mb-2">Platform Details</h2>
                            <ul className='flex flex-col gap-1'>
                                {[{ label: 'About Us', href: "/about" },
                                { label: 'Services', href: "/services" },
                                { label: 'FAQs', href: "/faq" },
                                { label: 'Testimonials', href: "/testimonials" },
                                { label: 'Privacy Policy', href: "/privacy-policy" },
                                { label: 'Terms & Conditions', href: "/terms-and-conditions" }].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href={link.href} className="hover:text-gray-400">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h2 className="text-base font-semibold mb-2">Popular Tests</h2>
                            <ul className='flex flex-col gap-1'>
                                {[{ label: 'Complete Blood Count', href: "/tests/67a38ddca80c243e83d518ed" },
                                { label: 'Fasting Blood Sugar', href: "/tests/67a44ab70daa8b678a7fa330" },
                                { label: 'Thyroid Stimulating Hormone', href: "/tests/67b9667ee39bde2a012634ca" },
                                { label: 'Random Blood Sugar', href: "/tests/67bd7997eb03aecfeb2f2331" },
                                { label: 'Urine Examination', href: "/tests/67bd6412266fe37d1fb4e7a8" }].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href={link.href} className="hover:text-gray-400">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='inline-flex flex-col'>
                            <h2 className="text-base font-semibold mb-2">Follow Us</h2>
                            <ul className='flex flex-col gap-1'>
                                {[{ label: 'Facebook', href: "#" },
                                { label: 'Instagram', href: "#" },
                                { label: 'LinkedIn', href: "#" },
                                { label: 'YouTube', href: "#" }].map((link, index) => (
                                    <li key={index} className="mb-1 text-sm">
                                        <a href={link.href} className="hover:text-gray-400">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#3987ba] mt-5 pt-4 text-center flex justify-between text-xs">
                    <p><a href="#" className="hover:text-gray-400">Privacy Policy</a> | <a href="#" className="hover:text-gray-400">Terms of Service</a></p>
                    <p>&copy; 2023 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;