import SelectTest from "@/app/components/SelectTest";
import Input from "@/components/Inputs/Input";
import Model from "@/components/Model";
import { useState } from "react";

export default function PricePopup({ priceDetails, onClose = () => { }, onSave = () => { } }: { priceDetails: { test: string, price: number, offer: number, expenses: number }, onClose?: () => void, onSave?: (priceDetails: { test: string, price: number, offer: number, name?: string, expenses: number }) => void }) {
    const [testSearch, setTestSearch] = useState<string>('');
    const [priceData, setPriceData] = useState<{ test: string, price: number, offer: number, expenses: number }>(priceDetails || {
        test: '',
        price: 0,
        offer: 0,
        expenses: 0
    })

    return (
        <Model heading='Add Price' onClose={onClose}>
            <div className='px-7 py-4 pb-2'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <label className="flex flex-col gap-1">
                        Test *
                        <SelectTest
                            onSelect={val => {
                                setPriceData(prevVal => ({ ...prevVal, test: val._id }))
                                setTestSearch(val.name)
                            }} />
                        {/* {(error.field == 'institute' && error.msg?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.msg}</p>} */}
                    </label>
                    <Input label='Price *' name='price' placeholder='Enter price' type='number' value={priceData.price.toString()} onChange={(val) => { setPriceData(prevVal => ({ ...prevVal, price: Number(val) })) }} labelClass='font-medium' containerClass='flex-1' />
                    <Input label='Offer *' name='offer' placeholder='Enter offer' type='number' value={priceData.offer.toString()} onChange={(val) => { setPriceData(prevVal => ({ ...prevVal, offer: Number(val) })) }} labelClass='font-medium' containerClass='flex-1' />
                    <Input label='Expenses *' name='expenses' placeholder='Enter expenses' type='number' value={(priceData.expenses || 0).toString()} onChange={(val) => { setPriceData(prevVal => ({ ...prevVal, expenses: Number(val) })) }} labelClass='font-medium' containerClass='flex-1' />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave({ ...priceData, name: testSearch });
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}