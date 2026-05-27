// components/Dropdown.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  options: string[] | number[];
  value: string | number;
  onChange?: (opt: { value: string | number; index: number }) => void;
  width?: string | number;
  height?: number | string;
  showPopupAtTop?: boolean;
  containerClassName?: string;
  optionElement?: (props: {
    option: string | number;
    index: number;
    onClick: () => void;
  }) => React.JSX.Element;
  ref?: React.RefObject<HTMLDivElement | null>;
  loading?: boolean;
};

function Dropdown({
  options = [],
  value = "",
  onChange = () => {},
  containerClassName = "",
  width,
  height,
  showPopupAtTop = false,
  optionElement,
  ref,
  loading = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClassName}`}
      style={{ width: width || "100%" }}
    >
      <button
        type="button"
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex justify-between items-center w-full px-4 py-2 bg-white dark:bg-[#1a1a1a] border rounded-xl outline-none transition-all duration-300 text-gray-800 dark:text-gray-200 text-sm font-medium shadow-sm ${
          isOpen
            ? "border-orange-500 ring-4 ring-orange-500/15 dark:border-orange-500 dark:ring-orange-500/20"
            : "border-gray-200 dark:border-white/10 hover:border-orange-500/50 dark:hover:border-white/30"
        } ${loading ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-[#111]" : "cursor-pointer"}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ height: height || 42 }}
      >
        <div className="truncate pr-3 text-left" title={value.toString()}>
          {value || (
            <span className="text-gray-400 font-normal">
              Select an option...
            </span>
          )}
        </div>
        <FiChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-300 shrink-0 ${
            isOpen
              ? "rotate-180 text-orange-500"
              : "rotate-0 group-hover:text-gray-700"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: showPopupAtTop ? 10 : -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: showPopupAtTop ? 10 : -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 z-50 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/40 py-1.5 max-h-64 overflow-y-auto custom-scrollbar"
            style={{
              top: showPopupAtTop ? "auto" : "calc(100% + 8px)",
              bottom: showPopupAtTop ? "calc(100% + 8px)" : "auto",
            }}
            role="listbox"
          >
            {!optionElement &&
              options.map((option, index) => {
                const isSelected = option === value;
                return (
                  <button
                    type="button"
                    key={index}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-orange-50/80 text-orange-600 font-bold dark:bg-orange-500/15 dark:text-orange-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                    onClick={() => {
                      onChange({ value: option, index });
                      setIsOpen(false);
                    }}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <FiCheck className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 ml-3" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            {optionElement &&
              options.map((option, index) =>
                optionElement({
                  option,
                  index,
                  onClick: () => setIsOpen(false),
                }),
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
