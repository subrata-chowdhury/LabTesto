// components/Inputs/DateInput.tsx
"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  label?: string;
  value: Date;
  onChange: (val: Date) => void;
  error?: string;
  containerClass?: string;
  labelClass?: string;
  minTime?: Date;
  maxTime?: Date;
  maxDate?: Date;
};

const DateInput = ({
  label = "",
  error = "",
  value = new Date(),
  onChange = () => {},
  containerClass = "",
  labelClass = "",
  minTime,
  maxTime,
  maxDate,
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
      <DatePicker
        selected={value}
        onChange={(date: Date | null) => {
          // Safely execute without 'as' assertion
          if (date) {
            onChange(date);
          }
        }}
        showTimeSelect
        dateFormat="Pp"
        minDate={minTime}
        maxDate={maxDate}
        minTime={minTime}
        maxTime={maxTime}
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

export default DateInput;
