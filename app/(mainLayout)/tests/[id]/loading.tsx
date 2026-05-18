// app/(mainLayout)/tests/[id]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <BasicTestDetailsLoader />
        <div className="space-y-4 mt-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LabLoader />
          </div>
        </div>
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <DetailsLoader />
        </div>
      </div>
    </div>
  );
}

export function BasicTestDetailsLoader() {
  return (
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 w-full">
      <div className="flex-1 animate-pulse">
        <div className="h-10 w-3/4 md:w-1/2 bg-gray-200 dark:bg-white/10 rounded mb-8"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end min-w-50 border-l border-gray-100 dark:border-white/10 pl-8 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
        <div className="h-8 w-28 bg-gray-200 dark:bg-white/10 rounded mb-6"></div>
        <div className="w-full h-12 bg-gray-200 dark:bg-white/10 rounded-xl mb-3"></div>
        <div className="w-full h-12 bg-gray-200 dark:bg-white/10 rounded-xl"></div>
      </div>
    </div>
  );
}

export function LabLoader() {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        className="border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-pulse h-25"
      >
        <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="w-3/4 h-5 rounded bg-gray-200 dark:bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-gray-200 dark:bg-white/10 rounded"></div>
            <div className="w-12 h-3 bg-gray-200 dark:bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    ));
}

export function DetailsLoader() {
  return (
    <div className="space-y-10">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-white/10 shrink-0"></div>
            <div className="flex-1 space-y-4">
              <div className="w-40 h-6 rounded bg-gray-200 dark:bg-white/10 mb-2"></div>
              <div className="w-full h-4 rounded bg-gray-200 dark:bg-white/10"></div>
              <div className="w-full h-4 rounded bg-gray-200 dark:bg-white/10"></div>
              <div className="w-3/4 h-4 rounded bg-gray-200 dark:bg-white/10"></div>
            </div>
          </div>
        ))}
    </div>
  );
}
