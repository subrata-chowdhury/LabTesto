// app/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 pt-16 pb-8"
      role="contentinfo"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 max-w-md"
          >
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-light-horizental.png"
                alt="LabTesto Logo"
                className="block dark:hidden w-35 h-auto"
                width={400}
                height={200}
              />
              <Image
                src="/logo-dark-horizental.png"
                alt="LabTesto Logo"
                className="hidden dark:block w-35 h-auto"
                width={400}
                height={200}
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              A trusted diagnostic platform offering seamless test bookings from
              accredited labs of your choice, with certified home sample
              collection and secure payment options.
            </p>
            <div className="flex gap-4">
              <SocialLink
                href="#"
                icon={<FaFacebook size={20} />}
                label="Facebook"
              />
              <SocialLink
                href="#"
                icon={<FaInstagram size={20} />}
                label="Instagram"
              />
              <SocialLink
                href="#"
                icon={<FaLinkedin size={20} />}
                label="LinkedIn"
              />
              <SocialLink
                href="#"
                icon={<FaYoutube size={20} />}
                label="YouTube"
              />
            </div>
            <div className="flex flex-col gap-3 pt-4 ">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Designed & Developed by{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  Subrata Chowdhury
                </span>
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://subratachowdhuryportfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  title="View Portfolio"
                >
                  <FiGlobe className="h-4 w-4" />
                  Portfolio
                </a>
                <a
                  href="https://www.linkedin.com/in/subrata7000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  title="Connect on LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Platform Details
            </h2>
            <ul className="flex flex-col gap-3">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/services" label="Services" />
              <FooterLink href="/faq" label="FAQs" />
              <FooterLink href="/testimonials" label="Testimonials" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink
                href="/terms-and-conditions"
                label="Terms & Conditions"
              />
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h2>
            <ul className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-3 items-center group">
                <div className="text-primary dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt size={18} />
                </div>
                <a
                  href="tel:+918250711212"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  +91 82507 11212
                </a>
              </li>
              <li className="flex gap-3 items-center group">
                <div className="text-primary dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FaEnvelope size={18} />
                </div>
                <a
                  href="mailto:sayan825071das@gmail.com"
                  className="hover:text-primary dark:hover:text-white transition-colors"
                >
                  sayan825071das@gmail.com
                </a>
              </li>
              <li className="flex gap-3 items-start group">
                <div className="text-primary dark:text-blue-400 mt-1 group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt size={18} />
                </div>
                <span className="leading-snug">
                  Kadasole more, Bankura, <br />
                  Pin. 722202 - West Bengal
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400"
        >
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="/terms-and-conditions"
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <p>&copy; {currentYear} LabTesto. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:translate-x-1 inline-block transition-all duration-300 font-medium"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary dark:hover:text-white dark:hover:border-white shadow-sm transition-colors"
    >
      {icon}
    </motion.a>
  );
}

export default Footer;
