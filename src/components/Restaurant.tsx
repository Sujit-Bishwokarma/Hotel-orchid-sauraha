/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Compass, ArrowRight, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { HOTEL_INFO } from '../data';

interface RestaurantProps {
  onOpenBooking: () => void;
}

export default function Restaurant({ onOpenBooking }: RestaurantProps) {
  return (
    <section id="restaurant" className="scroll-mt-24 py-24 bg-sand-100 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-coral-100/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual 2-Column with left-to-right entry animation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Animated Culinary Display (Slides up gracefully) */}
          <motion.div
            id="restaurant-animated-images"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 relative group"
          >
            <div className="relative aspect-video rounded-sm overflow-hidden shadow-2xl border border-sand-300">
              <img
                src={HOTEL_INFO.images.restaurant}
                alt="Flavors of Hotel Mirage Sauraha"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/40 via-transparent to-transparent" />
            </div>

            {/* Micro decorative float card */}
            <div className="absolute -bottom-6 -right-6 bg-ocean-800 text-sand-50 p-6 rounded-sm shadow-xl hidden md:block max-w-[240px] border border-ocean-700">
              <div className="flex items-center space-x-3 mb-2">
                <Utensils className="w-5 h-5 text-coral-400" />
                <span className="font-serif text-sm font-bold tracking-wide">Mirage Grill & Lounge</span>
              </div>
              <p className="font-sans text-[11px] text-sand-300 leading-relaxed">
                Experience open garden twilight seating coupled with fresh organic farm-to-table culinary treasures.
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Culinary Text Info (Slides in slightly after the images) */}
          <motion.div
            id="restaurant-animated-info"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
                The Mirage Culinary
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ocean-950 tracking-tight leading-tight">
                Authentic Spices, <br />
                <span className="italic font-normal text-coral-600 font-serif">Sourced Locally</span>
              </h2>
            </div>

            <div className="w-12 h-1 bg-coral-500" />

            <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed">
              Step into a dining haven crafted with traditional timber designs and open-air garden vistas. Our restaurant combines local organically sourced vegetables from Ratnanagar farms with Nepalese spices and international culinary favorites.
            </p>

            {/* Quick bullets */}
            <div className="space-y-3 font-sans text-xs sm:text-sm text-sand-800">
              <div className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full" />
                <span>Complimentary premium buffet breakfast for all room occupants</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full" />
                <span>Open-air sunset gardens overlooking peaceful national parks</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full" />
                <span>Custom curated jungle pack lunches for full-day safaris</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                id="restaurant-reserve-cta"
                onClick={onOpenBooking}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-sans font-bold text-ocean-800 hover:text-coral-500 tracking-widest uppercase transition-all group focus:outline-none cursor-pointer"
              >
                <span>Reserve a dining spot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
