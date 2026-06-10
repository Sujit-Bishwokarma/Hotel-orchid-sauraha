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

const cleanPath = (pathString: string, defaultValue: string): string => {
  if (!pathString) return defaultValue;
  if (pathString.startsWith('data:image')) return pathString; // Keep uploaded Base64 image
  if (pathString.includes('/src/') || pathString.includes('../')) {
    const match = pathString.match(/(?:src|assets)\/images\/(.+)$/);
    if (match) {
      return `/assets/images/${match[1]}`;
    }
    return defaultValue;
  }
  return pathString;
};

const cleanObjectPaths = <T extends Record<string, any>>(obj: T): T => {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      const val = result[key] as string;
      if (val.includes('/src/') || val.includes('../')) {
        result[key] = cleanPath(val, val) as any;
      }
    }
  }
  return result;
};

// Image optimization compression helper to handle heavy base64 strings gracefully on load
const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 1000, quality = 0.65): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

const compressObjectImages = async <T extends Record<string, any>>(obj: T): Promise<T> => {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      const val = result[key] as string;
      if (val.startsWith('data:image')) {
        try {
          result[key] = (await compressImage(val, 1000, 1000, 0.65)) as any;
        } catch (err) {
          console.warn("[DataContext] Image load-time compression failed slightly:", err);
        }
      }
    }
  }
  return result;
};

const compressArrayImages = async <T extends Record<string, any>>(arr: T[]): Promise<T[]> => {
  if (!arr || !Array.isArray(arr)) return arr;
  const promises = arr.map(item => compressObjectImages(item));
  return Promise.all(promises);
};

let lastAlertTime = 0;

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`[LocalStorage Sync Error] Failed to write key "${key}":`, error);
    
    const isQuotaError = 
      (error instanceof DOMException &&
        (error.name === 'QuotaExceededError' ||
         error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
         error.code === 22 ||
         error.code === 1014)) ||
      (error instanceof Error && error.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      const now = Date.now();
      // Only alert once every 10 seconds to prevent rendering freeze-loops inside the iframe
      if (now - lastAlertTime > 10000) {
        lastAlertTime = now;
        try {
          alert(
            "⚠️ Browser Storage Quota Exceeded!\n\nThe picture or layout you updated is too large for the browser's local sandbox storage (5MB limit across all data).\n\nTo prevent this, the website now automatically compresses images you upload to make them lightweight (often under 80KB). Try uploading a fresh image to replace the large one!"
          );
        } catch (alertErr) {
          console.warn("[LocalStorage Alert Blocked] Could not show alert in iframe sandbox:", alertErr);
        }
      }
    } else {
      console.warn(`[LocalStorage Error] Sync failed for "${key}" to avoid page freeze.`);
    }
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_rooms');
    const parsed = saved ? JSON.parse(saved) : ROOMS_DATA;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [gallery, setGallery] = useState<GallerySlide[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_gallery');
    const parsed = saved ? JSON.parse(saved) : GALLERY_SLIDES;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_testimonials');
    const parsed = saved ? JSON.parse(saved) : TESTIMONIALS;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    const saved = localStorage.getItem('hotel_orchid_hero_image');
    return cleanPath(saved || '', HOTEL_INFO.images.hero);
  });

  const [logoImage, setLogoImage] = useState<string>(() => {
    const saved = localStorage.getItem('hotel_orchid_logo_image');
    if (saved && saved.includes('brand_logo')) {
      return HOTEL_INFO.images.logo;
    }
    return cleanPath(saved || '', HOTEL_INFO.images.logo);
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('hotel_orchid_activities');
    const parsed = saved ? JSON.parse(saved) : ACTIVITIES_DATA;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  // Sync with LocalStorage
  useEffect(() => {
    safeSetItem('hotel_orchid_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    safeSetItem('hotel_orchid_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    safeSetItem('hotel_orchid_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    safeSetItem('hotel_orchid_hero_image', heroImage);
  }, [heroImage]);

  useEffect(() => {
    safeSetItem('hotel_orchid_logo_image', logoImage);
  }, [logoImage]);

  useEffect(() => {
    safeSetItem('hotel_orchid_activities', JSON.stringify(activities));
  }, [activities]);

  // Dynamically fetch published config file from server / public directory on first load
  useEffect(() => {
    const fetchPublishedConfig = async () => {
      try {
        const response = await fetch('/hotel_orchid_dynamic_config.json');
        if (response.ok) {
          const parsed = await response.json();
          if (parsed && typeof parsed === 'object' && parsed.rooms && parsed.gallery && parsed.testimonials) {
            console.log('[CPanel Sync] Found live server configuration file. Applying updates globally...');
            
            // Check if user is the admin actively working on draft updates in their cPanel module
            const isAuthorizedAdmin = localStorage.getItem('hotel_orchid_admin_authorized') === 'true';
            
            // If the local user is a regular visitor (or has empty storage), apply server truth
            if (!isAuthorizedAdmin) {
              const optRooms = await compressArrayImages(parsed.rooms.map((item: any) => cleanObjectPaths(item)));
              const optGallery = await compressArrayImages(parsed.gallery.map((item: any) => cleanObjectPaths(item)));
              const optTestimonials = await compressArrayImages(parsed.testimonials.map((item: any) => cleanObjectPaths(item)));

              setRooms(optRooms);
              setGallery(optGallery);
              setTestimonials(optTestimonials);

              if (parsed.activities) {
                const optActivities = await compressArrayImages(parsed.activities.map((item: any) => cleanObjectPaths(item)));
                setActivities(optActivities);
              }
              if (parsed.heroImage) {
                const optHero = await compressImage(parsed.heroImage, 1000, 1000, 0.65);
                setHeroImage(cleanPath(optHero, HOTEL_INFO.images.hero));
              }
              if (parsed.logoImage) {
                const optLogo = await compressImage(parsed.logoImage, 300, 300, 0.65);
                setLogoImage(cleanPath(optLogo, HOTEL_INFO.images.logo));
              }
            }
          }
        }
      } catch (err) {
        // Silent catch: file simply doesn't exist yet in the hosted location
        console.log('[CPanel Sync] Dynamic configuration file not found in public directory. Falling back to default bundle.');
      }
    };
    
    fetchPublishedConfig();
  }, []);

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
