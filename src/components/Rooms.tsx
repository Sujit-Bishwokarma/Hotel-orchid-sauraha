/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, User, Users, Minimize, Bed, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ROOMS_DATA } from '../data';

interface RoomsProps {
  onBookRoom: (roomType: string) => void;
}

export default function Rooms({ onBookRoom }: RoomsProps) {
  return (
    <section id="rooms" className="scroll-mt-24 py-24 bg-white relative overflow-hidden">
      {/* Dynamic background aesthetics */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-sand-200/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Rooms & Suites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Sophisticated Nature Sanctuaries
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed max-w-2xl mx-auto">
            Experience absolute tranquility in our boutique habitats, strictly secure and tailored for couples and traveling groups. All materials source sustainable timber elements from Sauraha.
          </p>
        </div>

        {/* Room Gallery Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {ROOMS_DATA.map((room, idx) => {
            return (
              <motion.div
                key={room.id}
                id={`room-card-${room.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="flex flex-col bg-sand-50/50 border border-sand-300 rounded-sm overflow-hidden group shadow-sm hover:shadow-lg transition-all"
              >
                {/* Room Image with overlay aspects */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* High contrast gradient overlay for clean view */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ocean-950/80 via-ocean-950/20 to-transparent p-6 flex items-end justify-between">
                    <span className="inline-flex items-center space-x-1.5 bg-coral-500 text-sand-50 text-[10px] sm:text-xs font-mono font-bold uppercase py-1 px-3.5 tracking-wider rounded-sm shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>{room.capacity === 2 ? 'Couple Choice' : 'Premium Gold'}</span>
                    </span>
                    <span className="text-sand-100 font-mono text-xs sm:text-sm bg-ocean-950/40 backdrop-blur-sm px-3 py-1 rounded-sm flex items-center gap-1.5 border border-sand-300/10">
                      {room.capacity === 2 ? <User size={14} /> : <Users size={14} />}
                      <span>{room.capacity} Guests</span>
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between space-y-6">
                  
                  {/* Title & Metadata row */}
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-ocean-950 tracking-tight group-hover:text-ocean-800 transition-colors mb-2">
                      {room.name}
                    </h3>
                    
                    {/* Size and bed detail */}
                    <div className="flex items-center space-x-6 text-sand-600 font-mono text-xs">
                      <span className="flex items-center space-x-1.5">
                        <Minimize className="w-3.5 h-3.5 text-coral-500" />
                        <span>{room.size} Space</span>
                      </span>
                      <span className="flex items-center space-x-1.5 border-l border-sand-300 pl-6">
                        <Bed className="w-3.5 h-3.5 text-coral-500" />
                        <span>{room.bedType}</span>
                      </span>
                    </div>

                    <p className="font-sans text-sm text-sand-700 leading-relaxed mt-4">
                      {room.description}
                    </p>
                  </div>

                  {/* Core Amenities Display [Comfort & Security Only] */}
                  <div className="bg-sand-100/70 border border-sand-300/50 p-6 rounded-sm space-y-3">
                    <div className="flex items-center space-x-2 text-ocean-950 text-xs font-mono uppercase font-bold tracking-wider">
                      <ShieldCheck className="w-4.5 h-4.5 text-coral-500" />
                      <span>Comfort & Security Standards</span>
                    </div>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-sand-700 font-sans">
                      {room.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-start space-x-2 py-0.5">
                          <CheckCircle2 size={13} className="text-coral-500 mt-0.5 flex-shrink-0" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Glowing Call To Action */}
                  <div className="pt-6 border-t border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left">
                      <span className="block text-[10px] font-mono text-sand-600 tracking-widest uppercase">Per Night Rate</span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-ocean-950">
                        {room.basePriceNPR.toLocaleString()}{' '}
                        <span className="text-sm sm:text-base font-sans font-normal text-sand-700">NPR</span>
                      </span>
                    </div>

                    <button
                      id={`book-button-${room.id}`}
                      onClick={() => onBookRoom(room.id)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-coral-500 hover:bg-coral-600 active:scale-95 text-sand-50 font-sans font-bold text-xs sm:text-sm tracking-widest uppercase rounded-sm border border-coral-400 transition-all shadow-[0_4px_14px_rgba(235,96,68,0.35)] coral-glow-btn cursor-pointer text-center"
                    >
                      Book Sanctuary Now
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
