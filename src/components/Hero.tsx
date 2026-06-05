/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, ChevronDown, Award, Compass, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { HOTEL_INFO } from '../data';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const scrollToRooms = () => {
    const el = document.getElementById('rooms');
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      try {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } catch (e) {
        window.scrollTo(0, offsetPosition);
      }
    }
  };

  return (
    <section id="home" className="scroll-mt-24 relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HOTEL_INFO.images.hero}
          alt="Hotel Orchid Sauraha Sunset Exterior View"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        {/* Soft elegant color-graded vignettes for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/95 via-ocean-950/70 to-ocean-950/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-sand-50 via-sand-50/20 to-transparent" />
      </div>

      {/* Floating text content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Tagline / Subtitle */}
          <div className="inline-flex items-center space-x-2 bg-coral-500/10 border border-coral-500/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <Compass className="w-4 h-4 text-coral-400 rotate-12" />
            <span className="text-sand-100 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] font-medium">
              {HOTEL_INFO.tagline}
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 id="hero-title" className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-sand-50 tracking-tight leading-none drop-shadow-md">
            Hotel Orchid <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand-100 via-coral-400 to-sand-200 font-serif italic font-normal block mt-2 text-3xl sm:text-5xl md:text-6xl">
              Sauraha, Chitwan
            </span>
          </h1>

          {/* Description */}
          <p id="hero-subtitle" className="max-w-2xl mx-auto text-sm sm:text-lg text-sand-200/90 font-sans leading-relaxed">
            Discover a sanctuary where polished hospitality, modern security, and natural wonder merge. Rest quietly in luxury comfort next to the rich ecosystems of Chitwan.
          </p>

          {/* Large Central Action CTA Area */}
          <div className="pt-6 max-w-md mx-auto sm:max-w-xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              id="hero-book-now-button"
              className="w-full sm:w-auto px-10 py-5 sm:px-14 bg-gradient-to-r from-coral-500 via-coral-400 to-coral-600 hover:brightness-110 active:scale-95 text-sand-50 rounded-sm font-sans font-bold text-base sm:text-lg tracking-widest uppercase border border-coral-400/30 transition-all shadow-[0_12px_24px_rgba(235,96,68,0.5)] cursor-pointer hover:shadow-[0_15px_30px_rgba(235,96,68,0.7)] group coral-glow-btn"
            >
              <span className="flex items-center justify-center space-x-3">
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>BOOK INSTANT CHECK-IN</span>
              </span>
            </motion.button>
          </div>

          {/* Value Micro Badges */}
          <div className="pt-10 grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-sand-300 font-mono text-[9px] sm:text-[11px] uppercase tracking-widest border-t border-sand-300/10">
            <div className="flex flex-col items-center space-y-1">
              <Award className="w-4 h-4 text-coral-400 mb-1" />
              <span>Premium Rooms</span>
              <span className="text-[8px] sm:text-[10px] text-sand-400 lowercase">from 2097 NPR</span>
            </div>
            <div className="flex flex-col items-center space-y-1 border-x border-sand-300/10">
              <ShieldCheck className="w-4 h-4 text-coral-400 mb-1" />
              <span>Top Security</span>
              <span className="text-[8px] sm:text-[10px] text-sand-400 lowercase">smart code locks</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Compass className="w-4 h-4 text-coral-400 mb-1" />
              <span>Free Transfers</span>
              <span className="text-[8px] sm:text-[10px] text-sand-400 lowercase">Airport Pickup</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Down chevron indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <button
          onClick={scrollToRooms}
          className="p-3 bg-ocean-950/40 text-coral-400 hover:text-coral-500 hover:bg-ocean-950/60 transition-all rounded-full flex justify-center items-center backdrop-blur-sm cursor-pointer animate-[bounce_2s_infinite]"
          aria-label="Scroll Down"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </section>
  );
}
