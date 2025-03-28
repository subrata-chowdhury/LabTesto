'use client'
import { SearchBar } from "../components/Menubar";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import deliveryIcon from '@/assets/HomePage/delivery.svg'
import nablcertiIcon from '@/assets/HomePage/nabl.svg'
import ontimeIcon from '@/assets/HomePage/ontime.png'
import accuratelabtest from '@/assets/HomePage/accurate.svg'
import flexdateandtime from '@/assets/HomePage/flex.png'
import cod from '@/assets/HomePage/cod.svg'
import Slide from "../components/Slide";
import Footer from "../components/Footer";
import { LinkArrowIcon } from "@/assets/reactIcon/LinkArrow";
import Link from "next/link";

export default function Home() {
    const navigate = useRouter();

    return (
        <>
            <div className="flex-1 pt-3 dark:bg-[#0A192F]">
                <div className="px-4 pt-2">
                <SearchBar className="md:hidden px-5 py-3" active={true} onSelect={(test) => navigate.push('/tests/' + test._id)} />
                </div>
                <section className="mx-4 mb-4">
                    <Slide slides={3} />
                </section>
                <section className="mx-auto flex flex-col">
                    <h1 className="text-3xl font-semibold text-center mx-auto mt-4">Frequently Required Tests</h1>
                    <div className="w-20 h-1 rounded-full mx-auto bg-black dark:bg-white dark:bg-opacity-30 bg-opacity-20 my-4"></div>
                    {/* <h1 className="text-2xl font-semibold">Frequently Required Tests</h1> */}
                    {/* <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Frequently Required Tests</h1> */}
                    <div className="mt-2 relative rounded-md w-full">
                        <div className="absolute -z-10 -top-64 md:-top-32 opacity-70 blur-sm w-full flex flex-col">
                            <div style={{ backgroundImage: `url(/wave.svg)` }} className="w-full h-[100vh] md:h-[55vh] bg-no-repeat bg-cover bg-center" />
                            <div style={{ backgroundImage: `url(/wave.svg)` }} className="w-full h-[100vh] md:h-[55vh] bg-no-repeat bg-cover bg-center rotate-180" />
                        </div>
                        {/* <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full"> */}
                        <div className="w-full md:w-[95%] mx-auto pt-0 sm:pt-0 md:pt-0 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            <Card
                                label="Complete Blood Count (CBC)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                            <Card
                                label="Fasting Blood Sugar (FBS)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                            <Card
                                label="Thyroid Stimulating Hormone (TSH)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                            <Card
                                label="Complete Blood Count (CBC)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                            <Card
                                label="Complete Blood Count (CBC)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                            <Card
                                label="Complete Blood Count (CBC)"
                                subText="Blood"
                                description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                                footer="Book Now"
                            />
                        </div>
                    </div>
                </section>
                <section className="mx-auto md:w-[95%] pt-0 sm:pt-0 md:pt-0 p-4 flex flex-col">
                    <h1 className="text-3xl font-semibold text-center mx-auto mt-4">Our Promise</h1>
                    <div className="w-20 h-1 rounded-full mx-auto bg-black dark:bg-white dark:bg-opacity-30 bg-opacity-20 my-3"></div>
                    <div className="mt-2 rounded-md w-full">
                        {/* <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full"> */}
                        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            <CardType2 label={<span><span className="font-bold text-[#f59942]">NABL Certified</span><br /> Lab Test</span>} icon={nablcertiIcon} bgColor="rgba(245, 182, 66, 0.3)" />
                            <CardType2 label={<span><span className="font-bold text-[rgba(245,96,66,1)]">On Time</span> Sample Collection by Expert</span>} icon={ontimeIcon} bgColor="rgba(245, 96, 66, 0.2)" />
                            <CardType2 label={<span><span className="font-bold text-[rgba(3,24,255,0.7)]">Accurate Test</span><br /> Report</span>} icon={accuratelabtest} bgColor="rgba(3, 24, 255, 0.25)" />
                            <CardType2 label={<span><span className="font-bold text-[rgba(8,145,178,0.8)]">Flexibility</span> to Schedule Test</span>} icon={flexdateandtime} bgColor="rgba(8, 145, 178, 0.2)" />
                            <CardType2 label={<span><span className="font-bold text-[rgba(245,96,66,1)]">Free</span> Home Collection</span>} icon={deliveryIcon} bgColor="rgba(245, 96, 66, 0.2)" />
                            <CardType2 label={<span><span className="font-bold text-[rgba(15,176,4,1)]">Cash On Delivery</span></span>} icon={cod} bgColor="rgba(15, 176, 4, 0.2)" />
                        </div>
                    </div>
                </section>
                <section className=" mx-auto md:w-[95%] pt-0 sm:pt-0 md:pt-0 p-4 flex flex-col">
                    <h1 className="text-3xl font-semibold text-center mx-auto mt-4">Our Popular Packages</h1>
                    <div className="w-20 h-1 rounded-full mx-auto bg-black dark:bg-white dark:bg-opacity-30 bg-opacity-20 my-3"></div>
                    {/* <h1 className="text-2xl font-semibold w-fit">Our Services</h1> */}
                    <ul className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <CardType3 label="Full Body Test" link="/tests/cardiology" />
                        <CardType3 label="Premium Full Body Test" link="/tests/dentistry" />
                        <CardType3 label="Full Gastroenterology Test" link="/tests/dermatology" />
                        <CardType3 label="Full Urology Test" link="/tests/diabetes" />
                        <CardType3 label="Full Neurology Test" link="/tests/neurology" />
                    </ul>
                </section>
                <section className="mx-auto md:w-[95%] pt-0 mt-5 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4 flex flex-col">
                    <h1 className="text-3xl font-semibold text-center mx-auto mt-4">Our Achivements</h1>
                    <div className="w-20 h-1 rounded-full mx-auto bg-black dark:bg-white dark:bg-opacity-30 bg-opacity-20 my-3"></div>
                    {/* <h1 className="text-2xl font-semibold w-fit">Our Achivements</h1> */}
                    <div className="mt-4 px-4 w-full grid gap-1 sm:gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {/* <CardType4 label="1000+" subText="" /> */}
                        <CardType4 label="100+" subText="Labs" />
                        <CardType4 label="8000+" subText="Tests" />
                        <CardType4 label="2000+" subText="Clients" />
                        <CardType4 label="97%" subText="Happy Customers" />
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}


function Card({ label = "CBC", subText, description, footer, icon }: { label: string, subText?: string, description?: string, footer?: string, icon?: StaticImageData }) {
    return (
        <div className="shadow-indigo-100 bg-white dark:bg-[#172A46] rounded-md shadow-lg dark:shadow-black border border-primary border-opacity-35 min-w-52">
            <div className="p-4 pb-2">
                <h1 className="text-2xl font-semibold mb-1.5 text-primary">{label}</h1>
                {subText && <p className="text-sm font-semibold text-primary mb-2.5 bg-primary bg-opacity-20 px-4 py-1.5 w-fit rounded-full">{subText}</p>}
                {description && <p className="text-sm opacity-70">{description}</p>}
                {icon && <Image src={icon} alt="" style={{ width: 120 }} />}
                <Link href={'#'} className="border-t border-gray-400 mt-2 pb-1.5 pt-2.5 text-primary text-sm flex items-center gap-2">{footer}<LinkArrowIcon size={12} /></Link>
            </div>
        </div>
    )
}

function CardType2({ label = "CBC", subText, description, icon, bgColor }: { label: ReactNode, subText?: string, description?: string, icon?: StaticImageData, bgColor?: string }) {
    return (
        <div className="rounded-md p-0 py-4 sm:p-4">
            <div className="flex flex-col gap-3">
                <div style={{ backgroundColor: bgColor }} className="w-24 h-24 p-4 mx-auto rounded-3xl flex items-center justify-center">
                    {icon && <Image src={icon} alt="" className="mx-auto" width={120} />}
                </div>
                <h1 className="text-lg font-medium text-center">{label}</h1>
                {subText && <p className="text-sm text-primary text-opacity-45">{subText}</p>}
                {description && <p className="text-sm">{description}</p>}
            </div>
            {/* <div className="w-1/2">
                    <img src="/blood-test.jpg" alt="blood test" className="w-full h-32 object-cover rounded-md" />
                </div> */}
        </div>
    )
}

function CardType3({ label = "Cardiology", link = "#" }: { label: string, link?: string, icon?: StaticImageData }) {
    return (
        <a href={link} className="shadow-md shadow-indigo-100 bg-white dark:bg-[#172A46] dark:shadow-black rounded-md p-2 py-6 border border-opacity-30 border-primary">
            <li className="flex flex-col items-center">
                <figure>
                    <Image
                        src="https://healthworldhospitals.com/wp-content/themes/healthworld/images/home/department/Cardiology.svg"
                        alt=""
                        className="sr-icon"
                        width={50}
                        height={50}
                    />
                </figure>
                <span className="text-primary text-center">{label}</span>
            </li>
        </a>
    )
}

function CardType4({ label = "CBC", subText, icon }: { label: string, subText?: string, description?: string, icon?: StaticImageData }) {
    return (
        <div className="inline-flex dark:bg-[#172A46] dark:shadow-md w-full h-32 mr-3 mb-3 flex-col items-center justify-center rounded-lg border-2 border-primary border-opacity-35 bg-primary bg-opacity-15">
            {icon && <figure>
                <Image
                    src={icon}
                    alt=""
                    className="sr-icon"
                    width={50}
                    height={50}
                />
            </figure>}
            <span className="text-primary text-5xl font-bold">{label}</span>
            <span className="text-primary">{subText}</span>
        </div>
    )
}