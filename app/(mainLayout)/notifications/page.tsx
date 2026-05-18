// app/(mainLayout)/notifications/page.tsx
"use client";
import fetcher from "@/lib/fetcher";
import React, { useEffect, useState, JSX } from "react";
import { useRouter } from "next/navigation";
import NotificationLoading from "./loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiTruck,
  FiChevronRight,
} from "react-icons/fi";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useRouter();

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const filter = {
        status: {
          $in: ["Out for Sample Collection", "Out for Report Delivery"],
        },
      };
      const response = await fetcher.get<{ orders: Order[] }>(
        `/orders?filter=${JSON.stringify(filter)}`,
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch order");
      }
      if (response.body) {
        const sortedOrders = response.body.orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setNotifications(
          sortedOrders.map((e) => ({
            heading: "Collector Status Update",
            type: "warning", // or derive based on specific status
            subText: (
              <p>
                Collector is <span className="font-semibold">{e.status}</span>{" "}
                for {e.items.map((e) => e.product.test.name).join(", ")}. Please
                be prepared.
              </p>
            ),
            link: { href: "/order/" + e._id, as: "View Order" },
            icon: <FiTruck size={20} />,
          })),
        );
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <NotificationLoading />;

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center bg-gray-50 dark:bg-black min-h-screen pb-20">
      <div className="w-full max-w-4xl px-4 py-8 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-xl">
            <FiBell size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Notifications
          </h1>
        </div>

        {notifications?.length <= 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col justify-center items-center h-[50vh] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <FiBell size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Caught Up!
            </h2>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              You don't have any new notifications at the moment. We'll alert
              you here when there are updates on your orders.
            </p>
          </motion.div>
        ) : (
          <ul className="space-y-4 flex-1">
            <AnimatePresence>
              {notifications.map((notification, outerIndex) => {
                // Determine styling based on type
                let colorClass =
                  "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-blue-400 dark:border-primary/30";
                let icon = notification.icon || <FiInfo size={20} />;

                if (notification.type === "warning") {
                  colorClass =
                    "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
                  if (!notification.icon) icon = <FiAlertCircle size={20} />;
                } else if (notification.type === "success") {
                  colorClass =
                    "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
                  if (!notification.icon) icon = <FiCheckCircle size={20} />;
                } else if (notification.type === "danger") {
                  colorClass =
                    "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
                  if (!notification.icon) icon = <FiAlertCircle size={20} />;
                }

                return (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: outerIndex * 0.05 }}
                    key={outerIndex}
                    onClick={() =>
                      notification.link?.href
                        ? navigate.push(notification.link.href)
                        : ""
                    }
                    className={`group bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-5 flex items-start sm:items-center gap-4 ${
                      notification.link?.href ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>
                      {icon}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white text-lg">
                        {notification.heading}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {notification.subText}
                      </div>
                    </div>

                    {notification.link?.href && (
                      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-white transition-colors shrink-0">
                        <FiChevronRight size={20} />
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

export type Order = {
  _id: string;
  items: {
    product: {
      test: { name: string; _id: string };
      lab: {
        name: string;
        _id: string;
        location: { address: { pin: string } };
      };
      price: number;
    };
    patientDetails: {
      name: string;
      gender: "Male" | "Female" | "Other";
      age: number;
      other?: string;
    }[];
    quantity: number;
    date?: Date;
  }[];
  address: {
    pin: number;
    city: string;
    district: string;
    other?: string;
    phone: string;
  };

  user: {
    email: string;
    name: string;
  };
  collector?: string;
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
    start?: string;
    end?: string;
  };
  reportDeliverTime: {
    start?: string;
    end?: string;
  };
  review: {
    test: string;
    lab: string;
    labRating: number;
    collectorRating: number;
    platformRating: number;
    reviewText: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

type Notification = {
  heading: string;
  subText?: JSX.Element;
  type: "warning" | "danger" | "normal" | "success";
  link?: {
    href: string;
    as?: string;
  };
  icon?: JSX.Element;
};
