import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Room, Testimonial, Activity, OwnerInfo } from '../types';
import { HOTEL_INFO, ROOMS_DATA, GALLERY_SLIDES, TESTIMONIALS, ACTIVITIES_DATA, DEFAULT_OWNER_INFO } from '../data';
import dynamicConfig from '../hotel_orchid_dynamic_config.json';

const bConfig = (dynamicConfig as any) || {};
const INITIAL_ROOMS = (bConfig && bConfig.rooms) ? bConfig.rooms : ROOMS_DATA;
const INITIAL_GALLERY = (bConfig && bConfig.gallery) ? bConfig.gallery : GALLERY_SLIDES;
const INITIAL_TESTIMONIALS = (bConfig && bConfig.testimonials) ? bConfig.testimonials : TESTIMONIALS;
const INITIAL_HERO = (bConfig && bConfig.heroImage) ? bConfig.heroImage : HOTEL_INFO.images.hero;
const INITIAL_LOGO = (bConfig && bConfig.logoImage) ? bConfig.logoImage : HOTEL_INFO.images.logo;
const INITIAL_ACTIVITIES = (bConfig && bConfig.activities) ? bConfig.activities : ACTIVITIES_DATA;
const INITIAL_OWNER = (bConfig && bConfig.ownerInfo) ? bConfig.ownerInfo : DEFAULT_OWNER_INFO;
const configSignature = bConfig ? String(JSON.stringify(bConfig).length) : 'default';

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
  ownerInfo: OwnerInfo;
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
  updateOwnerInfo: (info: Partial<OwnerInfo>) => void;
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
  const isInitialRooms = useRef(true);
  const isInitialGallery = useRef(true);
  const isInitialTestimonials = useRef(true);
  const isInitialHero = useRef(true);
  const isInitialLogo = useRef(true);
  const isInitialActivities = useRef(true);
  const isInitialOwner = useRef(true);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return INITIAL_ROOMS.map((item: any) => {
        const cloned = { ...item };
        const ams = cloned.amenities ? [...cloned.amenities] : [];
        const hasWifi = ams.some((a: string) => {
          const l = a.toLowerCase();
          return l === 'wi-fi' || l === 'wifi' || l.includes('wi-fi') || l.includes('wifi');
        });
        if (!hasWifi) {
          ams.push("Free Wi-Fi");
        } else {
          const idx = ams.findIndex((a: string) => {
            const l = a.toLowerCase();
            return l === 'wi-fi' || l === 'wifi';
          });
          if (idx !== -1) {
            ams[idx] = "Free Wi-Fi";
          }
        }

        const hasShower = ams.some((a: string) => {
          const l = a.toLowerCase();
          return l.includes('shower') || l.includes('hot and cold');
        });
        if (!hasShower) {
          ams.push("Hot and cold shower 24/7");
        }

        cloned.amenities = ams;
        return cleanObjectPaths(cloned);
      });
    }
    const saved = localStorage.getItem('hotel_orchid_rooms');
    let parsed = saved ? JSON.parse(saved) : INITIAL_ROOMS;
    parsed = parsed.map((item: any) => {
      const cloned = { ...item };
      const ams = cloned.amenities ? [...cloned.amenities] : [];
      
      const hasWifi = ams.some((a: string) => {
        const l = a.toLowerCase();
        return l === 'wi-fi' || l === 'wifi' || l.includes('wi-fi') || l.includes('wifi');
      });
      if (!hasWifi) {
        ams.push("Free Wi-Fi");
      } else {
        const idx = ams.findIndex((a: string) => {
          const l = a.toLowerCase();
          return l === 'wi-fi' || l === 'wifi';
        });
        if (idx !== -1) {
          ams[idx] = "Free Wi-Fi";
        }
      }

      const hasShower = ams.some((a: string) => {
        const l = a.toLowerCase();
        return l.includes('shower') || l.includes('hot and cold');
      });
      if (!hasShower) {
        ams.push("Hot and cold shower 24/7");
      }

      cloned.amenities = ams;
      return cleanObjectPaths(cloned);
    });
    return parsed;
  });

  const [gallery, setGallery] = useState<GallerySlide[]>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return INITIAL_GALLERY.map((item: any) => cleanObjectPaths(item));
    }
    const saved = localStorage.getItem('hotel_orchid_gallery');
    const parsed = saved ? JSON.parse(saved) : INITIAL_GALLERY;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return INITIAL_TESTIMONIALS.map((item: any) => cleanObjectPaths(item));
    }
    const saved = localStorage.getItem('hotel_orchid_testimonials');
    const parsed = saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return cleanPath(INITIAL_HERO, HOTEL_INFO.images.hero);
    }
    const saved = localStorage.getItem('hotel_orchid_hero_image');
    return cleanPath(saved || '', INITIAL_HERO);
  });

  const [logoImage, setLogoImage] = useState<string>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return cleanPath(INITIAL_LOGO, HOTEL_INFO.images.logo);
    }
    const saved = localStorage.getItem('hotel_orchid_logo_image');
    if (saved && saved.includes('brand_logo')) {
      return HOTEL_INFO.images.logo;
    }
    return cleanPath(saved || '', INITIAL_LOGO);
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return INITIAL_ACTIVITIES.map((item: any) => cleanObjectPaths(item));
    }
    const saved = localStorage.getItem('hotel_orchid_activities');
    const parsed = saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    return parsed.map((item: any) => cleanObjectPaths(item));
  });

  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>(() => {
    const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
    if (activeSignature !== configSignature) {
      return INITIAL_OWNER;
    }
    const saved = localStorage.getItem('hotel_orchid_owner_info');
    let parsed = INITIAL_OWNER;
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        if (loaded && typeof loaded === 'object' && loaded.name) {
          const defaultAchs = INITIAL_OWNER.achievements || [];
          const loadedAchs = loaded.achievements || [];
          
          let mergedAchs = loadedAchs.map((ach: any) => {
            const defAch = defaultAchs.find(d => d.id === ach.id);
            const isBrokenImage = !ach.image || ach.image.length < 15 || ach.image.includes('/src/') || ach.image.includes('../') || ach.image.includes('undefined');
            return {
              ...ach,
              image: isBrokenImage ? (defAch ? defAch.image : "") : ach.image
            };
          });

          defaultAchs.forEach(defAch => {
            if (!mergedAchs.some((a: any) => a.id === defAch.id)) {
              mergedAchs.push(defAch);
            }
          });

          parsed = {
            ...INITIAL_OWNER,
            ...loaded,
            achievements: mergedAchs
          };
        }
      } catch {}
    }
    return parsed;
  });

  // Sync with LocalStorage
  useEffect(() => {
    if (isInitialRooms.current) {
      isInitialRooms.current = false;
      return;
    }
    safeSetItem('hotel_orchid_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (isInitialGallery.current) {
      isInitialGallery.current = false;
      return;
    }
    safeSetItem('hotel_orchid_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    if (isInitialTestimonials.current) {
      isInitialTestimonials.current = false;
      return;
    }
    safeSetItem('hotel_orchid_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    if (isInitialHero.current) {
      isInitialHero.current = false;
      return;
    }
    safeSetItem('hotel_orchid_hero_image', heroImage);
  }, [heroImage]);

  useEffect(() => {
    if (isInitialLogo.current) {
      isInitialLogo.current = false;
      return;
    }
    safeSetItem('hotel_orchid_logo_image', logoImage);
  }, [logoImage]);

  useEffect(() => {
    if (isInitialActivities.current) {
      isInitialActivities.current = false;
      return;
    }
    safeSetItem('hotel_orchid_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    if (isInitialOwner.current) {
      isInitialOwner.current = false;
      return;
    }
    safeSetItem('hotel_orchid_owner_info', JSON.stringify(ownerInfo));
  }, [ownerInfo]);

  // Save the signature to confirm we have synced the configuration
  useEffect(() => {
    // Try to fetch custom layout from public folder dynamic configuration
    fetch('/hotel_orchid_dynamic_config.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No public config file on root');
      })
      .then(fetchedConfig => {
        if (fetchedConfig && typeof fetchedConfig === 'object') {
          console.log("[DataContext] Fetched public root config:", fetchedConfig);
          
          const fetchedSignature = String(JSON.stringify(fetchedConfig).length);
          const activeSignature = localStorage.getItem('hotel_orchid_loaded_config_signature');
          
          if (activeSignature !== fetchedSignature) {
            console.log("[DataContext] Dynamic mismatch on fetched config. Resetting state values from config.json...");
            
            if (fetchedConfig.rooms) setRooms(fetchedConfig.rooms);
            if (fetchedConfig.gallery) setGallery(fetchedConfig.gallery);
            if (fetchedConfig.testimonials) setTestimonials(fetchedConfig.testimonials);
            if (fetchedConfig.heroImage) setHeroImage(fetchedConfig.heroImage);
            if (fetchedConfig.logoImage) setLogoImage(fetchedConfig.logoImage);
            if (fetchedConfig.activities) setActivities(fetchedConfig.activities);
            if (fetchedConfig.ownerInfo) setOwnerInfo(cleanObjectPaths(fetchedConfig.ownerInfo));
            
            localStorage.setItem('hotel_orchid_loaded_config_signature', fetchedSignature);
          }
        }
      })
      .catch(err => {
        console.log("[DataContext] Using bundled configuration:", err.message);
        localStorage.setItem('hotel_orchid_loaded_config_signature', configSignature);
      });
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

  const updateOwnerInfo = (updatedFields: Partial<OwnerInfo>) => {
    setOwnerInfo(prev => ({ ...prev, ...updatedFields }));
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all modifications to default values? This will override all updates.')) {
      isInitialRooms.current = true;
      isInitialGallery.current = true;
      isInitialTestimonials.current = true;
      isInitialHero.current = true;
      isInitialLogo.current = true;
      isInitialActivities.current = true;
      isInitialOwner.current = true;

      localStorage.removeItem('hotel_orchid_rooms');
      localStorage.removeItem('hotel_orchid_gallery');
      localStorage.removeItem('hotel_orchid_testimonials');
      localStorage.removeItem('hotel_orchid_hero_image');
      localStorage.removeItem('hotel_orchid_logo_image');
      localStorage.removeItem('hotel_orchid_activities');
      localStorage.removeItem('hotel_orchid_owner_info');

      setRooms(INITIAL_ROOMS);
      setGallery(INITIAL_GALLERY);
      setTestimonials(INITIAL_TESTIMONIALS);
      setHeroImage(INITIAL_HERO);
      setLogoImage(INITIAL_LOGO);
      setActivities(INITIAL_ACTIVITIES);
      setOwnerInfo(INITIAL_OWNER);
      localStorage.setItem('hotel_orchid_loaded_config_signature', configSignature);
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
      ownerInfo,
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
      updateOwnerInfo,
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
