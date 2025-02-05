'use client'
import React, { ReactNode } from 'react';

const Slide = ({ slides }: { slides: ReactNode[] }) => {
    return (
        <div className="h-64 overflow-x-hidden">
            {slides.map((slide, index) => (
                <div key={index} className="w-full h-full float-left">
                    {slide}
                </div>
            ))}
        </div>
    );
};

export default Slide;