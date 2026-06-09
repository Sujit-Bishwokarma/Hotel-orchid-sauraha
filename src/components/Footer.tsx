/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, ArrowUp, Mail, Phone, Heart, Settings } from 'lucide-react';
import { HOTEL_INFO } from '../data';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer id="main-footer" className="bg-ocean-950 text-sand-200 pt-16 pb-8 border-t border-ocean-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top split columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-ocean-900">
          
          {/* Logo Brand info */}
          <div className="md:col-span-5 space-y-4 text-left">
            <span className="font-serif text-2xl font-bold tracking-wider text-sand-50">
              {HOTEL_INFO.name.toUpperCase()}
            </span>
            <p className="text-xs sm:text-sm text-sand-300 leading-relaxed max-w-sm">
              Your serene haven adjacent to the majestic Chitwan National Park. Unwind in secure, natural elegance, guided by Nepali hospitality warmth.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase text-coral-400">
              <ShieldCheck size={14} />
              <span>Verified Boutique Sanctuary</span>
            </div>
          </div>

          {/* Useful Links navigation links */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-sm font-bold uppercase text-sand-50 tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-sand-350">
              {['home', 'rooms', 'restaurant', 'amenities', 'gallery', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(id);
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
                    }}
                    className="hover:text-coral-400 transition-colors capitalize focus:outline-none cursor-pointer"
                  >
                    {id === 'rooms' ? 'Rooms & Suites' : id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details summaries */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="font-serif text-sm font-bold uppercase text-sand-50 tracking-wider">Quick Contacts</h4>
            <div className="space-y-3 text-xs sm:text-sm text-sand-300">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-sand-500">Concierge Desk</span>
                <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-coral-400 transition-colors font-semibold text-sand-50">
                  {HOTEL_INFO.phone}
                </a>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-sand-500">Support Email</span>
                <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-coral-400 transition-colors font-semibold text-sand-50">
                  {HOTEL_INFO.email}
                </a>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-sand-500">Find Us</span>
                <span className="text-sand-300 font-semibold">{HOTEL_INFO.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left text-xs text-sand-400 font-mono">
            <span>&copy; {new Date().getFullYear()} Hotel Orchid Sauraha, Chitwan. All rights strictly reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            {onOpenAdmin && (
              <button
                id="footer-cpanel-portal-toggle"
                onClick={onOpenAdmin}
                className="text-xs text-sand-400 hover:text-coral-400 font-mono flex items-center gap-1.5 cursor-pointer transition-colors bg-ocean-900 px-2.5 py-1 rounded-sm border border-ocean-800"
                title="Manage Room Prices, Gallery Photos, and Live Guest Reviews"
              >
                <Settings size={12} className="text-coral-500" />
                <span>cPanel Admin</span>
              </button>
            )}
            <div className="text-xs text-sand-400 flex items-center space-x-1 font-sans">
              <span>Made with</span>
              <Heart size={10} className="text-coral-500 fill-coral-500 animate-pulse" />
              <span>in Chitwan, Nepal</span>
            </div>

            <button
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="p-3 bg-ocean-900 hover:bg-coral-500 text-sand-100 hover:text-sand-50 transition-all rounded-sm border border-ocean-800 focus:outline-none cursor-pointer"
              aria-label="Back to Top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
