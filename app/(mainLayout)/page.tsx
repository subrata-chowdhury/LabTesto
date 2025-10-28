'use client'
import { SearchBar } from "../components/Menubar";
import React, { ReactNode, useEffect, useState } from "react";
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
import slide1Light from '@/assets/HomePage/Slides/slide1-light.webp'
import slide1Dark from '@/assets/HomePage/Slides/slide1-dark.webp'
import slide2Light from '@/assets/HomePage/Slides/slide2-light.webp'
import slide2Dark from '@/assets/HomePage/Slides/slide2-dark.webp'
import slide3Light from '@/assets/HomePage/Slides/slide3-light.webp'
import slide3Dark from '@/assets/HomePage/Slides/slide3-dark.webp'
import fullBodyTestIcon from '@/assets/HomePage/packages/full-body-test.png'
import premiumFullBodyTestIcon from '@/assets/HomePage/packages/premium-full-body-test.webp'
import fullGastroenterologyTestIcon from '@/assets/HomePage/packages/full-gastroenterology-test.png'
import fullUrologyTestIcon from '@/assets/HomePage/packages/full-urology-test.png'
import fullNeurologyTestIcon from '@/assets/HomePage/packages/full-neurology-test.png'
import useIsVisible from "@/lib/isVisibileHook";

export default function Home() {
    return (
        <>
            <main id="main" className="flex-1">
                <div className="md:hidden px-4 mt-4">
                    <SearchBar className="px-5 py-3" active={true} />
                </div>
                <section className="mx-4 mb-4">
                    <Slide
                        className="lg:h-[75vh] flex flex-col justify-center"
                        slides={3}
                        slideElement={({ slide }) => {
                            if (slide === 1) return <SlideImage imgLight={slide1Light} imgDark={slide1Dark} />
                            if (slide === 2) return <SlideImage imgLight={slide2Light} imgDark={slide2Dark} />
                            if (slide === 3) return <SlideImage imgLight={slide3Light} imgDark={slide3Dark} />
                        }} />
                </section>
                <FrequentRequiredTests />
                <Promises />
                <Packages />
                <Achivements />
            </main>
            <Footer />
        </>
    );
}

function FrequentRequiredTests() {
    const [ref, isVisible] = useIsVisible<HTMLSelectElement>({ threshold: 0.4, once: true });

    return (
        <section ref={ref} className="mx-auto flex flex-col py-20">
            <h1 className={"text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4 mx-auto mt-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Frequently Required Tests</h1>
            <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-4"></div>
            {/* <h1 className="text-2xl font-semibold">Frequently Required Tests</h1> */}
            {/* <h1 className="text-xl font-semibold translate-y-full ml-2 bg-white w-fit px-2">Frequently Required Tests</h1> */}
            <div className="mt-8 relative rounded-md w-full">
                {/* <div className="absolute -z-10 -top-64 md:-top-32 opacity-30 blur-sm w-full flex flex-col"> */}
                {/* <Image src={'/wave.svg'} width={960} height={540} alt="" className='w-full object-cover h-screen md:h-[55vh] -z-10 top-0 bg-transparent' /> */}
                {/* <Image src={'/wave.svg'} width={960} height={540} alt="" className='w-full object-cover h-screen md:h-[55vh] rotate-180 -z-10 top-0 bg-transparent' /> */}

                {/* <div style={{ backgroundImage: `url(/wave.svg)` }} className="w-full h-[100vh] md:h-[55vh] object-cover bg-no-repeat bg-cover bg-center" />
                            <div style={{ backgroundImage: `url(/wave.svg)` }} className="w-full h-[100vh] md:h-[55vh] object-cover bg-no-repeat bg-cover bg-center rotate-180" /> */}
                {/* </div> */}
                {/* <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full"> */}
                <div className="w-full md:w-[95%] mx-auto pt-0 sm:pt-0 md:pt-0 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl">
                    <Card
                        label="Complete Blood Count (CBC)"
                        tag="Blood"
                        description="It measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health. It helps diagnose infections, anemia, and other blood disorders."
                        link={{ label: "Book Now", href: '/tests/67a38ddca80c243e83d518ed' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.2s` }}
                    />
                    <Card
                        label="Fasting Blood Sugar (FBS)"
                        tag="Blood"
                        description="It's a blood test that measures glucose levels after an overnight fast. It helps diagnose diabetes, prediabetes, and monitor blood sugar control in diabetic patients."
                        link={{ label: "Book Now", href: '/tests/67a44ab70daa8b678a7fa330' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.3s` }}
                    />
                    <Card
                        label="Thyroid Stimulating Hormone (TSH)"
                        tag="Blood"
                        description="It's a blood test that measures TSH levels to evaluate thyroid function. It helps diagnose hypothyroidism, hyperthyroidism, and monitor thyroid disorders."
                        link={{ label: "Book Now", href: '/tests/67b9667ee39bde2a012634ca' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.4s` }}
                    />
                    <Card
                        label="Urine Examination (Routine)"
                        tag="Urine"
                        description="It analyzes urine for physical, chemical, and microscopic properties. It helps detect infections, kidney diseases, diabetes, and metabolic disorders."
                        link={{ label: "Book Now", href: '/tests/67bd6412266fe37d1fb4e7a8' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.5s` }}
                    />
                    <Card
                        label="Random Blood Sugar (RBS)"
                        tag="Blood"
                        description="It's a blood test that measures glucose levels at any time of the day, regardless of when you last ate. It helps assess blood sugar control and detect diabetes."
                        link={{ label: "Book Now", href: '/tests/67bd7997eb03aecfeb2f2331' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.6s` }}
                    />
                    <Card
                        label="Bilirubin, Total"
                        tag="Blood"
                        description="It's a blood test that measures bilirubin levels. It helps evaluate liver function and diagnose jaundice, liver disease, and hemolytic anemia."
                        link={{ label: "Book Now", href: '/tests/67bc6495e0dc0a8cb0b61dc5' }}
                        className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                        style={{ transition: `all 0.5s ease 0.7s` }}
                    />
                </div>
            </div>
        </section>
    )
}

function SlideImage({ imgLight, imgDark }: { imgLight: StaticImageData, imgDark: StaticImageData }) {
    return (
        <>
            <Image className="h-96 mx-auto object-scale-down dark:hidden block" src={imgLight} alt="" />
            <Image className="h-96 mx-auto object-scale-down hidden dark:block" src={imgDark} alt="" />
        </>
    )
}

export function Promises({ heading }: { heading?: string }) {
    const [ref, isVisible] = useIsVisible<HTMLSelectElement>({ threshold: 0.4, once: true });

    return (
        <section ref={ref} className="mx-auto md:w-[95%] flex flex-col py-20">
            <h1 className={"text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto mt-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>{heading ? heading : 'Our Promise'}</h1>
            <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-3"></div>
            {/* <div className="mt-4 p-3 md:p-5 border-2 border-primary border-opacity-40 border-dashed rounded-md bg-white w-full"> */}
            <div className="w-full max-w-6xl mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <CardType2
                    label={<span><span className="font-bold text-[#f59942]">NABL Certified</span><br /> Lab Test</span>}
                    icon={nablcertiIcon}
                    bgColor="rgba(245, 182, 66, 0.3)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.2s` }} />
                <CardType2
                    label={<span><span className="font-bold text-[rgba(245,96,66,1)]">On Time</span> Sample Collection by Expert</span>}
                    icon={ontimeIcon}
                    bgColor="rgba(245, 96, 66, 0.2)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.3s` }} />
                <CardType2
                    label={<span><span className="font-bold text-[rgba(3,24,255,0.7)]">Accurate Test</span><br /> Report</span>}
                    icon={accuratelabtest}
                    bgColor="rgba(3, 24, 255, 0.25)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.4s` }} />
                <CardType2
                    label={<span><span className="font-bold text-[rgba(8,145,178,0.8)]">Flexibility</span> to Schedule Test</span>}
                    icon={flexdateandtime}
                    bgColor="rgba(8, 145, 178, 0.2)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.5s` }} />
                <CardType2
                    label={<span><span className="font-bold text-[rgba(245,96,66,1)]">Free</span> Home Collection</span>}
                    icon={deliveryIcon}
                    bgColor="rgba(245, 96, 66, 0.2)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.6s` }} />
                <CardType2
                    label={<span><span className="font-bold text-[rgba(15,176,4,1)]">Cash On Delivery</span></span>}
                    icon={cod}
                    bgColor="rgba(15, 176, 4, 0.2)"
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.7s` }} />
            </div>
        </section>
    )
}

export function Packages() {
    const [ref, isVisible] = useIsVisible<HTMLSelectElement>({ threshold: 0.4, once: true });

    return (
        <section ref={ref} className="mx-auto md:w-[95%] flex flex-col py-20">
            <h1 className={"text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto mt-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Our Popular Packages</h1>
            <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-3"></div>
            {/* <h1 className="text-2xl font-semibold w-fit">Our Services</h1> */}
            <ul className="mt-8 mx-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <CardType3
                    label="Full Body Test"
                    link="/tests/67fa8db1144234ebc4c6fe06"
                    icon={fullBodyTestIcon}
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.2s` }} />
                <CardType3
                    label="Premium Full Body Test"
                    link="/tests/67fa8ded144234ebc4c6fe14"
                    icon={premiumFullBodyTestIcon}
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.3s` }} />
                <CardType3
                    label="Full Gastroenterology Test"
                    link="/tests/67fa8e33144234ebc4c6fe1d"
                    icon={fullGastroenterologyTestIcon}
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.4s` }} />
                <CardType3
                    label="Full Urology Test"
                    link="/tests/67fa8e5b144234ebc4c6fe28"
                    icon={fullUrologyTestIcon}
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.5s` }} />
                <CardType3
                    label="Full Neurology Test"
                    link="/tests/67fa8e80144234ebc4c6fe31"
                    icon={fullNeurologyTestIcon}
                    className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")}
                    style={{ transition: `all 0.5s ease 0.6s` }} />
            </ul>
        </section>
    )
}

export function Achivements() {
    const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.4, once: true });

    return (
        <section ref={ref} className="mx-auto md:w-[95%] mt-5 flex flex-col py-20">
            <h1 className={"text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto mt-4 " + (isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }}>Our Achivements</h1>
            <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-3"></div>
            {/* <h1 className="text-2xl font-semibold w-fit">Our Achivements</h1> */}
            <div className="mt-8 px-4 w-full grid gap-1 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* <CardType4 label="1000+" subText="" /> */}
                <CardType4 label="100+" value={100} subText="Labs" className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.2s` }} />
                <CardType4 label="8000+" value={8000} subText="Tests" className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.3s` }} />
                <CardType4 label="2000+" value={2000} subText="Clients" className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.4s` }} />
                <CardType4 label="97%" value={97} subText="Happy Customers" className={(isVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-6")} style={{ transition: `all 0.5s ease 0.5s` }} />
            </div>
        </section>
    )
}

function Card({ label = "CBC", tag, description, link, icon, className, style }: { label: string, tag?: string, description?: string, link?: { label: string, href: string }, icon?: StaticImageData, className?: string, style?: React.CSSProperties }) {
    return (
        <div className={`shadow-primary/5 flex flex-col p-4 pb-2 bg-white dark:bg-black rounded-md shadow-lg dark:shadow-black border border-primary/45 min-w-52 ${className}`} style={style}>
            <h1 className="text-xl font-semibold mb-1.5 text-primary dark:text-white">{label}</h1>
            {tag && <p className="text-xs font-semibold text-white mb-2.5 bg-primary dark:bg-white/25 px-4 py-1.5 w-fit rounded-full">{tag}</p>}
            {description && <p className="text-sm opacity-70 mb-2.5">{description}</p>}
            {icon && <Image src={icon} alt="" style={{ width: 120 }} />}
            <Link href={link?.href || '#'} className="border-t border-gray-400 mt-auto pt-2 text-primary dark:text-white text-sm flex items-center gap-2">{link?.label}<LinkArrowIcon size={12} /></Link>
        </div>
    )
}

function CardType2({ label = "CBC", subText, description, icon, bgColor, className, style }: { label: ReactNode, subText?: string, description?: string, icon?: StaticImageData, bgColor?: string, className?: string, style?: React.CSSProperties }) {
    return (
        <div className={`rounded-md p-0 py-4 sm:p-4 ${className}`} style={style}>
            <div className="flex flex-col gap-3">
                <div style={{ backgroundColor: bgColor }} className="w-24 h-24 p-4 mx-auto rounded-3xl flex items-center justify-center">
                    {icon && <Image src={icon} alt="" className="mx-auto" width={120} />}
                </div>
                <h1 className="sm:text-lg font-medium text-center">{label}</h1>
                {subText && <p className="text-sm text-primary text-opacity-45">{subText}</p>}
                {description && <p className="text-sm">{description}</p>}
            </div>
            {/* <div className="w-1/2">
                    <img src="/blood-test.jpg" alt="blood test" className="w-full h-32 object-cover rounded-md" />
                </div> */}
        </div>
    )
}

function CardType3({ label = "Cardiology", link = "#", icon, className, style }: { label: string, link?: string, icon?: StaticImageData, className?: string, style?: React.CSSProperties }) {
    return (
        <a href={link} className={`shadow-md group overflow-hidden relative transition-all shadow-primary/5 bg-white dark:bg-black dark:shadow-black rounded-md px-8 py-6 border border-primary/40 ${className}`} style={style}>
            <div className='bg-primary dark:bg-white/15 -z-10 transition-all duration-500 w-0 h-0 top-0 left-0 rounded-full group-hover:w-[150%] group-hover:h-[400px] absolute group-hover:-top-[25%] group-hover:-left-[25%]'></div>
            <li className="flex flex-col items-center">
                <figure>
                    {icon && <Image
                        src={icon}
                        alt=""
                        className="sr-icon filter brightness-0 dark:invert group-hover:invert transition-all duration-300"
                        width={80}
                        height={80}
                    />}
                </figure>
                <span className="text-primary dark:text-white text-center group-hover:text-gray-100 transition-all duration-300">{label}</span>
            </li>
        </a>
    )
}

function CardType4({ label = "CBC", value, subText, icon, className, style }: { label: string, value: number, subText?: string, description?: string, icon?: StaticImageData, className?: string, style?: React.CSSProperties }) {
    const [realValue, setRealValue] = useState(0);
    const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.5, once: true })

    useEffect(() => {
        if (isVisible) {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let currentValue = 0;
            const interval = setInterval(() => {
                if (currentValue >= value) clearInterval(interval);
                else {
                    currentValue = currentValue + increment;
                    setRealValue(Math.floor(currentValue));
                }
            }, duration / steps);

            return () => clearInterval(interval)
        }
    }, [value, isVisible]);

    return (
        <div ref={ref} className={"inline-flex dark:bg-black dark:shadow-md w-full h-32 mr-3 mb-3 flex-col items-center justify-center rounded-lg border border-primary/40 dark:border-white/25 shadow-md shadow-primary/10 " + className} style={style}>
            {icon && <figure>
                <Image
                    src={icon}
                    alt=""
                    className="sr-icon"
                    width={50}
                    height={50}
                />
            </figure>}
            <span className="text-primary dark:text-white text-4xl sm:text-5xl font-bold">{realValue >= value ? label : (realValue == 0 ? label : realValue)}</span>
            <span className="text-primary/70 dark:text-white/70">{subText}</span>
        </div>
    )
}