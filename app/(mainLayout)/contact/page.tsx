// app/(mainLayout)/contact/page.tsx
import React from "react";
import MainForm from "./components/MainContactForm";
import ContactDetails from "./components/ContactDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - LabTesto",
  description:
    "Get in touch with LabTesto. Whether you have questions or you would just like to say hello, contact us.",
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_APP_URL + "/contact" ||
      "https://labtesto.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-gray-50/50 dark:bg-black">
      {/* Hero Header */}
      <section className="relative flex flex-col items-center pt-20 pb-28 px-4 bg-primary overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-6 mx-auto leading-relaxed">
            Whether you have questions, feedback, or just want to say hello, our
            team is here and ready to help.
          </p>
        </div>

        {/* SVG Wave */}
        <svg
          className="w-full h-16 md:h-24 absolute bottom-0 translate-y-px text-gray-50/50 dark:text-black"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current"
            d="M0,0 L50,10 L100,5 L150,15 L200,8 L250,12 L300,5 L350,15 L400,10 L450,5 L500,12 L550,8 L600,15 L650,10 L700,5 L750,12 L800,8 L850,15 L900,5 L950,12 L1000,8 L1050,15 L1100,10 L1150,5 L1200,12 L1200,40 L0,40 Z"
          />
        </svg>
      </section>

      {/* Info Cards */}
      <div className="-mt-12 relative z-20 w-full">
        <ContactDetails />
      </div>

      {/* Form & Map Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <MainForm />

        <div className="flex flex-col h-full w-full shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111]">
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Us
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Our physical location and headquarters.
            </p>
          </div>
          <div className="w-full h-87.5 lg:h-full min-h-87.5 bg-gray-100 dark:bg-zinc-800">
            <iframe
              src="https://www.google.com/maps?q=23.432055556,87.274694444&z=15&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Support and Bug Reporting Section */}
      <footer className="w-full py-10 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
            Encountering a technical glitch or a platform issue?
          </p>
          <p className="mt-2 text-sm md:text-base">
            Report bugs directly to:{" "}
            <a
              href="mailto:subratachowdhury7000@gmail.com"
              className="font-bold text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all underline-offset-4"
            >
              subratachowdhury7000@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
