/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Added configuration patch to handle direct real-time email transactions 
// to info@hotelorchidchitwan.com for self-bookings and guest messages.
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Rooms from './components/Rooms';
import Amenities from './components/Amenities';
import Activities from './components/Activities';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Owner from './components/Owner';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import WhatsAppButton from './components/WhatsAppButton';
import CPanelAdmin from './components/CPanelAdmin';
import { DataProvider, useData } from './context/DataContext';

// Dynamic search-engine structured data and descriptive header SEO generator.
// This component dynamically synchronizes Google Search and other search spiders with the actual live rates
// configured in the database/cPanel. By injecting a real-time 'application/ld+json' schema block and updating
// the meta description tags in the HTML header, Google can crawl and display the correct rates (e.g., NPR 2,000 instead of 20,000).
function SEOManager() {
  const { rooms, heroImage } = useData();

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;
    
    // Calculate actual active room prices
    const prices = rooms.map(r => r.basePriceNPR).filter(p => !isNaN(p) && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 2000;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 2500;

    // Create official Google Structured JSON-LD representation of Hotel Orchid Sauraha
    const schemaJSON = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "Hotel Orchid Sauraha",
      "description": "Discover the charm of Chitwan at Hotel Orchid Sauraha, where elegant comfort meets natural beauty. Peaceful garden suites and safari hospitality near Rapti river.",
      "image": heroImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920",
      "telephone": "+977-9855080337",
      "email": "info@hotelorchidchitwan.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sauraha",
        "addressLocality": "Chitwan",
        "addressRegion": "Ratnanagar",
        "postalCode": "44200",
        "addressCountry": "NP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "27.5796",
        "longitude": "84.4947"
      },
      "url": window.location.origin,
      "priceRange": `NPR ${minPrice.toLocaleString()} - NPR ${maxPrice.toLocaleString()}`,
      "containsPlace": rooms.map(room => ({
        "@type": "HotelRoom",
        "name": room.name,
        "description": room.description,
        "occupancy": {
          "@type": "QuantitativeValue",
          "value": room.capacity
        },
        "offers": {
          "@type": "Offer",
          "price": room.basePriceNPR,
          "priceCurrency": "NPR",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": room.basePriceNPR,
            "priceCurrency": "NPR",
            "unitText": "NIGHT"
          }
        }
      }))
    };

    // Inject snippet securely into index header
    let scriptTag = document.getElementById('hotel-orchid-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'hotel-orchid-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaJSON, null, 2);

    // Update index.html meta description so that Google picks up the exact updated room rate
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `Welcome to Hotel Orchid Sauraha. Book comfortable rooms from NPR ${minPrice.toLocaleString()} per night. Contact +977-9855080337 or WhatsApp. Free WiFi, Air Conditioning, Hot/Cold Shower.`);
    }
    
    // Synchronize Open Graph descriptions for consistent social lookups
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", `Welcome to Hotel Orchid Sauraha. Book comfortable rooms from NPR ${minPrice.toLocaleString()} per night. Free WiFi, Air Conditioning, and guided safaris.`);
    }

  }, [rooms, heroImage]);

  return null;
}

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
      <SEOManager />
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

          {/* Comp Perks List (Strict Icon Mode) */}
          <Amenities />

          {/* Curated Local Activities section */}
          <Activities />

          {/* Meet our Owner Section */}
          <Owner />

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
