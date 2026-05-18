// components/Dropdown.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
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
        className={`flex justify-between items-center w-full px-4 py-2.5 bg-white dark:bg-[#111] border rounded-xl outline-none transition-all duration-200 text-gray-900 dark:text-white ${
          isOpen
            ? "border-primary ring-4 ring-primary/20 dark:border-primary dark:ring-primary/30"
            : "border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30"
        } ${loading ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
        onClick={() => {
          if (!loading) setIsOpen(!isOpen);
        }}
        style={{ height: height || "auto" }}
      >
        <div
          className="truncate font-medium pr-2 text-left"
          title={value.toString()}
        >
          {value || <span className="text-gray-400">Select...</span>}
        </div>
        <FiChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: showPopupAtTop ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: showPopupAtTop ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 z-50 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/40 py-1 max-h-60 overflow-y-auto custom-scrollbar`}
            style={{
              top: showPopupAtTop ? "auto" : "calc(100% + 6px)",
              bottom: showPopupAtTop ? "calc(100% + 6px)" : "auto",
            }}
          >
            {!optionElement &&
              options.map((option, index) => {
                const isSelected = option === value;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`w-full text-left px-4 py-2.5 transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold dark:bg-white/10 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                    onClick={() => {
                      onChange({ value: option, index });
                      setIsOpen(false);
                    }}
                  >
                    {option}
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
