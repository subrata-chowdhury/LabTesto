// components/Inputs/PasswordInput.tsx
"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  error?: string;
  iconSize?: number;
  labelClass?: string;
};

const PasswordInput = ({
  label = "",
  value = "",
  placeholder = "",
  name = "",
  onChange = () => {},
  error = "",
  iconSize = 20,
  labelClass = "",
}: Props) => {
  const [isPassword, setIsPassword] = useState(true);

  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span
          className={`text-sm font-semibold text-gray-700 dark:text-gray-300 ${labelClass}`}
        >
          {label}
        </span>
      )}
      <div
        className={`flex items-center bg-white dark:bg-[#111] border ${
          error && error.length > 0
            ? "border-red-500 focus-within:ring-red-500/20"
            : "border-gray-300 dark:border-white/20 focus-within:border-primary focus-within:ring-primary/20 dark:focus-within:border-primary dark:focus-within:ring-primary/30"
        } rounded-xl transition-all duration-200 focus-within:ring-4 overflow-hidden`}
      >
        <input
          type={isPassword ? "password" : "text"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2.5 w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={isPassword ? "Show password" : "Hide password"}
          className="px-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none"
          onClick={() => setIsPassword((prev) => !prev)}
        >
          {isPassword ? (
            <FiEye size={iconSize} />
          ) : (
            <FiEyeOff size={iconSize} />
          )}
        </button>
      </div>
      {error && error.length > 0 && (
        <p className="text-red-500 text-xs font-medium mt-0.5">{error}</p>
      )}
    </label>
  );
};

export default PasswordInput;
