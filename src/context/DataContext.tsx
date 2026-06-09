import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Testimonial } from '../types';
import { ROOMS_DATA, GALLERY_SLIDES, TESTIMONIALS } from '../data';

export interface GallerySlide {
  id: string;
  image: string;
  title: string;
  caption: string;
}

interface DataContextType {
  rooms: Room[];
  gallery: GallerySlide[];
  testimonials: Testimonial[];
  updateRoom: (roomId: string, updatedFields: Partial<Room>) => void;
  addGalleryPhoto: (photo: Omit<GallerySlide, 'id'>) => void;
  updateGalleryPhoto: (photoId: string, updatedFields: Partial<GallerySlide>) => void;
  deleteGalleryPhoto: (photoId: string) => void;
  addReview: (review: Omit<Testimonial, 'id' | 'avatarLetter'>) => void;
  updateReview: (reviewId: string, updatedFields: Partial<Testimonial>) => void;
  deleteReview: (reviewId: string) => void;
  resetToDefault: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_rooms');
    return saved ? JSON.parse(saved) : ROOMS_DATA;
  });

  const [gallery, setGallery] = useState<GallerySlide[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_gallery');
    return saved ? JSON.parse(saved) : GALLERY_SLIDES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_testimonials');
    return saved ? JSON.parse(saved) : TESTIMONIALS;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('hotel_orchid_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hotel_orchid_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('hotel_orchid_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Action methods
  const updateRoom = (roomId: string, updatedFields: Partial<Room>) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updatedFields } : room));
  };

  const addGalleryPhoto = (photo: Omit<GallerySlide, 'id'>) => {
    const nextId = `gal-${Date.now()}`;
    const newPhoto: GallerySlide = { id: nextId, ...photo };
    setGallery(prev => [...prev, newPhoto]);
  };

  const updateGalleryPhoto = (photoId: string, updatedFields: Partial<GallerySlide>) => {
    setGallery(prev => prev.map(photo => photo.id === photoId ? { ...photo, ...updatedFields } : photo));
  };

  const deleteGalleryPhoto = (photoId: string) => {
    setGallery(prev => prev.filter(photo => photo.id !== photoId));
  };

  const addReview = (review: Omit<Testimonial, 'id' | 'avatarLetter'>) => {
    const nextId = `t-${Date.now()}`;
    const avatarLetter = review.author ? review.author.charAt(0).toUpperCase() : 'G';
    const newReview: Testimonial = { id: nextId, avatarLetter, ...review };
    setTestimonials(prev => [newReview, ...prev]);
  };

  const updateReview = (reviewId: string, updatedFields: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const nextReview = { ...rev, ...updatedFields };
        if (updatedFields.author) {
          nextReview.avatarLetter = updatedFields.author.charAt(0).toUpperCase();
        }
        return nextReview;
      }
      return rev;
    }));
  };

  const deleteReview = (reviewId: string) => {
    setTestimonials(prev => prev.filter(rev => rev.id !== reviewId));
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all modifications to default values? This will override all updates.')) {
      setRooms(ROOMS_DATA);
      setGallery(GALLERY_SLIDES);
      setTestimonials(TESTIMONIALS);
    }
  };

  return (
    <DataContext.Provider value={{
      rooms,
      gallery,
      testimonials,
      updateRoom,
      addGalleryPhoto,
      updateGalleryPhoto,
      deleteGalleryPhoto,
      addReview,
      updateReview,
      deleteReview,
      resetToDefault
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
