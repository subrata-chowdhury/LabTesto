// app/(mainLayout)/tests/[id]/componenets/MainTestPage.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import React, { memo, useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";

import SampleTypeIcon from "@/assets/reactIcon/test/SampleType";
import TubeIcon from "@/assets/reactIcon/test/Tube";
import FoodIcon from "@/assets/reactIcon/test/Food";
import DescriptionIcon from "@/assets/reactIcon/test/Description";
import PackageIcon from "@/assets/reactIcon/test/Package";
import LabIcon from "@/assets/reactIcon/test/Lab";
import { CrossIcon } from "@/assets/reactIcon/Cross";
import { useItemCountContext } from "@/app/contexts/ItemCountContext";
import CheckBox from "@/components/Inputs/CheckBox";
import { MainTable } from "@/components/Table";
import { CartPage } from "../../../cart/component/CartPage";

// Replaced local SVGs with react-icons for better scaling and dark mode support
import { FiInfo, FiX, FiMapPin } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

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

type Lab = {
  _id: string;
  name: string;
  image?: string;
  description: string;
  location?: {
    address: {
      pin: string;
      city: string;
      district: string;
      other: string;
    };
  };
  rating: number;
};

type Props = {
  test: TestDetails;
};

// Helper function to check if HTML string contains actual text/media, not just empty tags like <p></p>
const hasValidContent = (html?: string) => {
  if (!html) return false;
  // Remove HTML tags and &nbsp;, then trim to check if any text remains
  const stripped = html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, "")
    .trim();
  if (stripped.length > 0) return true;
  // Allow sections that might only contain an image, video, or iframe
  if (/<(img|iframe|video|audio)[^>]+>/i.test(html)) return true;
  return false;
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

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8 pb-32 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Summary Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {test.name}
              </h1>
              {(test.otherTerms || []).length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Also known as:{" "}
                  </span>
                  {test.otherTerms?.join(", ")}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <InfoItem
                  icon={<SampleTypeIcon />}
                  label="Sample Type"
                  value={test.sampleType}
                />
                <InfoItem
                  icon={<TubeIcon />}
                  label={
                    test.tubeType.includes("Tube")
                      ? "Tube Type"
                      : "Container Type"
                  }
                  value={test.tubeType}
                />
                {test.fastingRequired && (
                  <InfoItem
                    icon={<FoodIcon />}
                    label="Fasting"
                    value={test.fastingRequired}
                  />
                )}
                {labs.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="text-primary dark:text-blue-400 mt-0.5">
                      <LabIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Selected Lab
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                          {lab.name}
                        </p>
                        <button
                          onClick={() => setShowLabDetails(true)}
                          className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                          aria-label="View Lab Details"
                        >
                          <FiInfo size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Action Area */}
            <div className="hidden md:flex flex-col items-end min-w-[200px] border-l border-gray-100 dark:border-white/10 pl-8">
              {labs.length > 0 ? (
                <>
                  <div className="flex flex-col items-end mb-6">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Total Price
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{finalPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg line-through text-gray-400">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400 mt-1 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      disabled={booking}
                      onClick={onBook}
                      className="w-full py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold shadow-md transition-colors disabled:opacity-70 flex items-center justify-center"
                    >
                      {booking ? <Spinner /> : "Book Now"}
                    </button>
                    <button
                      disabled={loading}
                      onClick={onAddToCart}
                      className="w-full py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-semibold transition-colors disabled:opacity-70 flex items-center justify-center"
                    >
                      {loading ? <Spinner /> : "Add to Cart"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No labs available
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Labs Selection */}
        {labs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white px-2">
              Available Labs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labs.slice(0, limit).map((labObj) => {
                const isSelected = lab.lab === labObj.lab;
                const labFinalPrice = Number(labObj.offer || 0);
                const labOriginalPrice = Number(labObj.price || 0);
                const labHasDiscount = labOriginalPrice > labFinalPrice;
                const labDiscountPercent = labHasDiscount
                  ? (
                      ((labOriginalPrice - labFinalPrice) / labOriginalPrice) *
                      100
                    ).toFixed(2)
                  : "0.00";

                return (
                  <motion.div
                    key={labObj.lab}
                    whileHover={{ y: -2 }}
                    onClick={() => onLabSelect(labObj)}
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10"
                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
                    }`}
                  >
                    <div className="w-16 h-16 shrink-0 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-center p-2 shadow-inner relative overflow-hidden">
                      {labObj.image ? (
                        <Image
                          src={labObj.image}
                          fill
                          alt={labObj.name}
                          className="object-contain p-1"
                        />
                      ) : (
                        <LabIcon />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {labObj.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900 dark:text-white">
                          ₹{labFinalPrice.toFixed(2)}
                        </span>
                        {labHasDiscount && (
                          <>
                            <span className="text-xs line-through text-gray-400">
                              ₹{labOriginalPrice.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded">
                              {labDiscountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <CheckBox
                        value={isSelected}
                        label=""
                        onChange={() => onLabSelect(labObj)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {labs.length > limit && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setLimit((l) => l + 6)}
                  className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-white/20 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Load More Labs
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
          <DetailsSection labBaseDetails={labBaseDetails} testDetails={test} />
        </motion.div>
      </div>

      {/* Mobile Sticky Action Bar */}
      {labs.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
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
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <Spinner /> : "Add to Cart"}
            </button>
            <button
              disabled={booking}
              onClick={onBook}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold shadow-md transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {booking ? <Spinner /> : "Book Now"}
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary dark:text-blue-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{value}</p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
  );
}

const DetailsSection = memo(
  ({
    labBaseDetails,
    testDetails,
  }: {
    labBaseDetails: { packages: string[]; ranges: { [key: string]: string }[] };
    testDetails: TestDetails;
  }) => {
    return (
      <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6 md:p-8 space-y-10">
        {labBaseDetails.packages.length > 0 && (
          <ExpandableSection icon={<PackageIcon />} title="Packages Include">
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {labBaseDetails.packages.map((pkg, i) => (
                <li key={i}>{pkg}</li>
              ))}
            </ul>
          </ExpandableSection>
        )}

        {hasValidContent(testDetails.overview) && (
          <ExpandableSection icon={<DescriptionIcon />} title="Overview">
            <div
              className="tiptap text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: testDetails.overview || "" }}
            />
          </ExpandableSection>
        )}

        {hasValidContent(testDetails.description) && (
          <ExpandableSection icon={<DescriptionIcon />} title="Description">
            <div
              className="tiptap text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: testDetails.description || "",
              }}
            />
          </ExpandableSection>
        )}

        {hasValidContent(testDetails.testResultInterpretation) && (
          <ExpandableSection
            icon={<DescriptionIcon />}
            title="Test Result Interpretation"
          >
            <div
              className="tiptap text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: testDetails.testResultInterpretation || "",
              }}
            />
          </ExpandableSection>
        )}

        {hasValidContent(testDetails.riskAssesment) && (
          <ExpandableSection icon={<DescriptionIcon />} title="Risk Assessment">
            <div
              className="tiptap text-gray-600 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: testDetails.riskAssesment || "",
              }}
            />
          </ExpandableSection>
        )}

        {labBaseDetails.ranges.length > 0 && (
          <div className="flex gap-4">
            <div className="text-primary dark:text-blue-400 mt-1 shrink-0">
              <DescriptionIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Ranges
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <MainTable
                  config={Object.keys(labBaseDetails.ranges[0] || {}).map(
                    (e) => ({ heading: e, selector: e }),
                  )}
                  data={labBaseDetails.ranges}
                  className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  },
);
DetailsSection.displayName = "DetailsSection";

function ExpandableSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 100) {
      setNeedsExpansion(true);
    }
  }, [children]);

  return (
    <div className="flex gap-4">
      <div className="text-primary dark:text-blue-400 mt-1 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <motion.div
          animate={{ height: expanded || !needsExpansion ? "auto" : "100px" }}
          className="relative overflow-hidden"
        >
          <div ref={contentRef}>{children}</div>
          {!expanded && needsExpansion && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-white dark:from-[#111] to-transparent pointer-events-none" />
          )}
        </motion.div>
        {needsExpansion && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm font-semibold text-primary hover:text-blue-600 transition-colors focus:outline-none"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}

const LabDetailsSidePopup = memo(
  ({ labId, onClose }: { labId: string; onClose: () => void }) => {
    const [lab, setLab] = useState<Lab>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchLabDetails() {
        setLoading(true);
        const res = await fetcher.get<Lab>(`/labs/${labId}`);
        if (res.status === 200 && res.body) setLab(res.body);
        setLoading(false);
      }
      fetchLabDetails();
    }, [labId]);

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-[90vw] sm:w-125 max-w-full h-full bg-white dark:bg-[#0a0a0a] shadow-2xl flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <CrossIcon />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative h-64 w-full bg-primary/10 dark:bg-white/5">
              {lab?.image && (
                <Image
                  src={lab.image}
                  alt="Lab Logo"
                  fill
                  className="object-cover opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                {loading ? (
                  <div className="h-8 w-2/3 bg-white/20 rounded animate-pulse mb-3" />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{lab?.name}</h2>
                )}
                {loading ? (
                  <div className="h-4 w-1/2 bg-white/20 rounded animate-pulse" />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <FiMapPin size={16} />
                    {lab?.location?.address?.city},{" "}
                    {lab?.location?.address?.district}
                  </div>
                )}
                {!loading && lab && (
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        {i < Math.floor(lab.rating) ? (
                          <FaStar size={16} />
                        ) : (
                          <FaRegStar size={16} />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                About this Lab
              </h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: hasValidContent(lab?.description)
                      ? (lab?.description || "").replace(/<\/?p>/g, "<br/>")
                      : "No description provided.",
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);
LabDetailsSidePopup.displayName = "LabDetailsSidePopup";
