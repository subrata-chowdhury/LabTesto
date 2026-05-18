// app/(mainLayout)/cart/loading.tsx
import React from "react";

const Loading = () => {
  return (
    <div className="flex-1 flex justify-center bg-gray-50 dark:bg-black min-h-screen pb-32">
      <div className="w-full max-w-4xl px-4 py-8 flex flex-col">
        <div className="w-48 h-10 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6"></div>
        <AddressLoader />
        <div className="w-full h-14 bg-white dark:bg-white/5 rounded-2xl animate-pulse mb-6"></div>
        <CartLoader />
      </div>
    </div>
  );
};

export function AddressLoader() {
  return (
    <div className="mb-5 w-full flex justify-between items-center p-5 min-h-[88px] rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"></div>
        <div>
          <div className="w-48 sm:w-64 h-5 rounded-md bg-gray-200 dark:bg-white/10 animate-pulse mb-2"></div>
          <div className="w-32 sm:w-40 h-4 rounded-md bg-gray-200 dark:bg-white/10 animate-pulse"></div>
        </div>
      </div>
      <div className="w-24 h-10 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse"></div>
    </div>
  );
}

export function CartLoader() {
  return (
    <ul className="space-y-4 flex-1 pb-5">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <li
            key={index}
            className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm flex flex-col overflow-hidden"
          >
            <div className="p-5 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-3 justify-between h-full flex-1">
                <div>
                  <div className="w-3/4 sm:w-64 h-8 animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg mb-2"></div>
                  <div className="w-48 h-5 animate-pulse bg-gray-200 dark:bg-white/10 rounded-md"></div>
                </div>
                <div className="w-24 h-8 animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg mt-4"></div>
              </div>
              <div className="flex flex-col sm:items-end justify-between gap-4">
                <div className="w-32 h-10 animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                <div className="w-full sm:w-32 h-10 animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 p-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex gap-2">
                <div className="w-24 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full"></div>
                <div className="w-24 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full hidden sm:block"></div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}

export default Loading;
