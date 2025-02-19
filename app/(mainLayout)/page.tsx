'use client'
import { SearchBar } from "../components/Menubar";
import { useRouter } from "next/navigation";
import React from "react";
import Image, { StaticImageData } from "next/image";
import deliveryIcon from '@/assets/HomePage/delivery-2.png'
import nablcertiIcon from '@/assets/HomePage/nabl.png'
import ontimeIcon from '@/assets/HomePage/ontime.png'
import accuratelabtest from '@/assets/HomePage/accurate.png'
import flexdateandtime from '@/assets/HomePage/flex.png'
import cod from '@/assets/HomePage/cod.png'
import Slide from "../components/Slide";

export default function Home() {
    const navigate = useRouter();

    return (
        <>
            <div className="flex-1 p-2 pt-3">
                <SearchBar className="md:hidden" active={true} onSelect={(test) => navigate.push('/tests/' + test._id)} />
                <div className="mx-2">
                    <Slide slides={3} />
                </div>
                <div className="mx-auto md:w-[95%] 2xl:w-fit pt-0 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Frequently Required Tests</h1>
                    <div className="mt-4 p-3 md:p-5 border-2 border-orange-200 border-dashed rounded-md bg-white w-full">
                        <div className="w-full overflow-x-auto flex gap-2">
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto md:w-[95%] 2xl:w-fit pt-0 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Our Promise</h1>
                    <div className="mt-4 p-3 md:p-5 border-2 border-orange-200 border-dashed rounded-md bg-white w-full">
                        <div className="w-full overflow-x-auto flex gap-2">
                            <CardType2 label="NABL Certified Lab Test" icon={nablcertiIcon} />
                            <CardType2 label="On Time Sample Collection by Expert" icon={ontimeIcon} />
                            <CardType2 label="Accurate Test Report" icon={accuratelabtest} />
                            <CardType2 label="Flexibility to Schedule Test" icon={flexdateandtime} />
                            <CardType2 label="Free Home Collection" icon={deliveryIcon} />
                            <CardType2 label="Cash On Delivery" icon={cod} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


function Card({ label = "CBC", subText, description, icon }: { label: string, subText?: string, description?: string, icon?: StaticImageData }) {
    return (
        <div className="bg-orange-400 rounded-md shadow-md border-2 border-orange-500 text-white p-4 min-w-52">
            <div className="flex gap-2">
                <div className="">
                    <h1 className="text-lg font-semibold">{label}</h1>
                    {subText && <p className="text-sm text-gray-100">{subText}</p>}
                    {description && <p className="text-sm">{description}</p>}
                    {icon && <Image src={icon} alt="" style={{ width: 120 }} />}
                </div>
                {/* <div className="w-1/2">
                    <img src="/blood-test.jpg" alt="blood test" className="w-full h-32 object-cover rounded-md" />
                </div> */}
            </div>
        </div>
    )
}

function CardType2({ label = "CBC", subText, description, icon }: { label: string, subText?: string, description?: string, icon?: StaticImageData }) {
    return (
        <div className="bg-orange-400 rounded-md shadow-md border-2 border-orange-500 text-white p-4 min-w-52 w-[209px]">
            <div className="flex flex-col gap-3">
                {icon && <Image src={icon} alt="" className="mx-auto" width={120} />}
                <h1 className="text-lg font-medium text-center">{label}</h1>
                {subText && <p className="text-sm text-gray-100">{subText}</p>}
                {description && <p className="text-sm">{description}</p>}
            </div>
            {/* <div className="w-1/2">
                    <img src="/blood-test.jpg" alt="blood test" className="w-full h-32 object-cover rounded-md" />
                </div> */}
        </div>
    )
}