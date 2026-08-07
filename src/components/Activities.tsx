/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Activities() {
  const { activities } = useData();
  const [activeIndex, setActiveIndex] = useState(0);

  if (activities.length === 0) {
    return null; // Don't show the section if there are no activities
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? activities.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
  };

  const currentAct = activities[activeIndex];
  const whatsappText = encodeURIComponent(
    `Hi, I am interested in booking the ${currentAct.name} activity during my stay at Hotel Orchid!`
  );
  const whatsappUrl = `https://wa.me/9779855080337?text=${whatsappText}`;

  return (
    <section id="activities" className="scroll-mt-24 py-24 bg-white relative overflow-hidden">
      {/* Visual background separation element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Chitwan Wildlife & Culture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Local Activities
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm text-sand-800 leading-relaxed max-w-lg mx-auto">
            Discover Sauraha's natural beauty and rich Tharu cultural heritage through curated tours.
          </p>
        </div>

        {/* Single Box Slider Wrapper */}
        <div className="max-w-5xl mx-auto relative group px-2">
          {/* Main Container */}
          <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:min-h-[380px]">
              
              {/* Image Column */}
              <div className="w-full md:w-1/2 aspect-[4/3] md:min-h-[380px] relative bg-ocean-950 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentAct.id}
                    src={currentAct.image}
                    alt={currentAct.name}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </AnimatePresence>
                {/* Visual shadow overlay inside image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
                
                {/* Overlaid index badge */}
                <div className="absolute top-6 left-6 bg-ocean-950/85 backdrop-blur-md border border-sand-300/20 text-white font-mono text-[10px] uppercase tracking-widest py-1.5 px-3.5 rounded-full z-10 shadow-sm">
                  Activity {activeIndex + 1} of {activities.length}
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left bg-sand-50/20 relative">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-coral-600 font-bold bg-coral-50 py-1.5 px-3 rounded-sm border border-coral-200/40 shadow-xs">
                      Curated Experience
                    </span>
                  </div>

                  <div className="flex flex-col justify-start">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentAct.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3.5"
                      >
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ocean-950 tracking-tight leading-tight">
                          {currentAct.name}
                        </h3>

                        <p className="font-sans text-sm sm:text-base text-sand-800 leading-relaxed font-normal">
                          {currentAct.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-sand-200/60 flex items-center justify-between">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider bg-coral-500 hover:bg-coral-600 active:scale-95 text-white py-3.5 px-6 rounded-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Inquire & Book</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  {/* Desktop Right corner arrow buttons */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2.5 rounded-full border border-sand-300 text-ocean-950 bg-white hover:bg-coral-500 hover:text-white hover:border-coral-500 active:scale-95 transition-all cursor-pointer shadow-xs"
                      aria-label="Previous Activity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-full border border-sand-300 text-ocean-950 bg-white hover:bg-coral-500 hover:text-white hover:border-coral-500 active:scale-95 transition-all cursor-pointer shadow-xs"
                      aria-label="Next Activity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Navigation Controls on Mobile and Outer placement for Tablet/Desktop */}
          <div className="flex sm:hidden justify-center items-center gap-6 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-sand-300 text-ocean-950 bg-white hover:bg-sand-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {activities.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? "w-6 bg-coral-500" 
                      : "w-2 bg-sand-300 hover:bg-sand-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-sand-300 text-ocean-950 bg-white hover:bg-sand-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Always Visible Outer Arrows on Sides for Desktop Hover */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex absolute top-1/2 -left-16 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-sand-200 text-ocean-950 hover:bg-coral-500 hover:text-white hover:border-coral-500 active:scale-95 items-center justify-center transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous Activity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute top-1/2 -right-16 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-sand-200 text-ocean-950 hover:bg-coral-500 hover:text-white hover:border-coral-500 active:scale-95 items-center justify-center transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next Activity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Desktop/Tablet Bottom Indicators */}
          <div className="hidden sm:flex justify-center items-center gap-2 mt-6">
            {activities.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx 
                    ? "w-8 bg-coral-500" 
                    : "w-2 bg-sand-300 hover:bg-sand-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
