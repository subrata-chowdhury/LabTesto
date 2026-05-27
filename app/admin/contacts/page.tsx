// app/admin/contacts/page.tsx
"use client";
import Card from "@/components/Card";
import Table from "@/components/Table";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";

const Contacts = () => {
  const [testData, setOrderData] = useState<Contact[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalContacts: number;
    resolved: number;
    pending: number;
  }>({ totalContacts: 0, resolved: 0, pending: 0 });

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

  const fetchContacts = useCallback(async () => {
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
      contacts: Contact[];
      pagination: { currentPage: number; pageSize: number; totalPages: number };
    }>(
      `/admin/contacts?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
    );
    if (res.status !== 200) {
      setLoading(false);
      return;
    }
    if (res.body) {
      setOrderData(res.body.contacts);
      setTotalPages(res.body.pagination.totalPages || 1);
      setCurrentPage(res.body.pagination.currentPage);
      setLimit(res.body.pagination.pageSize);
    }
    setLoading(false);
  }, [branch, type, name, currentPage, limit]);

  useEffect(() => {
    fetchContacts();
  }, [branch, type, name, currentPage, limit, fetchContacts]);

  async function getAnalytics() {
    const res = await fetcher.get<{
      totalContacts: number;
      resolved: number;
      pending: number;
    }>("/admin/contacts/analytics");
    if (res.status !== 200) return;
    if (res.body) {
      setAnalytics(res.body);
    }
  }

  async function deleteContact(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this contact message? This action cannot be undone.",
      )
    )
      return;
    const res = await fetcher.delete(`/admin/contacts/${id}`);
    if (res.status !== 200) return;
    if (res.status === 200 && res.body) {
      toast.success("Message deleted successfully!");
    }
    await fetchContacts();
    getAnalytics();
  }

  return (
    <div className="flex flex-col gap-6 mt-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support Messages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user inquiries, feedback, and support tickets.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          label="Total Messages"
          value={analytics.totalContacts}
          colors={{ lineColor: "#3b82f6", iconBgColor: "#eff6ff" }}
          className="w-full"
        />
        <Card
          label="Pending Responses"
          value={
            analytics.pending || analytics.totalContacts - analytics.resolved
          }
          colors={{ lineColor: "#ef4444", iconBgColor: "#fef2f2" }}
          className="w-full"
        />
        <Card
          label="Resolved Tickets"
          value={analytics.resolved}
          colors={{ lineColor: "#10b981", iconBgColor: "#ecfdf5" }}
          className="w-full"
        />
      </div>

      {/* Main Table */}
      <div className="w-full">
        <Table<Contact>
          name="Inbox"
          loading={loading}
          table={{
            config: [
              {
                heading: "Sender",
                selector: "user",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
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
                heading: "Subject",
                selector: "subject",
                component: ({ data }) => (
                  <div className="flex flex-col">
                    <span
                      className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-50"
                      title={data.subject}
                    >
                      {data.subject || "No Subject"}
                    </span>
                    <span
                      className="text-xs text-gray-500 truncate max-w-50"
                      title={data.message}
                    >
                      {data.message}
                    </span>
                  </div>
                ),
              },
              {
                heading: "Assigned To",
                selector: "resolvedBy",
                hideAble: true,
                component: ({ data }) => (
                  <div>
                    {data.resolvedBy ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {data.resolvedBy.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Unassigned
                      </span>
                    )}
                  </div>
                ),
              },
              {
                heading: "Status",
                selector: "status",
                component: ({ data }) => <ColoredStatus data={data} />,
              },
              {
                heading: "Date",
                selector: "createdAt",
                hideAble: true,
                component: ({ data }) => (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </span>
                ),
              },
              {
                heading: "Actions",
                component: ({ data }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Message"
                      onClick={() =>
                        navigate.push("/admin/contacts/view/" + data._id)
                      }
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                      title="Resolve/Edit Ticket"
                      onClick={() =>
                        navigate.push(`/admin/contacts/edit/${data._id}`)
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Ticket"
                      onClick={() => deleteContact(data._id)}
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
            options: ["All", "Pending", "Resolved"],
            value: branch || "All",
            onChange: (value) => {
              setCurrentPage(1);
              setBranch(value as string);
            },
            width: 150,
          }}
        />
      </div>
    </div>
  );
};

export default Contacts;

function ColoredStatus({ data }: { data: Contact }) {
  if (data.status === "Resolved")
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
        Resolved
      </span>
    );
  if (data.status === "Pending")
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
        Pending
      </span>
    );

  return <span>{data.status}</span>;
}

type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  user?: {
    name: string;
    email: string;
  };
  status: "Pending" | "Resolved";
  resolvedAt?: string | null;
  resolvedBy?: {
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  _id: string;
};
