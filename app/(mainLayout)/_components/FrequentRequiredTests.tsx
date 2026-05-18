"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { LinkArrowIcon } from "@/assets/reactIcon/LinkArrow";

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

export default function FrequentRequiredTests() {
  return (
    <section className="relative mx-auto flex flex-col py-20 md:py-32 overflow-hidden border-t border-gray-100 dark:border-white/5">
      <SectionHeader
        title="Frequently Required"
        highlight="Tests"
        description="Comprehensive diagnostic profiles essential for routine health monitoring and early disease detection."
      />

      <div className="mt-8 md:mt-16 w-full z-10">
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
            description="Measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. Helps diagnose infections, anemia, and other blood disorders."
            link={{
              label: "Book Now",
              href: "/tests/67a38ddca80c243e83d518ed",
            }}
          />
          <Card
            variants={itemVariants}
            label="Fasting Blood Sugar (FBS)"
            tag="Blood"
            description="A blood test that measures glucose levels after an overnight fast. Helps diagnose diabetes, prediabetes, and monitor blood sugar control."
            link={{
              label: "Book Now",
              href: "/tests/67a44ab70daa8b678a7fa330",
            }}
          />
          <Card
            variants={itemVariants}
            label="Thyroid Stimulating Hormone (TSH)"
            tag="Blood"
            description="A blood test that measures TSH levels to evaluate thyroid function. Helps diagnose hypothyroidism, hyperthyroidism, and monitor thyroid disorders."
            link={{
              label: "Book Now",
              href: "/tests/67b9667ee39bde2a012634ca",
            }}
          />
          <Card
            variants={itemVariants}
            label="Urine Examination (Routine)"
            tag="Urine"
            description="Analyzes urine for physical, chemical, and microscopic properties. Helps detect infections, kidney diseases, diabetes, and metabolic disorders."
            link={{
              label: "Book Now",
              href: "/tests/67bd6412266fe37d1fb4e7a8",
            }}
          />
          <Card
            variants={itemVariants}
            label="Random Blood Sugar (RBS)"
            tag="Blood"
            description="A blood test that measures glucose levels at any time of the day, regardless of when you last ate. Helps assess blood sugar control."
            link={{
              label: "Book Now",
              href: "/tests/67bd7997eb03aecfeb2f2331",
            }}
          />
          <Card
            variants={itemVariants}
            label="Bilirubin, Total"
            tag="Blood"
            description="A blood test that measures bilirubin levels. Helps evaluate liver function and diagnose jaundice, liver disease, and hemolytic anemia."
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group flex flex-col p-8 bg-white dark:bg-[#111] rounded-3xl shadow-xl shadow-black/5 dark:shadow-white/2 border border-gray-100 dark:border-white/5 min-w-52 h-full transition-all hover:shadow-2xl hover:border-orange-500/30 ${className}`}
      {...props}
    >
      <h1 className="text-xl font-bold mb-4 text-primary dark:text-white group-hover:text-orange-500 transition-colors">
        {label}
      </h1>
      {tag && (
        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-5 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-4 py-1.5 w-fit rounded-full uppercase tracking-widest">
          {tag} Sample
        </p>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex-1 leading-relaxed">
          {description}
        </p>
      )}
      {icon && (
        <div className="mb-6 flex justify-center">
          <Image
            src={icon}
            alt={label}
            style={{ width: 120, height: "auto" }}
          />
        </div>
      )}
      <Link
        href={link?.href || "#"}
        className="border-t border-gray-100 dark:border-white/10 pt-2 text-primary dark:text-gray-200 text-sm font-bold flex items-center justify-between hover:text-orange-500 transition-colors mt-auto group/link"
      >
        {link?.label}
        <motion.span
          className="bg-gray-50 dark:bg-white/5 p-2 rounded-full group-hover/link:bg-orange-500 group-hover/link:text-white transition-colors"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LinkArrowIcon size={14} />
        </motion.span>
      </Link>
    </motion.div>
  );
}
