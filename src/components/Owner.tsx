import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

export default function Owner() {
  const { ownerInfo } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const totalAchievements = ownerInfo?.achievements?.length || 0;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= totalAchievements - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? totalAchievements - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  // Autoplay intervals
  useEffect(() => {
    if (!isAutoPlaying || totalAchievements <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= totalAchievements - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalAchievements]);

  // Escape key handler for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!ownerInfo) return null;

  return (
    <section id="meet-our-owner-section" className="py-20 bg-gradient-to-b from-sand-50 to-sand-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-coral-600 font-sans tracking-widest text-xs font-bold uppercase block mb-3">
            Local Guardianship
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-ocean-950 font-medium">
            Meet Our Owner
          </h2>
          <div className="w-16 h-1 bg-coral-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Owner Portrait Box */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-coral-500 to-emerald-600 rounded-2xl opacity-10 blur-md group-hover:opacity-20 transition duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-md border-4 border-white aspect-square w-64 h-64 sm:w-72 sm:h-72">
                <img
                  src={ownerInfo.photo}
                  alt={ownerInfo.name}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full transform transition duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Mini Badge Floating */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-ocean-950 text-sand-50 text-[10px] font-mono uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg border border-sand-850 whitespace-nowrap">
                <span>Community Leader</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-serif text-ocean-950 font-medium">{ownerInfo.name}</h3>
              <p className="text-sm font-sans text-coral-600 font-medium tracking-wide mt-1">{ownerInfo.role}</p>
            </div>
          </div>

          {/* Description biography */}
          <div className="lg:col-span-8 lg:pl-6 text-left">
            <div className="prose prose-ocean max-w-none text-ocean-800/95 leading-relaxed font-sans text-base space-y-6">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-coral-600 text-justify">
                {ownerInfo.description}
              </p>
              <div className="text-sm text-ocean-700 italic border-l-4 border-emerald-500 pl-4 bg-emerald-500/5 py-3 rounded-r-lg">
                &ldquo;Protecting the ecosystem of Chitwan is not just a duty, it is a legacy we build for the future generation of Nepal. Through sustainable eco-conscious hospitality, we connect our guests with the magnificent pulse of local nature.&rdquo;
              </div>

              {/* Photo Box Slider with Larger Size & Container fit */}
              {totalAchievements > 0 && (
                <div className="relative mt-12 group">
                  <div className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Credentials & Certificates</span>
                    <span className="text-[10px] text-stone-400 font-normal normal-case italic">Click certificate to view full resolution</span>
                  </div>
                  
                  {/* Aspect Ratio updated to make the container taller and much larger */}
                  <div className="relative aspect-[4/3] lg:aspect-[1.4] w-full overflow-hidden rounded-2xl border border-sand-200 shadow-md bg-stone-950 flex items-center justify-center">
                    {/* Active Image with Contain for absolute clear rendering of certificate documents */}
                    <img
                      src={ownerInfo.achievements[currentIndex].image}
                      alt={ownerInfo.achievements[currentIndex].title}
                      referrerPolicy="no-referrer"
                      className="object-contain w-full h-full p-2 sm:p-4 cursor-zoom-in transition-all duration-700 select-none hover:brightness-105"
                      onClick={() => setLightboxImage(ownerInfo.achievements[currentIndex].image)}
                    />

                    {/* Dark gradient overlay at the bottom for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/10 to-transparent pointer-events-none" />

                    {/* Left & Right Navigation Buttons overlay */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={handlePrev}
                        aria-label="Previous Photo"
                        className="p-2.5 rounded-full bg-white/95 hover:bg-white text-stone-900 hover:text-coral-600 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="Next Photo"
                        className="p-2.5 rounded-full bg-white/95 hover:bg-white text-stone-900 hover:text-coral-600 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick zoom icon trigger indicator */}
                    <div 
                      className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-xs text-[10px] font-mono tracking-wider text-sand-200 py-1.5 px-3 rounded-full border border-white/10 flex items-center gap-1.5 cursor-zoom-in hover:bg-stone-900 transition-all"
                      onClick={() => setLightboxImage(ownerInfo.achievements[currentIndex].image)}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-coral-400" />
                      <span>Click to Zoom</span>
                    </div>

                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-white text-left pointer-events-none">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-mono font-bold bg-coral-500 px-2.5 py-0.5 rounded-sm text-white shadow-sm">
                          {ownerInfo.achievements[currentIndex].period}
                        </span>
                        <span className="text-xs font-medium text-emerald-300 tracking-wider">
                          {ownerInfo.achievements[currentIndex].role}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base md:text-lg font-serif font-bold tracking-tight text-sand-50 leading-tight">
                        {ownerInfo.achievements[currentIndex].title}
                      </h4>
                    </div>

                    {/* Index Indicator */}
                    <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-xs text-[10px] font-mono font-bold tracking-widest text-sand-100 py-1.5 px-3 rounded-full border border-white/10">
                      {currentIndex + 1} / {totalAchievements}
                    </div>
                  </div>

                  {/* Navigation controls underneath for mobile accessibility */}
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full border border-sand-300 text-stone-700 bg-white hover:bg-sand-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="flex items-center gap-1.5">
                      {ownerInfo.achievements.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setIsAutoPlaying(false);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentIndex === idx 
                              ? "w-6 bg-coral-500" 
                              : "w-1.5 bg-sand-300 hover:bg-sand-400"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full border border-sand-300 text-stone-700 bg-white hover:bg-sand-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Fully Interactive Zoom Lightbox Overlay */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-8 backdrop-blur-md transition-opacity duration-300 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button on high z-index */}
          <button 
            className="absolute top-4 right-4 text-white hover:text-coral-400 bg-stone-900/80 border border-white/10 p-2 rounded-full transition-all shadow-md cursor-pointer z-50"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full-width Modal Frame */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt="Certificate Fullscreen" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl border border-white/10 pointer-events-auto cursor-default select-none"
            />
            {currentIndex !== undefined && ownerInfo.achievements[currentIndex] && (
              <div className="bg-stone-900/90 border border-white/5 py-3 px-6 rounded-full mt-4 text-center pointer-events-auto">
                <p className="text-sand-100 font-serif text-sm font-bold tracking-tight">
                  {ownerInfo.achievements[currentIndex].title}
                </p>
                <p className="text-stone-400 font-sans text-xs tracking-wider mt-0.5">
                  {ownerInfo.achievements[currentIndex].role} ({ownerInfo.achievements[currentIndex].period})
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
