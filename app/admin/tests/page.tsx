// app/admin/tests/page.tsx
"use client";
import Card from "@/components/Card";
import Table from "@/components/Table";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const Tests = () => {
  const [testData, setTestData] = useState<Test[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalTests: number;
    blood: number;
    urine: number;
    stool: number;
  }>({ totalTests: 0, blood: 0, urine: 0, stool: 0 });

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [branch, setBranch] = useState("All");
  const [type, setType] = useState("All");

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getAnalytics();
  }, []);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    const filterData: {
      department?: string;
      sampleType?: string;
      name?: string;
    } = { department: branch, sampleType: type, name: name };
    if (branch === "All") delete filterData.department;
    if (type === "All") delete filterData.sampleType;
    if (name === "") delete filterData.name;

    const res = await fetcher.get<{
      tests: Test[];
      pagination: { currentPage: number; pageSize: number; totalPages: number };
    }>(
      `/tests?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
    );
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    if (res.body) {
      setTestData(res.body.tests);
      setTotalPages(res.body.pagination.totalPages || 1);
      setCurrentPage(res.body.pagination.currentPage);
      setLimit(res.body.pagination.pageSize);
    }
    setLoading(false);
  }, [branch, type, name, currentPage, limit]);

  useEffect(() => {
    fetchTests();
  }, [branch, type, name, currentPage, limit, fetchTests]);

  async function getAnalytics() {
    const res = await fetcher.get<{
      totalTests: number;
      blood: number;
      urine: number;
      stool: number;
    }>("/admin/tests/analytics");
    if (res.status !== 200) return;
    if (res.body) {
      setAnalytics({
        totalTests: res.body.totalTests || 0,
        blood: res.body.blood || 0,
        urine: res.body.urine || 0,
        stool: res.body.stool || 0,
      });
    }
  }

  async function deleteTest(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this test? This action cannot be undone.",
      )
    )
      return;
    const res = await fetcher.delete(`/admin/tests/${id}`);
    if (res.status !== 200) return;
    await fetchTests();
  }

  return (
    <div className="flex flex-col mt-6 gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tests Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview and manage all diagnostic tests
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          onClick={() => navigate.push("/admin/tests/new")}
        >
          <FiPlus className="w-5 h-5" />
          <span>New Test</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          label="Total Tests"
          value={analytics.totalTests}
          colors={{ lineColor: "#f97316", iconBgColor: "#fff7ed" }}
          className="w-full"
        />
        <Card
          label="Blood Tests"
          value={analytics.blood}
          colors={{ lineColor: "#ef4444", iconBgColor: "#fef2f2" }}
          className="w-full"
        />
        <Card
          label="Urine Tests"
          value={analytics.urine}
          colors={{ lineColor: "#eab308", iconBgColor: "#fefce8" }}
          className="w-full"
        />
        <Card
          label="Stool Tests"
          value={analytics.stool}
          colors={{ lineColor: "#8b5cf6", iconBgColor: "#f5f3ff" }}
          className="w-full"
        />
      </div>

      {/* Main Table */}
      <div className="w-full">
        <Table<Test>
          name="Test Directory"
          loading={loading}
          table={{
            config: [
              {
                heading: "Test Name",
                selector: "name",
                component: ({ data }) => (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.name}
                  </span>
                ),
              },
              {
                heading: "Sample Type",
                selector: "sampleType",
                component: ({ data }) => (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
                    {data.sampleType}
                  </span>
                ),
              },
              {
                heading: "Created Date",
                selector: "createdAt",
                hideAble: true,
                component: ({ data }) => (
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ),
              },
              {
                heading: "Actions",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Details"
                      onClick={() => navigate.push("/tests/" + data._id)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                      title="Edit Test"
                      onClick={() =>
                        navigate.push(`/admin/tests/edit/${data._id}`)
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Test"
                      onClick={() => deleteTest(data._id as string)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ],
            data: testData,
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
            tags: ["All", "Blood", "Urine", "Stool"],
            onTagChange: (tag) => {
              setCurrentPage(1);
              setType(tag);
            },
          }}
          dropdown={{
            options: [
              "All",
              "Blood",
              "Urine",
              "Semen",
              "Stool",
              "Sputum",
              "Other body fluid",
            ],
            value: branch || "All",
            onChange: (value) => {
              setCurrentPage(1);
              setBranch(value as string);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Tests;

type Test = {
  name: string;
  sampleType:
    | "Blood"
    | "Urine"
    | "Semen"
    | "Stool"
    | "Sputum"
    | "Other body fluid";
  tubeType:
    | "Clot/Plain tube (red color cap)"
    | "Fluoride/Sugar tube (gray color cap)"
    | "EDTA tube (purple color cap)"
    | "Citrate tube (blue color cap)";
  description: string;
  fastingRequired: string;
  overview: string;
  testResultInterpretation: string;
  riskAssesment: string;
  resultTime: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
};
