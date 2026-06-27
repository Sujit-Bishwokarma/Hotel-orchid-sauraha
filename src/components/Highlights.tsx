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
    <section id="highlights-section" className="py-20 bg-sand-50 relative overflow-hidden">
      {/* Decorative background orchid element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral-100/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ocean-100/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid: Split content left layout description, right title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
                Hotel Highlights
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-3 py-1 rounded-full shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                100% Direct Booking Trust
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight leading-tight">
              An Orchid of Peace <br />
              <span className="italic font-normal text-coral-600 font-serif">In Sauraha</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-6">
            <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed border-l-2 border-coral-400 pl-6">
              {HOTEL_INFO.about}
            </p>
          </div>
        </div>

        {/* Highlights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOTEL_HIGHLIGHTS.map((h, idx) => {
            const IconComponent = IconMap[h.icon] || MapPin;
            
            // Premium, modern color palette configurations
            const cardStyles = [
              {
                iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
                badgeText: "Nearby",
                badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
                hoverBorder: "hover:border-emerald-300 hover:shadow-emerald-100/40",
                hoverBg: "group-hover:bg-emerald-50/10"
              },
              {
                iconBg: "bg-amber-50 text-amber-700 border-amber-100",
                badgeText: "Caring",
                badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
                hoverBorder: "hover:border-amber-300 hover:shadow-amber-100/40",
                hoverBg: "group-hover:bg-amber-50/10"
              },
              {
                iconBg: "bg-coral-50 text-coral-700 border-coral-100",
                badgeText: "Outdoors",
                badgeBg: "bg-coral-50 text-coral-700 border-coral-100",
                hoverBorder: "hover:border-coral-300 hover:shadow-coral-100/40",
                hoverBg: "group-hover:bg-coral-50/10"
              }
            ][idx] || {
              iconBg: "bg-sand-100 text-sand-800 border-sand-200",
              badgeText: "Feature",
              badgeBg: "bg-sand-100 text-sand-700 border-sand-200",
              hoverBorder: "hover:border-sand-400",
              hoverBg: "group-hover:bg-sand-50/10"
            };

            return (
              <motion.div
                key={h.id}
                id={`highlight-card-${h.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`bg-white/90 backdrop-blur-xs border border-sand-200/80 p-8 sm:p-10 rounded-3xl relative group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${cardStyles.hoverBorder} ${cardStyles.hoverBg}`}
              >
                {/* Modern subtle top indicator tag */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 ${cardStyles.iconBg} border rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${cardStyles.badgeBg}`}>
                    {cardStyles.badgeText}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-3 group-hover:text-coral-600 transition-colors">
                  {h.title}
                </h3>

                <p className="font-sans text-sm text-sand-600 leading-relaxed">
                  {h.description}
                </p>
                
                {/* Clean minimalist design element instead of noisy background lines */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-sand-150/40 rounded-tl-full pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
