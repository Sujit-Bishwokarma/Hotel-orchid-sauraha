/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Compass, Flame, Footprints, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

export default function Activities() {
  const { activities } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate the photo slider
  useEffect(() => {
    if (activities.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, activities.length]);

  const safeIndex = currentIndex < activities.length ? currentIndex : 0;
  
  const handlePrev = () => {
    if (activities.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? activities.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (activities.length === 0) return;
    setCurrentIndex((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
  };

  if (activities.length === 0) {
    return null; // Don't show the section if the user cleared all activities
  }

  const activeActivity = activities[safeIndex];

  // Map appropriate lifestyle/adventure icons based on activity names
  const getActivityIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('walk') || lowercase.includes('hike') || lowercase.includes('jungle')) {
      return <Footprints className="w-5 h-5 text-coral-500" />;
    }
    if (lowercase.includes('safari') || lowercase.includes('jeep') || lowercase.includes('car')) {
      return <Compass className="w-5 h-5 text-coral-500" />;
    }
    if (lowercase.includes('tharu') || lowercase.includes('dance') || lowercase.includes('culture') || lowercase.includes('show')) {
      return <Flame className="w-5 h-5 text-coral-500" />;
    }
    return <Sparkles className="w-5 h-5 text-coral-500" />;
  };

  return (
    <section id="activities" className="scroll-mt-24 py-24 bg-sand-50 relative overflow-hidden">
      {/* Visual background separation element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Chitwan Wildlife & Culture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Curated Local Activities
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm text-sand-800 leading-relaxed max-w-lg mx-auto">
            Immerse yourself in Orchid Adventure experiences. We map complete customized itineraries from Nepal's most treasured National Park wildlife tours to unique tribal shows.
          </p>
        </div>

        {/* Outer Split Layout Grid: Photo Slider + Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT PANEL: Elegant Photo Slider with Animation (Manageable via cpanel) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4 mb-4">
              <span className="font-mono text-[10px] text-coral-500 uppercase tracking-widest font-bold block">
                ✦ Highlight Slide Showcase
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ocean-950 tracking-tight">
                Atmospheric Expedition Visuals
              </h3>
            </div>

            <div 
              id="activities-photo-slider" 
              className="relative w-full aspect-[16/10] md:aspect-[16/9] lg:h-[420px] overflow-hidden rounded-sm bg-ocean-950 border border-sand-300/40 shadow-xl group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeIndex}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={activeActivity?.image}
                    alt={activeActivity?.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Premium contrast gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-ocean-950/20 to-transparent" />
                  
                  {/* Floating caption on the active slide */}
                  <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                    <span className="font-mono text-[9px] text-coral-300 uppercase tracking-widest font-bold">
                      Slide {activities.length > 0 ? safeIndex + 1 : 0} of {activities.length}
                    </span>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-sand-50 mt-1">
                      {activeActivity?.name}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrows */}
              {activities.length > 1 && (
                <>
                  <button
                    id="activities-btn-prev"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-ocean-950/50 hover:bg-coral-500 text-sand-100 rounded-sm backdrop-blur-sm transition-all duration-200 z-20 cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    id="activities-btn-next"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-ocean-950/50 hover:bg-coral-500 text-sand-100 rounded-sm backdrop-blur-sm transition-all duration-200 z-20 cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Slider Progress Indicator (Dash pill trackers) */}
              {activities.length > 1 && (
                <div className="absolute bottom-6 right-6 flex space-x-1.5 z-20">
                  {activities.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === safeIndex ? 'w-6 bg-coral-500' : 'w-1.5 bg-sand-200/40'
                      }`}
                      aria-label={`View slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Interactive Cards Grid detailing descriptions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-coral-500 uppercase tracking-widest font-bold block">
                ✦ Adventure Itineraries
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ocean-950 tracking-tight">
                Our Signature Experiences
              </h3>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2 scrollbar-thin">
              {activities.map((act, index) => {
                const isActive = index === safeIndex;
                return (
                  <div
                    key={act.id}
                    id={`activity-card-${act.id}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                      isActive 
                        ? 'bg-white border-coral-400 shadow-md translate-x-1' 
                        : 'bg-white/60 border-sand-300/40 hover:border-sand-400/80 hover:bg-white'
                    }`}
                  >
                    {/* Activity Icon Indicator */}
                    <div className={`p-2.5 rounded-sm transition-all ${
                      isActive ? 'bg-coral-50' : 'bg-sand-100'
                    }`}>
                      {getActivityIcon(act.name)}
                    </div>

                    {/* Content */}
                    <div className="space-y-1 text-left flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-serif text-md font-bold transition-all ${
                          isActive ? 'text-coral-600' : 'text-ocean-950'
                        }`}>
                          {act.name}
                        </h4>
                        {isActive && (
                          <span className="font-mono text-[8px] sm:text-[9px] bg-coral-100 text-coral-700 px-1.5 py-0.5 rounded-sm font-bold uppercase">
                            Currently showing
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-sand-800 font-normal leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-house assist notice card */}
            <div className="p-4 bg-white border border-sand-300/30 rounded-sm flex items-start gap-3 shadow-sm bg-gradient-to-r from-coral-500/5 to-transparent">
              <Info className="w-5 h-5 text-coral-500 mt-0.5 flex-shrink-0" />
              <div className="text-left space-y-1">
                <p className="font-serif font-bold text-xs text-ocean-950">Interested in coordinating all these adventures?</p>
                <p className="font-sans text-[11px] text-sand-700">We offer specialized packaged bookings at no extra commission. Contact our front deck or talk with us instantly on WhatsApp and we will align the full schedule.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
