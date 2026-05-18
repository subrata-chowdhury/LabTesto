// components/Model.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CrossIcon } from "@/assets/reactIcon/Cross";

interface ModelProps {
  children?: React.ReactNode;
  onClose: () => void;
  className?: string;
  heading?: string;
}

function Model({
  children,
  onClose = () => {},
  className = "",
  heading = "",
}: ModelProps) {
  // Prevent scrolling on the background page when the modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`bg-white dark:bg-[#111] w-full sm:w-auto max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Mobile drag handle indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {heading}
          </h1>
          <button
            className="p-2 ml-3 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default Model;
