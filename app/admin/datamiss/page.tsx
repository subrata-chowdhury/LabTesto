// app/admin/datamiss/page.tsx
"use client";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiChevronRight,
  FiCheckCircle,
  FiFileText,
} from "react-icons/fi";

function Page() {
  const [datamissByLab, setDatamissByLab] = useState<LabWithMissingPrices[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const prevLabs = useRef<number>(0);

  useEffect(() => {
    fetchDatamissByLab(10).finally(() => setInitialLoading(false));
  }, []);

  const fetchDatamissByLab = async (currentLimit: number) => {
    setLoading(true);
    const res = await fetcher.get<LabWithMissingPrices[]>(
      "/admin/datamiss?limit=" + currentLimit,
    );
    if (res.body) {
      setDatamissByLab(res.body);
    }
    setLoading(false);
  };

  const handleLoadMore = async () => {
    prevLabs.current = datamissByLab.length;
    const newLimit = limit + 10;
    setLimit(newLimit);
    await fetchDatamissByLab(newLimit);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Scanning for missing data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-12 pt-4 px-4 sm:px-6 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 mt-1 sm:mt-0">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Missing Data Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
              Identify and resolve incomplete test configurations across partner
              laboratories. Labs listed here have tests assigned without pricing
              or complete details.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        {datamissByLab.length === 0 ? (
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Great job. There are currently no laboratories with missing test
              pricing or incomplete data.
            </p>
          </div>
        ) : (
          datamissByLab.map((lab) => (
            <Link
              href={"/admin/labs/edit/tests/" + lab.lab._id}
              key={lab.lab._id}
              className="block group"
            >
              <div className="bg-white dark:bg-[#111] border border-orange-200 dark:border-orange-500/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/40 relative overflow-hidden flex flex-col sm:flex-row justify-between gap-6">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 dark:bg-orange-500"></div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {lab.lab.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                      {lab.missingTests.length} Missing{" "}
                      {lab.missingTests.length === 1 ? "Test" : "Tests"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {lab.missingTests.map((missingTest) => (
                      <span
                        key={missingTest.test._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                      >
                        <FiFileText className="w-3 h-3 opacity-70" />
                        {missingTest.testName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center sm:justify-end shrink-0 border-t sm:border-t-0 border-gray-100 dark:border-white/10 pt-4 sm:pt-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>Resolve Now</span>
                    <FiChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}

        {/* Load More */}
        {datamissByLab.length > 0 &&
          prevLabs.current !== datamissByLab.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-35"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export type LabWithMissingPrices = {
  lab: {
    _id: string;
    name: string;
    prices: {
      test: {
        _id: string;
      };
    }[];
  };
  missingTests: {
    test: {
      _id: string;
      name: string;
    };
    testName: string;
  }[];
};

export default Page;
