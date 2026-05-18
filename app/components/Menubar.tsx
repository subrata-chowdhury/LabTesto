// app/components/Menubar.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import fetcher from "@/lib/fetcher";

import SelectTest from "./SelectTest";
import { useItemCountContext } from "../contexts/ItemCountContext";
import logout from "@/assets/Menubar/logout.svg";
import { CartIcon } from "@/assets/reactIcon/Cart";
import LabIcon from "@/assets/reactIcon/test/Lab";
import { FilledCartIcon } from "@/assets/reactIcon/menubar/FilledCart";
import { OrderIcon } from "@/assets/reactIcon/menubar/Orders";
import { AboutIcon } from "@/assets/reactIcon/menubar/About";
import { ContactIcon } from "@/assets/reactIcon/menubar/Contact";
import { NotificationIcon } from "@/assets/reactIcon/menubar/Notification";
import UserIcon from "@/assets/reactIcon/User";

const Menubar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const { itemCount, setItemCount } = useItemCountContext();

  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close profile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetcher.get<{ items: number }>("/cart/count").then((res) => {
      if (res.status === 200 && res.body) {
        setItemCount(res.body.items || 0);
        setIsLoggedIn(
          JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
        );
        setUserName(localStorage.getItem("userName") || "");
        setUserEmail(localStorage.getItem("userEmail") || "");
      } else if (res.status === 400) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
      }
    });
  }, [setItemCount]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-900 dark:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="text-xl sm:text-2xl font-extrabold flex-shrink-0">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="text-orange-500">Lab</span>
              <span className="text-primary dark:text-white">Testo</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-1 lg:space-x-4">
            <DesktopNavLink
              href="/tests"
              label="Book a Test"
              currentPath={pathname}
            />
            <DesktopNavLink
              href="/about"
              label="About Us"
              currentPath={pathname}
            />
            <DesktopNavLink
              href="/order"
              label="Orders"
              currentPath={pathname}
            />
            <DesktopNavLink
              href="/contact"
              label="Contact Us"
              currentPath={pathname}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden md:block">
              <SearchBar active={false} />
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  className="relative text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white transition-colors p-2"
                  href="/cart"
                  aria-label="View Cart"
                >
                  {(itemCount || 0) > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm">
                      {(itemCount || 0) > 9 ? "9+" : itemCount}
                    </span>
                  )}
                  <CartIcon size={24} />
                </Link>

                <div className="hidden md:block relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfilePopup((val) => !val)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white hover:bg-primary/20 dark:hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-black"
                    aria-expanded={showProfilePopup}
                    aria-label="User Profile"
                  >
                    <UserIcon size={20} />
                  </button>

                  <AnimatePresence>
                    {showProfilePopup && (
                      <ProfilePopup
                        isLoggedIn={isLoggedIn}
                        userEmail={userEmail}
                        userName={userName}
                        onPopupClose={() => setShowProfilePopup(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                href="/signup"
                className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-blue-600 rounded-full shadow-md shadow-primary/20 transition-colors"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenubar
            onClose={() => setIsOpen(false)}
            userEmail={userEmail}
            userName={userName}
            isLoggedIn={isLoggedIn}
          />
        )}
      </AnimatePresence>
    </>
  );
};

function DesktopNavLink({
  href,
  label,
  currentPath,
}: {
  href: string;
  label: string;
  currentPath: string | null;
}) {
  const isActive = currentPath === href || currentPath?.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "text-primary dark:text-white bg-primary/5 dark:bg-white/10"
          : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:text-white dark:hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

export function SearchBar({
  active = false,
  className = "",
  onSelect = () => {},
}: {
  active?: boolean;
  className?: string;
  onSelect?: (value: { name: string; _id: string }) => void;
}) {
  const [showSearchBar, setShowSearchBar] = useState(active);

  return (
    <div
      className={`relative flex items-center transition-all duration-300 ${
        showSearchBar
          ? "w-64 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full"
          : "w-auto"
      } ${className}`}
    >
      {showSearchBar && (
        <SelectTest
          onSelect={onSelect}
          optionElement={(option, index, onClick) => (
            <Link href={"/tests/" + option._id} key={index}>
              <div
                className="px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => {
                  onClick();
                  onSelect(option);
                  setShowSearchBar(false);
                }}
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {option.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.sampleType}
                </div>
              </div>
            </Link>
          )}
          className="w-full bg-transparent text-sm outline-none border-none dark:text-white placeholder:text-gray-500"
          style={{ border: "none", padding: 0, boxShadow: "none" }}
          placeholder="Search tests..."
        />
      )}
      <button
        type="button"
        className={`flex items-center justify-center rounded-full transition-colors ${
          showSearchBar
            ? "w-8 h-8 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
            : "w-10 h-10 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
        }`}
        onClick={() => setShowSearchBar(!showSearchBar)}
        aria-label="Toggle Search"
      >
        {showSearchBar ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 56.966 56.966"
          >
            <path d="M55.146,51.887L41.588,38.329c3.486-4.191,5.377-9.479,5.377-14.979C46.965,10.478,36.486,0,23.482,0 C10.479,0,0,10.478,0,23.482c0,13.004,10.479,23.482,23.482,23.482c5.5,0,10.788-1.891,14.979-5.377l13.558,13.558 c1.219,1.219,3.195,1.219,4.414,0C56.365,55.082,56.365,53.106,55.146,51.887z M23.482,41.965 c-10.214,0-18.482-8.268-18.482-18.482S13.268,5,23.482,5s18.482,8.268,18.482,18.482S33.696,41.965,23.482,41.965z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function MobileMenubar({
  onClose,
  isLoggedIn,
  userName = "",
  userEmail = "",
}: {
  onClose: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
}) {
  return (
    <div className="md:hidden fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-[85%] max-w-sm h-full bg-white dark:bg-[#111] shadow-2xl flex flex-col overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
          <div className="text-xl font-extrabold">
            <span className="text-orange-500">Lab</span>
            <span className="text-primary dark:text-white">Testo</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-50 dark:bg-white/5"
          >
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pb-8 flex-1 flex flex-col">
          {isLoggedIn ? (
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white">
                <UserIcon size={28} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-gray-900 dark:text-white truncate">
                  {userName || "Profile"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail}
                </div>
              </div>
            </Link>
          ) : (
            <div className="mb-8 flex flex-col gap-3">
              <Link
                href="/signup"
                onClick={onClose}
                className="w-full text-center py-3 bg-primary text-white rounded-xl font-medium"
              >
                Register / Login
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <MobileMenuLink
              href="/tests"
              icon={<LabIcon size={20} />}
              label="Book a Test"
              onClose={onClose}
            />
            <MobileMenuLink
              href="/cart"
              icon={<FilledCartIcon size={20} />}
              label="Cart"
              onClose={onClose}
            />
            <MobileMenuLink
              href="/order"
              icon={<OrderIcon size={20} />}
              label="Orders"
              onClose={onClose}
            />
            <MobileMenuLink
              href="/notifications"
              icon={<NotificationIcon size={20} />}
              label="Notifications"
              onClose={onClose}
            />
            <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
            <MobileMenuLink
              href="/about"
              icon={<AboutIcon size={20} />}
              label="About Us"
              onClose={onClose}
            />
            <MobileMenuLink
              href="/contact"
              icon={<ContactIcon size={20} />}
              label="Contact Us"
              onClose={onClose}
            />
          </div>

          {isLoggedIn && (
            <button
              onClick={() => {
                document.cookie = "token=; Max-Age=0; path=/;";
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");
                window.location.href = "/";
              }}
              className="mt-auto mb-4 flex items-center justify-center gap-3 w-full py-3.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-semibold rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-500/20"
            >
              <Image
                src={logout}
                alt="Logout"
                className="w-5 h-5 filter invert-[30%] sepia-[90%] saturate-[2000%] hue-rotate-[340deg] dark:invert-0 dark:brightness-200"
                width={20}
                height={20}
              />
              Log Out
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MobileMenuLink({
  href,
  icon,
  label,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors"
    >
      <div className="flex items-center gap-3 font-medium">
        <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        {label}
      </div>
      <span className="text-gray-300 dark:text-gray-600 text-sm">❯</span>
    </Link>
  );
}

function ProfilePopup({
  onPopupClose,
  userName,
  userEmail,
  isLoggedIn,
}: {
  onPopupClose: () => void;
  userName?: string;
  userEmail?: string;
  isLoggedIn?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-[calc(100%+12px)] w-64 p-2 rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-xl shadow-black/10 dark:shadow-black/50 border border-gray-100 dark:border-white/10 z-50"
    >
      <div className="flex flex-col items-center p-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white mb-3">
          <UserIcon size={32} />
        </div>
        <div className="text-center w-full">
          <div className="font-bold text-gray-900 dark:text-white truncate">
            {userName || "Profile"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {userEmail}
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-100 dark:border-white/10 pt-2 flex flex-col gap-1">
        <PopupLink
          href="/profile"
          icon={<UserIcon size={16} />}
          label="Account"
          onClick={onPopupClose}
        />
        <PopupLink
          href="/notifications"
          icon={<NotificationIcon size={16} />}
          label="Notifications"
          onClick={onPopupClose}
        />
      </div>

      {isLoggedIn && (
        <div className="mt-2 border-t border-gray-100 dark:border-white/10 pt-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            onClick={() => {
              document.cookie = "token=; Max-Age=0; path=/;";
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userName");
              localStorage.removeItem("userEmail");
              window.location.href = "/";
            }}
          >
            <Image
              src={logout}
              alt="Logout"
              className="w-4 h-4 filter invert-[30%] sepia-[90%] saturate-[2000%] hue-rotate-[340deg] dark:invert-0 dark:brightness-200"
              width={16}
              height={16}
            />
            Log Out
          </button>
        </div>
      )}
    </motion.div>
  );
}

function PopupLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        {label}
      </div>
      <span className="text-gray-300 dark:text-gray-600 text-xs">❯</span>
    </Link>
  );
}
export default Menubar;
