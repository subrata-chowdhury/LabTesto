"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Slide from "@/app/components/Slide";

import slide1Light from "@/assets/HomePage/Slides/slide1-light.webp";
import slide1Dark from "@/assets/HomePage/Slides/slide1-dark.webp";
import slide2Light from "@/assets/HomePage/Slides/slide2-light.webp";
import slide2Dark from "@/assets/HomePage/Slides/slide2-dark.webp";
import slide3Light from "@/assets/HomePage/Slides/slide3-light.webp";
import slide3Dark from "@/assets/HomePage/Slides/slide3-dark.webp";

const SliderSection = () => {
  return (
    <section className="relative mx-4 mb-12 mt-4">
      {/* Decorative Elements matching the theme */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <Slide
        className="h-[35vh] sm:h-[50vh] lg:h-[75vh] min-h-62.5 flex flex-col justify-center rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 relative z-10"
        slides={3}
        slideElement={({ slide }) => {
          if (slide === 1)
            return <SlideImage imgLight={slide1Light} imgDark={slide1Dark} />;
          if (slide === 2)
            return <SlideImage imgLight={slide2Light} imgDark={slide2Dark} />;
          if (slide === 3)
            return <SlideImage imgLight={slide3Light} imgDark={slide3Dark} />;
        }}
      />
    </section>
  );
};

export default SliderSection;

function SlideImage({
  imgLight,
  imgDark,
}: {
  imgLight: StaticImageData;
  imgDark: StaticImageData;
}) {
  return (
    <>
      {/* FIX: Replaced invalid `h-75` with `h-full` to adapt to parent height natively */}
      <Image
        className="h-full w-full mx-auto object-cover md:object-scale-down dark:hidden block"
        src={imgLight}
        alt="Slide Banner"
        priority
      />
      <Image
        className="h-full w-full mx-auto object-cover md:object-scale-down hidden dark:block"
        src={imgDark}
        alt="Slide Banner"
        priority
      />
    </>
  );
}
