/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, UserCheck, CreditCard, Send, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROOMS_DATA, HOTEL_INFO } from '../data';
import { BookingDetails } from '../types';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoomId?: string;
}

export default function BookingForm({ isOpen, onClose, preSelectedRoomId }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingDetails>({
    name: '',
    emailOrPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomType: 'deluxe-double',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Sync preSelectedRoomId
  useEffect(() => {
    if (preSelectedRoomId) {
      setFormData((prev) => ({ ...prev, roomType: preSelectedRoomId }));
    }
  }, [preSelectedRoomId, isOpen]);

  // Pricing Helpers
  const activeRoom = ROOMS_DATA.find((r) => r.id === formData.roomType) || ROOMS_DATA[0];

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nightsCount = calculateNights();
  const totalPriceNPR = activeRoom.basePriceNPR * nightsCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.emailOrPhone || !formData.checkIn || !formData.checkOut) return;

    setIsSubmitting(true);

    // Mimic secure database storage registration
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessReceipt({
        ...formData,
        bookingId: `MIR-${Math.floor(100000 + Math.random() * 900000)}`,
        nights: nightsCount,
        roomDetails: activeRoom,
        totalPrice: totalPriceNPR,
        orderDate: new Date().toLocaleDateString(),
      });
    }, 1800);
  };

  const handleClose = () => {
    setSuccessReceipt(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ocean-950/80 backdrop-blur-sm"
          />

          {/* Form Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative bg-white border border-sand-300 w-full max-w-lg md:max-w-2xl rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            
            {/* Top Close Banner */}
            <div className="bg-ocean-950 px-6 py-4 flex items-center justify-between border-b border-ocean-800">
              <div className="text-left">
                <h3 className="font-serif text-lg text-sand-50 font-semibold tracking-wide">
                  {successReceipt ? 'RESERVATION CONFIRMED' : 'SECURE MIRAGE RESERVATION'}
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-sand-400">
                  {successReceipt ? `Receipt ID: ${successReceipt.bookingId}` : 'Best Rate Guaranteed'}
                </p>
              </div>
              <button
                id="booking-form-close-btn"
                onClick={handleClose}
                className="p-1 text-sand-300 hover:text-sand-50 bg-ocean-900/50 hover:bg-ocean-900/90 rounded-full transition-colors focus:outline-none"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {/* Inner Content flow (Scrollable) */}
            <div className="overflow-y-auto p-6 sm:p-8">
              
              {!successReceipt ? (
                /* Regular booking entry fields */
                <form id="orchid-booking-inner-form" onSubmit={handleSubmit} className="space-y-6 text-left">
                  
                  <div className="bg-coral-50 border border-coral-200/50 p-4 rounded-sm flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-coral-500 mt-0.5 flex-shrink-0 animate-pulse" />
                    <p className="font-sans text-xs text-coral-900 leading-relaxed">
                      Namaste! You are direct-booking with <strong>Hotel Mirage Sauraha</strong>. No prepayment is required today. Pay during check-in.
                    </p>
                  </div>

                  {/* 2-Column fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Guest Name */}
                    <div className="space-y-1">
                      <label htmlFor="book-name" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Guest Full Name *
                      </label>
                      <input
                        id="book-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 placeholder-sand-500 focus:outline-none transition-all font-sans text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email/Phone */}
                    <div className="space-y-1">
                      <label htmlFor="book-phone" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Phone or Email *
                      </label>
                      <input
                        id="book-phone"
                        type="text"
                        required
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 placeholder-sand-500 focus:outline-none transition-all font-sans text-sm"
                        placeholder="e.g. +977-984... or alex@email.com"
                      />
                    </div>

                    {/* Check In */}
                    <div className="space-y-1">
                      <label htmlFor="book-checkin" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Check-In Date *
                      </label>
                      <input
                        id="book-checkin"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 focus:outline-none transition-all font-sans text-sm"
                      />
                    </div>

                    {/* Check Out */}
                    <div className="space-y-1">
                      <label htmlFor="book-checkout" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Check-Out Date *
                      </label>
                      <input
                        id="book-checkout"
                        type="date"
                        required
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 focus:outline-none transition-all font-sans text-sm"
                      />
                    </div>

                    {/* Room Type Dropdown */}
                    <div className="space-y-1">
                      <label htmlFor="book-roomtype" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Room Sanctum *
                      </label>
                      <select
                        id="book-roomtype"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 focus:outline-none transition-all font-sans text-sm"
                      >
                        {ROOMS_DATA.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} ({room.basePriceNPR.toLocaleString()} NPR /night)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-1">
                      <label htmlFor="book-guests" className="block text-[11px] font-mono text-sand-700 uppercase tracking-wider">
                        Number of Guests *
                      </label>
                      <select
                        id="book-guests"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...prev => ({ ...prev, guests: parseInt(e.target.value) }) })}
                        className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 focus:outline-none transition-all font-sans text-sm"
                      >
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'} (Capacity Limit Apply)
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Real-time calculated Invoice Details section */}
                  <div className="bg-sand-100 border border-sand-300 p-6 rounded-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-sand-300/60 pb-2">
                      <span className="font-serif font-bold text-ocean-950 text-base">Booking Estimation Ledger</span>
                      <span className="font-mono text-xs text-sand-600 uppercase tracking-wider">Direct Stay Policy</span>
                    </div>

                    <div className="space-y-2 font-sans text-xs sm:text-sm text-sand-800">
                      <div className="flex justify-between">
                        <span>Sanctum Sanctuary:</span>
                        <span className="font-semibold text-ocean-950">{activeRoom.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Night Rate:</span>
                        <span className="font-semibold text-ocean-950">{activeRoom.basePriceNPR.toLocaleString()} NPR</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration Duration:</span>
                        <span className="font-semibold text-ocean-950">{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
                      </div>
                    </div>

                    <div className="border-t border-sand-300 pt-3 flex justify-between items-baseline">
                      <span className="font-mono text-[10px] uppercase font-bold text-sand-700">Total Net Booking NPR</span>
                      <span className="font-serif text-2xl font-bold text-coral-600">
                        NPR {totalPriceNPR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action submit */}
                  <button
                    id="booking-form-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-300 text-sand-50 font-sans font-bold text-sm tracking-wider uppercase transition-all shadow-[0_4px_14px_rgba(235,96,68,0.25)] flex items-center justify-center space-x-2 rounded-sm cursor-pointer coral-glow-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
                        <span>RECORDING RESERVATION...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>AGREE TERMS & SUBMIT RESERVATION</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-sand-600 text-center font-sans">
                    <ShieldAlert size={12} className="text-coral-500" />
                    <span>Free cancellation up to 24 hours prior to estimated check-in time.</span>
                  </div>

                </form>
              ) : (
                /* Success booking receipt / voucher check-in print-look */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-300 shadow-md mx-auto">
                    <Check size={32} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-3xl font-bold text-ocean-950">Voucher Reserved</h4>
                    <p className="font-sans text-xs text-sand-700">
                      Namaste <strong>{successReceipt.name}</strong>, your retreat space is guaranteed!
                    </p>
                  </div>

                  {/* Mimic a glorious print hotel ticket voucher */}
                  <div id="orchid-booking-voucher-ticket" className="bg-sand-50 border-2 border-dashed border-sand-300 p-6 sm:p-8 rounded-sm text-left font-mono text-[10px] sm:text-xs text-sand-800 space-y-4">
                    
                    {/* Header voucher */}
                    <div className="flex justify-between items-start border-b border-sand-300 pb-3">
                      <div>
                        <strong className="text-sm font-serif text-ocean-900 block">{HOTEL_INFO.name.toUpperCase()}</strong>
                        <span className="text-[10px] tracking-wide text-sand-600">{HOTEL_INFO.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] block text-sand-600">RESERVATION ID</span>
                        <strong className="text-coral-600 text-sm font-serif">{successReceipt.bookingId}</strong>
                      </div>
                    </div>

                    {/* Core ledger */}
                    <div className="grid grid-cols-2 gap-y-3 pt-1">
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">GL_GUEST</span>
                        <strong>{successReceipt.name}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">GL_CONTACT</span>
                        <strong className="truncate block max-w-[150px]">{successReceipt.emailOrPhone}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">SANCTUM_TYPE</span>
                        <strong>{successReceipt.roomDetails.name}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">TOTAL_OCCUPANTS</span>
                        <strong>{successReceipt.guests} {successReceipt.guests === 1 ? 'Person' : 'People'}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">CHECK_IN_EST</span>
                        <strong>{successReceipt.checkIn} (12:00 PM onwards)</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-sand-500 uppercase">CHECK_OUT_EST</span>
                        <strong>{successReceipt.checkOut} (11:00 AM limit)</strong>
                      </div>
                    </div>

                    {/* Special notes if any */}
                    {successReceipt.specialRequests && (
                      <div className="bg-white border border-sand-200/60 p-3 rounded-none text-[10px]">
                        <span className="block text-[8px] text-sand-500 font-bold uppercase">CONCIERGE SPECIAL ARRANGEMENTS:</span>
                        <span className="italic block mt-1 text-sand-700">&ldquo;{successReceipt.specialRequests}&rdquo;</span>
                      </div>
                    )}

                    {/* Ledger Pricing details */}
                    <div className="border-t border-sand-300 pt-3 flex flex-col justify-end space-y-1 text-right">
                      <div className="flex justify-between font-sans text-xs">
                        <span className="text-sand-600">Calculated Stay ({successReceipt.nights} Nights):</span>
                        <span className="font-semibold text-ocean-950">NPR {successReceipt.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-sans text-xs pb-1">
                        <span className="text-sand-600">Booking Processing Fee:</span>
                        <span className="font-bold text-coral-500 uppercase">0% (Complimentary Upgrade)</span>
                      </div>
                      <div className="flex justify-between border-t border-sand-200 pt-2 text-sm">
                        <strong className="font-serif text-ocean-950">TOTAL AMOUNT DUE DURING STAY:</strong>
                        <strong className="font-serif text-base text-coral-600">NPR {successReceipt.totalPrice.toLocaleString()}</strong>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-center space-x-2 text-emerald-600 font-sans text-xs font-semibold bg-emerald-50 border border-emerald-200 p-3 rounded-sm">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    <span>Our transfer service has logged this voucher and will arrange your welcome!</span>
                  </div>

                  <div className="flex space-x-3 justify-center">
                    <button
                      id="close-confirmation-btn"
                      onClick={handleClose}
                      className="px-6 py-3 bg-ocean-850 hover:bg-ocean-950 text-sand-50 text-[11px] font-mono uppercase tracking-wider rounded-sm focus:outline-none cursor-pointer"
                    >
                      Finish and Return
                    </button>
                    <button
                      id="save-pdf-voucher-btn"
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-sand-200 hover:bg-sand-300 text-ocean-950 text-[11px] font-mono uppercase tracking-wider rounded-sm focus:outline-none"
                    >
                      Print Check-In Voucher
                    </button>
                  </div>

                </motion.div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
