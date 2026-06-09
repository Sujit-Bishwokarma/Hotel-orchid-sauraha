/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck, Phone, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTEL_INFO } from '../data';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export default function Header({ onOpenBooking, onOpenAdmin }: HeaderProps) {
  const { logoImage } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Rooms & Suites', id: 'rooms' },
    { label: 'Restaurant', id: 'restaurant' },
    { label: 'Amenities', id: 'amenities' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background toggle
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      // Define all sections scroll-tracked, mapping section ID to nav item ID
      const sectionToNavItemMap: Record<string, string> = {
        'home': 'home',
        'highlights-section': 'home',
        'rooms': 'rooms',
        'restaurant': 'restaurant',
        'amenities': 'amenities',
        'gallery': 'gallery',
        'testimonials-section': 'gallery',
        'contact': 'contact',
      };

      const headerOffset = 140; // buffer offset for header triggering
      let currentActive = 'home'; // default fallback

      for (const [sectionId, navItemId] of Object.entries(sectionToNavItemMap)) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element's top is scrolled past our header position,
          // and the bottom is still below/at the header position:
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            currentActive = navItemId;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at load
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
      if (id === 'home') {
        try {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } catch (e) {
          window.scrollTo(0, 0);
        }
        setActiveSection('home');
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        
        try {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } catch (e) {
          window.scrollTo(0, offsetPosition);
        }
        setActiveSection(id);
      }
    }, 150);
  };

  return (
    <header
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ocean-950/95 backdrop-blur-md shadow-lg border-b border-ocean-800/50 py-3'
          : 'bg-gradient-to-b from-ocean-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => scrollToSection('home')}
            id="nav-logo"
            className="flex items-center space-x-3 text-left cursor-pointer group focus:outline-none"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-sand-300/30 bg-white transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0">
              <img
                src={logoImage} 
                alt="Hotel Orchid Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-sand-50 group-hover:text-coral-400 transition-colors">
                {HOTEL_INFO.name.toUpperCase()}
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-sand-300">
                {HOTEL_INFO.subName}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans text-sm tracking-wide transition-all relative py-1 focus:outline-none cursor-pointer ${
                  activeSection === item.id
                    ? 'text-coral-400 font-semibold'
                    : 'text-sand-200 hover:text-sand-50'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              id="header-phone-link"
              className="flex items-center space-x-2 text-sand-200 hover:text-coral-400 text-sm font-sans transition-colors"
            >
              <Phone size={14} className="text-coral-500" />
              <span>{HOTEL_INFO.phone}</span>
            </a>
            {onOpenAdmin && (
              <button
                id="header-cpanel-btn"
                onClick={onOpenAdmin}
                className="px-3.5 py-2.5 bg-stone-900 hover:bg-coral-500 hover:text-sand-50 text-sand-200 text-xs font-mono rounded-sm border border-stone-800 hover:border-coral-400 transition-all cursor-pointer focus:outline-none flex items-center gap-1.5"
                title="Open cPanel Admin Portal"
              >
                <Settings size={13} className="text-coral-500 group-hover:text-sand-50" />
                <span>cPanel Admin</span>
              </button>
            )}
            <button
              id="header-book-cta"
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 active:scale-95 text-sand-50 text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase rounded-sm border border-coral-400 transition-all shadow-[0_4px_14px_rgba(235,96,68,0.4)] hover:shadow-[0_6px_20px_rgba(235,96,68,0.6)] focus:outline-none cursor-pointer"
            >
              Book Orchid Now
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center lg:hidden space-x-3">
            {onOpenAdmin && (
              <button
                id="header-mobile-cpanel"
                onClick={onOpenAdmin}
                className="p-2 bg-stone-900 text-sand-200 rounded-sm focus:outline-none"
                aria-label="cPanel Admin"
                title="cPanel Admin Portal"
              >
                <Settings size={18} className="text-coral-500" />
              </button>
            )}
            <button
              id="header-mobile-book"
              onClick={onOpenBooking}
              className="p-2 bg-coral-500 hover:bg-coral-600 text-sand-50 rounded-sm focus:outline-none"
              aria-label="Book Now"
            >
              <CalendarCheck size={18} />
            </button>
            <button
              id="mobile-menu-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-sand-100 hover:text-sand-50 hover:bg-ocean-900/50 rounded-sm transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-ocean-950 border-t border-ocean-800/80 mt-2 px-4 shadow-xl overflow-hidden"
          >
            <div className="py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left py-2 font-sans text-base px-2 rounded-sm transition-all ${
                    activeSection === item.id
                      ? 'text-coral-400 bg-ocean-900 font-semibold border-l-2 border-coral-500'
                      : 'text-sand-200 hover:text-sand-50 hover:bg-ocean-900/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-ocean-900 flex flex-col space-y-3 px-2">
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="flex items-center space-x-3 text-sand-300 hover:text-sand-50 font-sans text-sm py-1"
                >
                  <Phone size={16} className="text-coral-500" />
                  <span>{HOTEL_INFO.phone}</span>
                </a>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3 bg-coral-500 hover:bg-coral-600 text-sand-50 text-sm font-sans font-bold tracking-widest uppercase rounded-sm border border-coral-400 shadow-md text-center"
                >
                  Book Your Retreat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
