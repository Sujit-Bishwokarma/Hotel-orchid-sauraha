/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Heart, Leaf, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { HOTEL_HIGHLIGHTS, HOTEL_INFO } from '../data';

// Map icon string name to Lucide icons
const IconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  MapPin: MapPin,
  Heart: Heart,
  Leaf: Leaf,
};

export default function Highlights() {
  return (
    <section id="highlights-section" className="py-24 bg-sand-50 relative overflow-hidden">
      {/* Decorative background orchid element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral-100/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ocean-100/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid: Split content left layout description, right title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
              Hotel Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight leading-tight">
              A Mirage of Peace <br />
              <span className="italic font-normal text-coral-600 font-serif">In Sauraha</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed border-l-2 border-coral-400 pl-6 lg:pl-8">
              {HOTEL_INFO.about}
            </p>
          </div>
        </div>

        {/* Highlights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOTEL_HIGHLIGHTS.map((h, idx) => {
            const IconComponent = IconMap[h.icon] || MapPin;
            return (
              <motion.div
                key={h.id}
                id={`highlight-card-${h.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-sand-50/50 backdrop-blur-sm border border-sand-300 p-8 sm:p-10 rounded-sm relative group overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Accent coral line top card */}
                <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-800 to-coral-450 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                {/* Floating highlight index */}
                <span className="absolute top-6 right-8 font-mono text-xs font-semibold text-sand-300 group-hover:text-coral-300 transition-colors">
                  0{idx + 1}
                </span>

                <div className="w-12 h-12 bg-ocean-800 text-sand-50 rounded-sm flex items-center justify-center mb-6 group-hover:bg-coral-500 group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-3 group-hover:text-ocean-800 transition-colors">
                  {h.title}
                </h3>

                <p className="font-sans text-sm text-sand-700 leading-relaxed">
                  {h.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-16 pt-12 border-t border-sand-300 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sand-600">
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans">
            <CheckCircle className="text-coral-500 w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-ocean-950">100% Direct Bookings Trust</span>
          </div>
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans border-x border-sand-300 px-0 md:px-12">
            <Shield className="text-coral-500 w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-ocean-950">Guaranteed Secure Booking</span>
          </div>
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans">
            <CheckCircle className="text-coral-500 w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-ocean-950">All Inclusive Amenities</span>
          </div>
        </div>

      </div>
    </section>
  );
}
