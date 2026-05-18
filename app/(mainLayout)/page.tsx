// app/(mainLayout)/page.tsx
"use client";

import React, { ReactNode, useEffect, useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, HTMLMotionProps, useInView, Variants } from "framer-motion";

import { SearchBar } from "../components/Menubar";
import Slide from "../components/Slide";
import Footer from "../components/Footer";
import { LinkArrowIcon } from "@/assets/reactIcon/LinkArrow";

import deliveryIcon from "@/assets/HomePage/delivery.svg";
import nablcertiIcon from "@/assets/HomePage/nabl.svg";
import ontimeIcon from "@/assets/HomePage/ontime.png";
import accuratelabtest from "@/assets/HomePage/accurate.svg";
import flexdateandtime from "@/assets/HomePage/flex.png";
import cod from "@/assets/HomePage/cod.svg";

import slide1Light from "@/assets/HomePage/Slides/slide1-light.webp";
import slide1Dark from "@/assets/HomePage/Slides/slide1-dark.webp";
import slide2Light from "@/assets/HomePage/Slides/slide2-light.webp";
import slide2Dark from "@/assets/HomePage/Slides/slide2-dark.webp";
import slide3Light from "@/assets/HomePage/Slides/slide3-light.webp";
import slide3Dark from "@/assets/HomePage/Slides/slide3-dark.webp";

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

export default function Home() {
  return (
    <>
      <main id="main" className="flex-1 overflow-hidden">
        <div className="md:hidden px-4 mt-4">
          <SearchBar className="px-5 py-3 shadow-sm" active={true} />
        </div>
        <section className="mx-4 mb-8">
          <Slide
            className="lg:h-[75vh] flex flex-col justify-center rounded-xl overflow-hidden"
            slides={3}
            slideElement={({ slide }) => {
              if (slide === 1)
                return (
                  <SlideImage imgLight={slide1Light} imgDark={slide1Dark} />
                );
              if (slide === 2)
                return (
                  <SlideImage imgLight={slide2Light} imgDark={slide2Dark} />
                );
              if (slide === 3)
                return (
                  <SlideImage imgLight={slide3Light} imgDark={slide3Dark} />
                );
            }}
          />
        </section>
        <FrequentRequiredTests />
        <Promises />
        <Packages />
        <Achievements />
      </main>
      <Footer />
    </>
  );
}

function FrequentRequiredTests() {
  return (
    <section className="mx-auto flex flex-col py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
          Frequently Required Tests
        </h1>
        <div className="w-24 h-1.5 rounded-full bg-primary/40 dark:bg-primary/80 my-5"></div>
      </motion.div>

      <div className="mt-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full md:w-[95%] mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl"
        >
          <Card
            variants={itemVariants}
            label="Complete Blood Count (CBC)"
            tag="Blood"
            description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
            link={{
              label: "Book Now",
              href: "/tests/67a38ddca80c243e83d518ed",
            }}
          />
          <Card
            variants={itemVariants}
            label="Fasting Blood Sugar (FBS)"
            tag="Blood"
            description="It's a blood test that measures glucose levels after an overnight fast. It helps diagnose diabetes, prediabetes, and monitor blood sugar control in diabetic patients."
            link={{
              label: "Book Now",
              href: "/tests/67a44ab70daa8b678a7fa330",
            }}
          />
          <Card
            variants={itemVariants}
            label="Thyroid Stimulating Hormone (TSH)"
            tag="Blood"
            description="It's a blood test that measures TSH levels to evaluate thyroid function. It helps diagnose hypothyroidism, hyperthyroidism, and monitor thyroid disorders."
            link={{
              label: "Book Now",
              href: "/tests/67b9667ee39bde2a012634ca",
            }}
          />
          <Card
            variants={itemVariants}
            label="Urine Examination (Routine)"
            tag="Urine"
            description="It analyzes urine for physical, chemical, and microscopic properties. It helps detect infections, kidney diseases, diabetes, and metabolic disorders."
            link={{
              label: "Book Now",
              href: "/tests/67bd6412266fe37d1fb4e7a8",
            }}
          />
          <Card
            variants={itemVariants}
            label="Random Blood Sugar (RBS)"
            tag="Blood"
            description="It's a blood test that measures glucose levels at any time of the day, regardless of when you last ate. It helps assess blood sugar control and detect diabetes."
            link={{
              label: "Book Now",
              href: "/tests/67bd7997eb03aecfeb2f2331",
            }}
          />
          <Card
            variants={itemVariants}
            label="Bilirubin, Total"
            tag="Blood"
            description="It's a blood test that measures bilirubin levels. It helps evaluate liver function and diagnose jaundice, liver disease, and hemolytic anemia."
            link={{
              label: "Book Now",
              href: "/tests/67bc6495e0dc0a8cb0b61dc5",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function SlideImage({
  imgLight,
  imgDark,
}: {
  imgLight: StaticImageData;
  imgDark: StaticImageData;
}) {
  return (
    <>
      <Image
        className="h-75 sm:h-96 w-full mx-auto object-cover md:object-scale-down dark:hidden block"
        src={imgLight}
        alt="Slide Banner"
        priority
      />
      <Image
        className="h-75 sm:h-96 w-full mx-auto object-cover md:object-scale-down hidden dark:block"
        src={imgDark}
        alt="Slide Banner"
        priority
      />
    </>
  );
}

export function Promises({ heading }: { heading?: string }) {
  return (
    <section className="mx-auto md:w-[95%] flex flex-col py-16 md:py-24 bg-gray-50/50 dark:bg-white/2 rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto px-4">
          {heading ? heading : "Our Promise"}
        </h1>
        <div className="w-24 h-1.5 rounded-full bg-primary/40 dark:bg-primary/80 my-5"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-6xl mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 px-4"
      >
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[#f59942]">NABL Certified</span>
              <br /> Lab Test
            </span>
          }
          icon={nablcertiIcon}
          bgColor="rgba(245, 182, 66, 0.2)"
        />
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[rgba(245,96,66,1)]">
                On Time
              </span>{" "}
              Sample Collection by Expert
            </span>
          }
          icon={ontimeIcon}
          bgColor="rgba(245, 96, 66, 0.15)"
        />
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[rgba(3,24,255,0.7)]">
                Accurate Test
              </span>
              <br /> Report
            </span>
          }
          icon={accuratelabtest}
          bgColor="rgba(3, 24, 255, 0.15)"
        />
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[rgba(8,145,178,0.8)]">
                Flexibility
              </span>{" "}
              to Schedule Test
            </span>
          }
          icon={flexdateandtime}
          bgColor="rgba(8, 145, 178, 0.15)"
        />
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[rgba(245,96,66,1)]">Free</span>{" "}
              Home Collection
            </span>
          }
          icon={deliveryIcon}
          bgColor="rgba(245, 96, 66, 0.15)"
        />
        <CardType2
          variants={itemVariants}
          label={
            <span>
              <span className="font-bold text-[rgba(15,176,4,1)]">
                Cash On Delivery
              </span>
            </span>
          }
          icon={cod}
          bgColor="rgba(15, 176, 4, 0.15)"
        />
      </motion.div>
    </section>
  );
}

export function Packages() {
  return (
    <section className="mx-auto md:w-[95%] flex flex-col py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto px-4">
          Our Popular Packages
        </h1>
        <div className="w-24 h-1.5 rounded-full bg-primary/40 dark:bg-primary/80 my-5"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto w-full"
      >
        <CardType3
          variants={itemVariants}
          label="Full Body Test"
          link="/tests/67fa8db1144234ebc4c6fe06"
          icon={fullBodyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Premium Full Body Test"
          link="/tests/67fa8ded144234ebc4c6fe14"
          icon={premiumFullBodyTestIcon}
        />
        <CardType3
          variants={itemVariants}
          label="Full Gastroenterology Test"
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

export function Achievements() {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 overflow-hidden bg-white dark:bg-[#111] border-y border-gray-100 dark:border-white/5">
      {/* Decorative Circles matching the UI */}
      <div className="absolute -top-40 -left-40 w-125 h-125 border-50 border-orange-50 dark:border-orange-500/5 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-125 h-125 border-50 border-orange-50 dark:border-orange-500/5 rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-col items-center px-4"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary dark:text-white leading-tight">
          Building real-world health impact <br className="hidden md:block" />
          with reliable <span className="text-orange-500">Labs and Tests</span>
        </h1>
        <p className="mt-6 text-gray-500 dark:text-gray-400 text-center max-w-2xl text-sm sm:text-base">
          We design, build, and scale high-performance health diagnostics—from
          routine checkups to specialized pathology profiles—focused on accurate
          outcomes.
        </p>
      </motion.div>

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
          className="flex flex-col justify-center items-center md:items-start md:border-r border-gray-200 dark:border-white/10 md:pr-16 lg:pr-24"
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
          <LabLogo name="Dr. Lal PathLabs" />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Thyrocare" />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="SRL Diagnostics" />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Metropolis" />
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden md:block"></div>
          <LabLogo name="Apollo Diagnostics" />
        </div>
      </motion.div>
    </section>
  );
}

interface CardProps extends HTMLMotionProps<"div"> {
  label: string;
  tag?: string;
  description?: string;
  link?: { label: string; href: string };
  icon?: StaticImageData;
}

function Card({
  label,
  tag,
  description,
  link,
  icon,
  className = "",
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group flex flex-col p-6 bg-white dark:bg-[#111] rounded-2xl shadow-lg shadow-black/5 dark:shadow-white/5 border border-gray-100 dark:border-white/10 min-w-52 h-full transition-shadow hover:shadow-xl ${className}`}
      {...props}
    >
      <h1 className="text-xl font-bold mb-3 text-primary dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {label}
      </h1>
      {tag && (
        <p className="text-xs font-semibold text-white mb-4 bg-primary dark:bg-white/20 px-3 py-1 w-fit rounded-full uppercase tracking-wider">
          {tag}
        </p>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 leading-relaxed">
          {description}
        </p>
      )}
      {icon && (
        <div className="mb-4 flex justify-center">
          <Image
            src={icon}
            alt={label}
            style={{ width: 120, height: "auto" }}
          />
        </div>
      )}
      <Link
        href={link?.href || "#"}
        className="border-t border-gray-100 dark:border-white/10 pt-4 text-primary dark:text-gray-200 text-sm font-semibold flex items-center justify-between hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-auto"
      >
        {link?.label}
        <motion.span
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LinkArrowIcon size={14} />
        </motion.span>
      </Link>
    </motion.div>
  );
}

interface CardType2Props extends HTMLMotionProps<"div"> {
  label: ReactNode;
  subText?: string;
  description?: string;
  icon?: StaticImageData;
  bgColor?: string;
}

function CardType2({
  label,
  subText,
  description,
  icon,
  bgColor,
  className = "",
  ...props
}: CardType2Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-xl p-2 sm:p-4 flex flex-col items-center group cursor-default ${className}`}
      {...props}
    >
      <div
        style={{ backgroundColor: bgColor }}
        className="w-20 h-20 sm:w-24 sm:h-24 p-5 mx-auto rounded-3xl flex items-center justify-center transition-transform group-hover:rotate-3 shadow-sm"
      >
        {icon && (
          <Image
            src={icon}
            alt=""
            className="mx-auto drop-shadow-sm"
            width={80}
            height={80}
          />
        )}
      </div>
      <h1 className="sm:text-lg font-medium text-center mt-4 leading-snug">
        {label}
      </h1>
      {subText && (
        <p className="text-sm text-primary text-opacity-60 mt-1 text-center">
          {subText}
        </p>
      )}
      {description && (
        <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </motion.div>
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
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-[#111] rounded-2xl px-6 py-8 border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 hover:shadow-xl transition-all ${className}`}
      {...props}
    >
      <div className="bg-primary dark:bg-white/10 -z-10 transition-all duration-500 w-0 h-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full group-hover:w-[150%] group-hover:h-100 absolute"></div>
      <figure className="mb-4 z-10">
        {icon && (
          <Image
            src={icon}
            alt={label}
            className="filter brightness-0 opacity-80 dark:opacity-100 dark:invert group-hover:invert transition-all duration-300 group-hover:scale-110"
            width={72}
            height={72}
          />
        )}
      </figure>
      <span className="text-primary font-semibold dark:text-white text-center group-hover:text-white transition-all duration-300 z-10">
        {label}
      </span>
    </motion.a>
  );
}

// Extracted logic for animated numbers
function AnimatedNumber({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [realValue, setRealValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let currentValue = 0;

      const interval = setInterval(() => {
        if (currentValue >= value) {
          clearInterval(interval);
          setRealValue(value);
        } else {
          currentValue += increment;
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
function LabLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
      <span className="text-sm sm:text-base lg:text-lg font-extrabold tracking-widest text-primary dark:text-gray-200 uppercase text-center">
        {name}
      </span>
    </div>
  );
}
