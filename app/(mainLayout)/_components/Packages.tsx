"use client";
import Image, { StaticImageData } from "next/image";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import SectionHeader from "./SectionHeader";

import fullBodyTestIcon from "@/assets/HomePage/packages/full-body-test.png";
import premiumFullBodyTestIcon from "@/assets/HomePage/packages/premium-full-body-test.webp";
import fullGastroenterologyTestIcon from "@/assets/HomePage/packages/full-gastroenterology-test.png";
import fullUrologyTestIcon from "@/assets/HomePage/packages/full-urology-test.png";
import fullNeurologyTestIcon from "@/assets/HomePage/packages/full-neurology-test.png";

// Shared Animation Variants for staggered lists
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Packages() {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-gray-50 dark:border-white/[0.02] rounded-full pointer-events-none"></div>

      <SectionHeader
        title="Our Popular"
        highlight="Packages"
        description="Curated health packages designed to give you a complete overview of your well-being at competitive prices."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="z-10 mt-16 px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-7xl mx-auto w-full"
      >
        <CardType3
          variants={itemVariants}
          label="Full Body Test"
          link="/tests/67fa8db1144234ebc4c6fe06"
          icon={fullBodyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Premium Full Body"
          link="/tests/67fa8ded144234ebc4c6fe14"
          icon={premiumFullBodyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Full Gastroenterology"
          link="/tests/67fa8e33144234ebc4c6fe1d"
          icon={fullGastroenterologyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Full Urology Test"
          link="/tests/67fa8e5b144234ebc4c6fe28"
          icon={fullUrologyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Full Neurology Test"
          link="/tests/67fa8e80144234ebc4c6fe31"
          icon={fullNeurologyTestIcon}
        />
      </motion.div>
    </section>
  );
}

interface CardType3Props extends HTMLMotionProps<"a"> {
  label: string;
  link?: string;
  icon?: StaticImageData;
}

function CardType3({
  label,
  link = "#",
  icon,
  className = "",
  ...props
}: CardType3Props) {
  return (
    <motion.a
      href={link}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-[#111] rounded-3xl px-6 py-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-white/[0.02] hover:shadow-2xl transition-all ${className}`}
      {...props}
    >
      <div className="bg-orange-500 dark:bg-orange-600 -z-10 transition-all duration-500 w-0 h-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full group-hover:w-[200%] group-hover:h-120 absolute"></div>
      <figure className="mb-6 z-10">
        {icon && (
          <Image
            src={icon}
            alt={label}
            className="filter brightness-0 opacity-80 dark:opacity-100 dark:invert group-hover:invert transition-all duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:opacity-100"
            width={72}
            height={72}
          />
        )}
      </figure>
      <span className="text-primary text-lg font-bold dark:text-white text-center group-hover:text-white transition-all duration-300 z-10">
        {label}
      </span>
    </motion.a>
  );
}
