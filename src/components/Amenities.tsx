/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Car, Coffee, Wifi, Plane, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { FREE_AMENITIES } from '../data';

// Map icon string name to Lucide icons
const IconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Car: Car,
  Coffee: Coffee,
  Wifi: Wifi,
  Plane: Plane,
};

export default function Amenities() {
  return (
    <section id="amenities" className="scroll-mt-24 py-24 bg-sand-50 relative overflow-hidden">
      {/* Dynamic graphic accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-coral-50/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Complimentary Perks
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Absolutely Free For Our Guests
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed max-w-xl mx-auto">
            These essential hospitality upgrades are completely bundled with every room booking to ensure a tranquil Nepal adventure.
          </p>
        </div>

        {/* Free Amenities Grid (Strictly Icon Form with text fallback labels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FREE_AMENITIES.map((item, idx) => {
            const IconComponent = IconMap[item.iconName] || Gift;
            return (
              <motion.div
                key={item.id}
                id={`amenity-card-${item.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-sand-300 p-8 text-center rounded-sm group shadow-sm hover:shadow-lg transition-all"
              >
                {/* Micro badge indicator */}
                <div className="mx-auto w-16 h-16 bg-sand-100 text-ocean-800 rounded-full flex items-center justify-center mb-6 border border-sand-300 group-hover:bg-coral-500 group-hover:text-sand-50 group-hover:border-coral-400 group-hover:rotate-6 transition-all duration-300">
                  <IconComponent className="w-7 h-7" />
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-ocean-950 mb-2 group-hover:text-coral-600 transition-colors">
                  {item.name}
                </h3>
                
                <p className="font-sans text-xs sm:text-sm text-sand-600 leading-relaxed">
                  {item.description}
                </p>
                
                <span className="inline-block mt-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-coral-500 bg-coral-50/50 py-1 px-3 border border-coral-200/40 rounded-sm">
                  100% Free
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
