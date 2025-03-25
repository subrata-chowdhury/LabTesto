'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
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
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'
import { LabLoader } from '../loading'
import star from '@/assets/star.svg'
import filledStar from '@/assets/star-fill.svg'
import cross from '@/assets/cross.svg'
import { CartPage } from '../../../cart/component/CartPage'
import locationIcon from '@/assets/location.svg'
import { useItemCountContext } from '@/app/contexts/ItemCountContext'
import LabIcon from '@/assets/reactIcon/test/Lab'

type Props = {
    test: TestDetails
}

function MainTestPage({ test }: Props) {
    const testDetails = test;
    const [labBaseDetails, setLabBaseDetails] = useState<{ price: number, offer: number, packagesInclude: string[], ranges: { [key: string]: string }[] }>({
        price: 0,
        offer: 0,
        packagesInclude: [],
        ranges: []
    })
    const [lab, setLab] = useState<Lab>({ name: '', description: '', rating: 0, _id: '', prices: {} })
    const [labs, setLabs] = useState<LabDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [loadingLabs, setLoadingLabs] = useState(true);
    const [limit, setLimit] = useState<number>(10);
    const [showLabDetails, setShowLabDetails] = useState(false);
    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const { setItemCount } = useItemCountContext();
    const isItemFound = useRef(false)

    const { id } = useParams<{ id: string }>();
    const navigate = useRouter();

    useEffect(() => {
        getLabs(id, 10)
    }, [id])

    const onLabSelect = async (lab: LabDetails) => {
        const selectedLab = lab;
        if (selectedLab) {
            // console.log(selectedLab);
            setLab(selectedLab);
            const testPrice = selectedLab.prices[id];
            const packagesInclude = (selectedLab?.packagesInclude || {})[id];
            const ranges = (selectedLab.ranges || {})[id];
            setLabBaseDetails({
                price: testPrice?.price || 0,
                offer: testPrice?.offer || 0,
                packagesInclude: packagesInclude?.packages || [],
                ranges: ranges?.ranges || []
            });
        }
    }

    async function getLabs(id: string, limit: number = 10) {
        const filter = { test: id };
        await fetcher.get<{ labs: LabDetails[] }>(`/labs?filter=${JSON.stringify(filter)}&limit=${limit}`).then(res => {
            if (res.body && res.status === 200) {
                res.body.labs.forEach(lab => {
                    lab.prices = { [id]: lab.prices[id] };
                    lab.packagesInclude = { [id]: (lab.packagesInclude || {})[id] };
                    lab.ranges = { [id]: (lab.ranges || {})[id] };
                });
                setLabs(res.body.labs);
                setLab(res.body.labs[0]);
                onLabSelect(res.body.labs[0]);
                setLoadingLabs(false)
            }
        })
    }

    const onBook = () => {
        const cartItem = {
            product: {
                test: id,
                lab: lab._id,
                price: (labBaseDetails.price - (labBaseDetails.price * (labBaseDetails.offer / 100))).toFixed(2)
            },
            quantity: 1
        };
        setBooking(true);
        fetcher.post('/cart', cartItem).then(res => {
            if (res.status === 200) {
                setShowOrderPopup(true);
            } else if (res.status === 401) {
                toast.error('Please login to add test to cart');
                navigate.push('/login?redirect=/tests/' + id);
            } else {
                toast.error('Failed to add test to cart please try again');
            }
            setBooking(false);
        });
    }

    const onAddToCart = () => {
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
                fetcher.get<{ items: number }>('/cart/count').then(res => {
                    if (res.status === 200 && res.body) {
                        setItemCount(res.body.items || 0)
                    };
                })
            } else if (res.status === 401) {
                toast.error('Please login to add test to cart');
                navigate.push('/login?redirect=/tests/' + id);
            } else {
                toast.error('Failed to add test to cart please try again');
            }
            setLoading(false);
        });
    }

    return (
        <div className='bg-blue-50 dark:bg-[#0A192F] p-1 md:py-9 md:px-10'>
            <section className='bg-white dark:bg-[#0A192F] border-2 dark:border-[#172A46] p-7 px-8 flex flex-col rounded-lg'>
                <h1 className='text-2xl font-bold text-primary'>{testDetails.name}</h1>
                {(testDetails?.otherTerms || []).length > 0 && <div className='text-sm text-gray-500 pt-2'>
                    <strong className='font-normal'>Also known as:</strong> <span className='text-black font-medium'>{testDetails?.otherTerms?.join(', ')}</span>
                </div>}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6'>
                    <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <SampleTypeIcon />
                            Sample Type
                        </p>
                        <p className='text-gray-500 dark:text-gray-400'>{testDetails.sampleType}</p>
                    </div>
                    <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <TubeIcon />
                            {testDetails.tubeType.includes('Tube') ? 'Tube' : 'Container'} Type
                        </p>
                        <p className='text-gray-500 dark:text-gray-400'>{testDetails.tubeType}</p>
                    </div>
                    {testDetails.fastingRequired?.length > 0 && <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <FoodIcon />
                            Fasting Required
                        </p>
                        <p className='text-gray-500 dark:text-gray-400'>{testDetails.fastingRequired}</p>
                    </div>}
                    {labs.length > 0 && <div className='flex gap-4 items-center'>
                        <p className='font-medium dark:text-white flex gap-2'>
                            <LabIcon />
                            Lab
                        </p>
                        <p className='text-gray-500 dark:text-gray-400'>{lab.name}</p>
                        <Title title={<p className='text-nowrap font-medium'>See lab Details</p>} onClick={() => setShowLabDetails(true)} titleClass='bg-white text-primary'>
                            <Image src={informationIcon} alt="Information Icon" width={20} height={20} />
                        </Title>
                    </div>}
                </div>
                <div className='bottom-0 flex flex-col sm:flex-row gap-4 items-center justify-between mt-6'>
                    <div className='flex items-center gap-2'>
                        {loadingLabs ? (
                            <div className='animate-pulse'>
                                <div className='h-8 w-32 bg-gray-300 rounded'></div>
                            </div>
                        ) : (labs.length > 0 && <>
                            <div className='text-2xl font-semibold'>₹{(labBaseDetails.offer).toFixed(2)}</div>
                            <div className='text-base line-through text-gray-500 dark:text-gray-400'>₹{labBaseDetails.price}</div>
                            <div className='text-sm font-semibold text-red-400'>{(((labBaseDetails.price - labBaseDetails.offer) / labBaseDetails.price) * 100).toFixed(2)}% OFF</div>
                        </>)}
                    </div>
                    <div className='flex gap-3'>
                        {(!loadingLabs && labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-primary text-white font-medium' onClick={onBook}>{booking ? 'Booking..' : 'Book'}</button>}
                        {(!loadingLabs && labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-primary text-white font-medium text-nowrap' onClick={onAddToCart}>{loading ? 'Adding to Cart..' : 'Add to Cart'}</button>}
                    </div>
                </div>
            </section>
            <section className='mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 rounded-lg'>
                {loadingLabs === true && <LabLoader />}
                {loadingLabs === false && labs.length > 0 && labs.map((labObj, i) => (
                    <div key={i} className='border-2 dark:border-[#172A46] p-5 py-4 rounded-lg cursor-pointer flex justify-between bg-white dark:bg-[#172A46]' onClick={() => onLabSelect(labs[i])}>
                        <div className='flex items-center gap-3'>
                            <div className='w-14 h-14 bg-[rgba(57,134,186,0.2)] rounded-md flex items-center justify-center'>
                            </div>
                            <div>
                                <div className='font-semibold text-primary'>{labObj.name}</div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-lg font-semibold'>₹{labObj.prices[id].offer}</div>
                                    <div className='text-base line-through text-gray-500 dark:text-gray-400'>₹{labObj.prices[id].price}</div>
                                    <div className='text-sm font-semibold text-red-400'>{(((labObj.prices[id].price - (labObj.prices[id]?.offer || 0)) / labObj.prices[id].price) * 100).toFixed(2)}% OFF</div>
                                </div>
                            </div>
                        </div>
                        <CheckBox
                            value={lab._id === labObj._id}
                            label=""
                            onChange={() => onLabSelect(labs[i])}
                        />
                    </div>
                ))}
            </section>
            {labs.length >= limit && (
                <div className='w-full flex justify-center'>
                    <button
                        className='mt-2 px-5 py-2 rounded-md bg-primary text-white font-medium'
                        onClick={async () => {
                            setLimit(prevLimit => prevLimit + 10);
                            await getLabs(id, limit + 10)
                        }}
                    >
                        Load More
                    </button>
                </div>
            )}
            <DetailsSection labBaseDetails={labBaseDetails} testDetails={testDetails} />


            {showLabDetails && <LabDetailsSidePopup lab={lab} onClose={() => setShowLabDetails(false)} />}
            {showOrderPopup && <section className='w-screen h-screen z-20 flex flex-col fixed top-0 left-0 bg-gray-100'>
                <div className='ms-auto mr-6 mt-7 cursor-pointer' onClick={() => setShowOrderPopup(false)}>
                    <Image src={cross} alt=""></Image>
                </div>
                <CartPage
                    showRemoveBtn={false}
                    onFetchedCart={() => { isItemFound.current = false }}
                    filterCartFunc={(item) => {
                        if (isItemFound.current) return false;
                        if (item.product.test._id === id && item.product.lab._id === lab._id) {
                            isItemFound.current = true;
                            return true;
                        }
                        return false
                    }} />
            </section>}
        </div>
    )
}

export type TestDetails = {
    name: string,
    otherTerms?: string[],
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
    description: string,
    rating: number,
    name: string,
    prices: {
        [key: string]: {
            test: string;
            price: number;
            offer?: number;
            expenses?: number;
        }
    },
    packagesInclude?: {
        [key: string]: {
            test: string;
            packages: string[];
        }
    };
    ranges?: {
        [key: string]: {
            test: string;
            ranges: { [key: string]: string }[];
        }
    };
}

type Lab = {
    _id: string,
    name: string,
    description: string,
    location?: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string
        }
    },
    rating: number,
    prices: {
        [key: string]: {
            test: string;
            price: number;
            offer?: number;
            expenses?: number;
        }
    }
}

function DetailsSection({ labBaseDetails, testDetails }: {
    labBaseDetails: {
        price: number,
        offer: number,
        packagesInclude: string[],
        ranges: { [key: string]: string }[]
    },
    testDetails: TestDetails
}) {
    const [seeMore, setSeeMore] = useState({
        packagesInclude: false,
        overview: false,
        description: false,
        testResultInterpretation: false,
        riskAssesment: false
    });

    return (
        <section className='mt-1 md:mt-4 py-8 px-8 rounded-lg border-2 dark:border-[#172A46] bg-white dark:bg-[#172A46]'>
            <div className='flex flex-col gap-5' style={{ padding: 0, border: 0 }}>
                {labBaseDetails.packagesInclude.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <PackageIcon />
                    <div className='flex flex-col gap-1 w-full'>
                        <h2 className='font-semibold text-xl w-full'>Packages Include</h2>
                        <ul className={'list-disc list-inside relative w-full ' + (!seeMore.packagesInclude ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, packagesInclude: !seeMore.packagesInclude })}>
                            {
                                labBaseDetails.packagesInclude.map(e => (
                                    <li key={e}>{e}</li>
                                ))
                            }
                        </ul>
                        {labBaseDetails.packagesInclude.length > 5 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary' onClick={() => setSeeMore({ ...seeMore, packagesInclude: !seeMore.packagesInclude })}>See {!seeMore.packagesInclude ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {testDetails?.overview?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Overview</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.overview ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, overview: !seeMore.overview })}>
                            <div className='tiptap' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.overview }}></div>
                        </div>
                        {testDetails.overview.length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary' onClick={() => setSeeMore({ ...seeMore, overview: !seeMore.overview })}>See {!seeMore.overview ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {testDetails.description.replace(/<br\/>/g, '').length > 0 && <div className='flex justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex-1 flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl'>Description</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.description ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, description: !seeMore.description })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.description }}></div>
                        </div>
                        {testDetails.description.length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary' onClick={() => setSeeMore({ ...seeMore, description: !seeMore.description })}>See {!seeMore.description ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {testDetails?.testResultInterpretation?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Test Result Interpretation</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.testResultInterpretation ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, testResultInterpretation: !seeMore.testResultInterpretation })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.testResultInterpretation }}></div>
                        </div>
                        {testDetails.testResultInterpretation.length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary' onClick={() => setSeeMore({ ...seeMore, testResultInterpretation: !seeMore.testResultInterpretation })}>See {!seeMore.testResultInterpretation ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {testDetails?.riskAssesment?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Risk Assessment</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.riskAssesment ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, riskAssesment: !seeMore.riskAssesment })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.riskAssesment }}></div>
                        </div>
                        {testDetails.riskAssesment.length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary' onClick={() => setSeeMore({ ...seeMore, riskAssesment: !seeMore.riskAssesment })}>See {!seeMore.riskAssesment ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
            </div>
            {labBaseDetails.ranges.length > 0 && <div className='mt-1 md:mt-4 flex flex-col gap-5 rounded-lg'>
                {labBaseDetails.ranges.length > 0 && <div className='flex gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-1 flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Ranges</h2>
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
        </section>
    )
}

function LabDetailsSidePopup({ lab, onClose }: { lab: Lab, onClose: () => void }) {
    return (
        <section className='fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-20 z-50' onClick={() => onClose()}>
            <div className='fixed left-0 top-0 w-[90vw] sm:w-[70vw] bg-white shadow-2xl' onClick={e => e.stopPropagation()}>
                <button className='flex justify-end p-2 absolute right-0 top-0 translate-x-full bg-white rounded-e-md border-2' onClick={() => onClose()}>
                    <Image src={cross} alt='' />
                </button>
                <div className='overflow-y-scroll h-screen'>
                    <div className='bg-blue-200 relative min-h-52 overflow-hidden p-4'>
                        <h2 className='font-bold text-2xl bottom-16 absolute z-20 text-white'>{lab.name}</h2>
                        <p className='font-medium flex gap-1 bottom-10 absolute z-20 text-white'>
                            <Image src={locationIcon} alt="" width={18} height={18} />
                            {lab.location?.address?.city}, {lab.location?.address?.district}
                        </p>
                        <div className='flex gap-2 absolute bottom-4 z-20'>
                            {Array.from({ length: Math.floor(lab.rating) }).map((_, i) => (
                                <Image key={i} src={filledStar} alt='' width={20} height={20} />
                            ))}
                            {Array.from({ length: 5 - Math.floor(lab.rating) }).map((_, i) => (
                                <Image key={i} src={star} alt='' width={20} height={20} />
                            ))}
                        </div>
                        <div className='absolute bottom-0 w-full h-full z-10 -translate-x-[10%] translate-y-1/2 bg-gradient-to-t from-gray-400 to-transparent transform rotate-[20deg]'></div>
                    </div>
                    <div className='tiptap border-0 p-5' style={{ border: 0 }} dangerouslySetInnerHTML={{ __html: lab.description.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') }}></div>
                </div>
            </div>
        </section>
    )
}

export default MainTestPage