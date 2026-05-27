// app/admin/tests/components/TestsForm.tsx
"use client";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Inputs/Input";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Title from "@/components/Title";
import informationIcon from "@/assets/information.svg";
import TagInput from "@/components/Inputs/TagInput";
import RichTextEditor from "@/app/components/RichTextEditor";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  testDetails: TestDetails;
  loading?: boolean;
  error?: { [key in keyof TestDetails]?: string } | null;
  onChange: {
    testDetails: (testDetails: TestDetails) => void;
  };
  onSave: () => void;
};

const TestForm = ({
  testDetails,
  loading,
  error,
  onChange,
  onSave = () => {},
}: Props) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const sampleTypeInputRef = useRef<HTMLDivElement>(null);
  const tubeTypeInputRef = useRef<HTMLDivElement>(null);
  const fastingInputRef = useRef<HTMLInputElement>(null);
  const overviewInputRef = useRef<HTMLDivElement>(null);
  const testResultInputRef = useRef<HTMLDivElement>(null);
  const navigate = useRouter();

  useEffect(() => {
    if (error) {
      if (error.name) {
        nameInputRef.current?.focus();
        nameInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.name);
      } else if (error.sampleType) {
        sampleTypeInputRef.current?.focus();
        sampleTypeInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.sampleType);
      } else if (error.tubeType) {
        tubeTypeInputRef.current?.focus();
        tubeTypeInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.tubeType);
      } else if (error.fastingRequired) {
        fastingInputRef.current?.focus();
        fastingInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.fastingRequired);
      } else if (error.overview) {
        overviewInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.overview);
      } else if (error.testResultInterpretation) {
        testResultInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        toast.error(error.testResultInterpretation);
      }
    }
  }, [error]);

  return (
    <div className="max-w-6xl mt-6 mx-auto flex flex-col gap-6 pb-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {testDetails.name ? "Edit Test" : "Create New Test"}
          </h2>
          <Title
            title={
              <p className="text-nowrap font-medium text-sm">
                Fill in the details for the laboratory test
              </p>
            }
          >
            <Image
              src={informationIcon}
              alt="Info"
              width={20}
              height={20}
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          </Title>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Basic Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Test Name *"
            name="name"
            placeholder="e.g., Complete Blood Count (CBC)"
            value={testDetails.name}
            onChange={(val) =>
              onChange.testDetails({ ...testDetails, name: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            ref={nameInputRef}
            error={error?.name ? error.name : ""}
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Sample Type *
            </label>
            <Dropdown
              options={[
                "Blood",
                "Urine",
                "Semen",
                "Stool",
                "Sputum",
                "Other Body Fluid",
              ]}
              value={testDetails.sampleType}
              onChange={(val) =>
                onChange.testDetails({
                  ...testDetails,
                  sampleType: val.value as TestDetails["sampleType"],
                })
              }
              width={"100%"}
              ref={sampleTypeInputRef}
            />
            {error?.sampleType && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {error.sampleType}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Tube / Container Type *
            </label>
            <Dropdown
              options={[
                "Clot Tube",
                "Fluoride Tube",
                "EDTA Tube",
                "Citrate Tube",
                "Sterile Container",
                "Non-Sterile Container",
              ]}
              value={testDetails.tubeType}
              onChange={(val) =>
                onChange.testDetails({
                  ...testDetails,
                  tubeType: val.value as TestDetails["tubeType"],
                })
              }
              width={"100%"}
              ref={tubeTypeInputRef}
            />
            {error?.tubeType && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {error.tubeType}
              </p>
            )}
          </div>

          <Input
            label="Fasting Required *"
            name="fastingRequired"
            placeholder="e.g., 10-12 hours fasting"
            value={testDetails.fastingRequired || ""}
            onChange={(val) =>
              onChange.testDetails({ ...testDetails, fastingRequired: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.fastingRequired ? error.fastingRequired : ""}
            ref={fastingInputRef}
          />

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Search Tags / Aliases
            </label>
            <TagInput
              values={testDetails.otherTerms}
              onChange={(values) =>
                onChange.testDetails({ ...testDetails, otherTerms: values })
              }
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add alternative names or related terms to improve searchability.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Detailed Descriptions */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Clinical Details
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-2" ref={overviewInputRef}>
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Overview *
            </label>
            <div className="dark:border-white/10 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
              <RichTextEditor
                value={testDetails.overview || ""}
                onChange={(val) =>
                  onChange.testDetails({ ...testDetails, tempOverview: val })
                }
              />
            </div>
            {error?.overview && (
              <p className="text-red-500 text-xs font-medium">
                {error.overview}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2" ref={testResultInputRef}>
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Test Result Interpretation *
            </label>
            <div className="dark:border-white/10 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
              <RichTextEditor
                value={testDetails.testResultInterpretation || ""}
                onChange={(val) =>
                  onChange.testDetails({
                    ...testDetails,
                    tempTestResultInterpretation: val,
                  })
                }
              />
            </div>
            {error?.testResultInterpretation && (
              <p className="text-red-500 text-xs font-medium">
                {error.testResultInterpretation}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Risk Assessment
            </label>
            <div className="dark:border-white/10 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
              <RichTextEditor
                value={testDetails.riskAssesment || ""}
                onChange={(val) =>
                  onChange.testDetails({
                    ...testDetails,
                    tempRiskAssesment: val,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Additional Description
            </label>
            <div className="dark:border-white/10 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
              <RichTextEditor
                value={testDetails.description || ""}
                onChange={(val) =>
                  onChange.testDetails({ ...testDetails, tempDescription: val })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => navigate.back()}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-2.5 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Save Test"
          )}
        </button>
      </div>
    </div>
  );
};

export default TestForm;

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
    lab: string;
    name: string;
    price: number;
    offer?: number;
    expenses?: number;
    resultTime: string;
    packages?: string[];
    ranges?: Map<string, string>;
  }[];

  tempDescription?: string;
  tempOverview?: string;
  tempTestResultInterpretation?: string;
  tempRiskAssesment?: string;
};
