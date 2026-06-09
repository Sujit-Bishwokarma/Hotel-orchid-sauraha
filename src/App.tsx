/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Rooms from './components/Rooms';
import Restaurant from './components/Restaurant';
import Amenities from './components/Amenities';
import Activities from './components/Activities';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import WhatsAppButton from './components/WhatsAppButton';
import CPanelAdmin from './components/CPanelAdmin';
import { DataProvider } from './context/DataContext';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('hotel_orchid_admin_authorized');
    setShowAdminConsole(false);
    setIsAdminOpen(false);
  };

  // Check URL parameters or local storage to show/hide the admin buttons
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasAdminQuery = params.get('admin') === 'true';
    const isAlreadyAuthorized = localStorage.getItem('hotel_orchid_admin_authorized') === 'true';

    if (hasAdminQuery) {
      // Authorize this device and save it in temporary memory
      localStorage.setItem('hotel_orchid_admin_authorized', 'true');
      setShowAdminConsole(true);
      
      // Clean up the URL so it looks clean to the user
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (isAlreadyAuthorized) {
      setShowAdminConsole(true);
    }
  }, []);

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
    <DataProvider>
      <div id="hotel-orchid-application-root" className="bg-sand-50 min-h-screen text-ocean-950 flex flex-col font-sans selection:bg-coral-500 selection:text-sand-50">
        
        {/* Sticky Header with scrolling callbacks */}
        <Header 
          onOpenBooking={() => handleOpenBooking()} 
          onOpenAdmin={showAdminConsole ? () => setIsAdminOpen(true) : undefined}
        />

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

          {/* Curated Local Activities section */}
          <Activities />

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
        <Footer onOpenAdmin={showAdminConsole ? () => setIsAdminOpen(true) : undefined} />

        {/* Dynamic cPanel Administrative Console */}
        <CPanelAdmin 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          onSignOut={handleSignOut}
        />

      </div>
    </DataProvider>
  );
}
