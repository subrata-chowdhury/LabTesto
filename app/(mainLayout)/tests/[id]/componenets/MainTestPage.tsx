// app/(mainLayout)/tests/[id]/componenets/MainTestPage.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";

import SampleTypeIcon from "@/assets/reactIcon/test/SampleType";
import TubeIcon from "@/assets/reactIcon/test/Tube";
import FoodIcon from "@/assets/reactIcon/test/Food";
import LabIcon from "@/assets/reactIcon/test/Lab";
import { useItemCountContext } from "@/app/contexts/ItemCountContext";
import { CartPage } from "../../../cart/component/CartPage";
import { GrCart } from "react-icons/gr";
import { LuCalendarDays } from "react-icons/lu";

// Replaced local SVGs with react-icons for better scaling and dark mode support
import {
  FiInfo,
  FiX,
  FiMapPin,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiHome,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaShoppingBag } from "react-icons/fa";
import MiniInfoCard from "./MiniInfoCard";
import FeatureItem from "./FeatureItem";
import LabDetailsSidePopup from "./LabDetailsSidePopup";
import DetailsSection from "./DetailsSection";

export type TestDetails = {
  name: string;
  otherTerms?: string[];
  sampleType:
    | "Blood"
    | "Urine"
    | "Semen"
    | "Stool"
    | "Sputum"
    | "Other Body Fluid";
  tubeType:
    | "Clot Tube"
    | "Fluoride Tube"
    | "EDTA Tube"
    | "Citrate Tube"
    | "Sterile Container"
    | "Non-Sterile Container";
  description?: string;
  fastingRequired?: string;
  overview?: string;
  testResultInterpretation?: string;
  riskAssesment?: string;
  labsDetails?: {
    [key: string]: LabDetails;
  };
};

type LabDetails = {
  lab: string;
  name: string;
  image?: string;
  price: number;
  offer?: number;
  expenses?: number;
  resultTime: string;
  packages?: string[];
  ranges?: Map<string, string>;
};

type Props = {
  test: TestDetails;
};

export default function MainTestPage({ test }: Props) {
  const labs = Object.values(test.labsDetails || {});
  const [labBaseDetails, setLabBaseDetails] = useState<{
    price: number;
    offer: number;
    packages: string[];
    ranges: { [key: string]: string }[];
  }>(
    labs[0]
      ? {
          price: labs[0].price || 0,
          offer: labs[0].offer || 0, // 'offer' is the final discounted price
          packages: labs[0].packages || [],
          ranges: labs[0].ranges
            ? Array.from(labs[0].ranges, ([key, value]) => ({ [key]: value }))
            : [],
        }
      : { price: 0, offer: 0, packages: [], ranges: [] },
  );

  const [lab, setLab] = useState<LabDetails>(
    labs[0] || { name: "", lab: "", price: 0, resultTime: "" },
  );

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [limit, setLimit] = useState<number>(6);
  const [showLabDetails, setShowLabDetails] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  const { setItemCount } = useItemCountContext();
  const isItemFound = useRef(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();

  const onLabSelect = (selectedLab: LabDetails) => {
    if (selectedLab) {
      setLab(selectedLab);
      setLabBaseDetails({
        price: selectedLab.price || 0,
        offer: selectedLab.offer || 0,
        packages: selectedLab.packages || [],
        ranges: selectedLab.ranges
          ? Array.from(selectedLab.ranges, ([key, value]) => ({ [key]: value }))
          : [],
      });
    }
  };

  const createCartItem = () => ({
    product: {
      test: id,
      lab: lab.lab,
      price: Number(labBaseDetails.offer || 0).toFixed(2),
    },
    quantity: 1,
  });

  const onBook = async () => {
    setBooking(true);
    try {
      const res = await fetcher.post("/cart", createCartItem());
      if (res.status === 200) {
        setShowOrderPopup(true);
      } else if (res.status === 401) {
        toast.error("Please login to book a test.");
        navigate.push("/login?redirect=/tests/" + id);
      } else {
        toast.error("Failed to process booking. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setBooking(false);
    }
  };

  const onAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetcher.post("/cart", createCartItem());
      if (res.status === 200) {
        toast.success("Test added to cart successfully!");
        const countRes = await fetcher.get<{ items: number }>("/cart/count");
        if (countRes.status === 200 && countRes.body) {
          setItemCount(countRes.body.items || 0);
        }
      } else if (res.status === 401) {
        toast.error("Please login to add test to cart.");
        navigate.push("/login?redirect=/tests/" + id);
      } else {
        toast.error("Failed to add test to cart.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = Number(labBaseDetails.offer || 0).toFixed(2);
  const originalPrice = Number(labBaseDetails.price || 0).toFixed(2);
  const discountPercentage =
    labBaseDetails.price > 0
      ? (
          ((labBaseDetails.price - (labBaseDetails.offer || 0)) /
            labBaseDetails.price) *
          100
        ).toFixed(2)
      : "0.00";

  const hasDiscount = labBaseDetails.price > (labBaseDetails.offer || 0);

  // Helper for parsing text content
  const cleanDescription = (html?: string) => {
    if (!html)
      return "A comprehensive test to evaluate your overall health condition.";
    const stripped = html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    return stripped.length > 120
      ? stripped.substring(0, 120) + "..."
      : stripped;
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 pb-32 md:pb-12">
      <div className="max-w-300 mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <FiChevronRight className="w-3 h-3" />
          <Link href="/tests" className="hover:text-primary transition-colors">
            Find Tests
          </Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-orange-600 dark:text-orange-400 truncate">
            {test.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT COLUMN: Hero Card, Available Labs, Details */}
          <div className="space-y-6 min-w-0">
            {/* Hero Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl flex flex-col sm:flex-row overflow-hidden"
            >
              {/* Image Area */}
              <div className="sm:w-1/3 bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 relative min-h-55 flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-30 mix-blend-overlay"></div>
                <div className="w-24 h-24 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/10 text-orange-500 relative z-10 border-4 border-white/50 dark:border-white/5">
                  <SampleTypeIcon size={44} />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-[10px] font-bold tracking-wider uppercase rounded-full border border-teal-100 dark:border-teal-800/30">
                    {test.sampleType} TEST
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-bold tracking-wider uppercase rounded-full border border-gray-200 dark:border-white/5">
                    Routine
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {test.name}
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  {cleanDescription(test.overview || test.description)}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniInfoCard
                    icon={<SampleTypeIcon size={18} />}
                    label="SAMPLE"
                    value={test.sampleType}
                  />
                  <MiniInfoCard
                    icon={<TubeIcon size={18} />}
                    label="TUBE TYPE"
                    value={test.tubeType.replace(" Tube", "")}
                  />
                  <MiniInfoCard
                    icon={<FoodIcon size={18} />}
                    label="FASTING"
                    value={test.fastingRequired || "Not Required"}
                  />
                  <MiniInfoCard
                    icon={<FiClock size={18} />}
                    label="TAT"
                    value={lab.resultTime || "24 Hours"}
                  />
                </div>
              </div>
            </motion.section>

            {/* Available Labs */}
            {labs.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-2"
              >
                <div className="flex items-center gap-3 mb-5 px-1">
                  <LabIcon size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Available Labs
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {labs.slice(0, limit).map((labObj) => {
                    const isSelected = lab.lab === labObj.lab;
                    const labFinalPrice = Number(labObj.offer || 0);
                    const labOriginalPrice = Number(labObj.price || 0);
                    const labHasDiscount = labOriginalPrice > labFinalPrice;
                    const labDiscountPercent = labHasDiscount
                      ? (
                          ((labOriginalPrice - labFinalPrice) /
                            labOriginalPrice) *
                          100
                        ).toFixed(2)
                      : "0.00";

                    return (
                      <motion.div
                        key={labObj.lab}
                        whileHover={{ y: -2 }}
                        onClick={() => onLabSelect(labObj)}
                        className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 flex flex-col gap-4 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/40 dark:bg-orange-900/10 shadow-md shadow-orange-500/5"
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] hover:border-orange-300 dark:hover:border-white/20 shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex gap-4 items-center min-w-0">
                            <div className="w-12 h-12 shrink-0 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-center p-1.5 overflow-hidden">
                              {labObj.image ? (
                                <Image
                                  src={labObj.image}
                                  alt={labObj.name}
                                  width={48}
                                  height={48}
                                  className="object-contain p-1 mix-blend-multiply dark:mix-blend-screen"
                                />
                              ) : (
                                <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                                  {labObj.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2 flex items-center gap-1.5">
                                {labObj.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                {/* <span className="flex items-center gap-1 text-orange-500">
                                  <FaStar size={10} /> {labObj?.rating || "4.5"}
                                </span> */}
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="flex items-center gap-1">
                                  <FiClock size={10} />{" "}
                                  {labObj.resultTime || "24h TAT"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 mt-1">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-sm">
                                <FiCheckCircle size={16} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                            )}
                          </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/10 pt-4 flex justify-between items-end">
                          <div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              STARTING FROM
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-bold text-gray-900 dark:text-white">
                                ₹{labFinalPrice.toFixed(0)}
                              </span>
                              {labHasDiscount && (
                                <span className="text-xs font-medium text-gray-400 line-through">
                                  ₹{labOriginalPrice.toFixed(0)}
                                </span>
                              )}
                            </div>
                          </div>
                          {labHasDiscount && (
                            <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold px-2 py-1 rounded">
                              {labDiscountPercent}% OFF
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {labs.length > limit && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setLimit((l) => l + 6)}
                      className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-white/20 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      View More Labs
                    </button>
                  </div>
                )}
              </motion.section>
            )}

            {/* Content Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DetailsSection
                labBaseDetails={labBaseDetails}
                testDetails={test}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Pricing & Action Card (Sticky) */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 lg:p-7">
                <div className="text-right mb-6">
                  <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">
                    TOTAL PRICE
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      ₹{finalPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg font-semibold text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="inline-block mt-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs font-bold px-3 py-1.5 rounded-md">
                      You save ₹
                      {(Number(originalPrice) - Number(finalPrice)).toFixed(2)}{" "}
                      ({discountPercentage}%)
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 dark:border-white/10 pt-5 mb-6 space-y-3.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <LabIcon size={16} /> Selected Lab
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white truncate max-w-35">
                      {lab.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 font-medium">
                      <FiMapPin size={16} /> Home Collection
                    </div>
                    <div className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                      <FiCheckCircle size={14} /> Available
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    disabled={booking}
                    onClick={onBook}
                    className="w-full py-3.5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] dark:bg-white dark:hover:bg-gray-200 dark:text-[#111] text-white font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2.5 text-[15px]"
                  >
                    {booking ? (
                      <Spinner />
                    ) : (
                      <>
                        <LuCalendarDays size={15} /> Book Now
                      </>
                    )}
                  </button>
                  <button
                    disabled={loading}
                    onClick={onAddToCart}
                    className="w-full py-3.5 rounded-xl bg-white dark:bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-bold transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2.5 text-[15px]"
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <GrCart size={15} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Why Choose LabTesto Features */}
              <div className="bg-[#f8fafc] dark:bg-white/2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="text-orange-500 bg-orange-100 dark:bg-orange-500/20 p-1.5 rounded-full">
                    <FiCheckCircle size={16} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    Why Choose LabTesto
                  </h3>
                </div>

                <div className="space-y-5">
                  <FeatureItem
                    icon={
                      <FiShield
                        size={18}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    }
                    title="NABL Accredited Labs"
                    desc="Quality you can trust."
                  />
                  <FeatureItem
                    icon={
                      <FiHome
                        size={18}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    }
                    title="Free Home Sample Collection"
                    desc="Safe and convenient."
                  />
                  <FeatureItem
                    icon={
                      <FiZap
                        size={18}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    }
                    title="Fast Digital Reports"
                    desc="Access online within hours."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      {labs.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500 font-medium">
              Total Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{finalPrice}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through text-gray-400">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={onAddToCart}
              className="flex-1 py-3 rounded-xl gap-2.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <GrCart size={15} /> Cart
                </>
              )}
            </button>
            <button
              disabled={booking}
              onClick={onBook}
              className="flex-2 py-3 rounded-xl gap-2.5 bg-[#1e293b] dark:bg-white dark:text-[#111] text-white font-semibold shadow-md transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {booking ? (
                <Spinner />
              ) : (
                <>
                  <LuCalendarDays size={15} /> Book Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Popups */}
      <AnimatePresence>
        {showLabDetails && (
          <LabDetailsSidePopup
            labId={lab.lab}
            onClose={() => setShowLabDetails(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderPopup && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-[#0a0a0a]"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowOrderPopup(false)}
                className="p-2 bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CartPage
                showRemoveBtn={false}
                onFetchedCart={() => {
                  isItemFound.current = false;
                }}
                filterCartFunc={(item) => {
                  if (isItemFound.current) return false;
                  if (
                    item.product.test._id === id &&
                    item.product.lab._id === lab.lab
                  ) {
                    isItemFound.current = true;
                    return true;
                  }
                  return false;
                }}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

// Subcomponents

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70"></div>
  );
}
