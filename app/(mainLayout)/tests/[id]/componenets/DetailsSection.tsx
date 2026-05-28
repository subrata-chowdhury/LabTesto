// app/(mainLayout)/tests/[id]/componenets/DetailsSection.tsx
"use client";

import React, { memo } from "react";
import DescriptionIcon from "@/assets/reactIcon/test/Description";
import PackageIcon from "@/assets/reactIcon/test/Package";
import { MainTable } from "@/components/Table";
import ExpandableSection from "./ExpandableSection";
import { HiOutlineExclamationCircle } from "react-icons/hi";

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

// Reusable card wrapper for consistent spacing and elevated design
const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-5 sm:p-6 md:p-8 transition-shadow hover:shadow-md">
    {children}
  </section>
);

const DetailsSection = memo(
  ({
    labBaseDetails,
    testDetails,
  }: {
    labBaseDetails: { packages: string[]; ranges: { [key: string]: string }[] };
    testDetails: TestDetails;
  }) => {
    return (
      <div className="space-y-6">
        {labBaseDetails.packages && labBaseDetails.packages.length > 0 && (
          <SectionCard>
            <ExpandableSection
              icon={<HiOutlineExclamationCircle size={24} className="text-orange-500" />}
              title="Packages Include"
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 dark:text-gray-400 mt-2 list-none">
                {labBaseDetails.packages.map((pkg, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary dark:text-blue-400 mt-1.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </span>
                    <span className="leading-relaxed">{pkg}</span>
                  </li>
                ))}
              </ul>
            </ExpandableSection>
          </SectionCard>
        )}

        {hasValidContent(testDetails.overview) && (
          <SectionCard>
            <ExpandableSection
              icon={<HiOutlineExclamationCircle size={24} className="text-orange-500" />}
              title="Overview"
            >
              <div
                className="tiptap text-gray-600 dark:text-gray-400 mt-2"
                dangerouslySetInnerHTML={{ __html: testDetails.overview || "" }}
              />
            </ExpandableSection>
          </SectionCard>
        )}

        {hasValidContent(testDetails.description) && (
          <SectionCard>
            <ExpandableSection
              icon={<HiOutlineExclamationCircle size={24} className="text-orange-500" />}
              title="Description"
            >
              <div
                className="tiptap text-gray-600 dark:text-gray-400 mt-2"
                dangerouslySetInnerHTML={{
                  __html: testDetails.description || "",
                }}
              />
            </ExpandableSection>
          </SectionCard>
        )}

        {hasValidContent(testDetails.testResultInterpretation) && (
          <SectionCard>
            <ExpandableSection
              icon={<HiOutlineExclamationCircle size={24} className="text-orange-500" />}
              title="Test Result Interpretation"
            >
              <div
                className="tiptap text-gray-600 dark:text-gray-400 mt-2"
                dangerouslySetInnerHTML={{
                  __html: testDetails.testResultInterpretation || "",
                }}
              />
            </ExpandableSection>
          </SectionCard>
        )}

        {hasValidContent(testDetails.riskAssesment) && (
          <SectionCard>
            <ExpandableSection
              icon={<HiOutlineExclamationCircle size={24} className="text-orange-500" />}
              title="Risk Assessment"
            >
              <div
                className="tiptap text-gray-600 dark:text-gray-400 mt-2"
                dangerouslySetInnerHTML={{
                  __html: testDetails.riskAssesment || "",
                }}
              />
            </ExpandableSection>
          </SectionCard>
        )}

        {labBaseDetails.ranges && labBaseDetails.ranges.length > 0 && (
          <SectionCard>
            <div className="flex flex-col">
              <div className="flex gap-4">
                <div className="text-primary dark:text-blue-400 mt-1 shrink-0">
                  <HiOutlineExclamationCircle size={24} className="text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Ranges
                </h2>
              </div>
              <div className="flex-1 min-w-0 mt-2">
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
          </SectionCard>
        )}
      </div>
    );
  },
);

DetailsSection.displayName = "DetailsSection";

export default DetailsSection;

// Helper function to check if HTML string contains actual text/media, not just empty tags like <p></p>
export const hasValidContent = (html?: string) => {
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
