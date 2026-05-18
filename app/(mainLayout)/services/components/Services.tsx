// app/(mainLayout)/services/components/Services.tsx
"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion, Variants } from "framer-motion";

import deliveryIcon from "@/assets/HomePage/delivery.svg";
import nablcertiIcon from "@/assets/HomePage/nabl.svg";
import ontimeIcon from "@/assets/HomePage/ontime.png";
import accuratelabtest from "@/assets/HomePage/accurate.svg";
import flexdateandtime from "@/assets/HomePage/flex.png";
import cod from "@/assets/HomePage/cod.svg";
import selectLabIcon from "@/assets/services/labs.png";
import testsIcon from "@/assets/services/tests.png";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Services() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Our Services
        </h1>
        <div className="w-24 h-1.5 rounded-full bg-primary/40 dark:bg-primary/80 my-5"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {labServices.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            details={service.details}
          />
        ))}
      </motion.div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  details,
}: {
  icon: StaticImageData;
  title: string;
  details: React.JSX.Element;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-white/5 bg-white dark:bg-[#111] px-6 py-8 transition-all duration-300 h-full"
    >
      <div className="bg-primary/5 dark:bg-white/5 transition-all duration-500 w-0 h-0 top-0 left-0 rounded-full group-hover:w-[180%] group-hover:h-150 absolute group-hover:-top-[25%] group-hover:-left-[25%] -z-10"></div>

      <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
        <Image
          src={icon}
          alt={title}
          className="w-8 h-8 opacity-80 dark:opacity-100"
        />
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors z-10">
        {title}
      </h3>

      <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed z-10 flex-1">
        {details}
      </div>
    </motion.div>
  );
}

const labServices = [
  {
    icon: nablcertiIcon,
    title: "NABL Certified Laboratory Testing",
    details: (
      <p>
        We provide a wide range of tests from NABL{" "}
        <b className="font-semibold text-gray-800 dark:text-gray-200">
          (National Accreditation Board for Testing and Calibration
          Laboratories)
        </b>{" "}
        certified labs, ensuring high-quality standards and reliable results.
      </p>
    ),
  },
  {
    icon: testsIcon,
    title: "All Types of Diagnostic Tests Available",
    details: (
      <p>
        From basic blood tests like CBC to advanced diagnostics, our platform
        offers access to a full range of medical tests—easy to find and book
        without any hassle.
      </p>
    ),
  },
  {
    icon: selectLabIcon,
    title: "Freedom to Choose Your Preferred Lab",
    details: (
      <p>
        Our platform empowers users by allowing them to choose from a wide
        network of trusted diagnostic laboratories. You have full control to
        select the lab that best suits your preferences, location, or budget.
      </p>
    ),
  },
  {
    icon: ontimeIcon,
    title: "Timely Sample Collection by Experts",
    details: (
      <p>
        We ensure all sample collections are done on time by trained and
        certified phlebotomists. Our professionals follow strict hygiene and
        safety protocols to provide a seamless experience.
      </p>
    ),
  },
  {
    icon: accuratelabtest,
    title: "Reliable and Accurate Test Reports",
    details: (
      <p>
        Accuracy is at the core of our service. Test results are verified by
        accredited labs to ensure reliable, precise diagnostics. Your health
        information is handled with the highest standards.
      </p>
    ),
  },
  {
    icon: flexdateandtime,
    title: "Flexible Test Scheduling Options",
    details: (
      <p>
        We understand that your time is valuable. That’s why we offer flexible
        appointment slots, allowing you to schedule test collections at your
        convenience, whether it’s early morning, evening, or weekend.
      </p>
    ),
  },
  {
    icon: deliveryIcon,
    title: "Free Home Sample Collection Service",
    details: (
      <p>
        Enjoy the convenience of free home sample collection without any
        additional service charges. Our healthcare professionals come directly
        to your location, eliminating the need to travel.
      </p>
    ),
  },
  {
    icon: cod,
    title: "Pay with Cash on Delivery Option",
    details: (
      <p>
        For added convenience, we offer a Cash on Delivery (COD) payment method.
        You can pay for your selected tests in cash at the time of sample
        collection—secure, simple, and hassle-free.
      </p>
    ),
  },
];
