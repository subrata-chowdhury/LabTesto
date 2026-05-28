// app/(mainLayout)/tests/[id]/componenets/MainTestPage.tsx
"use client";

import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import fetcher from "@/lib/fetcher";
import { CrossIcon } from "@/assets/reactIcon/Cross";
import { FiMapPin } from "react-icons/fi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { hasValidContent } from "./DetailsSection";

type Lab = {
  _id: string;
  name: string;
  image?: string;
  description: string;
  location?: {
    address: {
      pin: string;
      city: string;
      district: string;
      other: string;
    };
  };
  rating: number;
};

const LabDetailsSidePopup = memo(
  ({ labId, onClose }: { labId: string; onClose: () => void }) => {
    const [lab, setLab] = useState<Lab>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchLabDetails() {
        setLoading(true);
        const res = await fetcher.get<Lab>(`/labs/${labId}`);
        if (res.status === 200 && res.body) setLab(res.body);
        setLoading(false);
      }
      fetchLabDetails();
    }, [labId]);

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-[90vw] sm:w-125 max-w-full h-full bg-white dark:bg-[#0a0a0a] shadow-2xl flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <CrossIcon />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative h-64 w-full bg-primary/10 dark:bg-white/5">
              {lab?.image && (
                <Image
                  src={lab.image}
                  alt="Lab Logo"
                  fill
                  className="object-cover opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                {loading ? (
                  <div className="h-8 w-2/3 bg-white/20 rounded animate-pulse mb-3" />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{lab?.name}</h2>
                )}
                {loading ? (
                  <div className="h-4 w-1/2 bg-white/20 rounded animate-pulse" />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <FiMapPin size={16} />
                    {lab?.location?.address?.city},{" "}
                    {lab?.location?.address?.district}
                  </div>
                )}
                {!loading && lab && (
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        {i < Math.floor(lab.rating) ? (
                          <FaStar size={16} />
                        ) : (
                          <FaRegStar size={16} />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                About this Lab
              </h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: hasValidContent(lab?.description)
                      ? (lab?.description || "").replace(/<\/?p>/g, "<br/>")
                      : "No description provided.",
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);
LabDetailsSidePopup.displayName = "LabDetailsSidePopup";

export default LabDetailsSidePopup;
