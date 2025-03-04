import SelectTest from "@/app/components/SelectTest";
import Input from "@/components/Inputs/Input";
import Model from "@/components/Model";
import { useState } from "react";

export default function ResultTimePopup({ details, onClose = () => { }, onSave = () => { } }: { details?: { name?: string, test: string, resultTime: string, }, onClose?: () => void, onSave?: (details: { name?: string, test: string, resultTime: string, }) => void }) {
    const [testSearch, setTestSearch] = useState<string>('');
    const [data, setData] = useState<{ name?: string, test: string, resultTime: string }>(details || {
        name: '',
        test: '',
        resultTime: ''
    })

    return (
        <Model heading='Add Result Time' onClose={onClose}>
            <div className='px-7 py-4 pb-2'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <label className="flex flex-col gap-1">
                        Test *
                        <SelectTest
                            onSelect={val => {
                                setData(prevVal => ({ ...prevVal, test: val._id }))
                                setTestSearch(val.name)
                            }} />
                        {/* {(error.field == 'institute' && error.msg?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.msg}</p>} */}
                    </label>
                    <Input label='ResultTime *' name='price' placeholder='Enter result time' value={data.resultTime} onChange={(val) => { setData(prevVal => ({ ...prevVal, resultTime: val })) }} labelClass='font-medium' containerClass='flex-1' />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => onClose()}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave({ ...data, name: testSearch });
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}