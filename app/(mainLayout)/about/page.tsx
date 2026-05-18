// app/(mainLayout)/about/page.tsx
"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import ContactDetails from "../contact/components/ContactDetails";
import Services from "../services/components/Services";
import { Achievements } from "../_components/Achievements";
import SectionHeader from "../_components/SectionHeader";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex-1 overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <section className="min-h-[calc(100vh-120px)] flex items-center py-20 md:py-32 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border-40 border-orange-50/50 dark:border-white/2 rounded-full pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col lg:flex-row gap-16 lg:gap-8 items-center justify-between z-10">
          {/* Left Text Content */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary dark:text-white leading-tight">
              Get Quick <br />
              <span className="text-orange-500">Tests Done</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              A trusted diagnostic platform offering secure, convenient access
              to accredited labs and professional sample collection right at
              your doorstep.
            </p>

            <div className="mt-10 flex justify-center lg:justify-start">
              <Link href="/signup">
                <button className="px-6 py-3 md:px-7 md:py-3 md:text-lg font-semibold bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                  Get Started
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="flex-1 relative flex justify-center items-center w-full max-w-md lg:max-w-none mx-auto">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-105 lg:h-105 relative flex justify-center items-center rounded-full shadow-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 text-4xl sm:text-5xl font-black z-0">
              <div className="absolute inset-0 rounded-full border-10 border-gray-50 dark:border-white/5 pointer-events-none"></div>
              <Image
                src="/logo-light.png"
                alt="LabTesto Logo"
                width={160}
                height={160}
                className="z-10 block dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="LabTesto Logo"
                width={160}
                height={160}
                className="z-10 hidden dark:block"
              />

              {/* Top Left Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute top-4 -left-6 sm:top-8 sm:-left-12 lg:top-12 lg:-left-8 flex gap-3 sm:gap-4 items-center bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-black/50 px-4 py-3 sm:px-5 sm:py-4 rounded-3xl z-20"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-black text-primary dark:text-white text-lg sm:text-xl leading-tight">
                    1820+
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Active Users
                  </div>
                </div>
              </motion.div>

              {/* Bottom Right Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-6 -right-4 sm:-bottom-10 sm:-right-8 lg:bottom-8 lg:-right-12 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-black/50 px-5 py-4 sm:px-6 sm:py-5 rounded-3xl z-20 max-w-55 sm:max-w-65"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500 mt-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <ul className="flex flex-col gap-2">
                    <li className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-snug">
                      Sample collection at your home
                    </li>
                    <li className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-snug">
                      Online reports delivered fast
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Services />
      </div>

      {/* Achievements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Achievements />
      </div>

      {/* Contact Details Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-[#111] border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-orange-50/50 to-transparent dark:from-orange-500/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center relative z-10">
          <SectionHeader
            title="Our Contact"
            highlight="Details"
            description="Reach out to us for support, inquiries, or to book a specialized test."
          />

          <div className="w-full">
            <ContactDetails />
          </div>
        </div>
      </section>
    </main>
  );
}
