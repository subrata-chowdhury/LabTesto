// app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Card from "@/components/Card";
import fetcher from "@/lib/fetcher";
import MonthlyPriceBarChart from "./components/dashboard-charts/MonthlyPriceBarChart";
import DonutChart from "./components/dashboard-charts/DonutChart";
import OutdatedOrders from "./components/OutdatedOrders";

type Analytics = {
  totalTests: number;
  totalLabs: number;
  totalCollectors: number;
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export type CloudinaryUsage = {
  usage: number;
  limit: number;
  usedPercent: number;
};

function CloudinaryMeterCard({
  usageData,
}: {
  usageData: CloudinaryUsage | null;
}) {
  if (!usageData) {
    return (
      <div className="bg-white dark:bg-[#111] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/2 w-full h-44 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full mt-2"></div>
          <div className="flex justify-between w-full mt-1">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-[#111] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/2 w-full hover:shadow-xl dark:shadow-none hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 dark:bg-orange-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-100 dark:border-purple-500/20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary dark:text-white leading-tight">
            Cloud Storage
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Media Asset Usage
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-4 mb-4 overflow-hidden border border-black/5 dark:border-white/5 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(usageData.usedPercent, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="bg-linear-to-r from-orange-400 to-orange-600 h-full rounded-full relative"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-gray-800 dark:text-gray-200">
          {formatBytes(usageData.usage)}{" "}
          <span className="text-gray-400 font-medium">Used</span>
        </span>
        <span className="text-orange-500 font-bold bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
          {usageData.usedPercent.toFixed(1)}%
        </span>
        <span className="text-gray-800 dark:text-gray-200">
          {formatBytes(usageData.limit)}{" "}
          <span className="text-gray-400 font-medium">Total</span>
        </span>
      </div>
    </div>
  );
}

export default function Page() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalTests: 0,
    totalLabs: 0,
    totalCollectors: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalOrders: 0,
  });
  const [financeData, setFinanceData] = useState<
    {
      date: Date;
      totalPrice: number;
      expenses: number;
    }[]
  >(
    Array.from({ length: 12 }, (_, index) => ({
      date: new Date(new Date().getFullYear(), index, 1),
      totalPrice: 0,
      expenses: 0,
    })),
  );
  const [cloudinaryUsage, setCloudinaryUsage] =
    useState<CloudinaryUsage | null>(null);

  useEffect(() => {
    startUp();
    fetchCloudinary();
  }, []);

  async function startUp() {
    const res = await fetcher.get<Analytics>("/admin/analytics");
    if (res.status === 200 && res.body) {
      setAnalytics(res.body);
    }
    getFinanceData();
    fetchCloudinary();
  }

  async function getFinanceData() {
    const res = await fetcher.get<
      {
        date: Date;
        totalPrice: number;
        expenses: number;
      }[]
    >("/admin/analytics/finance");
    if (res.status === 200 && res.body) {
      while (res.body.length < 12) {
        res.body.push({
          date: new Date(new Date().setMonth(res.body.length + 1)),
          totalPrice: 0,
          expenses: 0,
        });
      }
      setFinanceData(res.body);
    }
  }

  async function fetchCloudinary() {
    const res = await fetcher.get<CloudinaryUsage>("/admin/cloudinary/usage");
    if (res.status === 200 && res.body) {
      setCloudinaryUsage(res.body);
    } else {
      console.error(res.error);
    }
  }
  return (
    <main className="flex-1 overflow-x-hidden bg-gray-50 dark:bg-[#0a0a0a] min-h-screen relative py-8 pt-4 sm:py-12 sm:pt-5 lg:py-16 lg:pt-6">
      {/* Decorative Background Elements modeled after AboutPage */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border-60 border-orange-50/50 dark:border-white-[0.02] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>

      <div className="px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-10"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-primary dark:text-white">
                Admin <span className="text-orange-500">Dashboard</span>
              </h1>
              <p className="text-xs mt-1 sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                Real-time overview of system analytics, financial metrics, and
                operational performance.
              </p>
            </div>
            {/* Optional subtle branding/date icon top right */}
            <div className="hidden md:flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 py-2 px-4 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Live Status
              </span>
            </div>
          </motion.div>

          {/* Top Analytics Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
          >
            <Card
              label="Total Tests"
              value={analytics.totalTests}
              colors={{
                lineColor: "#3b82f6",
                iconBgColor: "rgba(59, 130, 246, 0.1)",
              }}
            />
            <Card
              label="Total Labs"
              value={analytics.totalLabs}
              colors={{
                lineColor: "#10b981",
                iconBgColor: "rgba(16, 185, 129, 0.1)",
              }}
            />
            <Card
              label="Total Collectors"
              value={analytics.totalCollectors}
              colors={{
                lineColor: "#f59e0b",
                iconBgColor: "rgba(245, 158, 11, 0.1)",
              }}
            />
            <Card
              label="Total Users"
              value={analytics.totalUsers}
              colors={{
                lineColor: "#f97316",
                iconBgColor: "rgba(249, 115, 22, 0.1)",
              }}
            />
            <Card
              label="Total Admins"
              value={analytics.totalAdmins}
              colors={{
                lineColor: "#ec4899",
                iconBgColor: "rgba(236, 72, 153, 0.1)",
              }}
            />
            <Card
              label="Total Orders"
              value={analytics.totalOrders}
              colors={{
                lineColor: "#8b5cf6",
                iconBgColor: "rgba(139, 92, 246, 0.1)",
              }}
            />
          </motion.div>

          {/* Main Dashboard Content Area */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full"
          >
            {/* Left Main Column: Charts & Orders */}
            <div className="lg:col-span-2 flex flex-col gap-8 w-full">
              <MonthlyPriceBarChart financeData={financeData} />
              <OutdatedOrders />
            </div>

            {/* Right Side Column: Usage & Demographics */}
            <div className="flex mb-auto flex-col gap-8 w-full">
              <CloudinaryMeterCard usageData={cloudinaryUsage} />
              <DonutChart
                data={[
                  { name: "Admins", value: analytics.totalAdmins },
                  { name: "Users", value: analytics.totalUsers },
                  { name: "Collectors", value: analytics.totalCollectors },
                ]}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
