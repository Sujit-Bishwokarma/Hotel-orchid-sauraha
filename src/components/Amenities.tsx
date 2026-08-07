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
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Services & Amenities
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed max-w-xl mx-auto">
            We offer simple and useful services to make your stay in Sauraha comfortable and relaxing.
          </p>
        </div>

        {/* Free Amenities Grid (Flat Icon size list - 2 per horizontal row) */}
        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-10 sm:gap-y-12 max-w-4xl mx-auto">
          {FREE_AMENITIES.map((item, idx) => {
            const IconComponent = IconMap[item.iconName] || Gift;
            return (
              <motion.div
                key={item.id}
                id={`amenity-item-${item.id}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 group text-left"
              >
                {/* Flat Icon size badge, not a large card */}
                <div className="flex-shrink-0 p-3 bg-white border border-sand-300 text-coral-600 rounded-sm group-hover:bg-coral-600 group-hover:text-white group-hover:border-coral-500 transition-all duration-300 shadow-sm">
                  <IconComponent className="w-5 h-5 sm:w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-ocean-950 group-hover:text-coral-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className={`inline-block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                      item.isFree 
                        ? "text-coral-600 bg-coral-50/50 border-coral-200/50" 
                        : "text-ocean-700 bg-sand-100/60 border-sand-300/50"
                    }`}>
                      {item.isFree ? "Free" : "On-Request"}
                    </span>
                  </div>
                  
                  <p className="font-sans text-xs sm:text-sm text-sand-800 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
