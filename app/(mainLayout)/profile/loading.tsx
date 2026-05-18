// app/(mainLayout)/profile/loading.tsx
// (You can copy this exact code to patients/loading.tsx and addresses/loading.tsx as well)
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full">
      <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-lg md:hidden mb-2"></div>

      {/* Header Skeleton */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-white/10 shrink-0"></div>
        <div className="flex flex-col justify-center h-full gap-3 pt-2 w-full items-center sm:items-start">
          <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded-md"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded-md"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="h-6 w-40 bg-gray-200 dark:bg-white/10 rounded-md mb-8"></div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-xl"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-xl"></div>
          <div className="md:col-span-2 h-12 w-full bg-gray-200 dark:bg-white/10 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
