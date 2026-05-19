// app/(mainLayout)/_components/Achievements.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import SectionHeader from "./SectionHeader";

import apolloLogo from "@/assets/HomePage/achievements/apollo-diagnostics.png";
import drLalLogo from "@/assets/HomePage/achievements/dr-lal.png";
import metropolisLogo from "@/assets/HomePage/achievements/metropolis.png";
import srlLogo from "@/assets/HomePage/achievements/srl-diagnostics.png";
import thyrocareLogo from "@/assets/HomePage/achievements/thyrocare.png";
import Image, { StaticImageData } from "next/image";

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

export function Achievements() {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 overflow-hidden bg-white dark:bg-[#111]">
      {/* Decorative Circles matching the UI */}
      <div className="absolute -top-40 -left-40 w-125 h-125 border-50 border-orange-50 dark:border-orange-500/5 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-125 h-125 border-50 border-orange-50 dark:border-orange-500/5 rounded-full pointer-events-none"></div>

      <SectionHeader
        title="Building real-world health impact with reliable"
        highlight="Labs and Tests"
        description="We design, build, and scale high-performance health diagnostics—from routine checkups to specialized pathology profiles—focused on accurate outcomes."
      />

      {/* Stats Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="z-10 mt-20 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 px-6"
      >
        {/* Left Side Big Stat */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center items-center md:ml-auto md:items-start md:border-r border-gray-200 dark:border-white/10 md:pr-16 lg:pr-24"
        >
          <div className="flex items-baseline">
            <AnimatedNumber
              value={8000}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-orange-500 tracking-tighter"
            />
            <span className="text-5xl sm:text-6xl font-black text-orange-500">
              +
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-white mt-2">
            Tests Delivered
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center md:text-left text-sm sm:text-base">
            From basic profiles to enterprise systems
          </p>
        </motion.div>

        {/* Right Side Smaller Stats */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center items-center md:items-start gap-12 md:pl-16 lg:pl-24"
        >
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={100}
                className="text-4xl sm:text-5xl font-black text-orange-500 tracking-tighter"
              />
              <span className="text-3xl sm:text-4xl font-black text-orange-500">
                +
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-white ml-2">
                Lab Partners
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-center md:text-left text-sm sm:text-base">
              NABL certified, top-rated pathology engines
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={97}
                className="text-4xl sm:text-5xl font-black text-orange-500 tracking-tighter"
              />
              <span className="text-3xl sm:text-4xl font-black text-orange-500">
                %
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-white ml-2">
                Happy Customers
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-center md:text-left text-sm sm:text-base">
              Across routine, specialized, and preventive care
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Logos Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="z-10 mt-24 pt-10 border-t border-gray-200 dark:border-white/10 max-w-6xl mx-auto w-full px-6"
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-8 md:gap-4 lg:gap-8">
          <LabLogo name="Dr. Lal PathLabs" img={drLalLogo} />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Thyrocare" img={thyrocareLogo} />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="SRL Diagnostics" img={srlLogo} />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Metropolis" img={metropolisLogo} />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Apollo Diagnostics" img={apolloLogo} />
        </div>
      </motion.div>
    </section>
  );
}

// SEO-Optimized Animated Number Logic
function AnimatedNumber({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  // Initialize with 'value' so the server renders the final number for SEO crawlers
  const [realValue, setRealValue] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;

      // Start counting from 0 on the client side when the element is in view
      let currentValue = 0;
      setRealValue(0);

      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= value) {
          clearInterval(interval);
          setRealValue(value);
        } else {
          setRealValue(currentValue);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [value, isInView]);

  return (
    <span ref={ref} className={className}>
      {Math.floor(realValue)}
    </span>
  );
}

// Extracted UI wrapper for standard text logos
function LabLogo({ name, img }: { name: string; img: StaticImageData }) {
  return (
    <div className="flex items-center justify-center opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
      <Image src={img} alt={name} width={140} height={50} />
    </div>
  );
}
