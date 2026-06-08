/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquareCode, Facebook, Instagram, Twitter, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_INFO } from '../data';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate real server-side form recording
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24 bg-sand-50 relative overflow-hidden">
      {/* Dynamic graphic details */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ocean-100/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-coral-500 uppercase tracking-[0.2em] font-semibold block">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-950 tracking-tight">
            Connect With Our Concierge
          </h2>
          <div className="w-12 h-1 bg-coral-500 mx-auto" />
          <p className="font-sans text-sm sm:text-base text-sand-700 leading-relaxed max-w-xl mx-auto">
            Have questions about jungle activities, airport pickup details, or custom booking needs? Shoot us a message or call directly.
          </p>
        </div>

        {/* 2-Column Responsive Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: Info list and Embedded Google Map */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            {/* Context list */}
            <div className="bg-white border border-sand-300 p-8 rounded-sm space-y-6 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-ocean-950">
                Contact Information
              </h3>
              
              <div className="space-y-4 font-sans text-sm">
                
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-sand-100 text-coral-500 rounded-sm flex items-center justify-center flex-shrink-0 border border-sand-300">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-sand-600 uppercase tracking-widest">Our Address</span>
                    <span className="font-semibold text-ocean-950">{HOTEL_INFO.address}</span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-sand-100 text-coral-500 rounded-sm flex items-center justify-center flex-shrink-0 border border-sand-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-sand-600 uppercase tracking-widest">Call Directly</span>
                    <a href={`tel:${HOTEL_INFO.phone}`} className="font-semibold text-ocean-950 hover:text-coral-500 transition-colors">
                      {HOTEL_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-sand-100 text-coral-500 rounded-sm flex items-center justify-center flex-shrink-0 border border-sand-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-sand-600 uppercase tracking-widest">Email Inquiry</span>
                    <a href={`mailto:${HOTEL_INFO.email}`} className="font-semibold text-ocean-950 hover:text-coral-500 transition-colors">
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-sand-300 space-y-3">
                <span className="block font-mono text-[10px] text-sand-650 uppercase tracking-widest">Social Channels</span>
                <div className="flex space-x-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-sand-50 hover:bg-coral-500 text-ocean-950 hover:text-sand-50 rounded-sm border border-sand-300 flex items-center justify-center transition-all">
                    <Facebook size={16} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-sand-50 hover:bg-coral-500 text-ocean-950 hover:text-sand-50 rounded-sm border border-sand-300 flex items-center justify-center transition-all">
                    <Instagram size={16} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-sand-50 hover:bg-coral-500 text-ocean-950 hover:text-sand-50 rounded-sm border border-sand-300 flex items-center justify-center transition-all">
                    <Twitter size={16} />
                  </a>
                </div>
              </div>

            </div>

            {/* Google Map Box */}
            <div className="border border-sand-300 rounded-sm overflow-hidden h-64 shadow-md bg-sand-200">
              <iframe
                title="Hotel Mirage Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14144.597793135084!2d84.484251101934!3d27.57342674381716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994ef7fcbba9435%3A0xe6bfbfa529e3fc14!2sSauraha%2C%20Ratnanagar%2044200%2C%20Nepal!5e0!3m2!1sen!2snp!4v1780650000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* RIGHT: Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-sand-300 p-8 sm:p-12 h-full rounded-sm flex flex-col justify-center shadow-lg relative">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-2xl font-bold text-ocean-950">
                        Drop Us A Line
                      </h3>
                      <p className="text-xs text-sand-600 font-sans">
                        Fields marked * are fully mandated.
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-sand-700">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 placeholder-sand-500 focus:outline-none transition-all font-sans text-sm"
                          placeholder="Your full name"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-sand-700">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 placeholder-sand-500 focus:outline-none transition-all font-sans text-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-sand-700">
                          Your Message *
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-sand-50 border border-sand-300 focus:border-coral-500 rounded-none text-ocean-950 placeholder-sand-500 focus:outline-none transition-all font-sans text-sm resize-none"
                          placeholder="How can we assist your trip itinerary planning?"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-300 text-sand-50 font-sans font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_4px_14px_rgba(235,96,68,0.25)] flex items-center justify-center space-x-2 rounded-sm cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
                          <span>SENDING TO CONCIERGE...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>SEND SECURE MESSAGE</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-300 shadow-md">
                      <Check size={32} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl font-bold text-ocean-950">
                        Inquiry Recorded
                      </h3>
                      <p className="font-sans text-sm text-sand-700 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-ocean-800">{formData.name}</strong>. Our front desk concierge team has logged your email <strong className="text-ocean-800">{formData.email}</strong> and will reach out with details in under 4 hours.
                      </p>
                    </div>

                    {/* Quick copy paper receipt mimic style */}
                    <div className="bg-sand-100 border border-sand-300 rounded-sm p-4 w-full text-left font-mono text-[11px] text-sand-700 space-y-1">
                      <div>DATE: {new Date().toLocaleDateString()}</div>
                      <div>RECEIVER: Hotel Mirage Concierge Team</div>
                      <div className="border-t border-sand-300/60 my-2 pt-2">MESSAGE TICKET CONTENT:</div>
                      <div className="italic">&ldquo;{formData.message}&rdquo;</div>
                    </div>

                    <button
                      id="contact-reset-btn"
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-ocean-800 hover:bg-ocean-900 text-sand-50 text-xs font-mono uppercase tracking-wider rounded-sm focus:outline-none"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
