'use client'
import React, { useEffect, useRef, useState } from "react";

export default function Slide({ slides = 1, slideElement }: { slideElement?: React.FC<{ slide: number }>, slides?: number }) {
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
            <div className="max-w-screen-lg overflow-x-hidden relative mx-auto mt-4">
                <div className={goingForward.current ? 'slide' : 'slide-reverse'} key={slideIndex}>
                    {!slideElement && <>
                        <div className="text-[#f2f2f2] text-[12px] px-[12px] py-[8px] absolute top-[0]">{slideIndex} / 3</div>
                        <div className="w-full h-72 flex justify-center items-center bg-[#3986ba43]">Slide {slideIndex}</div>
                    </>}
                    {slideElement && React.createElement(slideElement, { slide: slideIndex })}
                </div>
                <a className="cursor-pointer absolute top-2/4 w-auto p-[16px] -mt-[32px] font-bold text-[#3987ba] text-lg [transition:0.6s_ease] rounded-tl-[0] rounded-br-[4px] rounded-tr-[4px] rounded-bl-[0] select-none hover:bg-[#3987ba] hover:text-white" onClick={() => { setSlideIndex(val => val <= 1 ? slides : val - 1); goingForward.current = false; }}>❮</a>
                <a className="cursor-pointer absolute top-2/4 w-auto p-[16px] -mt-[32px] font-bold text-[#3987ba] text-lg [transition:0.6s_ease] rounded-tl-[4px] rounded-br-[0] rounded-tr-[0] rounded-bl-[4px] select-none right-[0] hover:bg-[#3987ba] hover:text-white" onClick={() => { setSlideIndex(val => val >= slides ? 1 : val + 1); goingForward.current = true; }}>❯</a>
            </div>
            <br />

            <div className="text-center justify-center flex gap-2">
                {Array(slides).fill(0).map((_, index) => (
                    <span key={index} className={`cursor-pointer h-3 w-3 ${slideIndex === index + 1 ? 'bg-[#3987ba]' : 'bg-[#3986ba40]'} rounded-full inline-block [transition:background-color_0.6s_ease]`} onClick={() => setSlideIndex(index + 1)}></span>
                ))}
            </div>
        </>
    )
}