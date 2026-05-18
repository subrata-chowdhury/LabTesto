// app/(mainLayout)/order/page.tsx
"use client";
import Model from "@/components/Model";
import fetcher from "@/lib/fetcher";
import React, { useEffect, useState } from "react";
import ReviewForm, { ReviewType } from "../../components/ReviewForm";
import { useRouter } from "next/navigation";
import OrdersLoading from "./loading";
import Pagination from "@/components/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiCalendar, FiChevronRight, FiInbox } from "react-icons/fi";

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModel, setShowReviewModel] = useState<{
    orderId: string;
    item: { test: string; lab: string };
  } | null>(null);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState("All");
  const navigate = useRouter();

  const statuses = [
    "All",
    "Ordered",
    "Out for Sample Collection",
    "Sample Collected",
    "Report Delivered to Lab",
    "Report Generated",
    "Out for Report Delivery",
    "Report Delivered",
    "Canceled",
  ];

  useEffect(() => {
    fetchOrder();
  }, [status, currentPage]);

  async function fetchOrder() {
    setLoading(true);
    try {
      const filterData: { status?: string; date?: string; name?: string } = {
        status: status,
      };
      if (status === "All") delete filterData.status;
      const response = await fetcher.get<{
        orders: Order[];
        pagination: {
          currentPage: number;
          pageSize: number;
          totalPages: number;
        };
      }>(
        `/orders?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`,
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch order");
      }
      if (response.body) {
        const sortedOrders = response.body.orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedOrders);
        setTotalPages(response.body.pagination.totalPages || 1);
        setCurrentPage(response.body.pagination.currentPage);
        setLimit(response.body.pagination.pageSize);
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

  if (loading && orders.length === 0) return <OrdersLoading />;

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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-xl">
            <FiPackage size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Orders
          </h1>
        </div>

        {/* Scrollable Filters */}
        <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {statuses.map((e, index) => {
            const isActive = status === e;
            return (
              <button
                key={index}
                className={`whitespace-nowrap px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 dark:bg-white dark:text-black"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50 dark:bg-[#111] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
                onClick={() => {
                  setStatus(e);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
              >
                {e}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
          </div>
        ) : orders?.length <= 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col justify-center items-center h-[50vh] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mt-4"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <FiInbox size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No Orders Found
            </h2>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              You don't have any orders matching the selected status.
            </p>
          </motion.div>
        ) : (
          <>
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout">
                {orders.map((order, outerIndex) => (
                  <motion.li
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={order._id}
                    onClick={() => navigate.push("/order/" + order._id)}
                    className="group bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {order.items.map((e) => e.product.test.name).join(", ")}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <StatusBadge status={order.status} />
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                          <FiCalendar size={14} />
                          {new Date(order.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-white transition-colors shrink-0">
                      <FiChevronRight size={20} />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {showReviewModel && (
          <ReviewModel
            onSave={async (review) => {
              const res = await fetcher.put<
                { product: { test: string; lab: string }; review: ReviewType },
                { message: string } | string
              >("/orders/" + showReviewModel.orderId, {
                product: showReviewModel.item,
                review: review,
              });
              if (res.status === 200) fetchOrder();
            }}
            onClose={() => setShowReviewModel(null)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;

// --- Helper Components ---

function StatusBadge({ status }: { status: Order["status"] }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Ordered":
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "Report Delivered":
        return "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "Canceled":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "Report Generated":
      case "Report Delivered to Lab":
        return "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
      case "Out for Sample Collection":
      case "Out for Report Delivery":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Sample Collected":
        return "bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusConfig(
        status,
      )} uppercase tracking-wider`}
    >
      {status}
    </span>
  );
}

function ReviewModel({
  onClose = () => {},
  onSave = () => {},
}: {
  onClose: () => void;
  onSave: (review: ReviewType) => void;
}) {
  return (
    <Model heading="Review" className="w-100" onClose={onClose}>
      <ReviewForm onSave={onSave} />
    </Model>
  );
}

// --- Types ---

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
  collector?: {
    name: string;
    email: string;
    phone?: string;
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
  statusRecords: {
    status:
      | "Out for Sample Collection"
      | "Sample Collected"
      | "Report Delivered to Lab"
      | "Report Generated"
      | "Out for Report Delivery"
      | "Report Delivered"
      | "Canceled";
    date: string;
  }[];
  paid: number;
  createdAt: string;
  updatedAt: string;
};
