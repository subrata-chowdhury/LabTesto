import React from 'react'
import testimonials, { tags, TestimonialType } from './data'
import { StarFilledIcon } from '@/assets/reactIcon/StarFilled';
import UserIcon from '@/assets/reactIcon/User';
import Image from 'next/image';

function Gallery() {
    return (
        <section className="container mx-auto mt-8">
            <h1 className="text-center text-5xl font-bold">
                We know testimonials drive trust
                <br />
                <span className="text-primary text-5xl">— here’s why people trust us</span>
            </h1>
            <div
                className="flex flex-wrap text-nowrap justify-center mt-5"
                style={{ gap: "1rem" }}
            >
                {tags.map(tag => (
                    <div className="px-4 border border-gray-300 dark:border-gray-500 rounded-md col-auto p-2" key={tag.text}>
                        <p className="card-text">{tag.icon} {tag.text}</p>
                    </div>
                ))}
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 p-4 mt-4">
                {testimonials.map((testimonial, index) => {
                    if (testimonial.type === "image") {
                        return <ImageCard key={index} testimonial={testimonial} />;
                    } else {
                        return <TestimonialCard key={index} testimonial={testimonial} />;
                    }
                })}
            </div>
        </section>
    )
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialType }) {
    return (
        <div className="w-full inline-block border border-gray-300 dark:border-gray-500 mb-4 break-inside-avoid bg-white dark:bg-[#172A46] rounded-lg text-start">
            <div className="px-4 py-3">
                <div className="flex items-center mr-auto">
                    {/* {testimonial.profilePic && <Image
                        className="bg-light border border-dark rounded-full"
                        width={40}
                        height={40}
                        src={testimonial.profilePic}
                        alt="profile picture"
                    />} */}
                    <UserIcon size={45} className='p-2 bg-primary bg-opacity-20 text-primary rounded-full' />
                    <div className="ml-2">
                        <div className="font-bold m-0 leading-4">{testimonial.name}</div>
                        <div>{testimonial.website}</div>
                    </div>
                </div>
                <div className="mt-2 text-yellow-400 flex gap-1.5">
                    {[...Array(testimonial.stars)].map((_, i) => (
                        <StarFilledIcon key={i} />
                    ))}
                </div>
                <div className="my-2">{testimonial.text}</div>
                <small className="text-gray-600 dark:text-gray-400">{testimonial.date}</small>
            </div>
        </div>
    );
}

function ImageCard({ testimonial }: { testimonial: TestimonialType }) {
    return (
        <div className="w-full inline-block border border-gray-300 dark:border-gray-500 mb-4 break-inside-avoid bg-white dark:bg-[#172A46] rounded-lg overflow-hidden text-start">
            <div className='relative w-full' style={{ height: testimonial.height }}>
                {testimonial.thumbnail && <Image
                    width={500}
                    height={500}
                    src={testimonial.thumbnail}
                    className="w-full h-full object-cover rounded-t-lg"
                    style={{ zIndex: -1 }}
                    alt='testimonial thumbnail'
                />}
                <div
                    style={{
                        // top: testimonial.top,
                        background: "linear-gradient(transparent 10%, rgba(0, 0, 0, 0.7) 90%)"
                    }}
                    className="ps-3 w-full absolute bottom-0 text-white pb-3"
                >
                    <div className="mt-2 text-yellow-400 flex gap-1.5">
                        {[...Array(testimonial.stars)].map((_, i) => (
                            <StarFilledIcon key={i} />
                        ))}
                    </div>
                    <h4 className="font-bold text-2xl mt-1">{testimonial.name}</h4>
                    <div>{testimonial.website}</div>
                </div>
            </div>
            {testimonial.text && <div className="px-4 py-3">
                <div className="my-2">{testimonial.text}</div>
                <small className="text-gray-600 dark:text-gray-400">{testimonial.date}</small>
            </div>}
        </div>
    );
}

export default Gallery