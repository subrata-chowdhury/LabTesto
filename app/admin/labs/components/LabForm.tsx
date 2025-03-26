import { MainTable } from '@/components/Table'
import Image from 'next/image'
import React, { useState } from 'react'
import plusIcon from '@/assets/blue-plus.svg'
import PricePopup from './PricePopup'
import PackageIncludePopup from './PackageIncludePopup'
import RangePopup from './RangePopup'
import ResultTimePopup from './ResultTimePopup'
import TrashBinIcon from '@/assets/reactIcon/TrashBin'

type Props = {
    labDetails: LabTestDetails,
    loading?: boolean,
    error: { field: string, msg: string } | null,
    onChange: {
        labDetails: (labDetails: LabTestDetails) => void
    },
    onSave: () => void
}

const LabForm = ({ labDetails, loading, onChange, onSave = () => { } }: Props) => {
    const [showPricePopup, setShowPricePopup] = useState<{ index: number } | null>(null);
    const [showPackageIncludePopup, setShowPackageIncludePopup] = useState<{ index: number } | null>(null);
    const [showRangePopup, setShowRangePopup] = useState<{ index: number } | null>(null);
    const [showResultTimePopup, setShowResultTimesPopup] = useState<{ index: number } | null>(null);

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Tests Lab Form of <span className='text-blue-600'>{labDetails.name}</span>
            </div>
            <div className='pb-4 flex justify-between font-semibold'>
                Result Times
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowResultTimesPopup({ index: labDetails.resultTimes?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<ResultTime>
                    config={[
                        { heading: 'Test', selector: 'name' },
                        { heading: 'ResultTime', selector: 'resultTime' },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setShowResultTimesPopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newResultTimes = [...(labDetails.resultTimes || [])];
                                        newResultTimes.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, resultTimes: newResultTimes });
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.resultTimes || []}
                    className='rounded text-sm border-0' />
                {
                    showResultTimePopup && <ResultTimePopup
                        details={labDetails.resultTimes?.[showResultTimePopup.index]}
                        onClose={() => setShowResultTimesPopup(null)}
                        onSave={(details) => {
                            const newResultTimes = [...(labDetails.resultTimes || [])];
                            newResultTimes[showResultTimePopup.index] = details;
                            onChange.labDetails({ ...labDetails, resultTimes: newResultTimes });
                            setShowResultTimesPopup(null);
                        }}
                    />
                }
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Prices
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowPricePopup({ index: labDetails.prices?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<Price>
                    config={[
                        { heading: 'Test', selector: 'name' },
                        { heading: 'Price', selector: 'price' },
                        { heading: 'Offer', selector: 'offer' },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setShowPricePopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newPrices = [...(labDetails.prices || [])];
                                        newPrices.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, prices: newPrices });
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.prices || []}
                    className='rounded text-sm border-0' />
                {showPricePopup && <PricePopup
                    priceDetails={labDetails?.prices?.[showPricePopup.index]}
                    onClose={() => setShowPricePopup(null)}
                    onSave={priceData => {
                        const newPrices = [...(labDetails.prices || [])];
                        newPrices[showPricePopup.index] = priceData;
                        onChange.labDetails({ ...labDetails, prices: newPrices });
                        setShowPricePopup(null);
                    }} />}
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Packages Include
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowPackageIncludePopup({ index: labDetails.packagesInclude?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<PackageInclude>
                    config={[
                        { heading: 'Test', selector: 'name' },
                        { heading: 'Packages', selector: 'packages', component: ({ data }) => <div>{data.packages.join(', ')}</div> },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1 w-20'>
                                <button
                                    onClick={() => setShowPackageIncludePopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newPackagesInclude = [...(labDetails.packagesInclude || [])];
                                        newPackagesInclude.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, packagesInclude: newPackagesInclude });
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.packagesInclude || []}
                    className='rounded text-sm border-0' />
                {showPackageIncludePopup && <PackageIncludePopup
                    packageIncludeDetails={labDetails.packagesInclude?.[showPackageIncludePopup.index] || { test: '', packages: [] }}
                    onClose={() => setShowPackageIncludePopup(null)}
                    onSave={packageIncludeData => {
                        const newPackagesInclude = [...(labDetails.packagesInclude || [])];
                        newPackagesInclude[showPackageIncludePopup.index] = packageIncludeData;
                        onChange.labDetails({ ...labDetails, packagesInclude: newPackagesInclude });
                        setShowPackageIncludePopup(null);
                    }} />}
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Ranges
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowRangePopup({ index: labDetails.ranges?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<Range>
                    config={[
                        { heading: 'Test', selector: 'test' },
                        { heading: 'Name', selector: 'name' },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button
                                    onClick={() => setShowRangePopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newRanges = [...(labDetails.ranges || [])];
                                        newRanges.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, ranges: newRanges });
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.ranges || []}
                    className='rounded text-sm border-0' />
                {showRangePopup && <RangePopup
                    rangeDetails={labDetails.ranges?.[showRangePopup.index] || { test: '', ranges: [] }}
                    onClose={() => setShowRangePopup(null)}
                    onSave={rangeData => {
                        const newRanges = [...(labDetails.ranges || [])];
                        newRanges[showRangePopup.index] = rangeData;
                        console.log({ ...labDetails, ranges: newRanges })
                        onChange.labDetails({ ...labDetails, ranges: newRanges });
                        setShowRangePopup(null);
                    }} />}
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <button
                    className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer'
                    onClick={async () => {
                        await onSave();
                    }}
                    disabled={loading}>{loading ? 'Saving..' : 'Save'}</button>
            </div>
        </div>
    )
}

export default LabForm;

export type LabTestDetails = {
    resultTimes?: ResultTime[],
    prices?: Price[],
    packagesInclude?: PackageInclude[],
    ranges?: Range[],
    name?: string
}

type ResultTime = {
    name?: string,
    test: string,
    resultTime: string,
}

type Price = {
    name?: string,
    test: string,
    price: number,
    offer: number,
    expenses: number
}

type PackageInclude = {
    name?: string,
    test: string,
    packages: string[]
}

type Range = {
    name?: string,
    test: string,
    ranges: { [key: string]: string }[]
}
