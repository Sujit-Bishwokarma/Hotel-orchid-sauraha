/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MessageCircle, Phone, Send, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_INFO } from '../data';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = `https://wa.me/9779845355551?text=Namaste!%20I%20am%20interested%20in%20reserving%20a%20sanctuary%20stay%20at%20Hotel%20Mirage%20Sauraha.%20Please%20advise%20availability!`;

  return (
    <div id="whatsapp-floating-system" className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="whatsapp-chat-drawer"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="mb-4 w-72 sm:w-80 bg-white border border-sand-300 rounded-sm shadow-2xl overflow-hidden text-left"
          >
            {/* Header banner */}
            <div className="bg-ocean-900 p-4 flex items-center justify-between text-sand-50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-sand-200 rounded-full overflow-hidden flex items-center justify-center text-ocean-950 font-serif font-bold border border-sand-300">
                    S
                  </div>
                  {/* Glowing online index */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-ocean-900 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-sand-50">Sabina (Concierge)</h4>
                  <span className="text-[10px] font-mono text-sand-300 tracking-wide uppercase">Hotel Mirage Host</span>
                </div>
              </div>
              <button
                id="whatsapp-drawer-close"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-ocean-800/80 rounded-full text-sand-300 hover:text-sand-50 transition-colors"
                aria-label="Close Chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulated chat body */}
            <div className="p-4 bg-sand-50 text-xs sm:text-sm text-sand-800 space-y-4 max-h-[220px] overflow-y-auto">
              <div className="bg-white border border-sand-300 p-3.5 rounded-sm shadow-sm relative text-left">
                {/* Decorative bubble arrow */}
                <span className="absolute left-3 -top-1.5 w-3 h-3 bg-white border-t border-l border-sand-300 rotate-45" />
                <p className="font-sans text-sand-700 leading-relaxed text-xs sm:text-sm pt-0.5">
                  Namasté! 🙏 Warm greetings from beautiful Sauraha, Chitwan.
                  <br /><br />
                  I'm here to help customize your room booking, answer questions about jungle tour safaris, or plan your free airport transfer. How can I help you today?
                </p>
                <span className="block mt-2 font-mono text-[9px] text-sand-400 text-right">Online Just Now</span>
              </div>
            </div>

            {/* User action link footer */}
            <div className="p-4 border-t border-sand-200 bg-white space-y-2">
              <a
                id="whatsapp-drawer-link-start"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-sand-50 text-xs sm:text-sm font-sans font-bold tracking-wider uppercase rounded-sm border border-emerald-400 shadow-md text-center flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <div className="relative flex items-center justify-center w-5 h-5 select-none pointer-events-none">
                  <MessageCircle size={18} className="text-white fill-white" />
                  <Phone size={8} className="absolute text-emerald-500 fill-emerald-500 -translate-y-[0.5px] -translate-x-[0.5px]" />
                </div>
                <span>START WHATSAPP CHAT</span>
              </a>
              <div className="flex items-center justify-center space-x-1 text-[9px] text-sand-500">
                <ShieldAlert size={10} className="text-coral-500" />
                <span>Safe & Secure peer-to-peer encrypted connection.</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Core */}
      <motion.button
        id="whatsapp-core-trigger-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-sand-50 rounded-full shadow-2xl flex items-center justify-center border border-emerald-400 transition-all cursor-pointer relative group"
        aria-label="Open Chat Help"
      >
        <div className="relative flex items-center justify-center w-8 h-8 select-none pointer-events-none">
          {/* Chat bubble body (white fill for true WhatsApp visual) */}
          <MessageCircle 
            size={28} 
            className="text-white fill-white group-hover:rotate-12 transition-transform duration-300" 
          />
          {/* Phone handset overlay inside the bubble */}
          <Phone 
            size={13} 
            className="absolute text-emerald-500 fill-emerald-500 group-hover:rotate-12 transition-transform duration-300 -translate-y-[0.5px] -translate-x-[0.5px]" 
          />
        </div>
        {/* Pulsing online orbit ring surrounding */}
        <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-60 pointer-events-none" />
      </motion.button>
    </div>
  );
}
