// app/(mainLayout)/cart/component/SelectLocation.tsx
import { useEffect, useState } from "react";
import CheckBox from "@/components/Inputs/CheckBox";
import Model from "@/components/Model";
import fetcher from "@/lib/fetcher";
import { User } from "../../profile/page";
import { AddressLoader } from "../loading";
import AddressDetailsPopup from "@/app/components/popups/AddressDetailsPopup";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaEdit, FaPlus, FaPen } from "react-icons/fa";

export function SelectLocation({
  selectedAddress,
  onChange,
}: {
  selectedAddress?: Address;
  onChange: (address: Address) => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [showAddressesPopup, setShowAddressesPopup] = useState(false);
  const [showAddAddressDetailsPopup, setShowAddAddressDetailsPopup] = useState<{
    index: number;
  } | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const res = await fetcher.get<User>("/user");
    if (res.status === 200 && res.body) {
      setUser(res.body);
      if (res.body.address?.length > 0 && !selectedAddress) {
        onChange(res.body.address[0]);
      }
      setLoadingAddress(false);
    }
  }

  async function updateUser(updatedUser: User) {
    const res = await fetcher.post<User, User>("/user", updatedUser);
    if (res.status === 200 && res.body) {
      setUser(res.body);
      toast.success("Address updated successfully");
    }
  }

  if (loadingAddress || !user) return <AddressLoader />;

  return (
    <>
      <div className="w-full flex justify-between items-center py-4 px-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm mb-5 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
            <FaMapMarkerAlt size={18} />
          </div>
          {user.address.length <= 0 ? (
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              No Address Found
            </div>
          ) : selectedAddress ? (
            <div>
              <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-sm text-gray-500 font-normal">
                  Deliver to:
                </span>
                {selectedAddress.city}, {selectedAddress.pin}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                {selectedAddress.other} • {selectedAddress.phone}
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              Select an address
            </div>
          )}
        </div>

        <button
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
          onClick={() => setShowAddressesPopup(true)}
        >
          {user.address.length > 0 ? "Change" : "Add Address"}
        </button>
      </div>

      {showAddressesPopup && (
        <Model
          heading="Select Address"
          onClose={() => setShowAddressesPopup(false)}
        >
          <div className="px-6 py-4 min-w-[320px] max-w-md w-full max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-3 pb-4">
              {user.address.map((address, index) => {
                const isSelected =
                  address.pin === selectedAddress?.pin &&
                  address.city === selectedAddress.city &&
                  address.other === selectedAddress?.other;

                return (
                  <div
                    key={index}
                    className={`p-4 flex gap-4 rounded-xl border-2 items-center transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:border-primary/50 dark:bg-primary/10"
                        : "border-gray-200 dark:border-white/10 hover:border-primary/30 dark:hover:border-white/20 bg-white dark:bg-white/5"
                    }`}
                    onClick={() => {
                      onChange(address);
                      setShowAddressesPopup(false);
                    }}
                  >
                    <div className="mt-1">
                      <CheckBox value={isSelected} onChange={() => {}} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {address.city}, {address.pin}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {address.other}
                      </div>
                      <div className="text-sm font-medium text-gray-500 mt-1">
                        Phone: {address.phone}
                      </div>
                    </div>
                    <button
                      className="p-2 h-fit text-gray-400 hover:text-primary dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        setShowAddAddressDetailsPopup({ index });
                      }}
                      aria-label="Edit address"
                    >
                      <FaPen size={16} />
                    </button>
                  </div>
                );
              })}

              <button
                className="w-full mt-2 py-3 flex items-center justify-center gap-2 rounded-xl text-primary font-semibold border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white/10 transition-colors"
                onClick={() =>
                  setShowAddAddressDetailsPopup({ index: user.address.length })
                }
              >
                <FaPlus /> Add New Address
              </button>
            </div>
          </div>
        </Model>
      )}

      {showAddAddressDetailsPopup && (
        <AddressDetailsPopup
          addressDetails={user.address?.[showAddAddressDetailsPopup.index]}
          onClose={() => setShowAddAddressDetailsPopup(null)}
          onRemove={async () => {
            const updatedAddressDetails = [...(user.address || [])];
            updatedAddressDetails.splice(showAddAddressDetailsPopup.index, 1);
            setUser({ ...user, address: updatedAddressDetails });
            await updateUser({ ...user, address: updatedAddressDetails });
            setShowAddAddressDetailsPopup(null);
          }}
          onSave={async (values) => {
            const updatedAddressDetails = [...(user.address || [])];
            updatedAddressDetails[showAddAddressDetailsPopup.index] = values;
            setUser({ ...user, address: updatedAddressDetails });
            await updateUser({ ...user, address: updatedAddressDetails });
            setShowAddAddressDetailsPopup(null);
          }}
        />
      )}
    </>
  );
}

type Address = {
  pin: string;
  city: string;
  district: string;
  other?: string;
  phone: string;
};
