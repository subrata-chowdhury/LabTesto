// app/admin/orders/components/OrderPopup.tsx
import SelectLab from "@/app/components/SelectLab";
import Model from "@/components/Model";
import PatientDetailsPopup, {
  PatientDetails,
} from "@/app/components/popups/PatientDetailsPopup";
import React, { useState } from "react";
import { Item } from "./OrderForm";
import Input from "@/components/Inputs/Input";
import { MainTable } from "@/components/Table";
import { toast } from "react-toastify";
import AdminTestSelector from "../../components/AdminTestSelector";
import { FiPlus, FiTrash2, FiEdit2, FiUserPlus } from "react-icons/fi";

export default function OrderPopup({
  item,
  onSave,
  onClose,
}: {
  item: Item;
  onSave: (item: Item) => void;
  onClose: () => void;
}) {
  const [itemData, setItemData] = useState<Item>(
    item || {
      product: { test: "", lab: "", price: 0 },
      patientDetails: [],
      quantity: 1,
    },
  );
  const [priceDetails, setPriceDetails] = useState<{
    [key: string]: {
      name: string;
      lab: string;
      price: number;
      offer?: number;
      expenses?: number;
      resultTime: string;
      packages?: string[];
      ranges?: Map<string, string>;
    };
  }>();
  const [showPatientPopup, setShowPatientPopup] = useState<boolean>(false);
  const [patientIndex, setPatientIndex] = useState<number | null>(null);

  return (
    <Model heading="Cart Item Details" className="max-w-4xl" onClose={onClose}>
      <div className="p-6 flex flex-col gap-6">
        {/* Test & Lab Selection */}
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Diagnostic Test *
            </label>
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111]">
              <AdminTestSelector
                onSelect={(val) => {
                  setItemData({
                    ...itemData,
                    product: { ...itemData?.product, test: val },
                  });
                  setPriceDetails(val.labsDetails);
                }}
              />
            </div>
            {itemData.product.test?.name && (
              <p className="text-xs text-orange-600 font-medium">
                Selected: {itemData.product.test.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Partner Lab *
            </label>
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111]">
              <SelectLab
                onSelect={(val) => {
                  if (priceDetails && priceDetails[val._id]) {
                    const testPrice = priceDetails[val._id].price || 0;
                    setItemData({
                      ...itemData,
                      product: {
                        ...itemData.product,
                        lab: val,
                        price: testPrice,
                      },
                    });
                  } else {
                    toast.error("This lab does not provide this test service");
                  }
                }}
              />
            </div>
            {itemData.product.lab?.name && (
              <p className="text-xs text-orange-600 font-medium">
                Selected: {(itemData.product.lab as any).name}
              </p>
            )}
          </div>
          <Input
            label="Override Price (₹)"
            type="number"
            placeholder="0.00"
            value={String(itemData?.product.price || "")}
            onChange={(val) =>
              setItemData({
                ...itemData,
                product: { ...itemData.product, price: Number(val) },
              })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
          <Input
            label="Total Patients (Quantity)"
            type="number"
            placeholder="1"
            value={String(itemData?.quantity || "1")}
            onChange={(val) =>
              setItemData({ ...itemData, quantity: Number(val) })
            }
            labelClass="font-semibold text-sm text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Patient Details */}
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/2 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Patient Profiles
            </h3>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
              onClick={() => {
                setPatientIndex(itemData?.patientDetails.length);
                setShowPatientPopup(true);
              }}
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
          <div className="p-0">
            <MainTable<PatientDetails>
              config={[
                {
                  heading: "Patient Name",
                  selector: "name",
                  component: ({ data }) => (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.name}
                    </span>
                  ),
                },
                {
                  heading: "Age",
                  selector: "age",
                  component: ({ data }) => (
                    <span className="text-gray-600 dark:text-gray-300">
                      {data.age} Yrs
                    </span>
                  ),
                },
                {
                  heading: "Gender",
                  selector: "gender",
                  component: ({ data }) => (
                    <span className="text-gray-600 dark:text-gray-300">
                      {data.gender}
                    </span>
                  ),
                },
                {
                  heading: "Actions",
                  component: ({ index }) => (
                    <div className="flex items-center gap-3">
                      <button
                        className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                        onClick={() => {
                          setPatientIndex(index);
                          setShowPatientPopup(true);
                        }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        onClick={() => {
                          const newPatients = [...itemData.patientDetails];
                          newPatients.splice(index, 1);
                          setItemData({
                            ...itemData,
                            patientDetails: newPatients,
                          });
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={itemData?.patientDetails}
              className="border-0"
            />
            {(!itemData?.patientDetails ||
              itemData.patientDetails.length === 0) && (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No patient details added yet. Please add patients based on the
                quantity.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
          <button
            className="px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-md shadow-orange-500/20"
            onClick={() => onSave(itemData)}
          >
            Save Item
          </button>
        </div>

        {showPatientPopup && patientIndex !== null && (
          <PatientDetailsPopup
            patientDetails={itemData.patientDetails[patientIndex]}
            onClose={() => setShowPatientPopup(false)}
            onSave={(patientDetails) => {
              const newPatients = [...itemData.patientDetails];
              newPatients[patientIndex] = patientDetails;
              setItemData({ ...itemData, patientDetails: newPatients });
              setShowPatientPopup(false);
            }}
            onRemove={() => {
              const newPatients = [...itemData.patientDetails];
              newPatients.splice(patientIndex, 1);
              setItemData({ ...itemData, patientDetails: newPatients });
              setShowPatientPopup(false);
            }}
          />
        )}
      </div>
    </Model>
  );
}
