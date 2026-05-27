// app/admin/orders/view/[id]/page.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import fetcher from "@/lib/fetcher";
import { PatientDetails } from "@/app/components/popups/PatientDetailsPopup";
import Model from "@/components/Model";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReviewForm, { ReviewType } from "@/app/components/ReviewForm";
import Loading from "./loading";
import ConfirmationModel from "@/app/components/popups/ConfirmationModel";
import { ColoredStatus } from "../../page";
import {
  FiMapPin,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiTruck,
  FiPhone,
  FiMail,
  FiFileText,
} from "react-icons/fi";

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
  const { id } = useParams();
  const navigate = useRouter();

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await fetcher.get<Order>("/admin/orders/" + id);
      if (response.status !== 200) {
        throw new Error("Failed to fetch order");
      }
      if (response.body) {
        return response.body;
      }
    } catch {
      toast.error("Unable to fetch data");
    }
  }, [id]);

  useEffect(() => {
    async function startUp() {
      setOrder(await fetchOrderDetails());
    }
    startUp();
  }, [fetchOrderDetails]);

  if (!order) return <Loading />;

  const isCompletedOrCanceled =
    order.status === "Report Delivered" || order.status === "Canceled";

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 pt-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Details
            </h1>
            <ColoredStatus status={order.status} />
          </div>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 tracking-wider">
            ID: {order._id.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isCompletedOrCanceled && (
            <button
              onClick={() => setShowConfirmPopup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-xl font-medium transition-colors"
            >
              <FiXCircle className="w-4 h-4" />
              Cancel Order
            </button>
          )}
          <button
            onClick={() => navigate.push(`/admin/orders/edit/${order._id}`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <FiEdit3 className="w-4 h-4" />
            Edit Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Items List */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFileText className="text-orange-500" />
              Tests & Services
            </h2>
            {order.items.map((item, index) => (
              <div
                className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden"
                key={index}
              >
                <div className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.product.test.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiTruck className="shrink-0" />
                      <span>{item.product.lab.name}</span>
                      <span>•</span>
                      <span>PIN: {item.product.lab.location.address.pin}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                      ₹{(item.product.price || 0) * item.quantity}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      ₹{item.product.price} × {item.quantity} Patient(s)
                    </div>
                  </div>
                </div>
                {item.patientDetails?.length > 0 && (
                  <div className="bg-gray-50 dark:bg-white/2 border-t border-gray-100 dark:border-white/5 p-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      Patients Attached
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array(item.quantity)
                        .fill(0)
                        .map((_, i) => {
                          const patient = item.patientDetails[i];
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                patient
                                  ? "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:border-orange-500/50 cursor-pointer"
                                  : "bg-orange-50 border-orange-200 text-orange-600 border-dashed dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400 cursor-pointer"
                              }`}
                              onClick={() =>
                                setShowPatientPopup({
                                  itemIndex: index,
                                  patientIndex: i,
                                })
                              }
                            >
                              <FiUser className="w-3.5 h-3.5 opacity-70" />
                              {patient?.name || "Add Patient Details +"}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Status Timeline */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiClock className="text-orange-500" />
              Order Timeline
            </h2>
            <div className="relative border-l-2 border-gray-200 dark:border-white/10 ml-3 md:ml-4 space-y-6 pb-2">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full -left-1.75 top-1.5 ring-4 ring-white dark:ring-[#111]"></div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Order Placed
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {order.statusRecords.map((e, index) => {
                const isLast = index === order.statusRecords.length - 1;
                return (
                  <div className="relative pl-6" key={e.date}>
                    <div
                      className={`absolute w-3 h-3 rounded-full -left-1.75 top-1.5 ring-4 ring-white dark:ring-[#111] ${isLast && !isCompletedOrCanceled ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-gray-300 dark:bg-gray-600"}`}
                    ></div>
                    <div
                      className={`font-semibold ${isLast && !isCompletedOrCanceled ? "text-orange-600 dark:text-orange-400" : "text-gray-900 dark:text-white"}`}
                    >
                      {e.status}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(e.date).toLocaleDateString()} at{" "}
                      {new Date(e.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Information Cards */}
        <div className="flex flex-col gap-6">
          {/* Customer Card */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-3">
              Customer Details
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <FiUser />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.user?.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5 break-all">
                    {order.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-3">
              Schedule
            </h3>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Collection Slot
                </p>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(
                    order.sampleTakenDateTime?.start || "",
                  ).toLocaleDateString()}
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-0.5">
                  {new Date(
                    order.sampleTakenDateTime?.start || "",
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(
                    order.sampleTakenDateTime?.end || "",
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Report Expected
                </p>
                <div className="font-medium text-gray-900 dark:text-white">
                  By{" "}
                  {new Date(
                    order.reportDeliverTime?.end || "",
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-3">
              Delivery & Contact
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-gray-400 mt-0.5 shrink-0" />
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p className="font-medium text-gray-900 dark:text-white mb-0.5">
                    {order.address?.city}, {order.address?.district}
                  </p>
                  <p>PIN: {order.address?.pin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <FiPhone className="text-gray-400 shrink-0" />
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.address?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Collector Card */}
          {!isCompletedOrCanceled && (
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-3">
                Assigned Collector
              </h3>
              {order.collector ? (
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                      <FiTruck />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.collector.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                        <FiPhone className="w-3.5 h-3.5" />
                        <span>{order.collector.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1 break-all">
                        <FiMail className="w-3.5 h-3.5" />
                        <span>{order.collector.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-white/2 p-4 rounded-xl text-center border border-dashed border-gray-200 dark:border-white/10">
                  No collector assigned yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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
              toast.success("Review Saved");
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
            <div className="p-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Cancel Order?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to cancel this order? This action{" "}
                <span className="font-semibold text-red-500">
                  cannot be undone
                </span>
                .
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
              toast.success("Order Canceled Successfully");
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

function PatientDetailsPopup({
  patientDetails,
  onClose,
}: {
  patientDetails?: PatientDetails;
  onSave?: (patientDetails: PatientDetails) => void;
  onClose: () => void;
}) {
  return (
    <Model heading="Patient Details" onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="bg-gray-50 dark:bg-white/2 border border-gray-200 dark:border-white/10 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-3">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Full Name
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {patientDetails?.name || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-3">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Age
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {patientDetails?.age ? `${patientDetails.age} Years` : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Gender
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {patientDetails?.gender || "—"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
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
    <Model heading="Review" className="max-w-md" onClose={onClose}>
      <ReviewForm reviewDetails={reviewDetails} onSave={onSave} />
    </Model>
  );
}

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
  createdAt: string;
  updatedAt: string;
};
