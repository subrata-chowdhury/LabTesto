// app/(mainLayout)/tests/[id]/componenets/MainTestPage.tsx
"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

function ExpandableSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 100) {
      setNeedsExpansion(true);
    }
  }, [children]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary dark:text-blue-400 shrink-0">{icon}</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex-1 min-w-0">
        <motion.div
          animate={{ height: expanded || !needsExpansion ? "auto" : "100px" }}
          className="relative overflow-hidden"
        >
          <div ref={contentRef} className="text-sm">
            {children}
          </div>
          {!expanded && needsExpansion && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-white dark:from-[#111] to-transparent pointer-events-none" />
          )}
        </motion.div>
        {needsExpansion && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm font-semibold text-primary hover:text-blue-600 transition-colors focus:outline-none"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ExpandableSection;
