'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
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
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'
import Loading, { LabLoader } from './loading'
import star from '@/assets/star.svg'
import filledStar from '@/assets/star-fill.svg'
import cross from '@/assets/cross.svg'
import { CartPage } from '../../cart/component/CartPage'

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
    const [lab, setLab] = useState<{ _id: string, name: string, description: string, rating: number, prices: { test: string, price: number, offer: number }[] }>({ name: '', description: '', rating: 0, _id: '', prices: [] })
    const [labs, setLabs] = useState<LabDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [loadingTest, setLoadingTest] = useState(true);
    const [loadingLabs, setLoadingLabs] = useState(true);
    const [limit, setLimit] = useState<number>(10);
    const [showLabDetails, setShowLabDetails] = useState(false);
    const [seeMore, setSeeMore] = useState({
        packagesInclude: false,
        overview: false,
        description: false,
        testResultInterpretation: false,
        riskAssesment: false
    });
    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const isItemFound = useRef(false)

    const { id } = useParams<{ id: string }>();
    const navigate = useRouter();

    useEffect(() => {
        getTestDetails(id);
        getLabs(id, 10)
    }, [id])

    const onLabSelect = async (lab: LabDetails, testId: string) => {
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
    }

    async function getLabs(id: string, limit: number = 10) {
        const filter = { 'prices.test': id };
        await fetcher.get<{ labs: LabDetails[] }>(`/labs?filter=${JSON.stringify(filter)}&limit=${limit}`).then(res => {
            if (res.body && res.status === 200) {
                res.body.labs.forEach(lab => {
                    lab.prices = lab.prices.filter(p => p.test === id);
                    lab.packagesInclude = lab.packagesInclude.filter(p => p.test === id);
                    lab.ranges = lab.ranges.filter(p => p.test === id);
                });
                setLabs(res.body.labs);
                setLab(res.body.labs[0]);
                onLabSelect(res.body.labs[0], id);
                setLoadingLabs(false)
            }
        })
    }

    async function getTestDetails(id: string) {
        const res = await fetcher.get<TestDetails>(`/tests/${id}`);
        if (res.body && res.status === 200) {
            setTestDetails({
                name: res.body.name || '',
                sampleType: res.body.sampleType || '',
                otherTerms: res.body.otherTerms || [],
                tubeType: res.body.tubeType || '',
                description: res.body.description.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') || '',
                fastingRequired: res.body.fastingRequired || '',
                overview: res.body.overview.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') || '',
                testResultInterpretation: res.body.testResultInterpretation.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') || '',
                riskAssesment: res.body.riskAssesment.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') || '',
                resultTime: res.body.resultTime || ''
            });
            setLoadingTest(false);
        }
    }

    if (loadingTest) return <Loading />

    return (
        <div className='bg-blue-50 p-1 md:py-9 md:px-10'>
            <div className='bg-white border-2 p-7 px-8 flex flex-col rounded-lg'>
                <div className='text-2xl font-bold text-[#3986ba]'>{testDetails.name}</div>
                {(testDetails?.otherTerms || []).length > 0 && <div className='text-sm text-gray-500 pt-2'>
                    Also known as: <div className='text-black font-medium'>{testDetails.otherTerms}</div>
                </div>}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6'>
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
                            {testDetails.tubeType.includes('Tube') ? 'Tube' : 'Container'} Type
                        </p>
                        <p className='text-gray-500'>{testDetails.tubeType}</p>
                    </div>
                    {testDetails.fastingRequired?.length > 0 && <div className='flex gap-4'>
                        <p className='font-medium flex gap-2'>
                            <FoodIcon />
                            Fasting Required
                        </p>
                        <p className='text-gray-500'>{testDetails.fastingRequired}</p>
                    </div>}
                    {labs.length > 0 && <div className='flex gap-4 items-center'>
                        <p className='font-medium flex gap-2'>
                            <Image src={labIcon} alt='' width={24} height={24} />
                            Lab
                        </p>
                        <p className='text-gray-500'>{lab.name}</p>
                        <Title title={<p className='text-nowrap font-medium'>See lab Details</p>} onClick={() => setShowLabDetails(true)} titleClass='bg-white text-[#3986ba]'>
                            <Image src={informationIcon} alt="" width={20} height={20} />
                        </Title>
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
                <div className='bottom-0 flex flex-col sm:flex-row gap-4 items-center justify-between mt-6'>
                    <div className='flex items-center gap-2'>
                        {loadingLabs ? (
                            <div className='animate-pulse'>
                                <div className='h-8 w-32 bg-gray-300 rounded'></div>
                            </div>
                        ) : (labs.length > 0 && <>
                            <div className='text-2xl font-semibold'>₹{(labBaseDetails.offer).toFixed(2)}</div>
                            <div className='text-base line-through text-gray-500'>₹{labBaseDetails.price}</div>
                            <div className='text-sm font-semibold text-red-400'>{(((labBaseDetails.price - labBaseDetails.offer) / labBaseDetails.price) * 100).toFixed(2)}% OFF</div>
                        </>)}
                    </div>
                    <div className='flex gap-3'>
                        {(!loadingLabs && !loadingTest && labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-[#3986ba] text-white font-medium' onClick={() => {
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
                                    // toast.success('Test added to cart successfully');
                                    setShowOrderPopup(true);
                                } else if (res.status === 401) {
                                    toast.error('Please login to add test to cart');
                                    navigate.push('/login?redirect=/tests/' + id);
                                } else {
                                    toast.error('Failed to add test to cart please try again');
                                }
                                setBooking(false);
                            });
                        }}>{booking ? 'Booking..' : 'Book'}</button>}
                        {(!loadingLabs && !loadingTest && labs.length > 0) && <button disabled={loading} className='px-5 py-2 rounded-md bg-[#3986ba] text-white font-medium text-nowrap' onClick={() => {
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
                                    // navigate.push('/cart');
                                } else if (res.status === 401) {
                                    toast.error('Please login to add test to cart');
                                    navigate.push('/login?redirect=/tests/' + id);
                                } else {
                                    toast.error('Failed to add test to cart please try again');
                                }
                                setLoading(false);
                            });
                        }}>{loading ? 'Adding to Cart..' : 'Add to Cart'}</button>}
                    </div>
                </div>
            </div>
            <div className='mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 rounded-lg'>
                {loadingLabs === true && <LabLoader />}
                {loadingLabs === false && labs.length > 0 && labs.map((labObj, i) => (
                    <div key={i} className='border-2 p-5 py-4 rounded-lg cursor-pointer flex justify-between bg-white' onClick={() => onLabSelect(labs[i], id)}>
                        <div className='flex items-center gap-3'>
                            <div className='w-14 h-14 bg-[rgba(57,134,186,0.2)] rounded-md flex items-center justify-center'>
                                {/* <Image src='/download.png' alt='' width={115} height={50} /> */}
                            </div>
                            <div>
                                <div className='font-semibold text-[#3986ba]'>{labObj.name}</div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-lg font-semibold'>₹{labObj.prices[0].offer}</div>
                                    <div className='text-base line-through text-gray-500'>₹{labObj.prices[0].price}</div>
                                    <div className='text-sm font-semibold text-red-400'>{(((labObj.prices[0].price - labObj.prices[0].offer) / labObj.prices[0].price) * 100).toFixed(2)}% OFF</div>
                                </div>
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
                        onClick={async () => {
                            setLimit(prevLimit => prevLimit + 10);
                            await getLabs(id, limit + 10)
                        }}
                    >
                        Load More
                    </button>
                </div>
            )}
            <div className='mt-1 md:mt-4 py-8 px-8 rounded-lg border-2 bg-white '>
                <div className='tiptap flex flex-col gap-5' style={{ padding: 0, border: 0 }}>
                    {labBaseDetails.packagesInclude.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                        <PackageIcon />
                        <div className='flex flex-col gap-1 w-full'>
                            <p className='font-semibold text-xl w-full'>Packages Include</p>
                            <ul className={'list-disc list-inside relative w-full ' + (!seeMore.packagesInclude ? 'max-h-[5rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, packagesInclude: !seeMore.packagesInclude })}>
                                {
                                    labBaseDetails.packagesInclude.map(e => (
                                        <li key={e}>{e}</li>
                                    ))
                                }
                                {labBaseDetails.packagesInclude.length > 5 && <div className=' absolute flex flex-col top-0 left-0 h-full w-full'>
                                    <div className={'h-full w-full mt-auto bg-gradient-to-t flex flex-col ' + (!seeMore.packagesInclude ? 'from-white to-transparent' : '')}>
                                        <div className='ms-auto mt-auto text-sm font-medium cursor-pointer text-[#3986ba]'>See {!seeMore.packagesInclude ? 'More' : 'Less'}</div>
                                    </div>
                                </div>}
                            </ul>
                        </div>
                    </div>}
                    {testDetails?.overview?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                        <DescriptionIcon />
                        <div className='flex flex-col gap-1'>
                            <p className='font-semibold text-xl flex gap-2'>Overview</p>
                            <div className={'text-gray-500 relative ' + (!seeMore.overview ? 'max-h-[5rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, overview: !seeMore.overview })}>
                                <div dangerouslySetInnerHTML={{ __html: testDetails.overview }}></div>
                                {testDetails.overview.length > 50 && <div className=' absolute flex flex-col top-0 left-0 h-full w-full'>
                                    <div className={'h-full w-full mt-auto bg-gradient-to-t flex flex-col ' + (!seeMore.overview ? 'from-white to-transparent' : '')}>
                                        <div className='ms-auto mt-auto text-sm font-medium cursor-pointer text-[#3986ba]'>See {!seeMore.overview ? 'More' : 'Less'}</div>
                                    </div>
                                </div>}
                            </div>
                            {/* <p className='text-gray-500'>{testDetails.overview}</p> */}
                        </div>
                    </div>}
                    {testDetails.description.replace(/<br\/>/g, '').length > 0 && <div className='flex justify-start gap-2'>
                        <DescriptionIcon />
                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-semibold text-xl'>Description</p>
                            <div className={'text-gray-500 relative ' + (!seeMore.description ? 'max-h-[5rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, description: !seeMore.description })}>
                                <div className='text-gray-500' dangerouslySetInnerHTML={{ __html: testDetails.description }}></div>
                                {testDetails.description.length > 50 && <div className=' absolute flex flex-col top-0 left-0 h-full w-full'>
                                    <div className={'h-full w-full mt-auto bg-gradient-to-t flex flex-col ' + (!seeMore.description ? 'from-white to-transparent' : '')}>
                                        <div className='ms-auto mt-auto text-sm font-medium cursor-pointer text-[#3986ba]'>See {!seeMore.description ? 'More' : 'Less'}</div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>}
                    {testDetails?.testResultInterpretation?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                        <DescriptionIcon />
                        <div className='flex flex-col gap-1'>
                            <p className='font-semibold text-xl flex gap-2'>Test Result Interpretation</p>
                            <div className={'text-gray-500 relative ' + (!seeMore.testResultInterpretation ? 'max-h-[5rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, testResultInterpretation: !seeMore.testResultInterpretation })}>
                                <div className='text-gray-500' dangerouslySetInnerHTML={{ __html: testDetails.testResultInterpretation }}></div>
                                {testDetails.testResultInterpretation.length > 50 && <div className=' absolute flex flex-col top-0 left-0 h-full w-full'>
                                    <div className={'h-full w-full mt-auto bg-gradient-to-t flex flex-col ' + (!seeMore.testResultInterpretation ? 'from-white to-transparent' : '')}>
                                        <div className='ms-auto mt-auto text-sm font-medium cursor-pointer text-[#3986ba]'>See {!seeMore.testResultInterpretation ? 'More' : 'Less'}</div>
                                    </div>
                                </div>}
                            </div>
                            {/* <p className='text-gray-500'>{testDetails.testResultInterpretation}</p> */}
                        </div>
                    </div>}
                    {testDetails?.riskAssesment?.length > 0 && <div className='grid grid-flow-col justify-start gap-2'>
                        <DescriptionIcon />
                        <div className='flex flex-col gap-1'>
                            <p className='font-semibold text-xl flex gap-2'>Risk Assessment</p>
                            <div className={'text-gray-500 relative ' + (!seeMore.riskAssesment ? 'max-h-[5rem] overflow-y-hidden' : '')} onClick={() => setSeeMore({ ...seeMore, riskAssesment: !seeMore.riskAssesment })}>
                                <div className='text-gray-500' dangerouslySetInnerHTML={{ __html: testDetails.riskAssesment }}></div>
                                {testDetails.riskAssesment.length > 50 && <div className=' absolute flex flex-col top-0 left-0 h-full w-full'>
                                    <div className={'h-full w-full mt-auto bg-gradient-to-t flex flex-col ' + (!seeMore.riskAssesment ? 'from-white to-transparent' : '')}>
                                        <div className='ms-auto mt-auto text-sm font-medium cursor-pointer text-[#3986ba]'>See {!seeMore.riskAssesment ? 'More' : 'Less'}</div>
                                    </div>
                                </div>}
                            </div>
                            {/* <p className='text-gray-500'>{testDetails.riskAssesment}</p> */}
                        </div>
                    </div>}
                </div>
                {labBaseDetails.ranges.length > 0 && <div className='mt-1 md:mt-4 flex flex-col gap-5 rounded-lg bg-white'>
                    {labBaseDetails.ranges.length > 0 && <div className='flex gap-2'>
                        <DescriptionIcon />
                        <div className='flex flex-1 flex-col gap-1'>
                            <p className='font-semibold text-xl flex gap-2'>Ranges</p>
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



            {
                showLabDetails &&
                <div className='fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-20 z-50' onClick={() => setShowLabDetails(false)}>
                    <div className='fixed left-0 top-0 w-[90vw] sm:w-[70vw] bg-white shadow-2xl' onClick={e => e.stopPropagation()}>
                        <button className='flex justify-end p-2 absolute right-0 top-0 translate-x-full bg-white rounded-e-md border-2' onClick={() => setShowLabDetails(false)}>
                            <Image src={cross} alt='' />
                        </button>
                        <div className='overflow-y-scroll h-screen'>
                            <div className='bg-blue-200 relative min-h-52 overflow-hidden p-4'>
                                <p className='font-bold text-2xl bottom-10 absolute z-20 text-white'>{lab.name}</p>
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
                            <div className='tiptap border-0 p-5' dangerouslySetInnerHTML={{ __html: lab.description.replace(/<p>/g, '').replace(/<\/p>/g, '<br/>') }}></div>
                        </div>
                    </div>
                </div>
            }
            {
                showOrderPopup && <div className='w-screen h-screen z-20 flex flex-col fixed top-0 left-0 bg-gray-100'>
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
                </div>
            }
        </div>
    )
}

export default Test;

type TestDetails = {
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
    sampleType: string,
    prices: { test: string, price: number, offer: number }[],
    packagesInclude: { test: string, packages: string[] }[],
    ranges: { test: string, ranges: { [key: string]: string }[] }[]
}