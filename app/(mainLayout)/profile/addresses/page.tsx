// app/(mainLayout)/profile/addresses/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { User } from "../page";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import AddressDetailsPopup from "@/app/components/popups/AddressDetailsPopup";
import { FiMapPin, FiPlus, FiEdit2 } from "react-icons/fi";

const AddressesPage = () => {
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
  const [showAddressPopup, setShowAddressPopup] = useState<{
    addressIndex: number;
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
      toast.success("Addresses updated successfully");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Addresses
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Add New Address Card */}
        <button
          className="min-h-[140px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl bg-gray-50/50 hover:bg-primary/5 hover:border-primary/50 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white"
          onClick={() =>
            setShowAddressPopup({ addressIndex: user.address?.length || 0 })
          }
        >
          <FiPlus size={28} />
          <span className="font-semibold">Add New Address</span>
        </button>

        {/* Existing Addresses */}
        {user?.address?.map((address, i) => (
          <div
            key={i}
            className="relative p-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold">
                  <FiMapPin />
                  <span>{address.pin}</span>
                </div>
                <button
                  className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddressPopup({ addressIndex: i });
                  }}
                  aria-label="Edit address"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {address.city}, {address.district}
              </p>
              {address.other && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {address.other}
                </p>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400">
              Phone: {address.phone}
            </div>
          </div>
        ))}
      </div>

      {showAddressPopup?.addressIndex != null && (
        <AddressDetailsPopup
          addressDetails={user.address?.[showAddressPopup.addressIndex]}
          onClose={() => setShowAddressPopup(null)}
          onRemove={() => {
            const updatedAddressDetails = [...(user.address || [])];
            updatedAddressDetails.splice(showAddressPopup.addressIndex, 1);
            setUser({ ...user, address: updatedAddressDetails });
            setIsDirty(true);
            setShowAddressPopup(null);
          }}
          onSave={async (values) => {
            const updatedAddressDetails = [...(user.address || [])];
            updatedAddressDetails[showAddressPopup.addressIndex] = values;
            setUser({ ...user, address: updatedAddressDetails });
            setIsDirty(true);
            setShowAddressPopup(null);
          }}
        />
      )}
    </div>
  );
};

export default AddressesPage;
