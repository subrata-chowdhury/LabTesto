// app/(mainLayout)/tests/page.tsx
"use client";

import fetcher from "@/lib/fetcher";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import debounce from "@/lib/debouncer";

type SampleTypeOption =
  | "All"
  | "Blood"
  | "Urine"
  | "Semen"
  | "Stool"
  | "Sputum"
  | "Other"
  | "Other Body Fluid";

type Test = {
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
};

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
          `/tests?filter=${JSON.stringify(apiFilter)}&limit=${searchLimit || 8}&page=1`,
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
      className="px-4 py-12 md:py-16 min-h-screen bg-gray-50/50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Explore Lab Tests
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Browse our comprehensive directory of diagnostic tests. Filter by
              sample type or search for specific requirements to find exactly
              what you need.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-xs lg:max-w-sm shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
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
              placeholder="Search tests..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm shadow-black/5"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
          {filterOptions.map((sampleType) => {
            const isActive = filter.sampleType === sampleType;
            return (
              <button
                key={sampleType}
                onClick={() => handleFilterClick(sampleType)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isActive
                    ? "text-white"
                    : "bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md shadow-primary/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{sampleType}</span>
              </button>
            );
          })}
        </div>

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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-[#111] rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-white/10">
                  <svg
                    className="w-10 h-10 text-gray-400"
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No tests found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  We couldn't find any tests matching your current search or
                  filter criteria.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {tests.map((test) => (
                  <Link
                    href={`/tests/${test._id}`}
                    key={test._id}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl block h-full"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      className="flex flex-col h-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-white/5 transition-all duration-300 p-6"
                    >
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {test.name}
                      </h2>

                      <div className="mb-6 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 rounded-full text-xs font-semibold tracking-wide uppercase">
                          {test.sampleType}
                        </span>
                      </div>

                      <div className="mt-auto space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Fasting
                          </span>
                          <span className="truncate ml-2">
                            {test.fastingRequired || "Not Required"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Tube Type
                          </span>
                          <span className="truncate ml-2 text-right">
                            {test.tubeType || "N/A"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Load More Button */}
            {totalPages !== 1 && tests.length >= limit && (
              <div className="w-full flex justify-center mt-12">
                <button
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
                  onClick={handleLoadMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-4/5 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/5 mb-4"></div>

      <div className="w-20 h-6 bg-primary/10 dark:bg-white/5 rounded-full mb-8"></div>

      <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}
