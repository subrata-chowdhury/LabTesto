// app/(mainLayout)/order/[id]/page.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Order } from "../page";
import fetcher from "@/lib/fetcher";
import { PatientDetails } from "@/app/components/popups/PatientDetailsPopup";
import Model from "@/components/Model";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import ReviewForm, { ReviewType } from "@/app/components/ReviewForm";
import Loading from "./loading";
import ConfirmationModel from "@/app/components/popups/ConfirmationModel";
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiClock,
  FiCalendar,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiStar,
} from "react-icons/fi";

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

function OrderPage() {
  const [order, setOrder] = useState<Order>();
  const [showPatientPopup, setShowPatientPopup] = useState<{
    itemIndex: number;
    patientIndex: number;
  } | null>(null);
  const [showReviewModel, setShowReviewModel] = useState<{
    orderId: string;
    item: { test: string; lab: string };
    index: number;
  } | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetcher.get<Order>("/orders/" + id);
      if (response.status !== 200) {
        toast.error(response.error || "Unable to fetch order details");
      }
      if (response.status === 200) setLoading(false);
      if (response.body) {
        return response.body;
      }
    } catch {
      toast.error("Unable to fetch data");
    }
    setLoading(false);
  }, [id]);

  const handlePayment = async () => {
    if (!order) {
      toast.error("Order not found");
      return;
    }
    const totalPrice = order.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    const res = await fetcher.post<
      { amount: number; id: string | string[] | undefined },
      { orderId: string }
    >("/orders/pay", {
      amount: totalPrice,
      id: id,
    });

    if (res.status !== 200) {
      toast.error(res.error || "Unable to initiate payment");
      return;
    }

    if (!res.body || !res.body.orderId) {
      toast.error("Invalid response from payment API");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: totalPrice * 100,
      currency: "INR",
      name: "LabTesto",
      description: "Test Payment",
      order_id: res.body.orderId,
      handler: async function (response: {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
      }) {
        if (
          !response ||
          !response.razorpay_order_id ||
          !response.razorpay_payment_id ||
          !response.razorpay_signature
        ) {
          toast.error("Payment failed or cancelled");
          return;
        }
        // verifying payment on server
        const verifyRes = await fetcher.post<
          {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
            id?: string[] | string;
          },
          { orderId: string }
        >("/orders/pay/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          id: id,
        });
        if (verifyRes.status !== 200) {
          toast.error(verifyRes.error || "Unable to verify payment");
          return;
        }
        toast.success("Payment successful!");
        setOrder(await fetchOrderDetails()); // refresh order data
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    async function startUp() {
      setOrder(await fetchOrderDetails());
    }
    startUp();
  }, [fetchOrderDetails]);

  if (loading) return <Loading />;
  if (!order)
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 font-medium">
        Order Not Found
      </div>
    );

  const isPaid =
    order.paid >=
    order.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  const totalAmount = order.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="flex-1 bg-gray-50 dark:bg-black min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Order Details
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                #{order?._id.toUpperCase()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <StatusBadge status={order.status} />

            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              {order.status === "Ordered" && (
                <button
                  className="flex-1 sm:flex-none border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  onClick={() => setShowConfirmPopup(true)}
                >
                  Cancel Order
                </button>
              )}
              {order.status === "Report Generated" && (
                <button
                  className="flex-1 sm:flex-none bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  onClick={async () => {
                    const res = await fetcher.put<
                      { status: Order["status"] },
                      { message: string } | string
                    >("/orders/" + order._id, {
                      status: "Report Delivered",
                    });
                    if (res.status === 200) setOrder(await fetchOrderDetails());
                  }}
                >
                  Mark as Delivered
                </button>
              )}
              {!isPaid && order.status !== "Canceled" && (
                <button
                  className="flex-1 sm:flex-none bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-xl transition-colors font-bold text-sm shadow-sm"
                  onClick={handlePayment}
                >
                  Pay ₹{totalAmount.toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Items and Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Ordered Items List */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white px-1">
                Tests Ordered
              </h2>
              {order?.items.map((item, index) => (
                <div
                  className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden"
                  key={index}
                >
                  <div className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.product.test.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.product.lab.name},{" "}
                        {item.product.lab.location.address.pin}
                      </div>
                      <div className="mt-2 text-lg font-bold text-primary dark:text-blue-400">
                        ₹{(item.product.price || 0) * item.quantity}
                        <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-2">
                          (Qty: {item.quantity})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center sm:items-end gap-3 mt-2 sm:mt-0">
                      {order.status === "Report Delivered" && (
                        <button
                          className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          onClick={() => {
                            setShowReviewModel({
                              orderId: order._id,
                              item: {
                                test: item.product.test._id,
                                lab: item.product.lab._id,
                              },
                              index: index,
                            });
                          }}
                        >
                          <FiStar /> Write a Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Patient Details Inline */}
                  {order.items[index]?.patientDetails?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-white/5 p-4 border-t border-gray-100 dark:border-white/5">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Patients for this test
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array(item.quantity)
                          .fill(0)
                          .map((_, i) => {
                            const patient =
                              order.items[index]?.patientDetails[i];
                            const hasPatient = !!patient?.name;
                            return (
                              <button
                                key={i}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                  hasPatient
                                    ? "bg-blue-50 text-primary border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50"
                                    : "bg-white text-gray-600 border-dashed border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-gray-400"
                                }`}
                                onClick={() => {
                                  if (hasPatient) {
                                    setShowPatientPopup({
                                      itemIndex: index,
                                      patientIndex: i,
                                    });
                                  }
                                }}
                              >
                                <FiUser size={14} />
                                {hasPatient
                                  ? patient.name.split(" ")[0]
                                  : "Missing Data"}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Address & Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scheduling Card */}
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FiClock
                    className="text-primary dark:text-blue-400"
                    size={20}
                  />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sample Schedule
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Estimated Start Time
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(
                        order?.sampleTakenDateTime?.start || "",
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {" • "}
                      {new Date(
                        order?.sampleTakenDateTime?.start || "",
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Estimated End Time
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(
                        order?.sampleTakenDateTime?.end || "",
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {" • "}
                      {new Date(
                        order?.sampleTakenDateTime?.end || "",
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FiMapPin
                    className="text-primary dark:text-blue-400"
                    size={20}
                  />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delivery Address
                  </h3>
                </div>
                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                    {order.user.name}
                  </p>
                  <p>
                    {order?.address?.city}, {order?.address?.district}
                  </p>
                  <p>PIN: {order?.address?.pin}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                    <FiPhone className="text-gray-400" />
                    <span>{order?.address?.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collector Details */}
            {!(
              order.status === "Report Delivered" || order.status === "Canceled"
            ) &&
              order.collector && (
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FiUser
                      className="text-primary dark:text-blue-400"
                      size={20}
                    />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Collector Assigned
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Name
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.collector.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Contact
                      </p>
                      <div className="flex flex-col gap-1 text-sm">
                        {order.collector.phone && (
                          <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <FiPhone className="text-gray-400" />{" "}
                            {order.collector.phone}
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <FiMail className="text-gray-400" />{" "}
                          {order.collector.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Right Column: Status Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Order Timeline
              </h3>

              <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 space-y-6">
                {/* Initial Order Node */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-white dark:ring-[#111]"></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Order Placed
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* History Nodes */}
                {order.statusRecords.map((record, index) => {
                  // Determine color based on status for the timeline dot
                  let dotColor = "bg-primary";
                  if (record.status === "Canceled") dotColor = "bg-red-500";
                  if (record.status === "Report Delivered")
                    dotColor = "bg-green-500";

                  return (
                    <div className="relative pl-6" key={record.date}>
                      <div
                        className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${dotColor} ring-4 ring-white dark:ring-[#111]`}
                      ></div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {record.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(record.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showPatientPopup?.itemIndex != null && (
        <PatientDetailsPopup
          patientDetails={
            order?.items[showPatientPopup?.itemIndex || 0].patientDetails[
              showPatientPopup.patientIndex
            ]
          }
          onClose={() => setShowPatientPopup(null)}
        />
      )}

      {showReviewModel && (
        <ReviewModel
          reviewDetails={order.review[showReviewModel.index]}
          onSave={async (review) => {
            const res = await fetcher.put<
              { product: { test: string; lab: string }; review: ReviewType },
              { message: string } | string
            >("/orders/" + showReviewModel.orderId, {
              product: showReviewModel.item,
              review: review,
            });
            if (res.status === 200) {
              toast.success("Review Saved successfully!");
              setOrder(await fetchOrderDetails());
              setShowReviewModel(null);
            }
          }}
          onClose={() => setShowReviewModel(null)}
        />
      )}

      {showConfirmPopup && (
        <ConfirmationModel
          msg={
            <div className="px-6 pt-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mb-4">
                <FiXCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Cancel Order?
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
            </div>
          }
          onDecline={() => setShowConfirmPopup(false)}
          onApprove={async () => {
            const res = await fetcher.put<
              { status: Order["status"] },
              { message: string } | string
            >("/orders/" + order._id, {
              status: "Canceled",
            });
            if (res.status === 200) {
              toast.success("Order has been canceled");
              setOrder(await fetchOrderDetails());
              setShowConfirmPopup(false);
            }
          }}
        />
      )}
    </div>
  );
}

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
      className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${getStatusConfig(
        status,
      )} uppercase tracking-wider flex items-center justify-center`}
    >
      {status === "Report Delivered" && (
        <FiCheckCircle className="mr-1.5" size={14} />
      )}
      {status === "Canceled" && <FiXCircle className="mr-1.5" size={14} />}
      {status}
    </span>
  );
}

function PatientDetailsPopup({
  patientDetails,
  onClose,
}: {
  patientDetails?: PatientDetails;
  onSave?: (patientDetails: PatientDetails) => void;
  onClose: () => void;
}) {
  return (
    <Model heading="Patient Details" onClose={onClose}>
      <div className="px-6 py-5">
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">
                Full Name
              </span>
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {patientDetails?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">
                Age
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {patientDetails?.age || "N/A"} Years
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">
                Gender
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {patientDetails?.gender || "N/A"}
              </span>
            </div>
            {patientDetails?.other && (
              <div className="flex flex-col sm:col-span-2 mt-2 pt-4 border-t border-gray-200 dark:border-white/10">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Additional Notes
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {patientDetails.other}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Model>
  );
}

function ReviewModel({
  reviewDetails,
  onClose = () => {},
  onSave = () => {},
}: {
  reviewDetails?: ReviewType;
  onClose: () => void;
  onSave: (review: ReviewType) => void;
}) {
  return (
    <Model heading="Write a Review" className="w-[400px]" onClose={onClose}>
      <ReviewForm reviewDetails={reviewDetails} onSave={onSave} />
    </Model>
  );
}
