import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Compass, Shield, Leaf, Hotel, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const getIcon = (id: string) => {
  switch (id) {
    case 'ach-1':
      return <Compass className="w-5 h-5 text-emerald-600" />;
    case 'ach-2':
      return <Shield className="w-5 h-5 text-red-600" />;
    case 'ach-3':
      return <Leaf className="w-5 h-5 text-emerald-600" />;
    default:
      return <Hotel className="w-5 h-5 text-amber-600" />;
  }
};

export default function Owner() {
  const { ownerInfo } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Responsive card layouts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4); // 4 cards on screen
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // 2 cards on screen
      } else {
        setItemsPerPage(1); // 1 card on screen
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalAchievements = ownerInfo?.achievements?.length || 0;
  const maxIndex = Math.max(0, totalAchievements - itemsPerPage);

  // Clamp current index if screen sizes shrink
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  // Autoplay intervals
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, maxIndex]);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-sand-200/60">
          
          {/* Owner Portrait Box */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-coral-500 to-emerald-600 rounded-2xl opacity-10 blur-md group-hover:opacity-20 transition duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-md border-4 border-sand-50 aspect-square w-64 h-64 sm:w-72 sm:h-72">
                <img
                  src={ownerInfo.photo}
                  alt={ownerInfo.name}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full transform transition duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Mini Badge Floating */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-ocean-950 text-sand-50 text-xs font-sans tracking-wide py-1.5 px-4 rounded-full shadow-lg border border-sand-800 flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-3.5 h-3.5 text-coral-400" />
                <span>Community Leader</span>
              </div>
            </div>

            <div className="text-center mt-8">
              <h3 className="text-2xl font-serif text-ocean-950 font-medium">{ownerInfo.name}</h3>
              <p className="text-sm font-sans text-coral-600 font-medium tracking-wide mt-1">{ownerInfo.role}</p>
            </div>
          </div>

          {/* Description biography */}
          <div className="lg:col-span-8 lg:pl-6">
            <div className="prose prose-ocean max-w-none text-ocean-800/90 leading-relaxed font-sans text-base space-y-4">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-coral-600">
                {ownerInfo.description}
              </p>
              <p className="text-sm text-ocean-700 italic border-l-2 border-emerald-500 pl-4 bg-emerald-50/40 py-2.5 rounded-r-lg">
                &ldquo;Protecting the ecosystem of Chitwan is not just a duty, it is a legacy we build for the future generation of Nepal. Through sustainable eco-conscious hospitality, we connect our guests with the magnificent pulse of local nature.&rdquo;
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Achievements Boxes in Interactive Slider Carousel with touch swipe & physics */}
        <div className="relative mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-3 border-b border-sand-200">
            <h4 className="text-lg font-serif text-ocean-950 flex items-center gap-2">
              <span>A Distinguished Journey of Public Service</span>
              <span className="text-xs font-sans text-emerald-600 bg-emerald-50 border border-emerald-100 py-0.5 px-2 rounded-full font-medium">Timeline</span>
            </h4>
            
            {/* Slider Controls */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="p-2.5 rounded-full border border-sand-300 text-ocean-950 hover:bg-coral-500 hover:border-coral-500 hover:text-white transition-all duration-300 shadow-sm active:scale-95 cursor-pointer bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono text-ocean-600/80 px-1">
                {currentIndex + 1} / {maxIndex + 1}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="p-2.5 rounded-full border border-sand-300 text-ocean-950 hover:bg-coral-500 hover:border-coral-500 hover:text-white transition-all duration-300 shadow-sm active:scale-95 cursor-pointer bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Viewport */}
          <div className="overflow-hidden py-4 -my-4 relative">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                const threshold = 50;
                if (info.offset.x < -threshold) {
                  handleNext();
                } else if (info.offset.x > threshold) {
                  handlePrev();
                }
              }}
              animate={{ x: `-${currentIndex * (100 / ownerInfo.achievements.length)}%` }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="flex gap-0 cursor-grab active:cursor-grabbing select-none"
              style={{
                width: `${Math.max(1, ownerInfo.achievements.length / itemsPerPage) * 100}%`,
              }}
            >
              {ownerInfo.achievements.map((ach) => (
                <div
                  key={ach.id}
                  style={{ width: `${100 / ownerInfo.achievements.length}%` }}
                  className="px-3 shrink-0"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-sand-200/60 p-5 hover:border-coral-400/50 hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Year Badge */}
                    <div className="text-xs font-sans font-bold text-coral-600 tracking-wider mb-3 flex justify-between items-center">
                      <span>{ach.period}</span>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Nepalese Calendar
                      </span>
                    </div>

                    {/* Box Image inside */}
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-sand-100 relative border border-sand-100">
                      <img
                        src={ach.image}
                        alt={ach.title}
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full transition duration-500 group-hover:scale-105 select-none pointer-events-none"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-sand-100">
                        {getIcon(ach.id)}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h5 className="text-sm font-sans font-bold text-ocean-950 tracking-tight leading-snug group-hover:text-coral-700 transition duration-200 mb-1">
                          {ach.title}
                        </h5>
                        <p className="text-xs font-sans text-ocean-700 bg-sand-50 border border-sand-100/80 px-2 py-0.5 rounded inline-block font-medium">
                          {ach.role}
                        </p>
                      </div>
                      
                      <div className="border-t border-sand-100 pt-3 mt-3 text-[11px] text-ocean-500 font-sans flex items-center justify-between">
                        <span>Chitwan Conservation Lead</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator Progress */}
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => {
                  setCurrentIndex(dotIdx);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 border focus:outline-none ${
                  currentIndex === dotIdx 
                    ? "w-8 bg-coral-500 border-coral-500" 
                    : "w-2 bg-sand-300 border-transparent hover:bg-sand-400"
                }`}
                aria-label={`Go to slide page ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
