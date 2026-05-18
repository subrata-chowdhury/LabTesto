// app/(mainLayout)/testimonials/components/Testimonials.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import testimonials, { tags, TestimonialType } from "./data";

// Using react-icons
import { FaStar, FaUserCircle, FaQuoteRight, FaPlay } from "react-icons/fa";

function Gallery() {
  const [activeTag, setActiveTag] = useState<string>("All testimonials");

  // Filter logic
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTag === "All testimonials") return true;
    return t.tags?.includes(activeTag);
  });

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          We know testimonials drive trust
          <br className="hidden sm:block mt-2" />
          <span className="text-primary dark:text-gray-300">
            {" "}
            — here’s why people trust us
          </span>
        </h1>
      </motion.div>

      {/* Interactive Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mt-10 mb-12"
      >
        {tags.map((tag) => {
          const isActive = activeTag === tag.text;
          return (
            <button
              key={tag.text}
              onClick={() => setActiveTag(tag.text)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border shadow-sm ${
                isActive
                  ? "bg-primary text-white border-primary shadow-primary/20 dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-gray-50 dark:bg-[#111] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              <span>{tag.icon}</span>
              <span>{tag.text}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={`${testimonial.name}-${index}-${activeTag}`}
              className="break-inside-avoid"
            >
              {testimonial.type === "image" ? (
                <ImageCard testimonial={testimonial} />
              ) : (
                <TestimonialCard testimonial={testimonial} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          No testimonials found for this category.
        </div>
      )}
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialType }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-start shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Decorative Background Quote via react-icons */}
      <FaQuoteRight className="absolute -top-4 -right-4 w-24 h-24 text-gray-50 dark:text-white/5 rotate-12 transition-transform duration-300 group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          {testimonial.profilePic && !imageError ? (
            <Image
              className="bg-gray-100 border border-gray-200 dark:border-gray-800 rounded-full object-cover"
              width={48}
              height={48}
              src={testimonial.profilePic}
              alt={`${testimonial.name}'s profile picture`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-full">
              <FaUserCircle size={28} />
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {testimonial.website}
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-4 text-amber-400">
          {[...Array(Math.max(0, testimonial.stars))].map((_, i) => (
            <FaStar key={i} size={16} />
          ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
          "{testimonial.text}"
        </p>

        {testimonial.date && (
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {testimonial.date}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageCard({ testimonial }: { testimonial: TestimonialType }) {
  return (
    <div className="group w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] rounded-2xl overflow-hidden text-start shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div
        className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
        style={{ height: testimonial.height || 250 }}
      >
        {testimonial.thumbnail && (
          <Image
            fill
            src={testimonial.thumbnail}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            alt={`${testimonial.name} video thumbnail`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
          <div className="flex gap-1 mb-2 text-amber-400">
            {[...Array(Math.max(0, testimonial.stars))].map((_, i) => (
              <FaStar key={i} size={16} />
            ))}
          </div>
          <h4 className="font-bold text-xl text-white tracking-wide">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-300">{testimonial.website}</p>
        </div>

        {/* Play Button via react-icons */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:bg-primary group-hover:border-primary transition-colors cursor-pointer shadow-lg">
          <FaPlay className="text-white ml-1" size={16} />
        </div>
      </div>

      {testimonial.text && (
        <div className="p-5">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
            "{testimonial.text}"
          </p>
          {testimonial.date && (
            <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {testimonial.date}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
