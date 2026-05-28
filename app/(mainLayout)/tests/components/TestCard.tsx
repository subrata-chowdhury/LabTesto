// app/(mainLayout)/tests/components/TestCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { FiClock, FiMapPin, FiArrowRight, FiBookmark } from "react-icons/fi";
import { FaFlask, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import fetcher from "@/lib/fetcher";

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
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);

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

  const getSampleTypeStyle = (type: string) => {
    const lowerType = type?.toLowerCase() || "";
    if (lowerType.includes("blood"))
      return "bg-red-50 text-red-400 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30";
    if (lowerType.includes("urine"))
      return "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30";
    return "bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart) return;

    setAddingToCart(true);
    try {
      // Create a payload according to your standard cart implementation
      const payload = {
        testId: test._id,
        quantity: 1,
      };

      const res = await fetcher.post("/cart", payload);

      if (res.status === 200) {
        toast.success("Test added to cart successfully!");
        // Dispatch global event for UI components listening for cart updates
        window.dispatchEvent(new Event("cartUpdated"));
      } else if (res.status === 401) {
        toast.error("Please login to add test to cart.");
        router.push(`/login?redirect=/tests/${test._id}`);
      } else {
        toast.error("Failed to add test to cart.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative flex flex-col h-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Floating Action Button for Cart (Placed outside Link to avoid nesting interactive elements) */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="absolute top-5 right-5 z-10 p-1 text-slate-400 hover:text-[#3987ba] dark:hover:text-blue-400 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3987ba]/50 rounded"
        aria-label="Add to cart"
      >
        {addingToCart ? (
          <FaSpinner className="animate-spin w-5 h-5" />
        ) : (
          <FiBookmark className="w-5 h-5" strokeWidth={2.5} />
        )}
      </button>

      <Link
        href={`/tests/${test._id}`}
        className="flex flex-col grow outline-none focus-visible:ring-2 focus-visible:ring-[#A64A22]/50 rounded-2xl"
      >
        <div className="p-5 sm:p-6 pb-0 grow flex flex-col">
          {/* Header Badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 border rounded-full text-[10px] font-bold tracking-wider uppercase ${getSampleTypeStyle(
                test.sampleType,
              )}`}
            >
              {test.sampleType || "Unknown"} Sample
            </span>
          </div>

          {/* Title & Excerpt */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2 pr-6">
            {test.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
            {test.overview ||
              test.description ||
              "Evaluates overall health and detects a wide range of disorders."}
          </p>

          {/* Details List */}
          <div className="space-y-3 mb-6 mt-auto">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiClock
                className="w-4.5 h-4.5 mr-2.5 text-gray-400 shrink-0"
                strokeWidth={2}
              />
              <span className="truncate">
                Fasting: {test.fastingRequired || "Not Required"}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FaFlask className="w-4.5 h-4.5 mr-2.5 text-gray-400 shrink-0" />
              <span className="truncate">
                Tube: {test.tubeType || "Standard"}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin
                className="w-4.5 h-4.5 mr-2.5 text-gray-400 shrink-0"
                strokeWidth={2}
              />
              <span className="truncate">Available in {labCount} Labs</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between group/footer">
          <span className="text-3xl font-bold text-orange-500 dark:text-orange-500">
            {avgPrice > 0 ? `₹${avgPrice}` : "N/A"}
          </span>

          <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/footer:text-[#A64A22] dark:group-hover/footer:text-orange-400 transition-colors">
            View Details
            <FiArrowRight className="ml-1.5 w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
