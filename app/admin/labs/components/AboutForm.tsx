// app/admin/labs/components/AboutForm.tsx
import Input from "@/components/Inputs/Input";
import { MainTable } from "@/components/Table";
import React, { useState } from "react";
import Model from "@/components/Model";
import RichTextEditor from "@/app/components/RichTextEditor";
import UploadToCloudinary from "@/app/components/ImageInput";
import { FiPlus, FiTrash2, FiEdit2, FiInfo } from "react-icons/fi";
import Title from "@/components/Title";

type Props = {
  labDetails: LabAboutDetails;
  loading?: boolean;
  onChange: (labDetails: LabAboutDetails) => void;
  onSave: () => void;
};

const AboutForm = ({
  labDetails,
  loading,
  onChange = () => {},
  onSave = async () => {},
}: Props) => {
  const [certificationIndex, setCetificationIndex] = useState<{
    index: number;
  } | null>(null);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {labDetails.name ? "Edit Lab Details" : "Register New Lab"}
          </h2>
          <Title
            title={
              <p className="text-nowrap font-medium text-sm">
                Provide comprehensive details about the laboratory
              </p>
            }
          >
            <FiInfo className="w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
          </Title>
        </div>
      </div>

      {/* Lab Information Section */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Basic Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Lab Name *"
            name="name"
            placeholder="e.g., Apollo Diagnostics"
            value={labDetails.name}
            onChange={(val) => onChange({ ...labDetails, name: val })}
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            containerClass="flex-1"
          />
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Lab Logo / Image
            </label>
            <div className="p-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/[0.02] hover:border-orange-500/50 transition-colors">
              <UploadToCloudinary
                imgUrl={labDetails.image}
                apiPath="/api/admin/labs/upload"
                onUpload={(url) => onChange({ ...labDetails, image: url })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Location & Coordinates
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="City *"
            value={labDetails.location?.address?.city || ""}
            onChange={(val) =>
              onChange({
                ...labDetails,
                location: {
                  ...labDetails.location,
                  address: { ...labDetails.location?.address, city: val },
                },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="District *"
            value={labDetails.location?.address?.district || ""}
            onChange={(val) =>
              onChange({
                ...labDetails,
                location: {
                  ...labDetails.location,
                  address: { ...labDetails.location?.address, district: val },
                },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="PIN Code *"
            value={labDetails.location?.address?.pin?.toString() || ""}
            onChange={(val) =>
              onChange({
                ...labDetails,
                location: {
                  ...labDetails.location,
                  address: { ...labDetails.location?.address, pin: val },
                },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="Street / Other Details"
            value={labDetails.location?.address?.other || ""}
            onChange={(val) =>
              onChange({
                ...labDetails,
                location: {
                  ...labDetails.location,
                  address: { ...labDetails.location?.address, other: val },
                },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2 pt-6 border-t border-gray-100 dark:border-white/10">
            <Input
              label="Latitude"
              name="lat"
              type="number"
              placeholder="e.g., 22.5726"
              value={labDetails.location?.location?.lat?.toString() || "0"}
              onChange={(val) =>
                onChange({
                  ...labDetails,
                  location: {
                    ...labDetails.location,
                    location: {
                      ...labDetails.location?.location,
                      lat: Number(val),
                    },
                  },
                })
              }
              labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            />
            <Input
              label="Longitude"
              name="lang"
              type="number"
              placeholder="e.g., 88.3639"
              value={labDetails.location?.location?.lang?.toString() || "0"}
              onChange={(val) =>
                onChange({
                  ...labDetails,
                  location: {
                    ...labDetails.location,
                    location: {
                      ...labDetails.location?.location,
                      lang: Number(val),
                    },
                  },
                })
              }
              labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Certifications & Accreditations
          </h3>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
            onClick={() =>
              setCetificationIndex({
                index: labDetails?.certification?.length || 0,
              })
            }
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        </div>
        <div className="p-0">
          <MainTable<Certification>
            config={[
              { heading: "Organization", selector: "organization" },
              { heading: "Year", selector: "year" },
              {
                heading: "Actions",
                component: ({ index }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                      onClick={() => setCetificationIndex({ index })}
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      onClick={() => {
                        const newCertification = [
                          ...(labDetails.certification || []),
                        ];
                        newCertification.splice(index, 1);
                        onChange({
                          ...labDetails,
                          certification: newCertification,
                        });
                      }}
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={labDetails.certification || []}
            className="border-0"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            About Description
          </h3>
        </div>
        <div className="p-6">
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
            <RichTextEditor
              value={labDetails.description || ""}
              onChange={(val) =>
                onChange({ ...labDetails, tempDescription: val })
              }
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => window.history.back()}
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
            "Save Lab"
          )}
        </button>
      </div>

      {certificationIndex && (
        <CertificationModel
          certificationDetails={
            labDetails?.certification?.[certificationIndex.index] ?? {}
          }
          onClose={() => setCetificationIndex(null)}
          onSave={(certificate) => {
            const newCertificate = [...(labDetails.certification || [])];
            newCertificate[certificationIndex.index] = certificate;
            onChange({ ...labDetails, certification: newCertificate });
            setCetificationIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default AboutForm;

export type LabAboutDetails = {
  name: string;
  description?: string;
  tempDescription?: string;
  image?: string;
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
  certification?: Certification[];
};

type Certification = {
  organization?: string;
  year?: number;
  imageUrl?: string;
};

function CertificationModel({
  certificationDetails,
  onSave,
  onClose,
}: {
  certificationDetails?: Certification;
  onSave: (certification: Certification) => void;
  onClose: () => void;
}) {
  const [certification, setCetification] = useState<Certification>(
    certificationDetails || {
      organization: "",
      imageUrl: "",
    },
  );

  return (
    <Model
      heading="Certification Details"
      onClose={onClose}
      className="max-w-md"
    >
      <div className="flex flex-col gap-5 p-6">
        <Input
          label="Organization Name *"
          name="organization"
          placeholder="e.g., NABL, CAP"
          value={certification?.organization || ""}
          onChange={(val) =>
            setCetification({ ...certification, organization: val })
          }
          labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
        />
        <Input
          label="Year Certified *"
          name="year"
          type="number"
          placeholder="e.g., 2023"
          value={certification?.year?.toString() || ""}
          onChange={(val) =>
            setCetification({ ...certification, year: Number(val) })
          }
          labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
        />
        <Input
          label="Certificate Image URL"
          name="imageUrl"
          placeholder="https://..."
          value={certification?.imageUrl || ""}
          onChange={(val) =>
            setCetification({ ...certification, imageUrl: val })
          }
          labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
        />
      </div>
      <div className="p-6 pt-0 flex justify-end gap-3 mt-4">
        <button
          className="px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
          onClick={() => onSave(certification)}
        >
          Save Details
        </button>
      </div>
    </Model>
  );
}
