"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

// Reusable Section Header to maintain the "Achievements" design language
function SectionHeader({
  title,
  highlight,
  description,
}: {
  title: ReactNode;
  highlight?: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.6 }}
      className="z-10 flex flex-col items-center px-4"
    >
      <h1 className="text-2xl sm:text-3xl max-w-5xl md:text-4xl font-bold text-center text-primary dark:text-white leading-tight">
        {title}{" "}
        {highlight && <span className="text-orange-500">{highlight}</span>}
      </h1>
      {description && (
        <p className="mt-3 md:mt-5 text-gray-500 dark:text-gray-400 text-center max-w-2xl text-xs sm:text-sm">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeader;
