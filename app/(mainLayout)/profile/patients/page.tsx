// app/(mainLayout)/profile/patients/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { User } from "../page";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import PatientDetailsPopup from "@/app/components/popups/PatientDetailsPopup";
import { FiUsers, FiPlus, FiEdit2 } from "react-icons/fi";

const PatientsPage = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    verified: false,
    patientDetails: [],
    address: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showPatientPopup, setShowPatientPopup] = useState<{
    patientIndex: number;
  } | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const res = await fetcher.get<User>("/user");
    if (res.status === 200 && res.body) setUser(res.body);
  }

  async function updateUser() {
    const res = await fetcher.post<User, User>("/user", user);
    if (res.status === 200 && res.body) {
      setUser(res.body);
      setIsDirty(false);
      toast.success("Patients updated successfully");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Patient Profiles
        </h2>
        {isDirty && (
          <button
            className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl transition-all shadow-sm text-sm"
            onClick={updateUser}
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add New Patient Card */}
        <button
          className="min-h-[120px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl bg-gray-50/50 hover:bg-primary/5 hover:border-primary/50 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white"
          onClick={() =>
            setShowPatientPopup({
              patientIndex: user.patientDetails?.length || 0,
            })
          }
        >
          <FiPlus size={24} />
          <span className="font-semibold text-sm">Add New Patient</span>
        </button>

        {/* Existing Patients */}
        {user?.patientDetails?.map((patientDetail, i) => (
          <div
            key={i}
            className="relative p-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center min-h-[120px]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-white/5 text-primary dark:text-gray-300 flex items-center justify-center shrink-0">
                  <FiUsers size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                    {patientDetail.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {patientDetail.age} yrs • {patientDetail.gender}
                  </p>
                </div>
              </div>
              <button
                className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPatientPopup({ patientIndex: i });
                }}
                aria-label="Edit patient"
              >
                <FiEdit2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPatientPopup?.patientIndex != null && (
        <PatientDetailsPopup
          patientDetails={user.patientDetails?.[showPatientPopup.patientIndex]}
          onClose={() => setShowPatientPopup(null)}
          onSave={async (values) => {
            const updatedPatientDetails = [...(user.patientDetails || [])];
            updatedPatientDetails[showPatientPopup.patientIndex] = values;
            setUser({ ...user, patientDetails: updatedPatientDetails });
            setIsDirty(true);
            setShowPatientPopup(null);
          }}
          onRemove={() => {
            const updatedPatientDetails = [...(user.patientDetails || [])];
            updatedPatientDetails.splice(showPatientPopup.patientIndex, 1);
            setUser({ ...user, patientDetails: updatedPatientDetails });
            setIsDirty(true);
            setShowPatientPopup(null);
          }}
        />
      )}
    </div>
  );
};

export default PatientsPage;
