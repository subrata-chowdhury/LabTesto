// app/admin/labs/page.tsx
"use client";
import Card from "@/components/Card";
import Table from "@/components/Table";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";

const Labs = () => {
  const [labData, setLabData] = useState<Lab[]>([]);
  const [analytics, setAnalytics] = useState<{ totalLabs: number }>({
    totalLabs: 0,
  });

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [location, setLocation] = useState("All");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const [totalPages, setTotalPages] = useState(0);

  const fetchLabs = useCallback(async () => {
    setLoading(true);
    const filterData: { location?: string; name?: string } = {
      location: location,
      name: name,
    };
    if (location === "All") delete filterData.location;
    if (name === "") delete filterData.name;

    const res = await fetcher.get<{
      labs: Lab[];
      pagination: {
        totalLabs: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    }>(
      `/labs?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
    );
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    if (res.body) {
      setLabData(res.body.labs);
      setTotalPages(res.body.pagination.totalPages || 1);
      setCurrentPage(res.body.pagination.currentPage);
      setLimit(res.body.pagination.pageSize);
      setAnalytics({ totalLabs: res.body.pagination.totalLabs });
    }
    setLoading(false);
  }, [location, name, currentPage, limit]);

  useEffect(() => {
    fetchLabs();
  }, [location, name, currentPage, limit, fetchLabs]);

  async function deleteLab(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this lab? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    const res = await fetcher.delete(`/admin/labs/${id}`);
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    await fetchLabs();
  }

  return (
    <div className="flex flex-col mt-6 gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Labs Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview and manage all partner laboratories
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          onClick={() => navigate.push("/admin/labs/new")}
        >
          <FiPlus className="w-5 h-5" />
          <span>New Lab</span>
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          label="Total Partner Labs"
          value={analytics.totalLabs}
          colors={{ lineColor: "#f97316", iconBgColor: "#fff7ed" }}
          className="w-full"
        />
      </div>

      {/* Main Table */}
      <div className="w-full">
        <Table<Lab>
          name="Laboratory Directory"
          loading={loading}
          table={{
            config: [
              {
                heading: "Lab Name",
                selector: "name",
                component: ({ data }) => (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.name}
                  </span>
                ),
              },
              {
                heading: "Location",
                selector: "location",
                component: ({ data }) => (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <FiMapPin className="w-4 h-4 shrink-0 text-orange-500" />
                    <span>
                      {data.location?.address?.city || "N/A"} -{" "}
                      {data.location?.address?.pin || ""}
                    </span>
                  </div>
                ),
              },
              {
                heading: "Rating",
                selector: "rating",
                component: ({ data }) => (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {data.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({data.rated || 0})
                    </span>
                  </div>
                ),
              },
              {
                heading: "Actions",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-lg transition-colors"
                      title="Edit Lab Details"
                      onClick={() =>
                        navigate.push("/admin/labs/edit/about/" + data._id)
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>About</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 dark:text-orange-400 rounded-lg transition-colors"
                      title="Manage Tests"
                      onClick={() =>
                        navigate.push(`/admin/labs/edit/tests/${data._id}`)
                      }
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>Tests</span>
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                      title="Delete Lab"
                      onClick={() => deleteLab(data._id as string)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ],
            data: labData,
          }}
          pagination={{
            currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
          }}
          limit={{
            limit,
            options: [5, 10, 20, 50],
            onLimitChange: (val) => setLimit(val as number),
          }}
          onSearch={(val) => {
            setCurrentPage(1);
            setName(val);
          }}
          tag={{
            tags: ["All", "Kolkata", "Delhi", "Mumbai"], // Example tags, adjust as needed or remove if dynamic
            onTagChange: (tag) => {
              setCurrentPage(1);
              setLocation(tag);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Labs;

type Lab = {
  name: string;
  location: {
    address: {
      pin: string;
      city: string;
      district: string;
      other: string; // road details
    };
    location: {
      lat: number;
      lang: number;
    };
  };
  certification?: {
    organization: string;
    imageUrl?: string;
  };
  prices: {
    name: number;
    price: number;
    offer?: number;
  }[];
  packagesInclude?: {
    test: string;
    packages: string[];
  }[];
  ranges?: {
    test: string;
    ranges: object[];
  }[];
  createdAt: string;
  rating: number;
  rated: number;
  _id: string;
};
