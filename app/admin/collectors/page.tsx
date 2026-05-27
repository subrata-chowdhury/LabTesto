// app/admin/collectors/page.tsx
"use client";
import Card from "@/components/Card";
import Table from "@/components/Table";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";
import {
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

const Collectors = () => {
  const [collectorData, setCollectorData] = useState<Collector[]>([]);
  const [analytics, setAnalytics] = useState<{ total: number }>({ total: 0 });

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("All");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [totalPages, setTotalPages] = useState(0);

  const fetchCollectors = useCallback(async () => {
    setLoading(true);
    const filterData: { sampleType?: string; name?: string } = {
      sampleType: type,
      name: name,
    };
    if (type === "All") delete filterData.sampleType;
    if (name === "") delete filterData.name;

    const res = await fetcher.get<{
      collectors: Collector[];
      pagination: {
        totalCollectors: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    }>(
      `/admin/collectors?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
    );

    if (res.status !== 200) {
      setLoading(false);
      return;
    }

    if (res.body) {
      setCollectorData(res.body.collectors);
      setTotalPages(res.body.pagination.totalPages || 1);
      setCurrentPage(res.body.pagination.currentPage);
      setLimit(res.body.pagination.pageSize);
      setAnalytics({ total: res.body.pagination.totalCollectors });
    }
    setLoading(false);
  }, [type, name, currentPage, limit]);

  useEffect(() => {
    fetchCollectors();
  }, [type, name, currentPage, limit, fetchCollectors]);

  async function deleteCollector(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this collector? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    const res = await fetcher.delete(`/admin/collectors/${id}`);
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    await fetchCollectors();
  }

  return (
    <div className="flex mt-6 flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sample Collectors
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage field phlebotomists and sample collection agents
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          onClick={() => navigate.push("/admin/collectors/new")}
        >
          <FiPlus className="w-5 h-5" />
          <span>New Collector</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          label="Total Active Collectors"
          value={analytics.total}
          colors={{ lineColor: "#f97316", iconBgColor: "#fff7ed" }}
          className="w-full"
        />
      </div>

      {/* Main Table */}
      <div className="w-full">
        <Table<Collector>
          name="Collector Directory"
          loading={loading}
          table={{
            config: [
              {
                heading: "Collector Info",
                selector: "name",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {data.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {data.email}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Experience",
                selector: "experience",
                component: ({ data }) => (
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <FiBriefcase className="w-4 h-4 text-gray-400" />
                    <span>
                      {data.experience ? `${data.experience} Years` : "Fresher"}
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
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Profile"
                      onClick={() => navigate.push("/collectors/" + data._id)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                      title="Edit Collector"
                      onClick={() =>
                        navigate.push(`/admin/collectors/edit/${data._id}`)
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Collector"
                      onClick={() => deleteCollector(data._id as string)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ],
            data: collectorData,
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
            tags: ["All", "Top Rated", "New"],
            onTagChange: (tag) => {
              setCurrentPage(1);
              setType(tag);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Collectors;

type Collector = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  adhaar?: string;
  experience?: number;
  qualification?: {
    degree?: string;
    college?: string;
    year?: number;
  }[];
  createdAt: Date;
  rating: number;
  rated: number;
  _id: string;
};
