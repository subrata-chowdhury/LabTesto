// app/(mainLayout)/contact/components/MainContactForm.tsx
"use client";
import React, { useState } from "react";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function MainForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  async function sendData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetcher.post("/contact", formData);
      if (res.status === 200) {
        toast.success("Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyles =
    "w-full outline-none border border-gray-200 dark:border-white/10 rounded-lg mt-1.5 bg-gray-50 dark:bg-[#1a1a1a] text-primary dark:text-white text-sm p-3 focus:bg-white dark:focus:bg-[#222] focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500";
  const labelStyles =
    "text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1";

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 md:p-8 flex flex-col rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/[0.02] bg-white dark:bg-[#111] w-full"
      onSubmit={sendData}
    >
      <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
        Send Us a Message
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col flex-1">
          <label htmlFor="name" className={labelStyles}>
            Name <span className="text-orange-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputStyles}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="email" className={labelStyles}>
            Email / Phone <span className="text-orange-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputStyles}
          />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="subject" className={labelStyles}>
          Subject <span className="text-orange-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          placeholder="How can we help you?"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col mb-8">
        <label htmlFor="message" className={labelStyles}>
          Message <span className="text-orange-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Write your message here..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`${inputStyles} resize-y min-h-28`}
          rows={4}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 font-semibold cursor-pointer rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </motion.form>
  );
}
