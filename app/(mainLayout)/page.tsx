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
import Footer from "../components/Footer";

export default function Home() {
    const navigate = useRouter();

    return (
        <>
            <div className="flex-1 p-2 pt-3">
                <SearchBar className="md:hidden" active={true} onSelect={(test) => navigate.push('/tests/' + test._id)} />
                <section className="mx-2">
                    <Slide slides={3} />
                </section>
                <section className="mx-auto md:w-[95%] 2xl:w-fit pt-0 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Frequently Required Tests</h1>
                    <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full">
                        <div className="w-full overflow-x-auto hide-scroll flex gap-2">
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                            <Card label="CBC" subText="Blood" description="Check Your Overall Health" />
                        </div>
                    </div>
                </section>
                <section className="mx-auto md:w-[95%] 2xl:w-fit pt-0 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Our Promise</h1>
                    <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full">
                        <div className="w-full overflow-x-auto hide-scroll flex gap-2">
                            <CardType2 label="NABL Certified Lab Test" icon={nablcertiIcon} />
                            <CardType2 label="On Time Sample Collection by Expert" icon={ontimeIcon} />
                            <CardType2 label="Accurate Test Report" icon={accuratelabtest} />
                            <CardType2 label="Flexibility to Schedule Test" icon={flexdateandtime} />
                            <CardType2 label="Free Home Collection" icon={deliveryIcon} />
                            <CardType2 label="Cash On Delivery" icon={cod} />
                        </div>
                    </div>
                </section>
                <section className=" mx-auto md:w-[95%] pt-0 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <ul className=" grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        <CardType3 label="Cardiology" link="/tests/cardiology" />
                        <CardType3 label="Dentistry" link="/tests/dentistry" />
                        <CardType3 label="Dermatology" link="/tests/dermatology" />
                        <CardType3 label="Diabetes" link="/tests/diabetes" />
                        <CardType3 label="ENT" link="/tests/ent" />
                        <CardType3 label="Gastroenterology" link="/tests/gastroenterology" />
                        <CardType3 label="General Surgery" link="/tests/general-surgery" />
                        <CardType3 label="Gynecology" link="/tests/gynecology" />
                        <CardType3 label="Hematology" link="/tests/hematology" />
                        <CardType3 label="Internal Medicine" link="/tests/internal-medicine" />
                        <CardType3 label="Neurology" link="/tests/neurology" />
                        <CardType3 label="Oncology" link="/tests/oncology" />
                        <CardType3 label="Orthopedics" link="/tests/orthopedics" />
                        <CardType3 label="Pediatrics" link="/tests/pediatrics" />
                        <CardType3 label="Physiotherapy" link="/tests/physiotherapy" />
                        <CardType3 label="Psychiatry" link="/tests/psychiatry" />
                        <CardType3 label="Radiology" link="/tests/radiology" />
                        <CardType3 label="Urology" link="/tests/urology" />
                    </ul>
                </section>
                <section className="mx-auto md:w-[95%] pt-0 mt-5 sm:pt-0 md:pt-0 p-1 sm:p-2 md:p-4">
                    <h1 className="text-2xl font-semibold bg-white w-fit">Our Achivements</h1>
                    <div className="mt-4 bg-white w-full grid gap-1 md:gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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


function Card({ label = "CBC", subText, description, icon }: { label: string, subText?: string, description?: string, icon?: StaticImageData }) {
    return (
        <div className="bg-[#97c7e762] rounded-md shadow-md border-2 border-[#3987ba] text-[#3987ba] p-4 min-w-52">
            <div className="flex gap-2">
                <div className="">
                    <h1 className="text-lg font-semibold">{label}</h1>
                    {subText && <p className="text-sm text-primary text-opacity-65">{subText}</p>}
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
        <div className="bg-[#9bc6e260] rounded-md shadow-md border-2 border-[#3987ba] text-[#3987ba] p-4 min-w-52 w-[209px]">
            <div className="flex flex-col gap-3">
                {icon && <Image src={icon} alt="" className="mx-auto" width={120} />}
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
        <li className="shadow-md shadow-indigo-100 bg-white rounded-md p-2 py-6">
            <a href={link} className="flex flex-col items-center">
                <figure>
                    <Image
                        src="https://healthworldhospitals.com/wp-content/themes/healthworld/images/home/department/Cardiology.svg"
                        alt=""
                        className="sr-icon"
                        width={50}
                        height={50}
                    />
                </figure>
                <span className="text-[#3987ba]">{label}</span>
            </a>
        </li>
    )
}

function CardType4({ label = "CBC", subText, icon }: { label: string, subText?: string, description?: string, icon?: StaticImageData }) {
    return (
        <div className="inline-flex w-full h-32 mr-3 mb-3 flex-col items-center justify-center rounded-lg border-2 border-[#3987ba] bg-[#9bc6e260]">
            {icon && <figure>
                <Image
                    src={icon}
                    alt=""
                    className="sr-icon"
                    width={50}
                    height={50}
                />
            </figure>}
            <span className="text-[#3987ba] text-5xl font-bold">{label}</span>
            <span className="text-[#3987ba]">{subText}</span>
        </div>
    )
}