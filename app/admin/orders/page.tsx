// app/admin/orders/page.tsx
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
  FiClock,
} from "react-icons/fi";

const Orders = () => {
  const [testData, setOrderData] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalOrders: number;
    canceled: number;
    ordered: number;
    sampleCollected: number;
  }>({ totalOrders: 0, canceled: 0, ordered: 0, sampleCollected: 0 });

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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const filterData: { status?: string; date?: string; name?: string } = {
      status: branch,
      date: type,
      name: name,
    };
    if (branch === "All") delete filterData.status;
    if (type === "All") delete filterData.date;
    if (type === "Today") filterData.date = new Date().toISOString();
    if (name === "") delete filterData.name;

    const res = await fetcher.get<{
      orders: Order[];
      pagination: { currentPage: number; pageSize: number; totalPages: number };
    }>(
      `/admin/orders?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
    );
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    if (res.body) {
      setOrderData(res.body.orders);
      setTotalPages(res.body.pagination.totalPages || 1);
      setCurrentPage(res.body.pagination.currentPage);
      setLimit(res.body.pagination.pageSize);
    }
    setLoading(false);
  }, [branch, type, name, currentPage, limit]);

  useEffect(() => {
    fetchOrders();
  }, [branch, type, name, currentPage, limit, fetchOrders]);

  async function getAnalytics() {
    const res = await fetcher.get<{
      totalOrders: number;
      canceled: number;
      ordered: number;
      sampleCollected: number;
    }>("/admin/orders/analytics");
    if (res.status !== 200) return;
    if (res.body) {
      setAnalytics({
        totalOrders: res.body.totalOrders || 0,
        canceled: res.body.canceled || 0,
        ordered: res.body.ordered || 0,
        sampleCollected: res.body.sampleCollected || 0,
      });
    }
  }

  async function deleteOrder(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    const res = await fetcher.delete(`/admin/orders/${id}`);
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    await fetchOrders();
    getAnalytics();
  }

  return (
    <div className="flex flex-col mt-6 gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and manage test bookings, samples, and reports.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          onClick={() => navigate.push("/admin/orders/new")}
        >
          <FiPlus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          label="Total Orders"
          value={analytics.totalOrders}
          colors={{ lineColor: "#3b82f6", iconBgColor: "#eff6ff" }}
          className="w-full"
        />
        <Card
          label="Ordered (New)"
          value={analytics.ordered}
          colors={{ lineColor: "#f97316", iconBgColor: "#fff7ed" }}
          className="w-full"
        />
        <Card
          label="Sample Collected"
          value={analytics.sampleCollected}
          colors={{ lineColor: "#10b981", iconBgColor: "#ecfdf5" }}
          className="w-full"
        />
        <Card
          label="Canceled"
          value={analytics.canceled}
          colors={{ lineColor: "#ef4444", iconBgColor: "#fef2f2" }}
          className="w-full"
        />
      </div>

      {/* Main Table */}
      <div className="w-full">
        <Table<Order>
          name="Order Directory"
          loading={loading}
          table={{
            config: [
              {
                heading: "User",
                selector: "user",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {data.user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {data.user.email}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                heading: "Collector",
                selector: "collector",
                component: ({ data }) => (
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {data.collector?.name || (
                        <span className="text-orange-500 italic">
                          Unassigned
                        </span>
                      )}
                    </div>
                    {data.collector?.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {data.collector.email}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                heading: "Status",
                selector: "status",
                component: ({ data }) => <ColoredStatus status={data.status} />,
              },
              {
                heading: "Date",
                selector: "createdAt",
                hideAble: true,
                component: ({ data }) => (
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                    <FiClock className="w-4 h-4 shrink-0" />
                    <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                  </div>
                ),
              },
              {
                heading: "Actions",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Order"
                      onClick={() =>
                        navigate.push("/admin/orders/view/" + data._id)
                      }
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                      title="Edit Order"
                      onClick={() =>
                        navigate.push(`/admin/orders/edit/${data._id}`)
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Order"
                      onClick={() => deleteOrder(data._id as string)}
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
            tags: ["All", "Today"],
            onTagChange: (tag) => {
              setCurrentPage(1);
              setType(tag);
            },
          }}
          dropdown={{
            options: [
              "All",
              "Ordered",
              "Out for Sample Collection",
              "Sample Collected",
              "Report Delivered to Lab",
              "Report Generated",
              "Out for Report Delivery",
              "Report Delivered",
              "Canceled",
            ],
            value: branch || "All",
            onChange: (value) => {
              setCurrentPage(1);
              setBranch(value as string);
            },
            width: 200,
          }}
        />
      </div>
    </div>
  );
};

export default Orders;

export function ColoredStatus({ status }: { status: Order["status"] }) {
  const statusStyles: Record<string, string> = {
    Ordered:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    "Out for Sample Collection":
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    "Sample Collected":
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
    "Report Delivered to Lab":
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    "Report Generated":
      "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
    "Out for Report Delivery":
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    "Report Delivered":
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    Canceled:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  };

  const currentStyle =
    statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${currentStyle} whitespace-nowrap`}
    >
      {status}
    </span>
  );
}

type Order = {
  items: {
    product: {
      test: string;
      lab: string;
      price: number;
    };
    patientDetails: {
      name: string;
      phone: string;
      address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
      };
    }[];
    quantity: number;
    date?: Date;
  }[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  collector?: {
    _id: string;
    name: string;
    email: string;
  };
  status:
    | "Ordered"
    | "Out for Sample Collection"
    | "Sample Collected"
    | "Report Delivered to Lab"
    | "Report Generated"
    | "Out for Report Delivery"
    | "Report Delivered"
    | "Canceled";
  sampleTakenDateTime: {
    start?: Date;
    end?: Date;
  };
  reportDeliverTime: {
    start?: Date;
    end?: Date;
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
};
