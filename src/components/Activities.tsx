/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Activities() {
  const { activities } = useData();
  const [activeIndex, setActiveIndex] = useState(0);

  if (activities.length === 0) {
    return null; // Don't show the section if there are no activities
  }

  const activeActivity = activities[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % activities.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + activities.length) % activities.length);
  };

  const whatsappText = encodeURIComponent(
    `Hi, I am interested in booking the ${activeActivity.name} activity during my stay at Hotel Orchid!`
  );
  const whatsappUrl = `https://wa.me/9779855080337?text=${whatsappText}`;

  return (
    <section id="activities" className="scroll-mt-24 py-20 bg-white relative overflow-hidden">
      {/* Visual background separation element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
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

        {/* Dynamic Interactive Single Box Slider */}
        <div className="max-w-4xl mx-auto relative px-2">
          
          {/* Main Slider Box */}
          <div className="bg-white border border-sand-300 rounded-sm shadow-xl overflow-hidden min-h-[460px] md:min-h-[380px] flex flex-col md:flex-row items-stretch relative">
            
            {/* Image Section (Responsive Width) */}
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-ocean-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeActivity.id}
                  src={activeActivity.image}
                  alt={activeActivity.name}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-ocean-950/10 pointer-events-none" />
              
              {/* Overlaid index counter */}
              <div className="absolute bottom-4 left-4 bg-ocean-950/85 backdrop-blur-sm border border-sand-300/20 text-white font-mono text-xs py-1.5 px-3 rounded-sm z-10 flex items-center space-x-1">
                <span className="text-coral-400 font-bold">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-sand-400">/</span>
                <span className="text-sand-300">
                  {String(activities.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Content Details Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 md:space-y-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeActivity.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 flex-grow flex flex-col justify-center"
                >
                  <div className="flex items-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-sand-600 font-bold bg-sand-100 py-1.5 px-3 rounded-sm">
                      Curated Tour
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ocean-950 tracking-tight leading-snug">
                    {activeActivity.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-sand-800 leading-relaxed font-normal min-h-[72px]">
                    {activeActivity.description}
                  </p>

                  <div className="pt-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider bg-coral-500 hover:bg-coral-600 text-white py-3 px-5 rounded-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Inquire & Book</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Tracker (Dot indicators) at the bottom */}
              <div className="flex items-center justify-center md:justify-start space-x-1.5 pt-4 border-t border-sand-100">
                {activities.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex ? "w-6 bg-coral-500" : "w-1.5 bg-sand-300 hover:bg-sand-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Absolute Navigation Buttons outside / side-overlaid */}
          <button
            onClick={handlePrev}
            className="absolute left-[-16px] md:left-[-24px] top-1/2 -translate-y-1/2 w-11 h-11 bg-white border border-sand-300 text-ocean-950 hover:text-coral-500 hover:border-coral-400 rounded-full shadow-lg flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous Activity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-16px] md:right-[-24px] top-1/2 -translate-y-1/2 w-11 h-11 bg-white border border-sand-300 text-ocean-950 hover:text-coral-500 hover:border-coral-400 rounded-full shadow-lg flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next Activity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </section>
  );
}
