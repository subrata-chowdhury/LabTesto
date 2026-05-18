// components/Inputs/TagInput.tsx
"use client";
import React, { useRef, useState } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  label?: string;
  values?: string[];
  className?: string;
  onChange?: (val: string[]) => void;
  error?: string;
};

const TagInput = ({
  label,
  values = [],
  onChange = () => {},
  className = "",
  error = "",
}: Props) => {
  const [tag, setTag] = useState<string>("");
  const inputContainer = useRef<HTMLInputElement>(null);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <div
        className={`bg-white dark:bg-[#111] border ${
          error && error.length > 0
            ? "border-red-500 focus-within:ring-red-500/20"
            : "border-gray-300 dark:border-white/20 focus-within:border-primary focus-within:ring-primary/20 dark:focus-within:border-primary dark:focus-within:ring-primary/30"
        } rounded-xl px-3 py-2 flex flex-wrap gap-2 transition-all duration-200 focus-within:ring-4 min-h-13 max-h-48 overflow-y-auto cursor-text`}
        onClick={() => inputContainer.current?.focus()}
      >
        {values.map((tagValue, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/5"
          >
            {tagValue}
            <button
              type="button"
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                const newTags = [...values];
                newTags.splice(index, 1);
                onChange(newTags);
              }}
              aria-label={`Remove tag ${tagValue}`}
            >
              <FiX size={14} />
            </button>
          </span>
        ))}
        <input
          ref={inputContainer}
          className="flex-1 min-w-30 bg-transparent outline-none py-1 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          placeholder={values.length === 0 ? "Type and press Enter..." : ""}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tag.trim() !== "") {
              e.preventDefault(); // prevent form submission if wrapped in one
              const newTags = [...values, tag.trim()];
              setTag("");
              onChange(newTags);
            }
          }}
        />
      </div>
      {error && error.length > 0 && (
        <p className="text-red-500 text-xs font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default TagInput;
