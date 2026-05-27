// app/admin/collectors/components/CollectorForm.tsx
"use client";
import Input from "@/components/Inputs/Input";
import React, { useState } from "react";
import Title from "@/components/Title";
import { MainTable } from "@/components/Table";
import Model from "@/components/Model";
import TagInput from "@/components/Inputs/TagInput";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiInfo,
  FiUser,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type Props = {
  collectorDetails: CollectorDetails;
  error?: { field: string; msg: string } | null;
  onChange: {
    collectorDetails: (collectorDetails: CollectorDetails) => void;
  };
  onSave: () => void;
};

const CollectorForm = ({
  collectorDetails,
  error,
  onChange,
  onSave = () => {},
}: Props) => {
  const [showQualificationPopup, setShowQualificationPopup] = useState<{
    index: number;
  } | null>(null);
  const navigate = useRouter();

  return (
    <div className="max-w-5xl mt-6 mx-auto flex flex-col gap-6 pb-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <FiUser className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {collectorDetails.name
                ? "Edit Collector Profile"
                : "Register New Collector"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage phlebotomist identity and professional credentials
              </p>
              <Title
                title={
                  <p className="text-nowrap font-medium text-sm">
                    Fill in the accurate details to create a valid collector
                    profile.
                  </p>
                }
              >
                <FiInfo className="w-4 h-4 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors" />
              </Title>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Personal Information */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Personal & Account Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            name="name"
            placeholder="e.g., John Doe"
            value={collectorDetails.name}
            onChange={(val) =>
              onChange.collectorDetails({ ...collectorDetails, name: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "name" ? error.msg : ""}
          />
          <Input
            label="Email Address *"
            name="email"
            type="email"
            placeholder="e.g., john@example.com"
            value={collectorDetails.email}
            onChange={(val) =>
              onChange.collectorDetails({ ...collectorDetails, email: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "email" ? error.msg : ""}
          />
          <Input
            label="Password *"
            name="password"
            placeholder="Secure password for login"
            value={collectorDetails.password}
            onChange={(val) =>
              onChange.collectorDetails({ ...collectorDetails, password: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "password" ? error.msg : ""}
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="e.g., +91 9876543210"
            value={collectorDetails.phone || ""}
            onChange={(val) =>
              onChange.collectorDetails({ ...collectorDetails, phone: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "phone" ? error.msg : ""}
          />
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex items-center gap-2">
          <FiBriefcase className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Professional Identity
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Aadhaar Number"
            name="adhaar"
            placeholder="12-digit Aadhaar"
            value={collectorDetails.adhaar || ""}
            onChange={(val) =>
              onChange.collectorDetails({ ...collectorDetails, adhaar: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "adhaar" ? error.msg : ""}
          />
          <Input
            label="Years of Experience"
            name="experience"
            type="number"
            placeholder="e.g., 3"
            value={collectorDetails.experience?.toString() || ""}
            onChange={(val) =>
              onChange.collectorDetails({
                ...collectorDetails,
                experience: parseInt(val || "0"),
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
            error={error?.field === "experience" ? error.msg : ""}
          />
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Serviceable Areas (Pincodes/Cities)
            </label>
            <TagInput
              className="w-full"
              values={collectorDetails.reachableAreas || []}
              onChange={(vals) =>
                onChange.collectorDetails({
                  ...collectorDetails,
                  reachableAreas: vals,
                })
              }
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press enter or comma to add a location
            </p>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiAward className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Qualifications & Degrees
            </h3>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
            onClick={() =>
              setShowQualificationPopup({
                index: collectorDetails.qualification?.length || 0,
              })
            }
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Credential</span>
          </button>
        </div>
        <div className="p-0">
          <MainTable<Qualification>
            config={[
              {
                heading: "Degree/Certificate",
                selector: "degree",
                component: ({ data }) => (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.degree}
                  </span>
                ),
              },
              { heading: "Institution", selector: "college" },
              { heading: "Completion Year", selector: "year" },
              {
                heading: "Actions",
                component: ({ index }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                      title="Edit"
                      onClick={() => setShowQualificationPopup({ index })}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete"
                      onClick={() => {
                        const newQualifications = [
                          ...(collectorDetails.qualification || []),
                        ];
                        newQualifications.splice(index, 1);
                        onChange.collectorDetails({
                          ...collectorDetails,
                          qualification: newQualifications,
                        });
                      }}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={collectorDetails?.qualification || []}
            className="border-0"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => navigate.back()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-2.5 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center min-w-30"
          onClick={onSave}
        >
          Save Profile
        </button>
      </div>

      {/* Modal */}
      {showQualificationPopup && (
        <QualificationPopup
          qualification={
            collectorDetails.qualification?.[showQualificationPopup.index]
          }
          onClose={() => setShowQualificationPopup(null)}
          onSave={(qualification) => {
            const newQualifications = [
              ...(collectorDetails.qualification || []),
            ];
            newQualifications[showQualificationPopup.index] = qualification;
            onChange.collectorDetails({
              ...collectorDetails,
              qualification: newQualifications,
            });
            setShowQualificationPopup(null);
          }}
        />
      )}
    </div>
  );
};

export default CollectorForm;

export type CollectorDetails = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  reachableAreas?: string[];
  adhaar?: string;
  experience?: number;
  qualification?: Qualification[];
};

export type Qualification = {
  degree?: string;
  college?: string;
  year?: number;
};

const QualificationPopup = ({
  qualification,
  onClose = () => {},
  onSave = () => {},
}: {
  qualification?: Qualification;
  onClose?: () => void;
  onSave?: (qualification: Qualification) => void;
}) => {
  const [qualificationData, setQualificationData] = useState<Qualification>(
    qualification || {
      degree: "",
      college: "",
      year: new Date().getFullYear(),
    },
  );

  return (
    <Model heading="Credential Details" onClose={onClose} className="max-w-xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Degree / Certificate *"
            name="degree"
            placeholder="e.g., B.Sc DMLT"
            value={qualificationData?.degree || ""}
            onChange={(val) =>
              setQualificationData((prevVal) => ({ ...prevVal, degree: val }))
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="sm:col-span-2"
          />
          <Input
            label="College / Institution *"
            name="college"
            placeholder="e.g., Medical College Name"
            value={qualificationData?.college || ""}
            onChange={(val) =>
              setQualificationData((prevVal) => ({ ...prevVal, college: val }))
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="Passing Year *"
            name="year"
            type="number"
            placeholder="e.g., 2021"
            value={qualificationData?.year?.toString() || ""}
            onChange={(val) =>
              setQualificationData((prevVal) => ({
                ...prevVal,
                year: parseInt(val || "0"),
              }))
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>
      <div className="p-6 flex justify-end gap-3 border-t border-gray-100 dark:border-white/10 mt-4 pt-4">
        <button
          className="px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-md shadow-orange-500/20"
          onClick={() => onSave(qualificationData)}
        >
          Save Credential
        </button>
      </div>
    </Model>
  );
};
