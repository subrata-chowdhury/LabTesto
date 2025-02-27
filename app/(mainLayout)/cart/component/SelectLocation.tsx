import CheckBox from "@/components/Inputs/CheckBox";
import Model from "@/components/Model";
import fetcher from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { User } from "../../profile/page";
import { AddressLoader } from "../loading";

export function SelectLocation({ selectedAddress, onChange }: { selectedAddress?: Address, onChange: (address?: Address) => void }) {
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
    const [showAddressesPopup, setShowAddressesPopup] = useState(false)
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

    if (loadingAddress) return <AddressLoader />

    return (
        <>
            <div className='w-full flex justify-between items-center py-3 px-4 bg-white rounded shadow mb-5'>
                {selectedAddress && <div>
                    <div className='font-medium'><span className='font-normal'>Deliver to:</span> {selectedAddress.city}, {selectedAddress.pin}</div>
                    <div className='text-sm text-gray-600'>{selectedAddress.other} | {selectedAddress.phone}</div>
                </div>}
                <div>
                    {user.address.length > 0 && <div className='px-3 py-1 rounded cursor-pointer text-[#3986ba] font-medium border-2 border-[#3986ba]' onClick={() => setShowAddressesPopup(true)}>Change</div>}
                    {user.address.length <= 0 && <div className='px-3 py-1 rounded cursor-pointer text-[#3986ba] font-medium border-2 border-[#3986ba]' onClick={() => setShowAddressesPopup(true)}>Add</div>}
                </div>
            </div>
            {showAddressesPopup && <Model heading='Addresses' onClose={() => setShowAddressesPopup(false)}>
                <div className='px-7 py-4 pt-6 min-w-80'>
                    <div className='grid grid-cols-1 gap-2 sm:gap-4 text-sm pb-4'>
                        {user.address.map((address, index) => (
                            <div key={index} className='bg-white p-3 flex gap-3 rounded-md border-2 border-gray-200 cursor-pointer' onClick={() => { onChange(address); setShowAddressesPopup(false) }}>
                                <CheckBox value={(address.pin === selectedAddress?.pin && address.city === selectedAddress.city && address.district === selectedAddress.district && address.other === selectedAddress.other && address.phone === selectedAddress.phone)} onChange={() => { }} />
                                <div>
                                    <div className='font-medium'>{address.city}, {address.pin}</div>
                                    <div className='text-sm text-gray-600'>{address.other} | {address.phone}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Model>}
        </>
    )
}

type Address = {
    pin: number;
    city: string;
    district: string;
    other?: string;
    phone: string;
}