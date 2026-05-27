// app/admin/components/OutdatedOrders.tsx
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function OutdatedOrders() {
  const [outdatedOrders, setOutdatedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOutdatedOrders() {
      setLoading(true);
      const res = await fetcher.get<{
        orders: Order[];
        pagination: {
          currentPage: number;
          pageSize: number;
          totalPages: number;
        };
      }>(
        `/admin/orders?filter=${JSON.stringify({ "sampleTakenDateTime.end": { $lt: new Date() }, status: { $in: ["Ordered", "Out for Sample Collection"] } })}&limit=${9999}`,
      );
      if (res.status === 200 && res.body) {
        setOutdatedOrders(res.body.orders);
      }
      setLoading(false);
    }
    fetchOutdatedOrders();
  }, []);

  const orderedOrders = outdatedOrders.filter((o) => o.status === "Ordered");
  const outForCollectionOrders = outdatedOrders.filter(
    (o) => o.status === "Out for Sample Collection",
  );

  return (
    <div className="bg-white dark:bg-[#111] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-white/[0.02] w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-500/20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-white leading-tight">
              Outdated Orders
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Requires immediate attention
            </p>
          </div>
        </div>
        <span className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 py-1 px-3 rounded-full text-xs font-bold">
          {outdatedOrders.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 dark:bg-white/5 h-20 rounded-2xl w-full"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {outdatedOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-3">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  All caught up! No outdated orders.
                </p>
              </div>
            )}

            {orderedOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-[#111]/90 backdrop-blur z-10 py-1">
                  Ordered
                </h3>
                {orderedOrders.map((order) => (
                  <OutdatedOrderCard order={order} key={order._id} />
                ))}
              </div>
            )}

            {outForCollectionOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-[#111]/90 backdrop-blur z-10 py-1">
                  Out for Collection
                </h3>
                {outForCollectionOrders.map((order) => (
                  <OutdatedOrderCard order={order} key={order._id} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OutdatedOrderCard({ order }: { order: Order }) {
  const dateObj = order.sampleTakenDateTime?.start
    ? new Date(order.sampleTakenDateTime.start)
    : null;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-gray-100 dark:border-white/5 border-l-4 border-l-orange-500 rounded-2xl transition-colors duration-300">
      <div>
        <div className="text-xs text-gray-400 mb-1 font-mono">
          ID: {order._id.slice(-8).toUpperCase()}
        </div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-orange-500"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {dateObj
            ? `${dateObj.toDateString()} at ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "N/A"}
        </div>
      </div>
      <div className="flex text-sm items-center gap-2 mt-2 sm:mt-0">
        <Link
          href={"/admin/orders/view/" + order._id}
          className="flex items-center justify-center px-4 py-2 font-medium bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-xl hover:shadow-md hover:border-blue-500/30 transition-all duration-300"
        >
          View
        </Link>
        <button
          className="flex items-center justify-center px-4 py-2 font-medium bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
          onClick={async () => {
            await fetcher
              .post<
                { id: string },
                string
              >("/admin/orders/" + order._id + "/pass", { id: order._id })
              .then((res) => {
                if (res.status === 200 && res.body) {
                  toast.success(
                    res.body || "Successfully Passed to another collector",
                  );
                } else {
                  toast.warning(res.body || "Unable to Pass");
                }
              });
          }}
        >
          Pass
        </button>
      </div>
    </div>
  );
}

// Order type interface kept identical to original
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
        other?: string;
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
    start?: string;
    end?: string;
  };
  reportDeliverTime: {
    start?: string;
    end?: string;
  };
  _id: string;
};
