import SelectLab from '@/app/components/SelectLab'
import Model from '@/components/Model'
import PatientDetailsPopup, { PatientDetails } from "@/app/components/popups/PatientDetailsPopup";
import SelectTest from '@/app/components/SelectTest'
import React, { useState } from 'react'
import { Item, Lab } from './OrderForm';
import Image from 'next/image'
import Input from '@/components/Inputs/Input'
import { MainTable } from '@/components/Table';
import plusIcon from '@/assets/blue-plus.svg'
import trashBin from '@/assets/trash-bin.svg'

export default function OrderPopup({ item, onSave, onClose }: { item: Item, onSave: (item: Item) => void, onClose: () => void }) {
    const [itemData, setItemData] = useState<Item>(item || { product: { test: '', lab: '', price: 0 }, patientDetails: [], quantity: 1 });
    const [showPatientPopup, setShowPatientPopup] = useState<boolean>(false);
    const [patientIndex, setPatientIndex] = useState<number | null>(null);

    return (
        <Model heading='Item Details' onClose={onClose}>
            <div className='px-7 py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium'>Test</label>
                        <SelectTest onSelect={val => setItemData({ ...itemData, product: { ...itemData?.product, test: val } })} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium'>Lab</label>
                        <SelectLab onSelect={val => {
                            // price calculation
                            const selectedTest = itemData.product.test;
                            const selectedLab = val as Lab;
                            const testPrice = selectedLab.prices.find(price => price.test === selectedTest._id)?.price || 0;
                            setItemData({ ...itemData, product: { ...itemData.product, lab: val, price: testPrice } });
                        }} />
                    </div>
                    {/* <Input label='Test' value={itemData?.product.test || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, test: val } })} /> */}
                    {/* <Input label='Lab' value={itemData?.product.lab || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, lab: val } })} /> */}
                    <Input label='Price' type='number' value={String(itemData?.product.price) || ''} onChange={val => setItemData({ ...itemData, product: { ...itemData.product, price: Number(val) } })} />
                    <Input label='Quantity' type='number' value={String(itemData?.quantity) || ''} onChange={val => setItemData({ ...itemData, quantity: Number(val) })} />
                </div>
                <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                    Patient Details
                    <div
                        className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                        onClick={() => {
                            setPatientIndex(itemData?.patientDetails.length);
                            setShowPatientPopup(true);
                        }}>
                        <div>New Patient</div>
                        <Image src={plusIcon} alt='' width={20} height={20} />
                    </div>
                </div>
                <div className='border-2 border-t-0 rounded'>
                    <MainTable<PatientDetails>
                        config={[
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Age', selector: 'age' },
                            { heading: 'Gender', selector: 'gender' },
                            {
                                heading: 'Actions',
                                component: ({ index }) => (
                                    <div className='flex items-center gap-1'>
                                        <button className='text-blue-500' onClick={() => {
                                            setPatientIndex(index);
                                            setShowPatientPopup(true);
                                        }}>
                                            Edit
                                        </button>|
                                        <button onClick={() => {
                                            const newPatients = [...itemData.patientDetails];
                                            newPatients.splice(index, 1);
                                            setItemData({ ...itemData, patientDetails: newPatients });
                                        }}><Image src={trashBin} alt="" width={20} height={20} /></button>
                                    </div>
                                )
                            }
                        ]}
                        data={itemData?.patientDetails}
                        className='rounded text-sm border-0' />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave(itemData);
                    }}>Save</div>
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
                            newPatients.slice(patientIndex, 1);
                            setItemData({ ...itemData, patientDetails: newPatients });
                            setShowPatientPopup(false);
                        }}
                    />
                )}
            </div>
        </Model>
    )
}