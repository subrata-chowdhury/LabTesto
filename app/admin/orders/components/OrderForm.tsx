// app/admin/orders/components/OrderForm.tsx
"use client";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Inputs/Input";
import React, { useState } from "react";
import Title from "@/components/Title";
import { MainTable } from "@/components/Table";
import SelectCollector from "@/app/components/SelectCollector";
import SelectUser from "@/app/components/SelectUser";
import DateInput from "@/components/Inputs/DateInput";
import OrderPopup from "./OrderPopup";
import OrderTimeSelector from "@/app/(mainLayout)/cart/component/OrderTimeSelector";
import {
  FiPlus,
  FiTrash2,
  FiInfo,
  FiUser,
  FiMapPin,
  FiBox,
  FiClock,
  FiDollarSign,
  FiEdit2,
} from "react-icons/fi";

type Props = {
  orderDetails: OrderDetails;
  error?: { field: string; msg: string } | null;
  onChange: {
    orderDetails: (orderDetails: OrderDetails) => void;
  };
  onSave: () => void;
};

const OrderForm = ({
  orderDetails,
  error,
  onChange,
  onSave = () => {},
}: Props) => {
  const [showOrderPopup, setShowOrderPopup] = useState<{
    index: number;
  } | null>(null);
  const [showScheduleOrderTimesModel, setShowScheduleOrderTimesModel] =
    useState<boolean>(false);

  const calculateTotal = () => {
    return orderDetails.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12 w-full mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {orderDetails.user._id ? "Edit Order" : "Create New Order"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage order assignments, items, and scheduling.
            </p>
            <Title
              title={
                <p className="text-nowrap font-medium text-sm">
                  Select user and fill in test details to place order
                </p>
              }
            >
              <FiInfo className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors" />
            </Title>
          </div>
        </div>
      </div>

      {/* Customer & Assignment */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Customer & Assignment
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              User / Patient *
            </label>
            <SelectUser
              onSelect={(val) =>
                onChange.orderDetails({ ...orderDetails, user: val })
              }
            />
            {orderDetails.user.name && (
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Selected: {orderDetails.user.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Assign Collector
            </label>
            <SelectCollector
              onSelect={(val) =>
                onChange.orderDetails({ ...orderDetails, collector: val })
              }
            />
            {orderDetails.collector?.name && (
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Assigned: {orderDetails.collector.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Order Status *
            </label>
            <Dropdown
              options={[
                "Ordered",
                "Out for Sample Collection",
                "Sample Collected",
                "Report Delivered to Lab",
                "Report Generated",
                "Out for Report Delivery",
                "Report Delivered",
                "Canceled",
              ]}
              value={orderDetails.status}
              onChange={(val) =>
                onChange.orderDetails({
                  ...orderDetails,
                  status: val.value as OrderDetails["status"],
                })
              }
              width={"100%"}
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
          <FiMapPin className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Collection & Delivery Address
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="City *"
            value={orderDetails.address.city}
            onChange={(val) =>
              onChange.orderDetails({
                ...orderDetails,
                address: { ...orderDetails.address, city: val },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="District *"
            value={orderDetails.address.district}
            onChange={(val) =>
              onChange.orderDetails({
                ...orderDetails,
                address: { ...orderDetails.address, district: val },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="PIN Code *"
            value={orderDetails.address.pin}
            onChange={(val) =>
              onChange.orderDetails({
                ...orderDetails,
                address: { ...orderDetails.address, pin: val },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="Contact Phone *"
            value={orderDetails.address.phone}
            onChange={(val) =>
              onChange.orderDetails({
                ...orderDetails,
                address: { ...orderDetails.address, phone: val },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Landmark / Full Address Details
            </label>
            <textarea
              className="border border-gray-300 dark:border-white/20 rounded-xl w-full h-24 p-3 bg-transparent text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white"
              placeholder="House number, street name, landmarks..."
              value={orderDetails.address.other}
              onChange={(e) =>
                onChange.orderDetails({
                  ...orderDetails,
                  address: { ...orderDetails.address, other: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiBox className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Cart Items
            </h3>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
            onClick={() =>
              setShowOrderPopup({ index: orderDetails.items?.length || 0 })
            }
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
        <div className="p-0">
          <MainTable<Item>
            config={[
              {
                heading: "Test / Profile",
                selector: "product",
                component: ({ data }) => (
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {data.product.test.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {typeof data.product.lab === "string"
                        ? data.product.lab
                        : data.product.lab.name}
                    </span>
                  </div>
                ),
              },
              {
                heading: "No. of Patients",
                selector: "quantity",
                component: ({ data }) => (
                  <span className="font-medium bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                    {data.quantity}
                  </span>
                ),
              },
              {
                heading: "Price",
                selector: "product",
                component: ({ data }) => (
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{data.product.price * data.quantity}
                  </span>
                ),
              },
              {
                heading: "Actions",
                component: ({ index }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                      title="Edit Item"
                      onClick={() => setShowOrderPopup({ index })}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      title="Remove Item"
                      onClick={() => {
                        const newItems = [...orderDetails.items];
                        newItems.splice(index, 1);
                        onChange.orderDetails({
                          ...orderDetails,
                          items: newItems,
                        });
                      }}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={orderDetails.items}
            className="border-0"
          />
          {orderDetails.items.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No items added to this order yet.
            </div>
          )}
        </div>
      </div>

      {/* Scheduling & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Information */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
            <FiClock className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Scheduling
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Sample Taken Start
                </label>
                <button
                  type="button"
                  className="px-4 py-2.5 text-left border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors dark:text-white"
                  onClick={() => setShowScheduleOrderTimesModel(true)}
                >
                  {new Date(
                    orderDetails.sampleTakenDateTime?.start || "",
                  ).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(
                    orderDetails?.sampleTakenDateTime?.start || "",
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Sample Taken End
                </label>
                <button
                  type="button"
                  className="px-4 py-2.5 text-left border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors dark:text-white"
                  onClick={() => setShowScheduleOrderTimesModel(true)}
                >
                  {new Date(
                    orderDetails.sampleTakenDateTime?.end || "",
                  ).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(
                    orderDetails?.sampleTakenDateTime?.end || "",
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateInput
                label="Report Expected By"
                minTime={new Date(new Date().setHours(6, 0, 0))}
                maxTime={new Date(new Date().setHours(18, 0, 0))}
                value={new Date(orderDetails.reportDeliverTime.start || "")}
                onChange={(val) =>
                  onChange.orderDetails({
                    ...orderDetails,
                    reportDeliverTime: {
                      ...orderDetails.reportDeliverTime,
                      start: new Date(val).toISOString(),
                    },
                  })
                }
                labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
              />
              <DateInput
                label="Report Expected Latest"
                minTime={new Date(new Date().setHours(6, 0, 0))}
                maxTime={new Date(new Date().setHours(18, 0, 0))}
                value={new Date(orderDetails.reportDeliverTime.end || "")}
                onChange={(val) =>
                  onChange.orderDetails({
                    ...orderDetails,
                    reportDeliverTime: {
                      ...orderDetails.reportDeliverTime,
                      end: new Date(val).toISOString(),
                    },
                  })
                }
                labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
            <FiDollarSign className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Payment Summary
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between gap-6">
            <Input
              label="Amount Paid So Far (₹) *"
              value={orderDetails?.paid?.toString() || "0"}
              type="number"
              onChange={(val) =>
                onChange.orderDetails({ ...orderDetails, paid: Number(val) })
              }
              labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            />

            <div className="mt-auto bg-orange-50 dark:bg-orange-500/10 rounded-xl p-5 border border-orange-100 dark:border-orange-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Items:
                </span>
                <span className="font-semibold dark:text-white">
                  {orderDetails.items.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white border-t border-orange-200 dark:border-orange-500/20 pt-2 mt-2">
                <span>Grand Total:</span>
                <span className="text-orange-600 dark:text-orange-400">
                  ₹{calculateTotal()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium mt-1">
                <span className="text-gray-500">Balance Due:</span>
                <span
                  className={`${calculateTotal() - (orderDetails.paid || 0) > 0 ? "text-red-500" : "text-green-500"}`}
                >
                  ₹{Math.max(0, calculateTotal() - (orderDetails.paid || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-2.5 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all min-w-30"
          onClick={onSave}
        >
          Save Order
        </button>
      </div>

      {/* Modals */}
      {showScheduleOrderTimesModel && (
        <OrderTimeSelector
          onClose={() => setShowScheduleOrderTimesModel(false)}
          onChange={(sampleTakenDateTime) =>
            onChange.orderDetails({
              ...orderDetails,
              sampleTakenDateTime: {
                start: sampleTakenDateTime.start.toISOString(),
                end: sampleTakenDateTime.end.toISOString(),
              },
            })
          }
        />
      )}

      {showOrderPopup && showOrderPopup.index !== null && (
        <OrderPopup
          item={orderDetails?.items[showOrderPopup.index]}
          onSave={(item) => {
            const newItems = [...orderDetails.items];
            newItems[showOrderPopup.index] = item;
            onChange.orderDetails({ ...orderDetails, items: newItems });
            setShowOrderPopup(null);
          }}
          onClose={() => setShowOrderPopup(null)}
        />
      )}
    </div>
  );
};

export default OrderForm;

export type OrderDetails = {
  items: Item[];
  user: { _id: string; name: string };
  collector?: { _id: string; name: string };
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
  address: {
    pin: string;
    city: string;
    district: string;
    other?: string; // road details
    phone: string;
  };
  paid?: number;
};

export type Item = {
  product: {
    test: { _id: string; name: string };
    lab: { _id: string; name: string } | Lab;
    price: number;
  };
  patientDetails: {
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    other?: string;
  }[];
  address: {
    pin: number;
    city: string;
    district: string;
    other?: string; // road details
  };
  quantity: number;
  date?: Date;
};

export type Lab = {
  _id: string;
  name: string;
  description?: string;
  location: {
    address: {
      pin: string;
      city: string;
      district: string;
      other: string; // road details
    };
    location: {
      lat: number;
      lang: number;
    };
  };
  certification?: {
    organization: string;
    year?: number;
    imageUrl?: string;
  }[];
  rating: number;
  rated: number;
  contractDetails?: {
    email?: string[];
    phone?: string[];
  };
};
