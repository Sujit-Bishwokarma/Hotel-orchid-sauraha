/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Camera } from 'lucide-react';
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
    <section id="gallery" className="scroll-mt-24 py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Visual Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Snapshot Of Paradise
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
        </div>

        {/* Dynamic Slide Container */}
        <div id="gallery-slider" className="relative max-w-5xl mx-auto aspect-[16/9] md:aspect-[16/8] overflow-hidden rounded-sm bg-ocean-950 border border-sand-300 shadow-2xl group">
          
          {/* Active Image (with beautiful smooth crossfade animations) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Text gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-ocean-950/30 to-transparent" />
              
              {/* Slide text details */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 text-left space-y-2 z-10">
                <span className="font-mono text-[10px] sm:text-xs text-coral-400 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                  <Camera size={12} />
                  <span>Slide {gallery.length > 0 ? safeIndex + 1 : 0} of {gallery.length}</span>
                </span>
                <h3 className="font-serif text-xl sm:text-3xl font-bold text-sand-50 tracking-tight">
                  {activeSlide.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-sand-200/90 max-w-2xl leading-relaxed">
                  {activeSlide.caption}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Arrow Navigation Overlay (Visible on hover on desktop) */}
          {gallery.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center z-20">
                <button
                  id="gallery-btn-prev"
                  onClick={handlePrev}
                  className="p-2 sm:p-3 bg-ocean-950/60 hover:bg-coral-500 text-sand-100 hover:text-sand-50 rounded-sm backdrop-blur-md transition-all duration-300 focus:outline-none cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="absolute inset-y-0 right-4 sm:right-6 flex items-center z-20">
                <button
                  id="gallery-btn-next"
                  onClick={handleNext}
                  className="p-2 sm:p-3 bg-ocean-950/60 hover:bg-coral-500 text-sand-100 hover:text-sand-50 rounded-sm backdrop-blur-md transition-all duration-300 focus:outline-none cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </>
          )}

          {/* Micro Index Bullet Markers Bottom */}
          {gallery.length > 1 && (
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 flex space-x-2.5 z-20">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  id={`gallery-bullet-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all focus:outline-none cursor-pointer ${
                    safeIndex === idx ? 'w-8 bg-coral-500' : 'w-2 sm:w-2.5 bg-sand-200/50 hover:bg-sand-100'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
