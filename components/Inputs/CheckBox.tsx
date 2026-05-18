// components/Inputs/CheckBox.tsx
"use client";
import React from "react";
import { FiCheck } from "react-icons/fi";

type Props = {
  label?: string;
  value: boolean;
  onChange: (val: boolean) => void;
  size?: number;
  disabled?: boolean;
};

const CheckBox = ({
  label = "",
  value = true,
  onChange = () => {},
  disabled,
  size = 20, // Reduced default size for modern aesthetics
}: Props) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={value}
      disabled={disabled}
      className={`group flex items-center gap-3 outline-none ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={() => {
        if (!disabled) onChange(!value);
      }}
    >
      <div
        className={`flex items-center justify-center rounded-md border-2 transition-all duration-200 ease-in-out group-focus-visible:ring-4 group-focus-visible:ring-primary/30 ${
          value
            ? "bg-primary border-primary text-white"
            : "bg-transparent border-gray-300 dark:border-gray-500 group-hover:border-primary dark:group-hover:border-primary"
        }`}
        style={{ width: size, height: size }}
      >
        <FiCheck
          strokeWidth={3}
          size={size * 0.7}
          className={`transition-transform duration-200 ${
            value ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
          {label}
        </span>
      )}
    </button>
  );
};

export default CheckBox;
