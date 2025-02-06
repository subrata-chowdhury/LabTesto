import Input from '@/components/Inputs/Input'
import { MainTable } from '@/components/Table'
import Image from 'next/image'
import React, { useState } from 'react'
import plusIcon from '@/assets/blue-plus.svg'
import trashBin from '@/assets/trash-bin.svg'
import informationIcon from '@/assets/information.svg'
import Title from '@/components/Title'
import PricePopup from './PricePopup'
import PackageIncludePopup from './PackageIncludePopup'
import RangePopup from './RangePopup'

type Props = {
    labDetails: LabDetails,
    error: { field: string, msg: string } | null,
    onChange: {
        labDetails: (labDetails: LabDetails) => void
    },
    onSave: () => void
}

const LabForm = ({ labDetails, error, onChange, onSave = () => { } }: Props) => {
    const [showPricePopup, setShowPricePopup] = useState<{ index: number } | null>(null);
    const [showPackageIncludePopup, setShowPackageIncludePopup] = useState<{ index: number } | null>(null);
    const [showRangePopup, setShowRangePopup] = useState<{ index: number } | null>(null);

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Lab Form
                <Title title={<p className='text-nowrap font-medium'>To autofill by labs themselves, <br /> enable checkbox at below of this form</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title>
            </div>
            <div className='pb-4 font-semibold'>Lab Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <Input label='Name *' name='name' placeholder='Enter name' value={labDetails.name} onChange={(val) => onChange.labDetails({ ...labDetails, name: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'name' ? error.msg : ""} />
                <Input label='Address *' name='address' placeholder='Enter address' value={labDetails.location.address} onChange={(val) => onChange.labDetails({ ...labDetails, location: { ...labDetails.location, address: val } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'address' ? error.msg : ""} />
                <Input label='Latitude *' name='lat' placeholder='Enter latitude' value={labDetails.location.location.lat.toString()} onChange={(val) => onChange.labDetails({ ...labDetails, location: { ...labDetails.location, location: { ...labDetails.location.location, lat: Number(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'lat' ? error.msg : ""} />
                <Input label='Longitude *' name='lang' placeholder='Enter longitude' value={labDetails.location.location.lang.toString()} onChange={(val) => onChange.labDetails({ ...labDetails, location: { ...labDetails.location, location: { ...labDetails.location.location, lang: Number(val) } } })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'lang' ? error.msg : ""} />
            </div>
            <div className='pb-4 font-semibold mt-6 pt-5 border-t-2'>Certification Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <Input label='Organization' name='organization' placeholder='Enter organization' value={labDetails.certification?.organization || ''} onChange={(val) => onChange.labDetails({ ...labDetails, certification: { ...labDetails.certification, organization: val } })} labelClass='font-medium' containerClass='flex-1' />
                <Input label='Image URL' name='imageUrl' placeholder='Enter image URL' value={labDetails.certification?.imageUrl || ''} onChange={(val) => onChange.labDetails({ ...labDetails, certification: { ...labDetails.certification, imageUrl: val } })} labelClass='font-medium' containerClass='flex-1' />
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2'>
                Prices
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowPricePopup({ index: labDetails.prices.length })}>
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
                                    <Image src={plusIcon} alt="" width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        const newPrices = [...labDetails.prices];
                                        newPrices.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, prices: newPrices });
                                    }}><Image src={trashBin} alt="" width={20} height={20} /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.prices}
                    className='rounded text-sm border-0' />
                {showPricePopup && <PricePopup
                    priceDetails={labDetails.prices[showPricePopup.index]}
                    onClose={() => setShowPricePopup(null)}
                    onSave={priceData => {
                        const newPrices = [...labDetails.prices];
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
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button
                                    onClick={() => setShowPackageIncludePopup({ index })}>
                                    <Image src={plusIcon} alt="" width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        const newPackagesInclude = [...(labDetails.packagesInclude || [])];
                                        newPackagesInclude.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, packagesInclude: newPackagesInclude });
                                    }}><Image src={trashBin} alt="" width={20} height={20} /></button>
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
                                    <Image src={plusIcon} alt="" width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        const newRanges = [...(labDetails.ranges || [])];
                                        newRanges.splice(index, 1);
                                        onChange.labDetails({ ...labDetails, ranges: newRanges });
                                    }}><Image src={trashBin} alt="" width={20} height={20} /></button>
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
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                    await onSave();
                }}>Save</div>
            </div>
        </div>
    )
}

export default LabForm;

export type LabDetails = {
    name: string,
    location: {
        address: string,
        location: {
            lat: number,
            lang: number
        }
    },
    certification?: {
        organization?: string,
        imageUrl?: string
    },
    prices: Price[],
    packagesInclude?: PackageInclude[],
    ranges?: Range[]
}

export type Price = {
    name?: string,
    test: string,
    price: number,
    offer: number
}

export type PackageInclude = {
    name?: string,
    test: string,
    packages: string[]
}

export type Range = {
    name?: string,
    test: string,
    ranges: { [key: string]: string }[]
}
