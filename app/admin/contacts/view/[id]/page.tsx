// app/admin/contacts/view/[id]/page.tsx
"use client";
import fetcher from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import {
  FiMessageSquare,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

function ContactViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactDetails(id);
  }, [id]);

  async function getContactDetails(id: string) {
    setLoading(true);
    const res = await fetcher.get<Contact>(`/admin/contacts/${id}`);
    if (res.body && res.status === 200) setContact(res.body);
    setLoading(false);
  }

  if (loading) return <Loading />;
  if (!contact)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load contact details.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12 w-full mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FiMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Message Details
              </h2>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                  contact.status === "Resolved"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                }`}
              >
                {contact.status === "Resolved" ? (
                  <FiCheckCircle />
                ) : (
                  <FiAlertCircle />
                )}
                {contact.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
              ID: {contact._id}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate.push(`/admin/contacts/edit/${contact._id}`)}
          className="px-5 py-2 font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-xl transition-colors"
        >
          Edit Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Message Content
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {contact.subject || "No Subject"}
                </span>
              </div>
              <div className="w-full h-px bg-gray-100 dark:bg-white/10"></div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Message
                </span>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {contact.message || "No message provided."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Sender Details
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 dark:text-gray-400">Name</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {contact.name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 break-all">
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-3 border-t border-gray-100 dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400">
                  Received On
                </span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                  <FiClock className="text-gray-400" />
                  {new Date(contact.createdAt).toLocaleDateString()} at{" "}
                  {new Date(contact.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {contact.user && (
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Platform User
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-3 text-sm bg-blue-50/30 dark:bg-blue-500/5">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                  Sender is a registered user
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Account Name
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contact.user.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Account Email
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white break-all">
                    {contact.user.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {contact.status === "Resolved" && contact.resolvedBy && (
            <div className="bg-white dark:bg-[#111] border border-green-200 dark:border-green-500/20 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-green-100 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10">
                <h3 className="font-semibold text-green-800 dark:text-green-400">
                  Resolution Details
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Resolved By
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contact.resolvedBy.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Admin Email
                  </span>
                  <span className="font-medium text-gray-600 dark:text-gray-400 break-all">
                    {contact.resolvedBy.email}
                  </span>
                </div>
                {contact.resolvedAt && (
                  <div className="flex flex-col gap-1 pt-3 border-t border-gray-100 dark:border-white/10">
                    <span className="text-gray-500 dark:text-gray-400">
                      Resolved On
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(contact.resolvedAt).toLocaleDateString()} at{" "}
                      {new Date(contact.resolvedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactViewPage;

type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  user?: {
    name: string;
    email: string;
    _id: string;
  };
  status: "Pending" | "Resolved";
  resolvedAt?: string | null;
  resolvedBy?: {
    name: string;
    email: string;
    _id: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  _id: string;
};
