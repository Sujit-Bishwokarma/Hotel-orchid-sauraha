/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevReview = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const active = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials-section" className="py-24 bg-sand-100 relative overflow-hidden">
      {/* Visual backdrops */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-ocean-100/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Section Title */}
        <div className="space-y-4 mb-12">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Guest Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Loved By Global Travelers
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
        </div>

        {/* Dynamic Display Slider Card */}
        <div className="relative bg-white border border-sand-300 p-8 sm:p-14 rounded-sm shadow-xl overflow-hidden min-h-[300px] flex flex-col justify-center">
          
          {/* Large decorative quotation icon background */}
          <div className="absolute top-6 left-6 text-sand-200">
            <Quote size={80} className="opacity-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="relative space-y-6 z-10"
            >
              
              {/* Star Rating displays */}
              <div className="flex justify-center space-x-1">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-coral-500 fill-coral-500" />
                ))}
              </div>

              {/* Review Quote text */}
              <blockquote className="font-serif text-base sm:text-xl text-ocean-950 italic font-medium leading-relaxed max-w-2xl mx-auto">
                &ldquo;{active.content}&rdquo;
              </blockquote>

              {/* Reviewer author credits */}
              <div className="space-y-1">
                <h4 className="font-serif text-sm sm:text-base font-bold text-ocean-950">
                  {active.author}
                </h4>
                <p className="font-mono text-[10px] sm:text-xs text-sand-600 uppercase tracking-widest">
                  {active.location}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigtion Arrows left-side, right-side */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <button
              id="testimonial-prev-arrow"
              onClick={prevReview}
              className="p-1.5 sm:p-2 hover:bg-sand-100 text-sand-500 hover:text-coral-500 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 flex items-center">
            <button
              id="testimonial-next-arrow"
              onClick={nextReview}
              className="p-1.5 sm:p-2 hover:bg-sand-100 text-sand-500 hover:text-coral-500 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Index indicator dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              id={`testi-dot-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all focus:outline-none cursor-pointer ${
                activeIndex === idx ? 'w-6 bg-coral-500' : 'w-2 bg-sand-300 hover:bg-sand-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
