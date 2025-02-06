import SelectTest from "@/app/components/SelectTest";
import TagInput from "@/components/Inputs/TagInput";
import Model from "@/components/Model";
import { MainTable } from "@/components/Table";
import fetcher from "@/lib/fetcher";
import plusIcon from '@/assets/blue-plus.svg'
import Image from "next/image";
import { useState } from "react";

export default function RangePopup({ rangeDetails, onClose = () => { }, onSave = () => { } }: { rangeDetails: { test: string, ranges: { [key: string]: string }[] }, onClose?: () => void, onSave?: (rangeDetails: { name?: string, test: string, ranges: { [key: string]: string }[] }) => void }) {
    const [tests, setTests] = useState<{ name: string, _id: string }[]>([]);
    const [testSearch, setTestSearch] = useState<string>('');
    const [rangeData, setRangeData] = useState<{ test: string, ranges: { [key: string]: string }[] }>(rangeDetails || {
        test: '',
        ranges: []
    });
    const [headers, setHeaders] = useState<string[]>(Object.keys(rangeDetails.ranges[0]) || []);
    const [showRangePopup, setShowRangePopup] = useState<{ index: number } | null>(null);

    return (
        <Model heading='Add Range' onClose={onClose}>
            <div className='px-7 py-4 pb-2 text-sm flex flex-col gap-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                                setRangeData(prevVal => ({ ...prevVal, test: val._id }))
                                setTestSearch(val.name)
                            }} />
                    </label>
                </div>
                <TagInput
                    label='Headers *'
                    values={headers}
                    onChange={(val) => setHeaders(val)}
                />
                {headers.length > 0 && <>
                    <div
                        className='me-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                        onClick={() => setShowRangePopup({ index: rangeData.ranges.length })}>
                        <div>New Entry</div>
                        <Image src={plusIcon} alt='' width={20} height={20} />
                    </div>
                    <MainTable<{ [key: string]: string }>
                        config={headers.map(header => ({ heading: header.replace(/_/g, ' '), selector: header }))}
                        data={rangeData.ranges}
                        className='rounded text-sm border-0'
                    />
                </>}
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave({ ...rangeData, name: testSearch });
                    }}>Save</div>
                </div>
            </div>
            {showRangePopup && <Model heading='Add Range' onClose={() => setShowRangePopup(null)}>
                <div className='px-7 py-4 pb-2'>
                    <div className='grid grid-cols-1 gap-4 text-sm'>
                        <TagInput
                            label='Values *'
                            values={rangeData.ranges[showRangePopup.index] ? Object.values(rangeData.ranges[showRangePopup.index]) : []}
                            onChange={vals => {
                                const newRanges = [...rangeData.ranges]
                                const newRangeObj = vals.reduce((acc, val, index) => {
                                    (acc as { [key: string]: string })[headers[index]] = val;
                                    return acc;
                                }, {});
                                newRanges[showRangePopup.index] = newRangeObj;
                                setRangeData({ ...rangeData, ranges: newRanges })
                            }} />
                    </div>
                    <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                        <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => setShowRangePopup(null)}>Cancel</div>
                        <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                            setShowRangePopup(null);
                        }}>Save</div>
                    </div>
                </div>
            </Model>}
        </Model>
    )
}
