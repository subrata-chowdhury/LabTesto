// app/admin/labs/components/LabForm.tsx
import { MainTable } from "@/components/Table";
import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCopy } from "react-icons/fi";
import Model from "@/components/Model";
import TagInput from "@/components/Inputs/TagInput";
import Input from "@/components/Inputs/Input";
import { toast } from "react-toastify";
import fetcher from "@/lib/fetcher";
import { useParams, useRouter } from "next/navigation";
import AdminTestSelector from "../../components/AdminTestSelector";
import SelectLab from "@/app/components/SelectLab";

type Props = {
  labDetails: LabTestDetails;
  loading?: boolean;
  error: { field: string; msg: string } | null;
  onChange: {
    labDetails: (labDetails: LabTestDetails) => void;
  };
  onSave: () => void;
};

const LabForm = ({
  labDetails,
  loading,
  onChange,
  onSave = () => {},
}: Props) => {
  const [showTestDetailsPopup, setShowTestDetailsPopup] = useState<{
    index: number;
  } | null>(null);
  const [copyLabId, setCopyLabId] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useRouter();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12 w-full mt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lab Tests Inventory
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing tests for:{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {labDetails.name}
            </span>
          </p>
        </div>

        {/* Quick Copy Feature */}
        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
          <span className="text-sm font-semibold text-orange-800 dark:text-orange-300 whitespace-nowrap">
            Import from:
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-48 sm:w-64">
              <SelectLab onSelect={(val) => setCopyLabId(val._id)} />
            </div>
            <button
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              onClick={() => {
                if (!copyLabId) {
                  toast.error("Please select a lab to copy from");
                  return;
                }
                if (copyLabId === id) {
                  toast.error("Cannot copy from the same lab");
                  return;
                }
                if (!id) {
                  toast.error("Lab ID is not available");
                  return;
                }
                fetcher
                  .post<
                    { targetId: string; copyId: string },
                    { success: boolean }
                  >(`/admin/labs/tests/copy`, { targetId: id as string, copyId: copyLabId })
                  .then((res) => {
                    if (res.status === 200 && res.body?.success) {
                      onChange.labDetails(labDetails); // Trigger refresh
                      toast.success("Lab test details imported successfully");
                    } else {
                      toast.error("Error importing lab details");
                    }
                  });
              }}
            >
              <FiCopy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Tests Table Section */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Available Tests & Pricing
          </h3>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
            onClick={() =>
              setShowTestDetailsPopup({
                index: labDetails.details?.length || 0,
              })
            }
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Test</span>
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <MainTable<TestsDetails>
            config={[
              {
                heading: "Test Name",
                selector: "name",
                component: ({ data }) => (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.name}
                  </span>
                ),
              },
              {
                heading: "Base Price (₹)",
                selector: "price",
                component: ({ data }) => (
                  <span className="text-gray-600 dark:text-gray-300">
                    ₹{data.price}
                  </span>
                ),
              },
              {
                heading: "Offer Price (₹)",
                selector: "offer",
                component: ({ data }) => (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {data.offer ? `₹${data.offer}` : "—"}
                  </span>
                ),
              },
              {
                heading: "TAT (Result Time)",
                selector: "resultTime",
                hideAble: true,
                component: ({ data }) => (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {data.resultTime || "—"}
                  </span>
                ),
              },
              {
                heading: "Actions",
                component: ({ index, data }) => (
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                      onClick={() => setShowTestDetailsPopup({ index })}
                      title="Edit Pricing"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                      title="Remove Test"
                      onClick={() => {
                        const deleteTestData = async () =>
                          fetcher
                            .delete<
                              { test: string },
                              { messege: string } | string
                            >(`/admin/labs/tests/${id}`, { test: data.test })
                            .then((res) => {
                              if (res.status === 200 && res.body) {
                                const newTestDetails = [
                                  ...(labDetails.details || []),
                                ];
                                newTestDetails.splice(index, 1);
                                onChange.labDetails({
                                  ...labDetails,
                                  details: newTestDetails,
                                });
                              } else if (
                                res.status === 404 &&
                                res.body == "Lab test details not found"
                              ) {
                                const newTestDetails = [
                                  ...(labDetails.details || []),
                                ];
                                newTestDetails.splice(index, 1);
                                onChange.labDetails({
                                  ...labDetails,
                                  details: newTestDetails,
                                });
                              } else {
                                throw new Error("Failed to delete test data");
                              }
                            });
                        toast.promise(deleteTestData(), {
                          pending: "Removing test...",
                          success: "Test removed successfully",
                          error: "Failed to remove test",
                        });
                      }}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={labDetails.details || []}
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
            "Save Inventory"
          )}
        </button>
      </div>

      {/* Modals */}
      {showTestDetailsPopup && (
        <TestDetailsPopup
          details={(labDetails.details || [])[showTestDetailsPopup.index]}
          onClose={() => setShowTestDetailsPopup(null)}
          onSave={(details) => {
            const newLabDetails = {
              name: labDetails?.name,
              details: [...(labDetails.details || [])],
            };
            newLabDetails.details[showTestDetailsPopup.index] = details;
            onChange.labDetails(newLabDetails);
            setShowTestDetailsPopup(null);
          }}
        />
      )}
    </div>
  );
};

export default LabForm;

export type LabTestDetails = {
  name?: string;
  details?: TestsDetails[];
};

type TestsDetails = {
  test: string;
  name?: string;
  price: number;
  offer?: number;
  expenses?: number;
  resultTime: string;
  packages?: string[];
  ranges?: Map<string, string>;
};

function TestDetailsPopup({
  details,
  onClose,
  onSave,
}: {
  details: TestsDetails;
  onClose: () => void;
  onSave: (details: TestsDetails) => void;
}) {
  const [testDetails, setTestDetails] = useState<TestsDetails>(
    details || {
      test: "",
      name: "",
      price: 0,
      offer: 0,
      expenses: 0,
      resultTime: "",
      packages: [],
    },
  );
  const [error, setError] = useState<{ [key: string]: string }>({});

  return (
    <Model
      className="max-w-2xl"
      heading={details?.test ? "Edit Test Pricing" : "Add Test to Lab"}
      onClose={onClose}
    >
      <div className="p-6 flex flex-col gap-6">
        {/* Test Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Select Master Test *
          </label>
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20">
            <AdminTestSelector
              onSelect={(val) =>
                setTestDetails((prevVal) => ({
                  ...prevVal,
                  test: val._id,
                  name: val.name,
                }))
              }
            />
          </div>
          {testDetails.name && (
            <p className="text-sm font-medium text-orange-600 mt-1 flex items-center gap-1">
              <FiEdit2 className="w-3 h-3" /> Selected: {testDetails.name}
            </p>
          )}
          {error?.test && (
            <p className="text-red-500 text-xs font-medium">{error.test}</p>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Base Price (₹) *"
            name="price"
            type="number"
            placeholder="0.00"
            value={testDetails?.price?.toString() || ""}
            onChange={(val) =>
              setTestDetails({ ...testDetails, price: Number(val) })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            error={error?.price ? error.price : ""}
          />
          <Input
            label="Offer Price (₹)"
            name="offer"
            type="number"
            placeholder="0.00"
            value={testDetails?.offer?.toString() || ""}
            onChange={(val) =>
              setTestDetails({ ...testDetails, offer: Number(val) })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            error={error?.offer ? error.offer : ""}
          />
          <Input
            label="Internal Expenses (₹)"
            name="expenses"
            type="number"
            placeholder="0.00"
            value={testDetails?.expenses?.toString() || ""}
            onChange={(val) =>
              setTestDetails({ ...testDetails, expenses: Number(val) })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            error={error?.expenses ? error.expenses : ""}
          />
          <Input
            label="Turnaround Time (TAT) *"
            name="resultTime"
            placeholder="e.g., 24 Hours, Same Day"
            value={testDetails?.resultTime || ""}
            onChange={(val) =>
              setTestDetails({ ...testDetails, resultTime: val })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
            error={error?.resultTime ? error.resultTime : ""}
          />
        </div>

        {/* Packages */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Associated Packages
          </label>
          <TagInput
            values={testDetails?.packages || []}
            onChange={(val) =>
              setTestDetails((prevVal) => ({ ...prevVal, packages: val }))
            }
          />
          {error?.packages && (
            <p className="text-red-500 text-xs font-medium">{error.packages}</p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0 flex justify-end gap-3 mt-2 border-t border-gray-100 dark:border-white/10 mt-4 pt-4">
        <button
          className="px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-md shadow-orange-500/20"
          onClick={() => {
            const errors: { [key: string]: string } = {};
            if (!testDetails.price || testDetails.price <= 0) {
              errors.price = "Price must be greater than 0";
            }
            if (testDetails.offer && testDetails.offer < 0) {
              errors.offer = "Offer cannot be negative";
            }
            if (testDetails.expenses && testDetails.expenses < 0) {
              errors.expenses = "Expenses cannot be negative";
            }
            if (
              !testDetails.resultTime ||
              testDetails.resultTime.trim() === ""
            ) {
              errors.resultTime = "Result Time is required";
            }
            if (!testDetails.test || testDetails.test.length === 0) {
              errors.test = "Please Select a Test";
              toast.error("Please Select a Master Test");
            }
            if (Object.keys(errors).length > 0) {
              setError(errors);
              return;
            }
            setError({});
            onSave(testDetails);
          }}
        >
          Save Test Data
        </button>
      </div>
    </Model>
  );
}
