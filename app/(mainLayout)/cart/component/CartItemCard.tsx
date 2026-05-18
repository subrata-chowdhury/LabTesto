// app/(mainLayout)/cart/component/CartItemCard.tsx
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import fetcher from "@/lib/fetcher";
import { CartItem } from "./CartPage";

export default function CartItemCard({
  item,
  isPatientDetailsRequired = false,
  onQuantityChange,
  onRemove,
  onOrder,
  onPatientClick,
}: {
  item: CartItem;
  isPatientDetailsRequired?: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove?: () => void;
  onOrder: () => void;
  onPatientClick: (index: number) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-5">
        {/* Info Section */}
        <div className="flex flex-col gap-1 flex-1">
          <Link
            href={"/tests/" + item.product.test._id}
            className="group w-fit"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {item.product.test.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Lab:
            </span>
            {item.product.lab.name}, {item.product.lab.location.address.pin}
          </p>
          <div className="mt-3 text-2xl font-extrabold text-primary dark:text-blue-400">
            ₹{((item.product.price || 0) * item.quantity).toFixed(2)}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden h-10">
              <button
                className="w-10 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                disabled={item.quantity <= 1 || isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  await onQuantityChange(item.quantity - 1);
                  setIsUpdating(false);
                }}
              >
                <FaMinus size={12} />
              </button>
              <div className="w-10 h-full flex items-center justify-center font-medium dark:text-white">
                {item.quantity}
              </div>
              <button
                className="w-10 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                disabled={isUpdating}
                onClick={async () => {
                  setIsUpdating(true);
                  await onQuantityChange(item.quantity + 1);
                  setIsUpdating(false);
                }}
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Remove Button */}
            {onRemove && (
              <button
                className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/30"
                onClick={async () => {
                  const res = await fetcher.delete<
                    { test: string; lab: string; quantity: number },
                    { message: string } | string
                  >("/cart", {
                    test: item.product.test._id,
                    lab: item.product.lab._id,
                    quantity: item.quantity,
                  });
                  if (res.status === 200) onRemove();
                }}
                aria-label="Remove item"
              >
                <FaTrashAlt size={16} />
              </button>
            )}
          </div>

          <button
            className="w-full sm:w-auto bg-primary hover:bg-blue-700 dark:bg-primary/80 dark:hover:bg-primary text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            onClick={onOrder}
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Patient Details Section */}
      {isPatientDetailsRequired && (
        <div className="bg-gray-50 dark:bg-white/5 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-white/5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Patient Details ({item.quantity})
          </p>
          <div className="flex flex-wrap gap-2">
            {Array(item.quantity)
              .fill(0)
              .map((_, i) => {
                const patient = item?.patientDetails[i];
                const hasPatient = !!patient?.name;

                return (
                  <button
                    key={i}
                    onClick={() => onPatientClick(i)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      hasPatient
                        ? "bg-blue-50 text-primary border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50"
                        : "bg-white text-gray-600 border-dashed border-gray-300 hover:border-primary hover:text-primary dark:bg-transparent dark:border-gray-600 dark:text-gray-400 dark:hover:border-white dark:hover:text-white"
                    }`}
                  >
                    {hasPatient ? (
                      <FaUser size={12} />
                    ) : (
                      <FaUserPlus size={12} />
                    )}
                    {hasPatient ? patient.name.split(" ")[0] : "Add Details"}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </motion.li>
  );
}
