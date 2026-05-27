// components/Table.tsx
import React, { useState } from "react";
import Pagination from "./Pagination";
import SearchIcon from "@/assets/search.svg";
import Image from "next/image";
import Dropdown from "./Dropdown";
import { FiInbox, FiSearch, FiX } from "react-icons/fi";

type Props<T> = {
  name: string;
  table: {
    config: {
      heading: string;
      selector?: keyof T;
      hideAble?: boolean;
      component?: React.FC<{ data: T; index: number }>;
    }[];
    data: T[];
    tableStyle?: React.CSSProperties;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  limit: {
    options: string[] | number[];
    limit: string | number;
    onLimitChange: (value: string | number) => void;
  };
  onSearch?: (value: string) => void;
  tag?: {
    tags: string[];
    onTagChange: (tag: string) => void;
  };
  dropdown?: {
    options: string[] | number[];
    value: string | number;
    onChange: (value: string | number) => void;
    width?: number;
    height?: number;
  };
  loading?: boolean;
};

function Table<T>({
  name,
  table,
  pagination,
  limit,
  onSearch,
  tag,
  dropdown,
  loading = false,
}: Props<T>) {
  return (
    <div className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-[#111] dark:border-white/10 dark:shadow-white/[0.02]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 py-3 md:py-3 md:p-6 border-b border-gray-100 dark:border-white/10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and view your {name.toLowerCase()} data efficiently.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {onSearch && (
            <div className="w-full sm:w-auto">
              <SearchBar onSearch={(val) => (!loading ? onSearch(val) : "")} />
            </div>
          )}
          {dropdown && (
            <div className="w-full sm:w-auto min-w-[150px]">
              <Dropdown
                loading={loading}
                options={dropdown?.options || []}
                value={dropdown?.value || ""}
                onChange={(val) => dropdown?.onChange(val.value)}
                width={dropdown?.width}
                height={dropdown?.height}
              />
            </div>
          )}
        </div>
      </div>

      {tag?.tags && tag.tags.length > 0 && (
        <div className="px-5 md:px-6 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/10">
          <TableTags
            loading={loading}
            tags={tag.tags}
            onActiveTagChange={tag.onTagChange}
          />
        </div>
      )}

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <MainTable<T> loading={loading} {...table} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center p-4 py-3 md:py-3 md:p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-[#1a1a1a]/80">
        <div className="flex gap-3 items-center w-full md:w-auto justify-between md:justify-start">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Rows per page:
          </p>
          <div className="w-20">
            <Dropdown
              loading={loading}
              options={limit.options || [5, 10, 15, 20, 50]}
              value={limit.limit}
              onChange={(val) => limit.onLimitChange(val.value)}
              showPopupAtTop={true}
              height={36}
            />
          </div>
          <p className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-400">
            Total {pagination.totalPages} pages
          </p>
        </div>
        <div className="w-full md:w-auto flex justify-center">
          <Pagination
            loading={loading}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onChange={pagination.onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;

interface MainTableProps<T> {
  config: {
    heading: string;
    selector?: keyof T;
    hideAble?: boolean;
    component?: React.FC<{ data: T; index: number }>;
  }[];
  data: T[];
  className?: string;
  loading?: boolean;
}

export function MainTable<T>({
  config = [],
  data = [],
  className = "",
  loading = false,
}: MainTableProps<T>) {
  if (!config.length) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] rounded-xl m-4 border border-dashed border-gray-200 dark:border-white/10">
        Invalid Table Configuration
      </div>
    );
  }

  const renderCellValue = (obj: T, selector?: keyof T) => {
    if (!selector) return null;
    const value = obj[selector];
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return null;
  };

  return (
    <table
      className={`w-full text-left border-collapse whitespace-nowrap ${className}`}
      cellPadding={0}
      cellSpacing={0}
    >
      <thead>
        <tr className="bg-white dark:bg-[#111] border-b-2 border-gray-100 dark:border-white/10">
          {config.map((configObj, index) => (
            <th
              key={index}
              className={`pl-6 pr-4 py-4 font-bold text-gray-700 dark:text-gray-300 text-xs tracking-wider uppercase ${configObj.hideAble ? "hidden md:table-cell" : ""}`}
            >
              {configObj.heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
        {!loading &&
          data?.length > 0 &&
          data.map((obj, index) => (
            <tr
              key={index}
              className="bg-white dark:bg-[#111] hover:bg-orange-50/50 dark:hover:bg-white/[0.03] transition-colors duration-200 group"
            >
              {config.map((configObj, innerIndex) => (
                <td
                  key={innerIndex}
                  className={`pl-6 pr-4 py-4 text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors ${configObj.hideAble ? "hidden md:table-cell" : ""}`}
                >
                  {configObj.component
                    ? React.createElement(configObj.component, {
                        data: obj,
                        index,
                      })
                    : renderCellValue(obj, configObj.selector)}
                </td>
              ))}
            </tr>
          ))}

        {loading && (
          <tr>
            <td className="py-20 text-center" colSpan={config.length}>
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-t-orange-500 dark:border-white/10 dark:border-t-orange-500"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                  Loading data...
                </p>
              </div>
            </td>
          </tr>
        )}

        {!loading && (!data || data?.length <= 0) && (
          <tr>
            <td className="py-20" colSpan={config.length}>
              <div className="flex flex-col justify-center items-center text-center px-4">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/10">
                  <FiInbox className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  No results found
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  We couldn't find any data matching your current filters or
                  search criteria.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function TableTags({
  tags = [],
  onActiveTagChange = () => {},
  loading = false,
}: {
  tags: string[];
  onActiveTagChange?: (tag: string) => void;
  loading?: boolean;
}) {
  const [activeTag, setActiveTag] = useState(tags[0]);

  if (!tags.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scroll-smooth">
      {tags.map((tag, index) => {
        const isActive = activeTag === tag;
        return (
          <button
            type="button"
            key={index}
            disabled={loading}
            className={`whitespace-nowrap cursor-pointer py-1.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
              isActive
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-500/20 dark:ring-orange-500/40"
                : "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-500/10"
            }`}
            onClick={() => {
              setActiveTag(tag);
              onActiveTagChange(tag);
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

function SearchBar({
  onSearch = () => {},
}: {
  onSearch?: (value: string) => void;
}) {
  const [searchValue, setSearchValue] = useState("");

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="flex items-center gap-2 p-1.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] w-full min-h-[42px] focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 group shadow-sm">
      <FiSearch className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-orange-500 transition-colors shrink-0" />
      <input
        className="outline-none w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        value={searchValue}
        placeholder="Search records..."
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSearch(e.target.value);
        }}
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors shrink-0"
          aria-label="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
