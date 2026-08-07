/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_INFO } from '../data';

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = `https://wa.me/9779855080337?text=Namaste!%20I%20am%20interested%20in%20reserving%20a%20sanctuary%20stay%20at%20Hotel%20Orchid%20Sauraha.%20Please%20advise%20availability!`;

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
                  <span className="text-[10px] font-mono text-sand-300 tracking-wide uppercase">Hotel Orchid Host</span>
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
                  I'm here to help customize your room booking, answer questions about jungle tour safaris, or plan your airport transfer. How can I help you today?
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
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-sans font-bold tracking-wider uppercase rounded-sm border border-[#34E073] shadow-md text-center flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
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
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da14e] text-white rounded-full shadow-2xl flex items-center justify-center border border-[#34E073] transition-all cursor-pointer relative group"
        aria-label="Open Chat Help"
      >
        <div className="relative flex items-center justify-center w-8 h-8 select-none pointer-events-none text-white">
          <WhatsAppIcon className="w-8 h-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
        </div>
        {/* Pulsing online orbit ring surrounding */}
        <span className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-60 pointer-events-none" />
      </motion.button>
    </div>
  );
}
