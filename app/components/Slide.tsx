'use client'
import React, { useEffect, useRef, useState } from "react";

export default function Slide({ slides = 1, slideElement, className }: { slideElement?: React.FC<{ slide: number }>, slides?: number, className?: string }) {
    const [slideIndex, setSlideIndex] = useState(1);
    const goingForward = useRef(true);

    useEffect(() => {
        const interval = setInterval(() => {
            goingForward.current = true;
            setSlideIndex(val => val >= slides ? 1 : val + 1)
        }, 5000);

        return () => clearInterval(interval);
    }, [slides])

    return (
        <>
            <div className={"max-w-7xl overflow-x-hidden relative mx-auto mt-4 " + className}>
                <div className={goingForward.current ? 'slide' : 'slide-reverse'} key={slideIndex}>
                    {!slideElement && <>
                        <div className="text-[#f2f2f2] text-[12px] px-3 py-2 absolute top-0">{slideIndex} / 3</div>
                        <div className="w-full h-72 flex justify-center items-center bg-primary/25 font-semibold text-6xl text-primary text-opacity-60">Slide {slideIndex}</div>
                    </>}
                    {slideElement && React.createElement(slideElement, { slide: slideIndex })}
                </div>
                <button className="cursor-pointer absolute top-2/4 w-auto p-3 -mt-8 font-bold text-primary dark:text-white text-lg [transition:0.6s_ease] rounded-tl-none rounded-br-sm rounded-tr-sm rounded-bl-none select-none hover:bg-primary hover:text-white dark:hover:bg-white/30 dark:hover:text-white" onClick={() => { setSlideIndex(val => val <= 1 ? slides : val - 1); goingForward.current = false; }}>❮</button>
                <button className="cursor-pointer absolute top-2/4 w-auto p-3 -mt-8 font-bold text-primary dark:text-white text-lg [transition:0.6s_ease] rounded-tl-sm rounded-br-none rounded-tr-none rounded-bl-sm select-none right-0 hover:bg-primary hover:text-white dark:hover:bg-white/30 dark:hover:text-white" onClick={() => { setSlideIndex(val => val >= slides ? 1 : val + 1); goingForward.current = true; }}>❯</button>
            </div>
            <br />

            <div className="text-center justify-center flex gap-2">
                {Array(slides).fill(0).map((_, index) => (
                    <span key={index} className={`cursor-pointer h-3 w-3 ${slideIndex === index + 1 ? 'bg-primary dark:bg-white' : 'bg-primary/25 dark:bg-white/25'} rounded-full inline-block [transition:background-color_0.6s_ease]`} onClick={() => setSlideIndex(index + 1)}></span>
                ))}
            </div>
        </>
    )
}