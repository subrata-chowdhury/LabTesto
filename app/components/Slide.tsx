// app/components/Slide.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function Slide({
  slides = 1,
  slideElement,
  className = "",
}: {
  slideElement?: React.FC<{ slide: number }>;
  slides?: number;
  className?: string;
}) {
  const [slideIndex, setSlideIndex] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setSlideIndex((prev) => (prev >= slides ? 1 : prev + 1));
  }, [slides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setSlideIndex((prev) => (prev <= 1 ? slides : prev - 1));
  }, [slides]);

  // Handle auto-sliding, pausing when hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {slideElement ? (
              React.createElement(slideElement, { slide: slideIndex })
            ) : (
              // Fallback placeholder if no element is passed
              <div className="w-full h-full flex flex-col justify-center items-center bg-primary/5 text-primary">
                <div className="text-sm font-medium mb-2">
                  {slideIndex} / {slides}
                </div>
                <div className="text-4xl sm:text-6xl font-extrabold opacity-50">
                  Slide {slideIndex}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/90 dark:bg-black/40 dark:hover:bg-black/90 backdrop-blur-md text-gray-900 dark:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none hover:scale-105 z-10 shadow-lg"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={24} className="mr-0.5" />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/90 dark:bg-black/40 dark:hover:bg-black/90 backdrop-blur-md text-gray-900 dark:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none hover:scale-105 z-10 shadow-lg"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <FiChevronRight size={24} className="ml-0.5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 bg-black/20 dark:bg-black/50 backdrop-blur-md px-3 py-2 rounded-full">
        {Array(slides)
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setDirection(index + 1 > slideIndex ? 1 : -1);
                setSlideIndex(index + 1);
              }}
              className={`h-2 rounded-full transition-all duration-300 ease-out outline-none ${
                slideIndex === index + 1
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
      </div>
    </div>
  );
}
