import SelectTest from "@/app/components/SelectTest";
import TagInput from "@/components/Inputs/TagInput";
import Model from "@/components/Model";
import fetcher from "@/lib/fetcher";
import { useState } from "react";

export default function PackageIncludePopup({ packageIncludeDetails, onClose = () => { }, onSave = () => { } }: { packageIncludeDetails: { test: string, packages: string[] }, onClose?: () => void, onSave?: (packageIncludeDetails: { name?: string, test: string, packages: string[] }) => void }) {
    const [tests, setTests] = useState<{ name: string, _id: string }[]>([]);
    const [testSearch, setTestSearch] = useState<string>('');
    const [packageData, setPackageData] = useState<{ test: string, packages: string[] }>(packageIncludeDetails || {
        test: '',
        packages: []
    });

    return (
        <Model heading='Add Package Include' onClose={onClose}>
            <div className='px-7 py-4 pb-2'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <label className="flex flex-col gap-1">
                        Test *
                        <SelectTest
                            options={tests || []}
                            value={testSearch}
                            onChange={async val => {
                                setTestSearch(val)
                                const res = await fetcher.get<{ tests: { name: string, _id: string }[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify({ name: val })}&limit=5&page=1`);
                                if (res.status === 200 && res.body) {
                                    setTests(res.body.tests)
                                }
                            }}
                            onSelect={val => {
                                setPackageData(prevVal => ({ ...prevVal, test: val._id }))
                                setTestSearch(val.name)
                            }} />
                    </label>
                    {/* <Input label='Packages *' name='packages' placeholder='Enter packages' value={packageData.packages.join(', ')} onChange={(val) => { setPackageData(prevVal => ({ ...prevVal, packages: val.split(',').map(pkg => pkg.trim()) })) }} labelClass='font-medium' containerClass='flex-1' /> */}
                </div>
                <div className='text-sm pt-2'>
                    <TagInput
                        label='Packages *'
                        values={packageData.packages}
                        onChange={(val) => setPackageData(prevVal => ({ ...prevVal, packages: val }))}
                    />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave({ ...packageData, name: testSearch });
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}
