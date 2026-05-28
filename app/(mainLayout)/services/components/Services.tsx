// app/(mainLayout)/services/components/Services.tsx
"use client";

import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, Variants } from "framer-motion";

// Import the shared SectionHeader component
import SectionHeader from "@/app/(mainLayout)/_components/SectionHeader";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Services() {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <SectionHeader
        title="Our"
        highlight="Services"
        description="Explore our comprehensive range of diagnostic and healthcare solutions tailored for your convenience and accuracy."
      />

      <div className="mt-16 w-full z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Use masonry-like layout with specific grid columns per row to match image */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full flex flex-wrap gap-6 justify-center list-none"
        >
          {labServices.map((service, index) => {
            // Determine column span based on the row logic in the design
            // Row 1: 3 items, Row 2: 3 items, Row 3: 2 items
            let basisClass = "basis-full";

            if (index < 6) {
              // First two rows (3 items each)
              basisClass =
                "md:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]";
            } else {
              // Last row (2 items)
              basisClass =
                "md:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]";
            }

            return (
              <div key={service.title} className={`${basisClass} flex`}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  details={service.details}
                />
              </div>
            );
          })}
        </motion.ul>
      </div>
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
  details: ReactNode;
}) {
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden flex flex-col border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none bg-white dark:bg-[#111] p-8 w-full transition-all duration-300"
    >
      <div className="w-14 h-14 mb-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
        <Image src={icon} alt={title} className="w-8 h-8 object-contain" />
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors z-10 leading-tight">
        {title}
      </h3>

      <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed z-10 flex-1">
        {details}
      </div>
    </motion.li>
  );
}

const labServices = [
  {
    icon: nablcertiIcon,
    title: "NABL Certified Laboratory Testing",
    details: (
      <p>
        We provide a wide range of tests from NABL certified labs, ensuring
        high- quality standards and internationally recognized accuracy.
      </p>
    ),
  },
  {
    icon: testsIcon,
    title: "Diagnostic Tests Available",
    details: (
      <p>
        From basic blood tests like CBC to advanced diagnostics, our platform
        offers access to a full range of medical tests at your fingertips.
      </p>
    ),
  },
  {
    icon: selectLabIcon,
    title: "Freedom of Choice",
    details: (
      <p>
        Our platform empowers users by allowing them to choose from a wide
        network of trusted diagnostic laboratories that best suits their needs.
      </p>
    ),
  },
  {
    icon: ontimeIcon,
    title: "Timely Sample Collection",
    details: (
      <p>
        We ensure all sample collections are done on time by trained and
        certified phlebotomists following strict hygiene protocols.
      </p>
    ),
  },
  {
    icon: accuratelabtest,
    title: "Reliable Test Reports",
    details: (
      <p>
        Accuracy is at our core. Test results are verified by accredited labs to
        ensure the most reliable and precise diagnostic outcomes.
      </p>
    ),
  },
  {
    icon: deliveryIcon,
    title: "Free Home Collection",
    details: (
      <p>
        Enjoy the convenience of free home sample collection without any
        additional service charges. We come directly to your location.
      </p>
    ),
  },
  {
    icon: flexdateandtime,
    title: "Flexible Scheduling",
    details: (
      <p>
        We offer flexible appointment slots that fit your busy life, allowing
        you to schedule test collections at your absolute convenience.
      </p>
    ),
  },
  {
    icon: cod,
    title: "Secure Payment Options",
    details: (
      <p>
        Choose between secure online payments or Cash on Delivery (COD) for your
        convenience during the sample collection process.
      </p>
    ),
  },
];
