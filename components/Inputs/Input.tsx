// components/Inputs/Input.tsx
"use client";
import React from "react";

type Props = {
  label?: string;
  value: string;
  min?: number;
  max?: number;
  onChange: (val: string) => void;
  name?: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "tel" | "url";
  error?: string;
  inputStyle?: React.CSSProperties;
  containerClass?: string;
  labelClass?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
};

const Input = ({
  label = "",
  placeholder = "",
  name = "",
  error = "",
  value = "",
  min,
  max,
  onChange = () => {},
  type = "text",
  inputStyle = {},
  containerClass = "",
  labelClass = "",
  ref,
}: Props) => {
  return (
    <label className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <span
          className={`text-sm font-semibold text-gray-700 dark:text-gray-300 ${labelClass}`}
        >
          {label}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        className={`px-4 py-2.5 w-full bg-white dark:bg-[#111] border ${
          error && error.length > 0
            ? "border-red-500 focus:ring-red-500/20"
            : "border-gray-300 dark:border-white/20 focus:border-primary focus:ring-primary/20 dark:focus:border-primary dark:focus:ring-primary/30"
        } rounded-xl outline-none transition-all duration-200 focus:ring-4 text-gray-900 dark:text-white placeholder:text-gray-400`}
      />
      {error && error.length > 0 && (
        <p className="text-red-500 text-xs font-medium mt-0.5">{error}</p>
      )}
    </label>
  );
};

export default Input;
