"use client";
import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import SectionHeader from "./SectionHeader";

import deliveryIcon from "@/assets/HomePage/delivery.svg";
import nablcertiIcon from "@/assets/HomePage/nabl.svg";
import ontimeIcon from "@/assets/HomePage/ontime.png";
import accuratelabtest from "@/assets/HomePage/accurate.svg";
import flexdateandtime from "@/assets/HomePage/flex.png";
import cod from "@/assets/HomePage/cod.svg";

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

export function Promises({ heading }: { heading?: string }) {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 bg-gray-50 dark:bg-[#111] border-y border-gray-100 dark:border-white/5">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-orange-50/50 to-transparent dark:from-orange-500/5 pointer-events-none"></div>

      <SectionHeader
        title={heading ? heading : "Our core"}
        highlight="Promises"
        description="We are committed to delivering precise, timely, and convenient diagnostic services directly to your doorstep."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="z-10 w-full max-w-6xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 px-4"
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
          bgColor="rgba(245, 182, 66, 0.1)"
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
          bgColor="rgba(245, 96, 66, 0.08)"
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
          bgColor="rgba(3, 24, 255, 0.08)"
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
          bgColor="rgba(8, 145, 178, 0.08)"
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
          bgColor="rgba(245, 96, 66, 0.08)"
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
          bgColor="rgba(15, 176, 4, 0.08)"
        />
      </motion.div>
    </section>
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
      whileHover={{ y: -5 }}
      className={`rounded-2xl p-4 sm:p-6 flex flex-col items-center group cursor-default transition-all ${className}`}
      {...props}
    >
      <div
        style={{ backgroundColor: bgColor }}
        className="w-20 h-20 sm:w-24 sm:h-24 p-5 mx-auto rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-black/5 dark:border-white/5"
      >
        {icon && (
          <Image
            src={icon}
            alt=""
            className="mx-auto drop-shadow-sm transition-transform duration-500 group-hover:rotate-6"
            width={80}
            height={80}
          />
        )}
      </div>
      <h1 className="sm:text-lg font-semibold text-center mt-6 text-primary dark:text-gray-200 leading-snug">
        {label}
      </h1>
      {subText && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
          {subText}
        </p>
      )}
      {description && (
        <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}
