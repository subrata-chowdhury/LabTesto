import React from 'react'
import Image, { StaticImageData } from "next/image";
import deliveryIcon from '@/assets/HomePage/delivery.svg'
import nablcertiIcon from '@/assets/HomePage/nabl.svg'
import ontimeIcon from '@/assets/HomePage/ontime.png'
import accuratelabtest from '@/assets/HomePage/accurate.svg'
import flexdateandtime from '@/assets/HomePage/flex.png'
import cod from '@/assets/HomePage/cod.svg'
import selectLabIcon from '@/assets/services/labs.png'
import testsIcon from '@/assets/services/tests.png'

function AboutPage() {
    return (
        <>
            <div className='w-full min-h-screen dark:bg-[#0A192F]'>
                <Services />
            </div>
        </>
    )
}

export default AboutPage;

export function Services() {
    return (
        <section className="mx-auto md:w-[95%] pt-0 sm:pt-0 md:pt-0 p-4 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center mx-auto mt-4">Our Services</h1>
            <div className="w-20 h-1 rounded-full mx-auto bg-black dark:bg-white dark:bg-opacity-30 bg-opacity-20 my-3"></div>
            <div className='w-full mx-auto mt-5 pt-0 sm:pt-0 md:pt-0 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {labServices.map((service, index) => (
                    <ServiceCard key={index} icon={service.icon} title={service.title} details={service.details} />
                ))}
            </div>
        </section>
    )
}

function ServiceCard({ icon, title, details }: { icon: StaticImageData, title: string; details: React.JSX.Element }) {
    return (
        <div className="border dark:border-gray-600 rounded-lg shadow dark:shadow-md dark:shadow-black px-5 py-4 bg-white dark:bg-[#172A46]">
            <Image src={icon} alt={title} className="w-10 h-10 ml-2 mt-2 mb-4 mr-auto" />
            <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
            <div className="text-gray-600 dark:text-gray-300 text-sm">{details}</div>
        </div>
    );
}

const labServices = [
    {
        icon: nablcertiIcon,
        title: "NABL Certified Laboratory Testing",
        details: <p>We provide a wide range of tests from NABL <b className="font-semibold">(National Accreditation Board for Testing and Calibration Laboratories)</b> certified labs, ensuring high-quality standards and reliable results.</p>
    },
    {
        icon: testsIcon,
        title: "All Types of Diagnostic Tests Available",
        details: <p>From basic blood tests like CBC to advanced diagnostics, our platform offers access to a full range of medical tests—easy to find and book without any hassle.</p>

    },
    {
        icon: selectLabIcon,
        title: "Freedom to Choose Your Preferred Lab",
        details: <p>Our platform empowers users by allowing them to choose from a wide network of trusted diagnostic laboratories. You have full control to select the lab that best suits your preferences, location, or budget</p>,
    },
    {
        icon: ontimeIcon,
        title: "Timely Sample Collection by Certified Professionals",
        details: <p>We ensure all sample collections are done on time by trained and certified phlebotomists. Our professionals follow strict hygiene and safety protocols to provide a seamless, comfortable home collection experience.</p>

    },
    {
        icon: accuratelabtest,
        title: "Reliable and Accurate Test Reports",
        details: <p>Accuracy is at the core of our service. Test results are verified by accredited labs to ensure reliable, precise diagnostics. Your health information is handled with the highest standards of medical integrity.</p>
    },
    {
        icon: flexdateandtime,
        title: "Flexible Test Scheduling Options",
        details: <p>We understand that your time is valuable. That’s why we offer flexible appointment slots, allowing you to schedule test collections at your convenience, whether it’s early morning, evening, or weekend</p>,
    },
    {
        icon: deliveryIcon,
        title: "Free Home Sample Collection Service",
        details: <p>Enjoy the convenience of free home sample collection without any additional service charges. Our healthcare professionals come directly to your location, eliminating the need to travel or wait in queues</p>,
    },
    {
        icon: cod,
        title: "Pay with Cash on Delivery Option",
        details: <p>For added convenience, we offer a Cash on Delivery (COD) payment method. You can pay for your selected tests in cash at the time of sample collection—secure, simple, and hassle-free</p>,
    },
];
