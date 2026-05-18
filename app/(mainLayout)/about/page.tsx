// app/(mainLayout)/about/page.tsx
"use client";

import Link from "next/link";
import React from "react";
import ContactDetails from "../contact/components/ContactDetails";
import Services from "../services/components/Services";
import { Achievements } from "../page";

export default function AboutPage() {
  return (
    <>
      <section className="min-h-[calc(100vh-120px)] flex items-center pt-12 pb-24 overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col lg:flex-row gap-16 lg:gap-8 items-center justify-between z-10">
          {/* Left Text Content */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 dark:text-white leading-tight">
              Get Quick
              <br />
              <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
                Tests Done
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
              A trusted diagnostic platform offering secure, convenient access
              to accredited labs and professional sample collection right at
              your doorstep.
            </p>

            <div className="mt-10 flex justify-center lg:justify-start">
              <Link href="/signup">
                <button className="px-8 py-3.5 text-lg font-medium bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
                  Get Started
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
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
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] relative flex justify-center items-center rounded-full shadow-2xl bg-linear-to-br from-primary/20 to-transparent dark:from-white/10 dark:to-white/5 border border-white/50 dark:border-white/10 backdrop-blur-sm text-4xl sm:text-5xl font-bold z-0">
              <div className="flex flex-col items-center">
                <span className="text-orange-500 drop-shadow-md">Lab</span>
                <span className="text-gray-900 dark:text-white drop-shadow-md">
                  Testo
                </span>
              </div>

              {/* Top Left Badge */}
              <div className="absolute top-4 -left-6 sm:top-8 sm:-left-12 lg:top-12 lg:-left-8 flex gap-3 sm:gap-4 items-center bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-black/50 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl z-20">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
                  <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl leading-tight">
                    1820+
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active Users
                  </div>
                </div>
              </div>

              {/* Bottom Right Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-10 sm:-right-8 lg:bottom-12 lg:-right-12 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-black/50 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl z-20 max-w-[220px] sm:max-w-[260px]">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
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
                    <li className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
                      Sample collection at your home
                    </li>
                    <li className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
                      Online reports delivered fast
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Services />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Achievements />
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Our Contact Details
            </h1>
            <div className="w-24 h-1.5 rounded-full bg-primary/40 dark:bg-primary/80 mt-5 mb-2"></div>
          </div>

          <div className="w-full">
            <ContactDetails
              className="flex-wrap justify-center gap-8 lg:gap-16"
              iconClassName="border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-black/20 bg-white dark:bg-[#111]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
