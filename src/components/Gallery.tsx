/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Gallery() {
  const { gallery } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, gallery.length]);

  // Safe checks for indices
  const safeIndex = currentIndex < gallery.length ? currentIndex : 0;
  const activeSlide = gallery[safeIndex] || {
    id: 'placeholder',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    title: 'No photographs in gallery',
    caption: 'Please enter the dynamic admin panel to upload custom photos.'
  };

  const handlePrev = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="scroll-mt-24 py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Visual Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Photo Gallery
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
        </div>

        {/* Responsive, highly optimized aspect ratio container with object-cover and text overlay */}
        <div id="gallery-slider" className="relative max-w-4xl mx-auto w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-sm bg-sand-100 border border-sand-300 shadow-xl group">
          
          {/* Active Image (with elegant fade transition) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              {/* Crisp text caption overlay at the bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ocean-950/85 via-ocean-950/45 to-transparent p-4 sm:p-6 pt-12 text-white z-10 flex flex-col justify-end">
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-white mb-0.5">
                  {activeSlide.title}
                </h3>
                {activeSlide.caption && (
                  <p className="font-sans text-[11px] sm:text-xs text-sand-200 font-normal opacity-90 max-w-2xl">
                    {activeSlide.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Arrow Navigation Overlay */}
          {gallery.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center z-20">
                <button
                  id="gallery-btn-prev"
                  onClick={handlePrev}
                  className="p-1.5 sm:p-2 bg-ocean-950/70 hover:bg-coral-500 text-white rounded-sm backdrop-blur-sm transition-all focus:outline-none cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-3 sm:right-4 flex items-center z-20">
                <button
                  id="gallery-btn-next"
                  onClick={handleNext}
                  className="p-1.5 sm:p-2 bg-ocean-950/70 hover:bg-coral-500 text-white rounded-sm backdrop-blur-sm transition-all focus:outline-none cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </>
          )}

          {/* Indicators bottom-right */}
          {gallery.length > 1 && (
            <div className="absolute top-4 right-4 bg-ocean-950/80 backdrop-blur-sm px-2.5 py-1 text-white text-[10px] sm:text-xs font-mono rounded-sm z-20 border border-sand-300/10">
              {safeIndex + 1} / {gallery.length}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
