// app/(mainLayout)/profile/components/Menubar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FiUser, FiMapPin, FiUsers, FiSettings } from "react-icons/fi";

const Menubar = () => {
  const currentPath = usePathname();

  const menuItems = [
    { label: "Profile Details", href: "/profile", icon: <FiUser size={18} /> },
    {
      label: "Saved Addresses",
      href: "/profile/addresses",
      icon: <FiMapPin size={18} />,
    },
    {
      label: "Patient Profiles",
      href: "/profile/patients",
      icon: <FiUsers size={18} />,
    },
    {
      label: "Settings",
      href: "/profile/settings",
      icon: <FiSettings size={18} />,
    },
  ];

  return (
    <nav className="flex md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
      {menuItems.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 md:shrink border ${
              isActive
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20 dark:bg-primary/20 dark:text-blue-400 dark:border-primary/50"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-blue-50 dark:bg-[#111] dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Menubar;
