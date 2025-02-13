import Input from "@/components/Inputs/Input";
import Model from "@/components/Model";
import { useState } from "react";

export default function PatientDetailsPopup({ patientDetails, onSave, onClose }: { patientDetails?: PatientDetails, onSave: (patientDetails: PatientDetails) => void, onClose: () => void }) {
    const [values, setValues] = useState<PatientDetails>(patientDetails || {
        name: '',
        phone: '',
        address: {
            pin: 0,
            city: '',
            district: '',
            other: ''
        }
    });

    return (
        <Model heading='Patient Details' onClose={onClose}>
            <div className='px-7 py-4'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-4'>
                    <Input label='Name' value={values.name} onChange={val => setValues({ ...values, name: val })} />
                    <Input label='Phone' value={values.phone} onChange={val => setValues({ ...values, phone: val })} />
                </div>
                <div className='pb-2 font-semibold'>Address Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-2'>
                    <Input label='Pin' value={String(values.address.pin)} onChange={val => setValues({ ...values, address: { ...values.address, pin: Number(val) } })} />
                    <Input label='City' value={values.address.city} onChange={val => setValues({ ...values, address: { ...values.address, city: val } })} />
                    <Input label='District' value={values.address.district} onChange={val => setValues({ ...values, address: { ...values.address, district: val } })} />
                    <Input label='Other' value={values.address.other || ''} onChange={val => setValues({ ...values, address: { ...values.address, other: val } })} />
                </div>
                <div className='p-5 pb-2 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-orange-500 h-10 flex justify-center items-center px-4 border-2 border-orange-500 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-orange-500 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave(values);
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}

export type PatientDetails = {
    name: string;
    phone: string;
    address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
    };
};