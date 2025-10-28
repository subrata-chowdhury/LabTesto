import Input from "@/components/Inputs/Input";
import Model from "@/components/Model";
import { useState } from "react";

export default function AddressDetailsPopup({ addressDetails, onSave, onRemove, onClose }: { addressDetails?: AddressDetails, onSave: (patientDetails: AddressDetails) => void, onRemove: () => void, onClose: () => void }) {
    const [values, setValues] = useState<AddressDetails>(addressDetails || {
        pin: '',
        city: '',
        district: '',
        other: '',
        phone: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    return (
        <Model heading='Address Details' onClose={onClose}>
            <div className='px-7 py-4 min-w-80'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm pb-4'>
                    <Input label='City *' value={values.city} error={errors.city} onChange={val => setValues({ ...values, city: val })} />
                    {/* <div className='text-sm flex flex-col gap-1'>
                        <label className='font-medium'>Gender *</label>
                        <Dropdown options={['Male', 'Female', 'Other']} width={'100%'} value={'Male'} onChange={({ value }) => setValues({ ...values, gender: value as 'Male' | 'Female' | 'Other' })} />
                    </div> */}
                    <Input label='District *' value={values.district} error={errors.district} onChange={val => setValues({ ...values, district: val })} />
                    <Input label='Pin *' value={values.pin?.toString()} type="number" error={errors.pin} onChange={val => setValues({ ...values, pin: val })} />
                    <Input label='Phone *' value={values.phone} error={errors.phone} onChange={val => setValues({ ...values, phone: val })} />
                </div>
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Landmark / Any Other details</label>
                    <textarea className='border-2 border-gray-300/50 dark:border-white/20 rounded w-full h-20 p-2 outline-none bg-transparent' rows={5} placeholder='Enter Other Details' value={values.other} onChange={(e) => setValues({ ...values, other: e.target.value })}></textarea>
                </div>
                <div className='p-5 pb-2 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-primary h-10 flex justify-center items-center px-4 border-2 border-primary rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className="bg-primary dark:bg-white/20 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer" onClick={onRemove}>Remove</div>
                    <div className='bg-primary dark:bg-white/20 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        // validate
                        const errors: { [key: string]: string } = {};
                        if (!values.city) errors.city = 'City is required';
                        if (!values.district) errors.district = 'District is required';
                        if (!values.phone) errors.phone = 'Phone is required';
                        if (!values.pin) errors.pin = 'Pin is required';
                        if (Object.keys(errors).length) return setErrors(errors);

                        await onSave(values);
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}

type AddressDetails = {
    pin: string;
    city: string;
    district: string;
    other?: string;
    phone: string;
}