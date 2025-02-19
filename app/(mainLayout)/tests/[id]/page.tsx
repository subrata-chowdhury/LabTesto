'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import labIcon from '@/assets/lab.png'
import Image from 'next/image'
import fetcher from '@/lib/fetcher'
import SampleTypeIcon from '@/assets/reactIcon/test/SampleType'
import TubeIcon from '@/assets/reactIcon/test/Tube'
import FoodIcon from '@/assets/reactIcon/test/Food'
import DescriptionIcon from '@/assets/reactIcon/test/Description'
// import Dropdown from '@/components/Dropdown'
import PackageIcon from '@/assets/reactIcon/test/Package'
import { MainTable } from '@/components/Table'
import CheckBox from '@/components/Inputs/CheckBox'
import { toast } from 'react-toastify'

function Test() {
    const [testDetails, setTestDetails] = useState<TestDetails>({
        name: 'Test',
        sampleType: '',
        tubeType: '',
        description: 'It is a test',
        fastingRequired: '',
        overview: '',
        testResultInterpretation: '',
        riskAssesment: '',
        resultTime: ''
    })
    const [labBaseDetails, setLabBaseDetails] = useState<{ price: number, offer: number, packagesInclude: string[], ranges: { [key: string]: string }[] }>({
        price: 0,
        offer: 0,
        packagesInclude: [],
        ranges: [{}]
    })
    const [lab, setLab] = useState<{ _id: string, name: string, prices: { test: string, price: number, offer: number }[] }>({ name: '', _id: '', prices: [] })
    const [labs, setLabs] = useState<LabDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState<number>(10);
    const { id } = useParams<{ id: string }>();

    const navigate = useRouter();

    useEffect(() => {
        getTestDetails(id);
    }, [id])

    const onLabSelect = useCallback(async (lab: LabDetails, testId: string) => {
        const selectedLab = lab;
        if (selectedLab) {
            // console.log(selectedLab);
            setLab(selectedLab);
            const testPrice = selectedLab.prices.find(p => p.test === testId);
            const packagesInclude = selectedLab.packagesInclude.find(p => p.test === testId);
            const ranges = selectedLab.ranges.find(p => p.test === testId);
            setLabBaseDetails({
                price: testPrice?.price || 0,
                offer: testPrice?.offer || 0,
                packagesInclude: packagesInclude?.packages || [],
                ranges: ranges?.ranges || []
            });
        }
    }, [])

    useEffect(() => {
        const filter = { 'prices.test': id };
        fetcher.get<{ labs: LabDetails[] }>(`/labs?filter=${JSON.stringify(filter)}&limit=${limit}`).then(res => {
            if (res.body && res.status === 200) {
                setLabs(res.body.labs);
                setLab(res.body.labs[0]);
                onLabSelect(res.body.labs[0], id);
            }
        })
    }, [id, limit, onLabSelect])

    async function getTestDetails(id: string) {
        const res = await fetcher.get<TestDetails>(`/tests/${id}`);
        if (res.body && res.status === 200)
            setTestDetails({
                name: res.body.name || '',
                sampleType: res.body.sampleType || '',
                tubeType: res.body.tubeType || '',
                description: res.body.description || '',
                fastingRequired: res.body.fastingRequired || '',
                overview: res.body.overview || '',
                testResultInterpretation: res.body.testResultInterpretation || '',
                riskAssesment: res.body.riskAssesment || '',
                resultTime: res.body.resultTime || ''
            });
    }

    return (
        <div className='bg-blue-50 p-1 md:py-9 md:px-10'>
            <div className='bg-white border-2 p-7 px-8 flex flex-col rounded-lg'>
                <div className='text-2xl font-bold pb-6 text-orange-600'>{testDetails.name}</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <SampleTypeIcon />
                            Sample Type
                        </p>
                        <p className='text-gray-500'>{testDetails.sampleType}</p>
                    </div>
                    <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <TubeIcon />
                            Tube Type
                        </p>
                        <p className='text-gray-500'>{testDetails.tubeType}</p>
                    </div>
                    <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <FoodIcon />
                            Fasting Required
                        </p>
                        <p className='text-gray-500'>{testDetails.fastingRequired}</p>
                    </div>
                    {labs.length > 0 && <div className='flex gap-4 items-center'>
                        <p className='font-medium flex gap-2'>
                            <Image src={labIcon} alt='' width={24} height={24} />
                            Lab
                        </p>
                        <p className='text-gray-500'>{lab.name}</p>
                        {/* <Dropdown
                            options={labs.map(e => e.name)}
                            value={lab?.name || ''}
                            containerClassName='flex-1'
                            optionElement={({ index, onClick }) => (
                                <div key={index} onClick={() => { onLabSelect(index); onClick() }} className='p-2 border-b-2 hover:bg-gray-200 cursor-pointer'>
                                    <div className='font-semibold text-orange-500'>{labs[index].name}</div>
                                    <div className='flex items-center gap-2'>
                                        <div className='text-lg font-semibold'>₹{(labs[index].prices[0].price - (labs[index].prices[0].price * (labs[index].prices[0].offer / 100))).toFixed(2)}</div>
                                        <div className='text-base line-through text-gray-500'>₹{labs[index].prices[0].price}</div>
                                        <div className='text-sm font-semibold text-red-400'>{labs[index].prices[0].offer}% OFF</div>
                                    </div>
                                </div>
                            )}
                            onChange={({ index }) => onLabSelect(index)}
                            width={'100%'} /> */}
                    </div>}
                </div>
                <div className='flex items-center justify-between mt-3'>
                    <div className='flex items-center gap-2'>
                        <div className='text-2xl font-semibold'>₹{(labBaseDetails.price - (labBaseDetails.price * (labBaseDetails.offer / 100))).toFixed(2)}</div>
                        <div className='text-base line-through text-gray-500'>₹{labBaseDetails.price}</div>
                        <div className='text-sm font-semibold text-red-400'>{labBaseDetails.offer}% OFF</div>
                    </div>
                    <button disabled={loading} className='px-5 py-2 rounded-md bg-orange-500 text-white font-medium' onClick={() => {
                        const cartItem = {
                            product: {
                                test: id,
                                lab: lab._id,
                                price: (labBaseDetails.price - (labBaseDetails.price * (labBaseDetails.offer / 100))).toFixed(2)
                            },
                            quantity: 1
                        };
                        setLoading(true);
                        fetcher.post('/cart', cartItem).then(res => {
                            if (res.status === 200) {
                                toast.success('Test added to cart successfully');
                                navigate.push('/cart');
                            } else if (res.status === 401) {
                                toast.error('Please login to add test to cart');
                                navigate.push('/login?redirect=/tests/' + id);
                            } else {
                                toast.error('Failed to add test to cart please try again');
                            }
                            setLoading(false);
                        });
                    }}>{loading ? 'Booking..' : 'Book'}</button>
                </div>
            </div>
            <div className='mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 rounded-lg'>
                {labs.length > 0 && labs.map((labObj, i) => (
                    <div key={i} className='border-2 p-5 py-4 rounded-lg cursor-pointer flex justify-between bg-white' onClick={() => onLabSelect(labs[i], id)}>
                        <div>
                            <div className='font-semibold text-orange-500'>{labObj.name}</div>
                            <div className='flex items-center gap-2'>
                                <div className='text-lg font-semibold'>₹{(labObj.prices[0].price - (labObj.prices[0].price * (labObj.prices[0].offer / 100))).toFixed(2)}</div>
                                <div className='text-base line-through text-gray-500'>₹{labObj.prices[0].price}</div>
                                <div className='text-sm font-semibold text-red-400'>{labObj.prices[0].offer}% OFF</div>
                            </div>
                        </div>
                        <CheckBox
                            value={lab._id === labObj._id}
                            label=""
                            onChange={() => onLabSelect(labs[i], id)}
                        />
                    </div>
                ))}
            </div>
            {labs.length >= limit && (
                <div className='w-full flex justify-center'>
                    <button
                        className='mt-2 px-5 py-2 rounded-md bg-orange-500 text-white font-medium'
                        onClick={() => setLimit(prevLimit => prevLimit + 10)}
                    >
                        Load More
                    </button>
                </div>
            )}
            <div className='mt-1 md:mt-4 py-8 px-8 flex flex-col gap-5 rounded-lg border-2 bg-white'>
                <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Description</p>
                        <p className='text-gray-500'>{testDetails.description}</p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium flex gap-2'>Overview</p>
                        <p className='text-gray-500'>{testDetails.overview}</p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium flex gap-2'>Test Result Interpretation</p>
                        <p className='text-gray-500'>{testDetails.testResultInterpretation}</p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium flex gap-2'>Risk Assessment</p>
                        <p className='text-gray-500'>{testDetails.riskAssesment}</p>
                    </div>
                </div>
            </div>
            {(labBaseDetails.packagesInclude.length > 0 && labBaseDetails.ranges.length > 0) && <div className='mt-1 md:mt-4 py-8 px-8 flex flex-col gap-5 rounded-lg border-2 bg-white'>
                {labBaseDetails.packagesInclude.length > 0 && <div className='flex items-start gap-2'>
                    <PackageIcon />
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Packages Include</p>
                        <ul className='list-disc list-inside'>
                            {
                                labBaseDetails.packagesInclude.map(e => (
                                    <li key={e}>{e}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>}
                {labBaseDetails.ranges.length > 0 && <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-1 flex-col gap-1'>
                        <p className='font-medium flex gap-2'>Ranges</p>
                        <div>
                            <MainTable
                                config={Object.keys(labBaseDetails.ranges[0] || {}).map(e => ({ heading: e, selector: e }))}
                                data={labBaseDetails.ranges}
                                className='border-2'
                            />
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

export default Test;

type TestDetails = {
    name: string,
    sampleType: string,
    tubeType: string,
    description: string,
    fastingRequired: string,
    overview: string,
    testResultInterpretation: string,
    riskAssesment: string,
    resultTime: string
}

type LabDetails = {
    _id: string,
    name: string,
    sampleType: string,
    prices: { test: string, price: number, offer: number }[],
    packagesInclude: { test: string, packages: string[] }[],
    ranges: { test: string, ranges: { [key: string]: string }[] }[]
}