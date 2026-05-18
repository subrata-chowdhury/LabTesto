// app/(mainLayout)/tests/components/TestCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FiClock, FiTarget, FiActivity, FiArrowRight } from "react-icons/fi";

// Re-exporting types to be used across the tests module
export type LabDetail = {
  lab: string;
  name: string;
  image: string;
  price: number;
  offer: number;
  expenses: number;
  resultTime: string;
  packages: unknown[];
};

export type Test = {
  _id: string;
  name: string;
  otherTerms?: string[];
  sampleType: string;
  tubeType: string;
  description: string;
  fastingRequired: string;
  overview: string;
  testResultInterpretation: string;
  riskAssesment: string;
  labsDetails?: Record<string, LabDetail>;
};

interface TestCardProps {
  test: Test;
  variants?: Variants;
}

export default function TestCard({ test, variants }: TestCardProps) {
  // Calculate average price and total labs
  const labs = test.labsDetails ? Object.values(test.labsDetails) : [];
  const labCount = labs.length;
  const avgPrice =
    labCount > 0
      ? Math.round(
          labs.reduce((sum, lab) => sum + (lab.offer || lab.price || 0), 0) /
            labCount,
        )
      : 0;

  return (
    <Link
      href={`/tests/${test._id}`}
      className="group outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-2xl block h-full"
    >
      <motion.div
        variants={variants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="flex flex-col h-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 p-5 sm:p-6 relative overflow-hidden"
      >
        {/* Decorative subtle gradient on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500 rounded-bl-full pointer-events-none z-0"></div>

        {/* Header: Title & Sample Type */}
        <div className="relative z-10 mb-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-lg font-extrabold text-primary dark:text-white line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">
              {test.name}
            </h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 rounded-full text-[11px] font-bold tracking-wider uppercase">
            {test.sampleType} Sample
          </span>
        </div>

        {/* Details Box */}
        <div className="relative z-10 bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6 space-y-3 flex-1 border border-gray-100 dark:border-white/5">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 shrink-0 rounded flex items-center justify-center bg-white dark:bg-[#222] mr-3 shadow-sm border border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500">
              <FiClock size={14} />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-300 mr-2">
              Fasting:
            </span>
            <span className="truncate">
              {test.fastingRequired || "Not Required"}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 shrink-0 rounded flex items-center justify-center bg-white dark:bg-[#222] mr-3 shadow-sm border border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500">
              <FiTarget size={14} />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-300 mr-2">
              Tube:
            </span>
            <span className="truncate">{test.tubeType || "N/A"}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 shrink-0 rounded flex items-center justify-center bg-white dark:bg-[#222] mr-3 shadow-sm border border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500">
              <FiActivity size={14} />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-300 mr-2">
              Labs:
            </span>
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {labCount} {labCount === 1 ? "Available" : "Available"}
            </span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="relative z-10 mt-auto flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">
              Avg. Price
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-500 leading-none">
              {avgPrice > 0 ? `₹${avgPrice}` : "N/A"}
            </span>
          </div>

          <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
            View Details
            <span className="ml-1 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
              <FiArrowRight size={12} strokeWidth={3} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
