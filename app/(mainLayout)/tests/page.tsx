// app/(mainLayout)/tests/page.tsx
"use client";

import fetcher from "@/lib/fetcher";
import React, { useCallback, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import debounce from "@/lib/debouncer";
import TestCard, { Test } from "./components/TestCard";
import SkeletonCard from "./components/SkeletonCard";

type SampleTypeOption =
  | "All"
  | "Blood"
  | "Urine"
  | "Semen"
  | "Stool"
  | "Sputum"
  | "Other"
  | "Other Body Fluid";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [filter, setFilter] = useState<{
    name: string;
    sampleType: SampleTypeOption;
  }>({
    name: "",
    sampleType: "All",
  });
  const [limit, setLimit] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const onSearch = useCallback(
    debounce(async function (
      searchFilter: { name: string; sampleType?: SampleTypeOption },
      searchLimit: number,
      isLoadMore: boolean = false,
    ) {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const apiFilter = { ...searchFilter };
      if (apiFilter.sampleType === "All") {
        delete apiFilter.sampleType;
      }
      if (apiFilter.sampleType === "Other") {
        apiFilter.sampleType = "Other Body Fluid";
      }

      try {
        const res = await fetcher.get<{
          tests: Test[];
          pagination: {
            totalTests: number;
            currentPage: number;
            pageSize: number;
            totalPages: number;
          };
        }>(
          `/tests?filter=${JSON.stringify(apiFilter)}&limit=${
            searchLimit || 8
          }&page=1`,
        );

        if (res.status === 200 && res.body) {
          setTests(res.body.tests);
          setTotalPages(res.body.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    onSearch({ name: "", sampleType: "All" }, 8, false);
  }, [onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFilter({ ...filter, name: newName });
    onSearch({ name: newName, sampleType: filter.sampleType }, limit, false);
  };

  const handleFilterClick = (sampleType: SampleTypeOption) => {
    setFilter({ ...filter, sampleType });
    onSearch({ name: filter.name, sampleType }, limit, false);
  };

  const handleLoadMore = () => {
    const newLimit = limit + 8;
    setLimit(newLimit);
    onSearch(filter, newLimit, true);
  };

  const filterOptions: SampleTypeOption[] = [
    "All",
    "Blood",
    "Urine",
    "Semen",
    "Stool",
    "Sputum",
    "Other",
  ];

  return (
    <main
      id="main"
      className="relative px-4 py-12 md:py-16 min-h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-100 h-100 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary dark:text-white mb-4 leading-tight"
            >
              Explore <span className="text-orange-500">Lab Tests</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 max-w-xl text-base leading-relaxed"
            >
              Browse our comprehensive directory of diagnostic tests. Filter by
              sample type or search for specific requirements to find exactly
              what you need.
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full lg:max-w-md shrink-0"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              value={filter.name}
              placeholder="Search specific tests..."
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] text-primary dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#222] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all shadow-inner text-sm md:text-base font-medium"
            />
          </motion.div>
        </div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2"
        >
          {filterOptions.map((sampleType) => {
            const isActive = filter.sampleType === sampleType;
            return (
              <button
                key={sampleType}
                onClick={() => handleFilterClick(sampleType)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
                  isActive
                    ? "text-white"
                    : "bg-white dark:bg-[#111] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-orange-500 rounded-full -z-10 shadow-md shadow-orange-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{sampleType}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Test Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {tests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl mt-4"
              >
                <div className="w-20 h-20 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5 shadow-md shadow-black/5">
                  <svg
                    className="w-10 h-10 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                  No tests found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm md:text-base">
                  We couldn't find any tests matching your current search or
                  filter criteria. Try adjusting your keywords.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {tests.map((test) => (
                  <TestCard
                    key={test._id}
                    test={test}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            )}

            {/* Load More Button */}
            {totalPages !== 1 && tests.length >= limit && (
              <div className="w-full flex justify-center mt-10">
                <button
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                  onClick={handleLoadMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Tests"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
