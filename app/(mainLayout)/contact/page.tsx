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

function ContactPage() {
  return (
    <>
      <div className="flex flex-col relative items-center pb-12 mb-6 bg-primary/80">
        <div className="text-4xl md:text-6xl text-white text-center font-bold mt-18">
          We'd Love to Hear From You
        </div>
        <div className="text-white text-center text-lg mt-4 mb-2 mx-4">
          Whether you have questions or you would just like to say hello,
          contact us.
        </div>
        <svg
          className="w-full h-20 absolute bottom-0 translate-y-1/2 text-white dark:text-white/0"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current"
            d="M0,0 L50,10 L100,5 L150,15 L200,8 L250,12 L300,5 L350,15 L400,10 L450,5 L500,12 L550,8 L600,15 L650,10 L700,5 L750,12 L800,8 L850,15 L900,5 L950,12 L1000,8 L1050,15 L1100,10 L1150,5 L1200,12 L1200,40 L0,40 Z"
          />
        </svg>
      </div>

      <ContactDetails />

      <div className="sm:w-fit mx-auto flex flex-col lg:flex-row gap-4 mb-8">
        <MainForm />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Find Us
          </h2>
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-6">
            <iframe
              src="https://www.google.com/maps?q=23.432055556,87.274694444&z=15&output=embed"
              width="400"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Support and Bug Reporting Section */}
      <footer className="w-full py-8 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Encountering a technical glitch or a platform issue?
          </p>
          <p className="mt-2 font-medium text-primary dark:text-blue-400">
            Report bugs to:{" "}
            <a
              href="mailto:subratachowdhury7000@gmail.com"
              className="hover:underline transition-all underline-offset-4"
            >
              subratachowdhury7000@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default ContactPage;
