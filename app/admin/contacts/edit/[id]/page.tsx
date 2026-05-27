// app/admin/contacts/edit/[id]/page.tsx
"use client";
import fetcher from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import Input from "@/components/Inputs/Input";
import Dropdown from "@/components/Dropdown";
import { toast } from "react-toastify";
import {
  FiMessageSquare,
  FiUser,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

function ContactEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContactDetails(id);
  }, [id]);

  async function getContactDetails(id: string) {
    setLoading(true);
    const res = await fetcher.get<Contact>(`/admin/contacts/${id}`);
    if (res.body && res.status === 200) setContact(res.body);
    setLoading(false);
  }

  async function onSave() {
    if (!contact) return;
    setSaving(true);
    const res = await fetcher.put<{ status: "Pending" | "Resolved" }, Contact>(
      `/admin/contacts/${id}`,
      { status: contact.status },
    );
    if (res.body && res.status === 201) {
      setContact(res.body);
      toast.success("Ticket status updated successfully");
      navigate.push("/admin/contacts");
    } else {
      toast.error(res.error || "Error updating ticket");
    }
    setSaving(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12 w-full mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FiMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Support Ticket
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review and update the status of this inquiry.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Message Details
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Sender Name"
                  labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
                  value={contact?.name || ""}
                  onChange={() => {}}
                />
                <Input
                  label="Sender Email"
                  labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
                  value={contact?.email || ""}
                  onChange={() => {}}
                />
              </div>
              <Input
                label="Subject"
                labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
                value={contact?.subject || ""}
                onChange={() => {}}
              />
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Message Body
                </label>
                <div className="p-4 bg-gray-50 dark:bg-white/2 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap min-h-37.5">
                  {contact?.message || "No message provided."}
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
                Resolution Status
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Current Status
                </label>
                <Dropdown
                  width={"100%"}
                  value={contact?.status || ""}
                  options={["Pending", "Resolved"]}
                  onChange={(val) => {
                    if (contact)
                      setContact({
                        ...contact,
                        status: val.value as "Pending" | "Resolved",
                      });
                  }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <FiClock className="shrink-0" />
                <span>
                  Received:{" "}
                  {new Date(contact?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {contact?.user && (
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Registered User
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-3 text-sm">
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
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    User ID
                  </span>
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/10 mt-1">
                    {contact.user._id}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => navigate.back()}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-30"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Update Ticket"
          )}
        </button>
      </div>
    </div>
  );
}

export default ContactEditPage;

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
  } | null;
  createdAt: string;
  updatedAt: string;
  _id: string;
};
