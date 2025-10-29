'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { memo, useEffect, useRef, useState } from 'react'
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
import star from '@/assets/star.svg'
import filledStar from '@/assets/star-fill.svg'
import cross from '@/assets/cross.svg'
import { CartPage } from '../../../cart/component/CartPage'
import locationIcon from '@/assets/location.svg'
import { useItemCountContext } from '@/app/contexts/ItemCountContext'
import LabIcon from '@/assets/reactIcon/test/Lab'
import { CrossIcon } from '@/assets/reactIcon/Cross'

type Props = {
    test: TestDetails
}

function MainTestPage({ test }: Props) {
    const labs = Object.values(test.labsDetails || {});
    const testDetails = test;
    const [labBaseDetails, setLabBaseDetails] = useState<{
        price: number,
        offer: number,
        packages: string[],
        ranges: { [key: string]: string }[]
    }>(labs[0] ? {
        price: labs[0].price || 0,
        offer: labs[0].offer || 0,
        packages: labs[0].packages || [],
        ranges: labs[0].ranges ? Array.from(labs[0].ranges, ([key, value]) => ({ [key]: value })) : []
    } : {
        price: 0,
        offer: 0,
        packages: [],
        ranges: []
    })
    const [lab, setLab] = useState<LabDetails>(labs[0] || { name: '', lab: '', price: 0, resultTime: '' });
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [limit, setLimit] = useState<number>(10);
    const [showLabDetails, setShowLabDetails] = useState(false);
    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const { setItemCount } = useItemCountContext();
    const isItemFound = useRef(false)

    const { id } = useParams<{ id: string }>();
    const navigate = useRouter();

    const onLabSelect = async (lab: LabDetails) => {
        const selectedLab = lab;
        if (selectedLab) {
            // console.log(selectedLab);
            setLab(selectedLab);
            setLabBaseDetails({
                price: selectedLab?.price || 0,
                offer: selectedLab?.offer || 0,
                packages: selectedLab?.packages || [],
                ranges: selectedLab.ranges ? Array.from(selectedLab.ranges, ([key, value]) => ({ [key]: value })) : []
            });
        }
    }

    const onBook = () => {
        const cartItem = {
            product: {
                test: id,
                lab: lab.lab,
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
                lab: lab.lab,
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
        <div className='bg-blue-50 dark:bg-white/0 p-1 md:py-9 md:px-10'>
            <section className='bg-white dark:bg-black border-2 border-gray-300/50 dark:border-white/15 p-7 px-8 flex flex-col rounded-lg'>
                <h1 className='text-2xl font-bold text-primary dark:text-white'>{testDetails.name}</h1>
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
                    {(testDetails?.fastingRequired?.length || 0) > 0 && <div className='flex gap-4'>
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
                        {labs.length > 0 && <>
                            <div className='text-2xl font-semibold'>₹{(labBaseDetails.offer).toFixed(2)}</div>
                            <div className='text-base line-through text-gray-500 dark:text-gray-400'>₹{labBaseDetails.price}</div>
                            <div className='text-sm font-semibold text-red-400'>{(((labBaseDetails.price - labBaseDetails.offer) / labBaseDetails.price) * 100).toFixed(2)}% OFF</div>
                        </>}
                    </div>
                    <div className='flex gap-3'>
                        {(labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-primary dark:bg-white/15 text-white font-medium cursor-pointer' onClick={onBook}>{booking ? 'Booking..' : 'Book'}</button>}
                        {(labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-primary dark:bg-white/15 text-white font-medium text-nowrap cursor-pointer' onClick={onAddToCart}>{loading ? 'Adding to Cart..' : 'Add to Cart'}</button>}
                    </div>
                </div>
            </section>
            <section className='mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 rounded-lg'>
                {/* {loadingLabs === true && <LabLoader />} */}
                {labs.length > 0 && labs.map((labObj, i) => (
                    <div key={i} className='border-2 border-gray-300/50 dark:border-white/15 p-5 py-4 rounded-lg cursor-pointer flex justify-between bg-white dark:bg-black' onClick={() => onLabSelect(labObj)}>
                        <div className='flex items-center gap-3'>
                            <div className='w-14 h-14 bg-primary/20 dark:bg-white/30 rounded-md flex items-center justify-center'>
                                {labObj.image && <Image src={labObj.image} width={56} height={56} alt="" />}
                            </div>
                            <div>
                                <div className='font-semibold text-primary dark:text-white'>{labObj.name}</div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-lg font-semibold'>₹{labObj.offer}</div>
                                    <div className='text-base line-through text-gray-500 dark:text-gray-400'>₹{labObj.price}</div>
                                    <div className='text-sm font-semibold text-red-400'>{(((labObj.price - (labObj?.offer || 0)) / labObj.price) * 100).toFixed(2)}% OFF</div>
                                </div>
                            </div>
                        </div>
                        <CheckBox
                            value={lab.lab === labObj.lab}
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
                        }}
                    >
                        Load More
                    </button>
                </div>
            )}
            <DetailsSection labBaseDetails={labBaseDetails} testDetails={testDetails} />


            {showLabDetails && <LabDetailsSidePopup labId={lab.lab} onClose={() => setShowLabDetails(false)} />}
            {showOrderPopup && <section className='w-screen h-screen z-20 flex flex-col fixed top-0 left-0 bg-gray-100'>
                <div className='ms-auto mr-6 mt-7 cursor-pointer' onClick={() => setShowOrderPopup(false)}>
                    <Image src={cross} alt=""></Image>
                </div>
                <CartPage
                    showRemoveBtn={false}
                    onFetchedCart={() => { isItemFound.current = false }}
                    filterCartFunc={(item) => {
                        if (isItemFound.current) return false;
                        if (item.product.test._id === id && item.product.lab._id === lab.lab) {
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
    name: string;
    otherTerms?: string[];
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other Body Fluid';
    tubeType: 'Clot Tube' | 'Fluoride Tube' | 'EDTA Tube' | 'Citrate Tube' | 'Sterile Container' | 'Non-Sterile Container';
    description?: string;
    fastingRequired?: string;
    overview?: string;
    testResultInterpretation?: string;
    riskAssesment?: string;
    labsDetails?: {
        [key: string]: LabDetails
    };
}

type LabDetails = {
    lab: string;
    name: string;
    image?: string;
    price: number;
    offer?: number;
    expenses?: number;
    resultTime: string;
    packages?: string[];
    ranges?: Map<string, string>;
}

type Lab = {
    _id: string,
    name: string,
    image?: string,
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
}

const DetailsSection = memo(({ labBaseDetails, testDetails }: {
    labBaseDetails: {
        price: number,
        offer: number,
        packages: string[],
        ranges: { [key: string]: string }[]
    },
    testDetails: TestDetails
}) => {
    const [seeMore, setSeeMore] = useState({
        packagesInclude: false,
        overview: false,
        description: false,
        testResultInterpretation: false,
        riskAssesment: false
    });

    return (
        <section className='mt-1 md:mt-4 py-8 px-8 rounded-lg border-2 border-gray-300/50 dark:border-white/15 bg-white dark:bg-black'>
            <div className='flex flex-col gap-5' style={{ padding: 0, border: 0 }}>
                {labBaseDetails.packages.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <PackageIcon />
                    <div className='flex flex-col gap-1 w-full'>
                        <h2 className='font-semibold text-xl w-full'>Packages Include</h2>
                        <ul className={'list-disc list-inside relative w-full ' + (!seeMore.packagesInclude ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, packagesInclude: !seeMore.packagesInclude })}>
                            {
                                labBaseDetails.packages.map(e => (
                                    <li key={e}>{e}</li>
                                ))
                            }
                        </ul>
                        {labBaseDetails.packages.length > 5 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary dark:text-white' onClick={() => setSeeMore({ ...seeMore, packagesInclude: !seeMore.packagesInclude })}>See {!seeMore.packagesInclude ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {(testDetails?.overview?.length || 0) > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Overview</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.overview ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, overview: !seeMore.overview })}>
                            <div className='tiptap' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.overview || '' }}></div>
                        </div>
                        {(testDetails?.overview || '').replace(/<[^>]*>/g, '').length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary dark:text-white' onClick={() => setSeeMore({ ...seeMore, overview: !seeMore.overview })}>See {!seeMore.overview ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {(testDetails?.description || '').replace(/<[^>]*>/g, '').length > 0 && <div className='flex justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex-1 flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl'>Description</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.description ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, description: !seeMore.description })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.description || '' }}></div>
                        </div>
                        {(testDetails?.description || '').replace(/<[^>]*>/g, '').length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary dark:text-white' onClick={() => setSeeMore({ ...seeMore, description: !seeMore.description })}>See {!seeMore.description ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {(testDetails?.testResultInterpretation || '').length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1 overflow-x-auto'>
                        <h2 className='font-semibold text-xl flex gap-2'>Test Result Interpretation</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.testResultInterpretation ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, testResultInterpretation: !seeMore.testResultInterpretation })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.testResultInterpretation || '' }}></div>
                        </div>
                        {(testDetails.testResultInterpretation || '').replace(/<[^>]*>/g, '').length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary dark:text-white' onClick={() => setSeeMore({ ...seeMore, testResultInterpretation: !seeMore.testResultInterpretation })}>See {!seeMore.testResultInterpretation ? 'More' : 'Less'}</div>}
                    </div>
                </div>}
                {(testDetails?.riskAssesment || '').replace(/<[^>]*>/g, '').length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                    <DescriptionIcon />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-semibold text-xl flex gap-2'>Risk Assessment</h2>
                        <div className={'text-gray-500 dark:text-gray-300 relative ' + (!seeMore.riskAssesment ? 'max-h-[4.8rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, riskAssesment: !seeMore.riskAssesment })}>
                            <div className='tiptap text-gray-500 dark:text-gray-300' style={{ padding: 0, border: 0, minHeight: 'auto' }} dangerouslySetInnerHTML={{ __html: testDetails.riskAssesment || '' }}></div>
                        </div>
                        {(testDetails.riskAssesment || '').replace(/<[^>]*>/g, '').length > 50 && <div className='mt-auto text-sm font-semibold cursor-pointer text-primary dark:text-white' onClick={() => setSeeMore({ ...seeMore, riskAssesment: !seeMore.riskAssesment })}>See {!seeMore.riskAssesment ? 'More' : 'Less'}</div>}
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
})
DetailsSection.displayName = 'DetailsSection';

const LabDetailsSidePopup = memo(({ labId, onClose }: { labId: string, onClose: () => void }) => {
    const [lab, setLab] = useState<Lab>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLabDetails();
    }, [labId])

    async function fetchLabDetails() {
        setLoading(true);
        const res = await fetcher.get<Lab>(`/labs/${labId}`);
        if (res.status === 200 && res.body) {
            setLab(res.body);
        }
        setLoading(false);
    }

    return (
        <section className='fixed w-screen h-screen top-0 left-0 bg-black/20 dark:bg-white/20 backdrop-blur-sm z-50' onClick={() => onClose()}>
            <div className='fixed left-0 top-0 w-[90vw] sm:w-[70vw] bg-white dark:bg-black shadow-2xl' onClick={e => e.stopPropagation()}>
                <button className='flex justify-end p-2 absolute right-0 top-0 cursor-pointer translate-x-full bg-white dark:text-white dark:bg-black rounded-e-md border-2 border-transparent' onClick={() => onClose()}>
                    <CrossIcon />
                </button>
                <div className='overflow-y-scroll h-screen'>
                    <div className='bg-primary/20 dark:bg-white/15 relative min-h-52 w-full overflow-hidden p-4'>
                        {lab?.image && <Image src={lab.image} className='bg-white/80 z-20 relative rounded' alt="" width={80} height={80} />}
                        <h2 className='font-bold text-2xl bottom-16 absolute z-20 text-white'>{loading ? <div className='h-6 w-28 animate-pulse bg-gray-300 rounded'></div> : lab?.name}</h2>
                        <div className='font-medium flex gap-1 bottom-10 absolute z-20 text-white'>
                            {loading ? <div className='h-4 w-52 animate-pulse bg-gray-300 rounded'></div> : <>
                                <Image src={locationIcon} alt="" width={18} height={18} />
                                {lab?.location?.address?.city}, {lab?.location?.address?.district}
                            </>}
                        </div>
                        {loading ? <div className='h-6 w-36 animate-pulse absolute bottom-3 bg-gray-300 rounded z-20'></div> : <div className='flex gap-2 absolute bottom-4 z-20'>
                            {Array.from({ length: Math.floor(lab?.rating || 0) }).map((_, i) => (
                                <Image key={i} src={filledStar} alt='' width={20} height={20} />
                            ))}
                            {Array.from({ length: 5 - Math.floor(lab?.rating || 0) }).map((_, i) => (
                                <Image key={i} src={star} alt='' width={20} height={20} />
                            ))}
                        </div>}
                        <div className='absolute bottom-0 w-full h-full z-10 -translate-x-[10%] translate-y-1/2 bg-linear-to-t from-primary/30 dark:from-white/15 to-transparent transform rotate-20'></div>
                    </div>
                    {loading ? <div className='p-5 flex flex-col gap-2'>
                        <div className='h-4 w-full animate-pulse bg-gray-300 rounded'></div>
                        <div className='h-4 w-full animate-pulse bg-gray-300 rounded'></div>
                        <div className='h-4 w-10/12 animate-pulse bg-gray-300 rounded'></div>
                    </div> :
                        <div className='tiptap border-0 p-5' style={{ border: 0 }} dangerouslySetInnerHTML={{ __html: (lab?.description || '').replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') }}></div>}

                </div>
            </div>
        </section>
    )
})
LabDetailsSidePopup.displayName = 'LabDetailsSidePopup';

export default MainTestPage