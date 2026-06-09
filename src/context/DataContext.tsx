import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Testimonial, Activity } from '../types';
import { HOTEL_INFO, ROOMS_DATA, GALLERY_SLIDES, TESTIMONIALS, ACTIVITIES_DATA } from '../data';

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
  heroImage: string;
  logoImage: string;
  activities: Activity[];
  updateRoom: (roomId: string, updatedFields: Partial<Room>) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  deleteRoom: (roomId: string) => void;
  addGalleryPhoto: (photo: Omit<GallerySlide, 'id'>) => void;
  updateGalleryPhoto: (photoId: string, updatedFields: Partial<GallerySlide>) => void;
  deleteGalleryPhoto: (photoId: string) => void;
  addReview: (review: Omit<Testimonial, 'id' | 'avatarLetter'>) => void;
  updateReview: (reviewId: string, updatedFields: Partial<Testimonial>) => void;
  deleteReview: (reviewId: string) => void;
  updateHeroImage: (image: string) => void;
  updateLogoImage: (image: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  deleteActivity: (activityId: string) => void;
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

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('hotel_orchid_hero_image') || HOTEL_INFO.images.hero;
  });

  const [logoImage, setLogoImage] = useState<string>(() => {
    return localStorage.getItem('hotel_orchid_logo_image') || HOTEL_INFO.images.logo;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_activities');
    return saved ? JSON.parse(saved) : ACTIVITIES_DATA;
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

  useEffect(() => {
    localStorage.setItem('hotel_orchid_hero_image', heroImage);
  }, [heroImage]);

  useEffect(() => {
    localStorage.setItem('hotel_orchid_logo_image', logoImage);
  }, [logoImage]);

  useEffect(() => {
    localStorage.setItem('hotel_orchid_activities', JSON.stringify(activities));
  }, [activities]);

  // Action methods
  const updateRoom = (roomId: string, updatedFields: Partial<Room>) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...updatedFields } : room));
  };

  const addRoom = (room: Omit<Room, 'id'>) => {
    const nextId = `room-${Date.now()}`;
    const newRoom: Room = { id: nextId, ...room };
    setRooms(prev => [...prev, newRoom]);
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
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

  const updateHeroImage = (image: string) => {
    setHeroImage(image);
  };

  const updateLogoImage = (image: string) => {
    setLogoImage(image);
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const nextId = `act-${Date.now()}`;
    const newActivity: Activity = { id: nextId, ...activity };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (activityId: string, updatedFields: Partial<Activity>) => {
    setActivities(prev => prev.map(act => act.id === activityId ? { ...act, ...updatedFields } : act));
  };

  const deleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(act => act.id !== activityId));
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all modifications to default values? This will override all updates.')) {
      setRooms(ROOMS_DATA);
      setGallery(GALLERY_SLIDES);
      setTestimonials(TESTIMONIALS);
      setHeroImage(HOTEL_INFO.images.hero);
      setLogoImage(HOTEL_INFO.images.logo);
      setActivities(ACTIVITIES_DATA);
    }
  };

  return (
    <DataContext.Provider value={{
      rooms,
      gallery,
      testimonials,
      heroImage,
      logoImage,
      activities,
      updateRoom,
      addRoom,
      deleteRoom,
      addGalleryPhoto,
      updateGalleryPhoto,
      deleteGalleryPhoto,
      addReview,
      updateReview,
      deleteReview,
      updateHeroImage,
      updateLogoImage,
      addActivity,
      updateActivity,
      deleteActivity,
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
