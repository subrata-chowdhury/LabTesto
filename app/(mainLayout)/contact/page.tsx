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
    <main className="w-full min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Hero Header */}
      <section className="relative flex flex-col items-center pt-16 pb-24 px-4 overflow-hidden border-b border-gray-100 dark:border-white/5">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[20px] border-orange-50/50 dark:border-white/[0.02] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white font-extrabold tracking-tight leading-tight">
            We'd Love to <br className="hidden sm:block" />
            <span className="text-orange-500">Hear From You</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mt-4 mx-auto leading-relaxed">
            Whether you have questions, feedback, or just want to say hello, our
            team is here and ready to help.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <div className="-mt-12 relative z-20 w-full mb-10">
        <ContactDetails />
      </div>

      {/* Form & Map Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <MainForm />

        <div className="flex flex-col h-full w-full shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111]">
          <div className="p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-bold text-primary dark:text-white">
              Find Us
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Our physical location and headquarters.
            </p>
          </div>
          <div className="w-full h-80 lg:h-full min-h-80 bg-gray-50 dark:bg-black/50">
            <iframe
              src="https://www.google.com/maps?q=23.432055556,87.274694444&z=15&output=embed"
              className="w-full h-full border-0 filter dark:invert-[0.9] dark:hue-rotate-180"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Support and Bug Reporting Section */}
      <footer className="w-full py-10 bg-gray-50 dark:bg-[#111] border-t border-gray-100 dark:border-white/5 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
            Encountering a technical glitch or a platform issue?
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Report bugs directly to:{" "}
            <a
              href="mailto:subratachowdhury7000@gmail.com"
              className="font-bold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 hover:underline transition-all underline-offset-4"
            >
              subratachowdhury7000@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
