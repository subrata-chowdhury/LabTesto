import CheckBox from "@/components/Inputs/CheckBox";
import Model from "@/components/Model";
import fetcher from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { User } from "../../profile/page";
import { AddressLoader } from "../loading";
import AddressDetailsPopup from "@/app/components/popups/AddressDetailsPopup";
import { toast } from "react-toastify";

export function SelectLocation({ selectedAddress, onChange }: { selectedAddress?: Address, onChange: (address: Address) => void }) {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        password: '',
        verified: false,
        patientDetails: [],
        address: [],
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const [showAddressesPopup, setShowAddressesPopup] = useState(false);
    const [showAddAddressDetailsPopup, setShowAddAddressDetailsPopup] = useState<{ index: number } | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        const res = await fetcher.get<User>('/user');
        if (res.status === 200 && res.body) {
            setUser(res.body);
            onChange(res.body.address[0]);
            setLoadingAddress(false)
        }
    }

    async function updateUser(user: User) {
        const res = await fetcher.post<User, User>('/user', user);
        if (res.status === 200 && res.body) {
            setUser(res.body)
            toast.success('Address updated successfully')
        }
    }

    if (loadingAddress) return <AddressLoader />

    return (
        <>
            <div className='w-full flex justify-between items-center py-3 px-4 bg-white dark:bg-[#172A46] rounded shadow mb-5'>
                {user.address.length <= 0 && <div className='text-sm text-gray-600'>Add Address</div>}
                {selectedAddress && <div>
                    <div className='font-medium'><span className='font-normal'>Deliver to:</span> {selectedAddress.city}, {selectedAddress.pin}</div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>{selectedAddress.other} | {selectedAddress.phone}</div>
                </div>}
                <div>
                    {user.address.length > 0 && <div className='px-3 py-1 rounded cursor-pointer text-primary font-medium border-2 border-primary' onClick={() => setShowAddressesPopup(true)}>Change</div>}
                    {user.address.length <= 0 && <div className='px-3 py-1 rounded cursor-pointer text-primary font-medium border-2 border-primary' onClick={() => setShowAddressesPopup(true)}>Add</div>}
                </div>
            </div>
            {showAddressesPopup && <Model heading='Addresses' onClose={() => setShowAddressesPopup(false)}>
                <div className='px-7 py-4 pt-6 min-w-80'>
                    <div className='grid grid-cols-1 gap-2 sm:gap-4 text-sm pb-4'>
                        {user.address.map((address, index) => (
                            <div key={index} className='bg-white dark:bg-[#172A46] p-3 flex gap-3 rounded-md border-2 border-gray-200 dark:border-gray-400 cursor-pointer' onClick={() => { onChange(address); setShowAddressesPopup(false) }}>
                                <CheckBox value={(address.pin === selectedAddress?.pin && address.city === selectedAddress.city && address.district === selectedAddress.district && address.other === selectedAddress.other && address.phone === selectedAddress.phone)} onChange={() => { }} />
                                <div>
                                    <div className='font-medium'>{address.city}, {address.pin}</div>
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>{address.other} | {address.phone}</div>
                                </div>
                                <div className="px-2 py-1 my-auto ms-auto rounded cursor-pointer text-primary font-medium border-2 border-primary" onClick={() => setShowAddAddressDetailsPopup({ index })}>Edit</div>
                            </div>
                        ))}
                        <div className="bg-primary p-2 px-3 flex gap-3 rounded-md text-white cursor-pointer ms-auto" onClick={() => setShowAddAddressDetailsPopup({ index: user.address.length })}>Add new Address</div>
                    </div>
                </div>
            </Model>}
            {showAddAddressDetailsPopup && <AddressDetailsPopup
                addressDetails={user.address?.[showAddAddressDetailsPopup.index]}
                onClose={() => setShowAddAddressDetailsPopup(null)}
                onRemove={async () => {
                    const updatedAddressDetails = [...(user.address || [])];
                    updatedAddressDetails.splice(showAddAddressDetailsPopup.index, 1);
                    setUser({ ...user, address: updatedAddressDetails });
                    await updateUser({ ...user, address: updatedAddressDetails });
                    setShowAddAddressDetailsPopup(null);
                }}
                onSave={async values => {
                    const updatedAddressDetails = [...(user.address || [])];
                    updatedAddressDetails[showAddAddressDetailsPopup.index] = values;
                    setUser({ ...user, address: updatedAddressDetails });
                    await updateUser({ ...user, address: updatedAddressDetails });
                    await fetchUser();
                    setShowAddAddressDetailsPopup(null);
                }} />}
        </>
    )
}

type Address = {
    pin: string;
    city: string;
    district: string;
    other?: string;
    phone: string;
}