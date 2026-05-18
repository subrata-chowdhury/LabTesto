// app/(mainLayout)/profile/settings/page.tsx
"use client";
import React from "react";
import { FiSettings } from "react-icons/fi";

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-6">
        <FiSettings size={40} className="animate-[spin_4s_linear_infinite]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Settings Coming Soon
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        We are working on bringing you advanced account preferences,
        notification toggles, and security settings. Check back soon!
      </p>
    </div>
  );
};

export default SettingsPage;
