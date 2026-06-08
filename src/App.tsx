/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Rooms from './components/Rooms';
import Restaurant from './components/Restaurant';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import WhatsAppButton from './components/WhatsAppButton';
import { motion } from 'motion/react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  // Trigger modal with prefilled details
  const handleOpenBooking = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedRoomId(undefined);
  };

  return (
    <div id="hotel-orchid-application-root" className="bg-sand-50 min-h-screen text-ocean-950 flex flex-col font-sans selection:bg-coral-500 selection:text-sand-50 overflow-x-hidden">
      {/* Sticky Header with scrolling callbacks */}
      <Header onOpenBooking={() => handleOpenBooking()} />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        
        {/* Full-Screen Hero */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Brand Highlights section */}
        <Highlights />

        {/* Room Gallery & Specifications */}
        <Rooms onBookRoom={(roomId) => handleOpenBooking(roomId)} />

        {/* Culinary Restaurant slide reveal block */}
        <Restaurant onOpenBooking={() => handleOpenBooking()} />

        {/* Comp Perks List (Strict Icon Mode) */}
        <Amenities />

        {/* Interactive Photo Swiper */}
        <Gallery />

        {/* Guest Reviews list */}
        <Testimonials />

        {/* Maps, Contact Info & Forms */}
        <Contact />

      </main>

      {/* Secure Invoice Booking Overlay Modal */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preSelectedRoomId={selectedRoomId}
      />

      {/* Floating Interactive Live WhatsApp Chat Box */}
      <WhatsAppButton />

      {/* Structured Copywrite Footer */}
      <Footer />
    </div>
  );
}
