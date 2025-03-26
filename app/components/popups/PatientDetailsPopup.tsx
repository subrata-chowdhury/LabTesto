import Dropdown from "@/components/Dropdown";
import Input from "@/components/Inputs/Input";
import Model from "@/components/Model";
import { useState } from "react";

export default function PatientDetailsPopup({ patientDetails, onSave = () => { }, onRemove = () => { }, onClose = () => { }, patients }: { patientDetails?: PatientDetails, onSave: (patientDetails: ValidPatientDetails) => void, onRemove: () => void, onClose: () => void, patients?: PatientDetails[] }) {
    const [values, setValues] = useState<PatientDetails>(patientDetails || {
        name: '',
        gender: '',
        age: '',
        other: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    return (
        <Model heading='Patient Details' onClose={onClose}>
            <div className='px-7 py-4 min-w-80'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm pb-4'>
                    <Input label='Name *' value={values.name} error={errors.name} onChange={val => setValues({ ...values, name: val })} />
                    <div className='text-sm flex flex-col gap-1'>
                        <label className='font-medium'>Gender *</label>
                        <Dropdown options={['Male', 'Female', 'Other']} width={'100%'} value={values?.gender || ''} onChange={({ value }) => setValues({ ...values, gender: value as 'Male' | 'Female' | 'Other' })} />
                        {errors.gender && <div className='text-red-500 text-xs'>{errors.gender}</div>}
                    </div>
                    {/* <Input label='Phone' value={values.phone} error={errors.phone} onChange={val => setValues({ ...values, phone: val })} /> */}
                    <Input label='Age *' value={values.age?.toString()} type="number" error={errors.age} onChange={val => setValues({ ...values, age: Number(val) })} />
                </div>
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Other Details</label>
                    <textarea className='border-2 dark:border-gray-400 bg-transparent rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Other Details' value={values.other} onChange={(e) => setValues({ ...values, other: e.target.value })}></textarea>
                </div>
                <div className='p-5 pb-2 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-primary h-10 flex justify-center items-center px-4 border-2 border-primary rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className="bg-primary font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer" onClick={onRemove}>Remove</div>
                    <div className='bg-primary font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        // validate
                        const errors: { [key: string]: string } = {};
                        if (!values.name) errors.name = 'Name is required';
                        if (!values.gender) errors.gender = 'Gender is required';
                        if (!values.age) errors.age = 'Age is required';
                        if (Object.keys(errors).length) return setErrors(errors);

                        await onSave({
                            ...values,
                            age: Number(values.age) || 0,
                            gender: values.gender as 'Male' | 'Female' | 'Other'
                        });
                    }}>Save</div>
                </div>
            </div>
            {patients && patients.length > 0 && <div className='bg-[rgba(57,134,186,0.05)] p-1 text-xs'>
                {
                    patients.map((patient, i) => (
                        <div
                            key={i}
                            className='bg-[rgba(57,134,186,0.2)] px-4 py-2 rounded-full cursor-pointer inline-flex m-1'
                            onClick={() => setValues(patient)}>
                            {patient?.name?.split(' ').map(e => e.charAt(0)).join('') || 'Add +'}
                        </div>
                    ))
                }
            </div>}
        </Model>
    )
}

export type PatientDetails = {
    name: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    age: number | '';
    other?: string;
};

interface ValidPatientDetails extends PatientDetails {
    gender: 'Male' | 'Female' | 'Other';
    age: number;
}