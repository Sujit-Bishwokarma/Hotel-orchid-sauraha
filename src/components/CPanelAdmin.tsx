import React, { useState, useRef } from 'react';
import { 
  X, LayoutGrid, Bed, Images, MessageSquare, 
  Settings, RotateCcw, Plus, Trash2, Edit2, 
  Upload, Check, ShieldAlert, Download, Save, 
  HelpCircle, Star, Sparkles, MapPin, DollarSign, Lock,
  Compass, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Room } from '../types';

interface CPanelAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => void;
}

type TabType = 'dashboard' | 'rooms' | 'gallery' | 'reviews' | 'activities' | 'owner' | 'cpanel-info';

export default function CPanelAdmin({ isOpen, onClose, onSignOut }: CPanelAdminProps) {
  const {
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
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Room State
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [roomForm, setRoomForm] = useState<Partial<Room>>({});

  // Gallery Form State
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    image: '',
    title: '',
    caption: ''
  });

  // Review Form State
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    location: '',
    rating: 5,
    content: ''
  });

  // Activity Form State
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Compress uploaded images dynamically to prevent localStorage QuotaExceededError
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

  // File Upload Handlers (converts image files to base64 strings so they persist locally)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Auto-compressor allows handling larger original photos up to 10MB with ease!
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is extremely large (above 10MB). Please select a file under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        compressImage(rawBase64, 1000, 1000, 0.65)
          .then((compressedUrl) => {
            callback(compressedUrl);
          })
          .catch((err) => {
            console.error("[CPanel] Image compression failed, fallback to original:", err);
            callback(rawBase64);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  // ROOM ACTIONS
  const handleEditRoomClick = (room: Room) => {
    setEditingRoomId(room.id);
    setIsAddingRoom(false);
    setRoomForm(room);
  };

  const handleAddRoomClick = () => {
    setIsAddingRoom(true);
    setEditingRoomId(null);
    setRoomForm({
      name: '',
      basePriceNPR: 2500,
      bedType: '1 King Bed',
      size: '32 m²',
      description: 'Spacious serene room offering custom comfortable bedding, modern high-end amenities, and warm ambient decor.',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
      capacity: 2,
      amenities: ['Wi-Fi', 'Air Conditioning', 'Room Service', 'Flat-screen TV']
    });
  };

  const handleSaveRoom = (roomId: string) => {
    if (!roomForm.name || !roomForm.basePriceNPR) {
      alert("Please fill in Room Name and Base Price.");
      return;
    }
    try {
      updateRoom(roomId, roomForm);
      setEditingRoomId(null);
      showNotification("Room prices and specifications updated successfully!");
    } catch (error) {
      console.error("[CPanel Error] Failed to update room:", error);
      alert(`⚠️ Failed to update room details: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSaveNewRoom = () => {
    if (!roomForm.name || !roomForm.basePriceNPR) {
      alert("Please fill in Room Name and Base Price.");
      return;
    }
    try {
      const safeRoom: Omit<Room, 'id'> = {
        name: roomForm.name || 'New Room Sanctuary',
        description: roomForm.description || '',
        image: roomForm.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
        basePriceNPR: roomForm.basePriceNPR || 2500,
        capacity: roomForm.capacity || 2,
        amenities: roomForm.amenities || ['Wi-Fi', 'Air Conditioning', 'Room Service'],
        bedType: roomForm.bedType || '1 King Bed',
        size: roomForm.size || '32 m²'
      };
      addRoom(safeRoom);
      setIsAddingRoom(false);
      setRoomForm({});
      showNotification("New room sanctuary added successfully!");
    } catch (error) {
      console.error("[CPanel Error] Failed to save new room:", error);
      alert(`⚠️ Failed to create new room: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDeleteRoomClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this room? This is permanent unless you reset to default.")) {
      try {
        deleteRoom(id);
        showNotification("Room sanctuary removed successfully.");
      } catch (error) {
        console.error("[CPanel Error] Failed to delete room:", error);
        alert(`⚠️ Failed to delete room: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // GALLERY ACTIONS
  const handleSaveGallery = () => {
    if (!galleryForm.image || !galleryForm.title) {
      alert("Please provide at least an image reference and title.");
      return;
    }

    try {
      if (editingGalleryId) {
        updateGalleryPhoto(editingGalleryId, galleryForm);
        setEditingGalleryId(null);
        showNotification("Gallery slide updated successfully!");
      } else {
        addGalleryPhoto(galleryForm);
        setIsAddingGallery(false);
        showNotification("New photo added to your dynamic Gallery!");
      }
      // Reset Form on successful save only
      setGalleryForm({ image: '', title: '', caption: '' });
    } catch (error) {
      console.error("[CPanel Error] Failed to save gallery photo:", error);
      alert(`⚠️ Failed to save gallery photo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEditGalleryClick = (photo: any) => {
    setEditingGalleryId(photo.id);
    setGalleryForm({
      image: photo.image,
      title: photo.title,
      caption: photo.caption
    });
    setIsAddingGallery(false);
  };

  const handleDeleteGalleryClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery photo?")) {
      try {
        deleteGalleryPhoto(id);
        showNotification("Gallery photo removed.");
      } catch (error) {
        console.error("[CPanel Error] Failed to delete gallery photo:", error);
        alert(`⚠️ Failed to delete photo: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // REVIEWS ACTIONS
  const handleSaveReview = () => {
    if (!reviewForm.author || !reviewForm.content) {
      alert("Please provide the Guest Name and Review Comment.");
      return;
    }

    try {
      if (editingReviewId) {
        updateReview(editingReviewId, reviewForm);
        setEditingReviewId(null);
        showNotification("Review updated successfully!");
      } else {
        addReview(reviewForm);
        setIsAddingReview(false);
        showNotification("Thank you! New guest testimonial added successfully.");
      }
      // Reset Form on successful save only
      setReviewForm({ author: '', location: '', rating: 5, content: '' });
    } catch (error) {
      console.error("[CPanel Error] Failed to save review:", error);
      alert(`⚠️ Failed to save review: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEditReviewClick = (rev: any) => {
    setEditingReviewId(rev.id);
    setReviewForm({
      author: rev.author,
      location: rev.location,
      rating: rev.rating,
      content: rev.content
    });
    setIsAddingReview(false);
  };

  const handleDeleteReviewClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      try {
        deleteReview(id);
        showNotification("Review deleted successfully.");
      } catch (error) {
        console.error("[CPanel Error] Failed to delete review:", error);
        alert(`⚠️ Failed to delete review: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // ACTIVITIES ACTIONS
  const handleEditActivityClick = (act: any) => {
    setEditingActivityId(act.id);
    setIsAddingActivity(false);
    setActivityForm({
      name: act.name,
      description: act.description,
      image: act.image
    });
  };

  const handleAddActivityClick = () => {
    setIsAddingActivity(true);
    setEditingActivityId(null);
    setActivityForm({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
    });
  };

  const handleSaveActivity = () => {
    if (!activityForm.name || !activityForm.description) {
      alert("Please fill in the Activity Name and Description.");
      return;
    }

    try {
      if (editingActivityId) {
        updateActivity(editingActivityId, activityForm);
        setEditingActivityId(null);
        showNotification("Activity specifications updated successfully!");
      } else {
        addActivity(activityForm);
        setIsAddingActivity(false);
        showNotification("New Orchid activity registered successfully!");
      }
      // Reset Form on successful save only
      setActivityForm({ name: '', description: '', image: '' });
    } catch (error) {
      console.error("[CPanel Error] Failed to save activity:", error);
      alert(`⚠️ Failed to save activity details: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDeleteActivityClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity? This is permanent unless you reset to default.")) {
      try {
        deleteActivity(id);
        showNotification("Activity removed successfully.");
      } catch (error) {
        console.error("[CPanel Error] Failed to delete activity:", error);
        alert(`⚠️ Failed to delete activity: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // CPANEL PORTABILITY EXPORT / IMPORT
  const handleExportDataForcPanel = () => {
    try {
      const backup = {
        rooms,
        gallery,
        testimonials,
        heroImage,
        logoImage,
        activities,
        ownerInfo,
        exportedAt: new Date().toISOString(),
        host: "bisup_hosting_cpanel"
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", blobUrl);
      downloadAnchor.setAttribute("download", "hotel_orchid_dynamic_config.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(blobUrl);
      
      showNotification("Configuration file exported! Store this inside your dynamic document folders.");
    } catch (err) {
      console.error("[CPanel Error] Export failed:", err);
      alert(`⚠️ Failed to export layout configuration: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleImportDataForcPanel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onerror = (evt) => {
        console.error("[CPanel Info] FileReader error:", evt);
        alert("⚠️ Failed to read the selected file from disk.");
      };
      
      reader.onload = (event) => {
        try {
          let text = event.target?.result as string;
          if (!text) {
            alert("⚠️ The uploaded file appears to be empty.");
            return;
          }

          // Strip Byte Order Mark (BOM) if present in the text
          if (text.charCodeAt(0) === 0xFEFF) {
            text = text.substring(1);
          }
          text = text.trim();

          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch (jsonErr) {
            console.error("[CPanel Error] JSON parsing failed on contents:", text);
            console.error(jsonErr);
            alert(`⚠️ Could not parse JSON. Check file encoding or structure.\nDetail: ${jsonErr instanceof Error ? jsonErr.message : String(jsonErr)}`);
            return;
          }

          if (parsed && typeof parsed === "object" && parsed.rooms && parsed.gallery && parsed.testimonials) {
            try {
              localStorage.setItem('hotel_orchid_rooms', JSON.stringify(parsed.rooms));
              localStorage.setItem('hotel_orchid_gallery', JSON.stringify(parsed.gallery));
              localStorage.setItem('hotel_orchid_testimonials', JSON.stringify(parsed.testimonials));
              
              if (parsed.activities) {
                localStorage.setItem('hotel_orchid_activities', JSON.stringify(parsed.activities));
              }
              if (parsed.heroImage) {
                localStorage.setItem('hotel_orchid_hero_image', parsed.heroImage);
              }
              if (parsed.logoImage) {
                localStorage.setItem('hotel_orchid_logo_image', parsed.logoImage);
              }
              if (parsed.ownerInfo) {
                localStorage.setItem('hotel_orchid_owner_info', JSON.stringify(parsed.ownerInfo));
              }
              
              showNotification("Database configuration imported successfully!");
              setTimeout(() => {
                window.location.reload(); // Force refresh to re-initialize dynamic states
              }, 1200);
            } catch (storageErr) {
              console.error("[CPanel Error] LocalStorage quota exceeded:", storageErr);
              alert(`⚠️ Failed to restore configuration to browser memory.\nThis usually happens when image files configured inside the JSON are excessively large.\nError: ${storageErr instanceof Error ? storageErr.message : String(storageErr)}`);
            }
          } else {
            console.error("[CPanel Error] Decoded JSON structure is missing fields:", parsed);
            alert("⚠️ Invalid file structure. The uploaded JSON must contain 'rooms', 'gallery', and 'testimonials' keys.");
          }
        } catch (generalErr) {
          console.error("[CPanel Error] Unexpected import error:", generalErr);
          alert(`⚠️ An unexpected error occurred while restoring: ${generalErr instanceof Error ? generalErr.message : String(generalErr)}`);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-ocean-950/80 backdrop-blur-md overflow-hidden">
      
      {/* Container holding the admin controls */}
      <motion.div 
        id="cpanel-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full h-full sm:h-[85vh] sm:max-w-6xl bg-stone-900 text-stone-100 flex flex-col rounded-none sm:rounded-md shadow-2xl border border-stone-800 overflow-hidden"
      >
        
        {/* Header - cPanel Branding */}
        <div className="bg-stone-950 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-sm bg-coral-500 flex items-center justify-center text-sand-50 shadow-md">
              <Settings size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-lg font-bold tracking-wider text-sand-50 flex items-center gap-1.5">
                  ORCHID <span className="bg-coral-500/10 text-coral-400 border border-coral-500/20 px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-widest rounded-sm">cPanel v4.2</span>
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-stone-400">
                Dynamic Admin Controls • Bisup Hosting Cloud Invariant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onSignOut && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to sign out and lock this administrator console? This will hide the cPanel buttons from standard viewer layouts.")) {
                    onSignOut();
                  }
                }}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-100 hover:text-white text-xs font-mono rounded-sm flex items-center gap-1.5 transition-colors border border-red-900/50"
                title="Sign out of Admin Session and hide cPanel console shortcut buttons"
              >
                <Lock size={13} className="text-red-400" />
                <span>Lock Console</span>
              </button>
            )}
            <button
               onClick={resetToDefault}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-sm flex items-center gap-1.5 transition-colors border border-stone-700"
              title="Reset all content to original default package"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-850 transition-colors focus:outline-none rounded-full"
              aria-label="Close Portal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-800 text-emerald-100 px-6 py-2.5 text-xs font-mono font-semibold flex items-center space-x-2 shadow-inner"
            >
              <Check size={14} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Layout Split */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Navigation Rails */}
          <div className="w-full md:w-64 bg-stone-950 border-r border-stone-850 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
            
            <button
              onClick={() => { setActiveTab('dashboard'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'dashboard'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <LayoutGrid size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('rooms'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'rooms'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <Bed size={16} />
              <span>Room Control</span>
            </button>

            <button
              onClick={() => { setActiveTab('gallery'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'gallery'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <Images size={16} />
              <span>Gallery Control</span>
            </button>

            <button
              onClick={() => { setActiveTab('reviews'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'reviews'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <MessageSquare size={16} />
              <span>Guest Reviews</span>
            </button>

            <button
              onClick={() => { setActiveTab('activities'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'activities'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <Compass size={16} />
              <span>Activities Control</span>
            </button>

            <button
              onClick={() => { setActiveTab('owner'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'owner'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <Award size={16} className="text-coral-400" />
              <span>Meet Our Owner</span>
            </button>

            <button
              onClick={() => { setActiveTab('cpanel-info'); }}
              className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 text-xs tracking-wider uppercase font-mono border-b md:border-b-0 md:border-r-4 transition-all w-auto md:w-full text-left font-bold ${
                activeTab === 'cpanel-info'
                  ? 'bg-stone-900 border-coral-500 text-coral-400'
                  : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/40'
              }`}
            >
              <HelpCircle size={16} />
              <span>Hosting Sync</span>
            </button>

          </div>

          {/* Right Contents Window */}
          <div className="flex-grow p-6 overflow-y-auto bg-stone-900/95 max-w-full">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="space-y-2 text-left">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Website Dynamic Status</h2>
                  <p className="text-xs sm:text-sm text-stone-400">
                    Your changes automatically push live and persist immediately. No build steps required on bisup hosting cPanel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-stone-950 p-6 rounded-sm border border-stone-850 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Active Habitations</span>
                      <span className="text-3xl font-serif font-bold text-sand-50">{rooms.length} Rooms</span>
                    </div>
                    <Bed size={32} className="text-coral-500 opacity-60" />
                  </div>

                  <div className="bg-stone-950 p-6 rounded-sm border border-stone-850 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Gallery Items</span>
                      <span className="text-3xl font-serif font-bold text-sand-50">{gallery.length} Photos</span>
                    </div>
                    <Images size={32} className="text-coral-500 opacity-60" />
                  </div>

                  <div className="bg-stone-950 p-6 rounded-sm border border-stone-850 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Active Testimonials</span>
                      <span className="text-3xl font-serif font-bold text-sand-50">{testimonials.length} Reviews</span>
                    </div>
                    <MessageSquare size={32} className="text-coral-500 opacity-60" />
                  </div>

                  <div className="bg-stone-950 p-6 rounded-sm border border-stone-850 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Chitwan Activities</span>
                      <span className="text-3xl font-serif font-bold text-sand-50">{activities.length} Active</span>
                    </div>
                    <Compass size={32} className="text-coral-500 opacity-60" />
                  </div>
                </div>

                {/* Hero Background Customizer */}
                <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-6 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-coral-500" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-sand-50">Hero Background Customization</h3>
                    </div>
                    <p className="text-xs text-stone-400">
                      Configure your main landing page background cover image. You can paste any online image URL or upload a beautiful local photograph.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Visual Preview */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Live Active Background Preview</span>
                      <div className="relative aspect-video rounded-sm overflow-hidden border border-stone-800 bg-stone-900 group">
                        <img
                          src={heroImage}
                          alt="Hero background preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[9px] font-mono bg-coral-500 text-sand-50 px-2 py-0.5 rounded-sm">
                            Active Stage Main Cover
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                      {/* Paste URL */}
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1.5">Paste Image URL</label>
                        <input
                          type="text"
                          value={heroImage}
                          onChange={(e) => {
                            updateHeroImage(e.target.value);
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-mono"
                        />
                      </div>

                      {/* Upload Picture File */}
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1.5">Or Upload Custom Image File (Max 2MB)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-4 py-2.5 bg-stone-800 hover:bg-stone-750 hover:text-sand-50 text-stone-200 text-xs font-mono rounded-sm border border-stone-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                            <Upload size={14} className="text-coral-400" />
                            <span>Select Local File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(e, (url) => {
                                  updateHeroImage(url);
                                  showNotification("Hero background photo changed successfully!");
                                });
                              }}
                            />
                          </label>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Auto compressed to dynamic system cache
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-coral-400 leading-relaxed font-sans bg-coral-500/5 p-3 rounded-sm border border-coral-500/10">
                        ✨ <strong>Pro Tip:</strong> High-resolution landscape shots of gardens, jungle sights, or wooden resort interiors (aspect ratio 16:9) work wonderfully as the welcome cover image!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Logo Customizer */}
                <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-6 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-coral-500" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-sand-50">Hotel Logo Customization</h3>
                    </div>
                    <p className="text-xs text-stone-400">
                      Configure your main brand logo icon shown in the top navigation header bar. You can paste any online image URL or upload a beautiful local graphic image.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Visual Preview */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Active Brand Logo Preview</span>
                      <div className="flex items-center justify-center p-6 rounded-sm border border-stone-800 bg-stone-900/50 w-full aspect-video">
                        <div className="relative w-24 h-24 overflow-hidden rounded-full border border-sand-300/30 bg-white shadow-xl flex-shrink-0 flex items-center justify-center">
                          <img
                            src={logoImage}
                            alt="Brand Logo Preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                      {/* Paste URL */}
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1.5">Paste Logo Image URL</label>
                        <input
                          type="text"
                          value={logoImage}
                          onChange={(e) => {
                            updateLogoImage(e.target.value);
                          }}
                          placeholder="https://example.com/logo.png"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-mono"
                        />
                      </div>

                      {/* Upload Picture File */}
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1.5">Or Upload Custom Logo Image (Max 2MB)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-4 py-2.5 bg-stone-800 hover:bg-stone-750 hover:text-sand-50 text-stone-200 text-xs font-mono rounded-sm border border-stone-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                            <Upload size={14} className="text-coral-400" />
                            <span>Select Brand Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(e, (url) => {
                                  updateLogoImage(url);
                                  showNotification("Brand logo photo changed successfully!");
                                });
                              }}
                            />
                          </label>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Square or round PNG works best
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-coral-400 leading-relaxed font-sans bg-coral-500/5 p-3 rounded-sm border border-coral-500/10">
                        ⭐️ <strong>Best Quality:</strong> A clean square visual logo with transparent or white background is recommended for premium visual appeal!
                      </div>
                    </div>
                  </div>
                </div>

                {/* cPanel Directives Instructions */}
                <div className="bg-stone-950/60 p-6 rounded-sm border border-stone-850 space-y-4 text-left">
                  <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase font-mono">
                    <ShieldAlert size={16} />
                    <span>Dynamic Live Synchronizer Invariant</span>
                  </div>
                  <div className="text-xs sm:text-sm text-stone-300 space-y-2 leading-relaxed">
                    <p>
                      This custom cPanel dashboard manages your dynamic client-side content. It integrates with <strong>localStorage data caches</strong> to maintain deep data persistence without loading slow database APIs.
                    </p>
                    <p>
                      When you host this website on your <strong>Bisup Hosting cPanel account</strong>, keep changes synchronized across devices by downloading the data envelope under the <strong>Hosting Sync</strong> tab. You can export a static backup JSON file and re-load it on other machines in seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ROOMS TAB */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Room Prices and Photos</h2>
                    <p className="text-xs sm:text-sm text-stone-400">Update the name, description, rate per night, size, and photo for each sanctuary.</p>
                  </div>

                  {!isAddingRoom && !editingRoomId && (
                    <button
                      onClick={handleAddRoomClick}
                      className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Plus size={14} />
                      <span>New Room</span>
                    </button>
                  )}
                </div>

                {/* Adding New Room Form Block */}
                {isAddingRoom && (
                  <div className="bg-stone-950 border border-coral-500/30 p-6 rounded-sm space-y-6 text-left">
                    <h3 className="font-serif text-md sm:text-lg font-bold text-coral-400">Create New Room Sanctuary</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Executive Suite Canopy"
                            value={roomForm.name || ''}
                            onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Price (NPR / Night)</label>
                          <input
                            type="number"
                            placeholder="2500"
                            value={roomForm.basePriceNPR || ''}
                            onChange={e => setRoomForm({ ...roomForm, basePriceNPR: parseInt(e.target.value) || 0 })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Bed Installation Typology</label>
                          <input
                            type="text"
                            placeholder="e.g., 1 King Bed"
                            value={roomForm.bedType || ''}
                            onChange={e => setRoomForm({ ...roomForm, bedType: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Dimensions (e.g., "32 m²")</label>
                          <input
                            type="text"
                            placeholder="e.g., 32 m²"
                            value={roomForm.size || ''}
                            onChange={e => setRoomForm({ ...roomForm, size: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Description Narrative</label>
                        <textarea
                          placeholder="Provide a wonderful description of this peaceful retreat space..."
                          value={roomForm.description || ''}
                          onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                          rows={3}
                          className="w-full bg-stone-900 border border-stone-750 p-2.5 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Photo Source (URL or Upload below)</label>
                          <input
                            type="text"
                            value={roomForm.image || ''}
                            onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm font-mono focus:outline-none focus:border-coral-500"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <label className="flex-grow flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-750 cursor-pointer pointer-events-auto border border-stone-700 py-2.5 px-3 rounded-sm transition-colors text-xs font-mono uppercase font-bold text-stone-200">
                            <Upload size={14} />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => handleFileUpload(e, (url) => setRoomForm({ ...roomForm, image: url }))}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex space-x-3 justify-end pt-4 border-t border-stone-850">
                        <button
                          onClick={() => {
                            setIsAddingRoom(false);
                            setRoomForm({});
                          }}
                          className="px-4 py-2 bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveNewRoom}
                          className="px-5 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                        >
                          <Save size={14} />
                          <span>Create Room</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {rooms.map(room => {
                    const isEditing = editingRoomId === room.id;

                    return (
                      <div key={room.id} className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-6 text-left">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Name</label>
                                <input
                                  type="text"
                                  value={roomForm.name || ''}
                                  onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                                  className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Price (NPR / Night)</label>
                                <input
                                  type="number"
                                  value={roomForm.basePriceNPR || 0}
                                  onChange={e => setRoomForm({ ...roomForm, basePriceNPR: parseInt(e.target.value) || 0 })}
                                  className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Bed Installation Typology</label>
                                <input
                                  type="text"
                                  value={roomForm.bedType || ''}
                                  onChange={e => setRoomForm({ ...roomForm, bedType: e.target.value })}
                                  className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                                />
                              </div>
                              <div>
                                <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Dimensions (e.g., "26 m²")</label>
                                <input
                                  type="text"
                                  value={roomForm.size || ''}
                                  onChange={e => setRoomForm({ ...roomForm, size: e.target.value })}
                                  className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Description Narrative</label>
                              <textarea
                                value={roomForm.description || ''}
                                onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                                rows={3}
                                className="w-full bg-stone-900 border border-stone-750 p-2.5 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                              <div>
                                <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Room Photo Source (URL or Upload below)</label>
                                <input
                                  type="text"
                                  value={roomForm.image || ''}
                                  onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                                  className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm font-mono focus:outline-none focus:border-coral-500"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <label className="flex-grow flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-750 cursor-pointer pointer-events-auto border border-stone-700 py-2.5 px-3 rounded-sm transition-colors text-xs font-mono uppercase font-bold text-stone-200">
                                  <Upload size={14} />
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleFileUpload(e, (url) => setRoomForm({ ...roomForm, image: url }))}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex space-x-3 justify-end pt-4 border-t border-stone-850">
                              <button
                                onClick={() => setEditingRoomId(null)}
                                className="px-4 py-2 bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveRoom(room.id)}
                                className="px-5 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                              >
                                <Save size={14} />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-48 h-32 bg-stone-900 border border-stone-800 rounded-sm overflow-hidden flex-shrink-0">
                              <img
                                src={room.image}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow flex flex-col justify-between space-y-4">
                              <div className="space-y-1.5">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-serif text-lg font-bold text-sand-50">{room.name}</h3>
                                  <span className="text-xl font-mono text-coral-400 font-bold">
                                    NPR {room.basePriceNPR.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex space-x-4 text-[10px] font-mono text-stone-400">
                                  <span>{room.size} Space</span>
                                  <span>•</span>
                                  <span>{room.bedType}</span>
                                </div>
                                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-sans">
                                  {room.description}
                                </p>
                              </div>

                              <div className="flex justify-end gap-3 pt-2">
                                <button
                                  onClick={() => handleDeleteRoomClick(room.id)}
                                  className="px-3 py-1.5 bg-stone-950 hover:bg-red-950/40 border border-stone-850 hover:border-red-900/40 text-stone-400 hover:text-red-200 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                                  title="Remove this room sanctuary"
                                >
                                  <Trash2 size={13} className="text-stone-500 hover:text-red-400" />
                                  <span>Delete Room</span>
                                </button>
                                <button
                                  onClick={() => handleEditRoomClick(room)}
                                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                                >
                                  <Edit2 size={13} className="text-coral-500" />
                                  <span>Edit Room</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Gallery Photographs</h2>
                    <p className="text-xs sm:text-sm text-stone-400">Add, edit, or remove photos displayed in the auto-crossfade swiper slider.</p>
                  </div>

                  {!isAddingGallery && !editingGalleryId && (
                    <button
                      onClick={() => {
                        setIsAddingGallery(true);
                        setGalleryForm({ image: '', title: '', caption: '' });
                      }}
                      className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>New Photo</span>
                    </button>
                  )}
                </div>

                {/* Adding or Editing Mode Form Block */}
                {(isAddingGallery || editingGalleryId) && (
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-4">
                    <h3 className="font-serif text-md font-bold text-coral-400">
                      {editingGalleryId ? 'Edit Gallery Slide' : 'Add New Photograph to Gallery'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Photograph Title</label>
                        <input
                          type="text"
                          value={galleryForm.title}
                          onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          placeholder="e.g., Sunset over Sauraha Gardens"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Short Caption</label>
                        <input
                          type="text"
                          value={galleryForm.caption}
                          onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                          placeholder="Brief architectural or natural context description"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                      <div className="sm:col-span-8">
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Image Asset (URL link or raw upload on right)</label>
                        <input
                          type="text"
                          value={galleryForm.image}
                          onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })}
                          placeholder="Paste an Unsplash image URL or click to upload"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 font-mono rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-750 cursor-pointer border border-stone-700 py-2.5 px-3 rounded-sm transition-colors text-xs font-mono uppercase font-bold text-stone-200">
                          <Upload size={14} />
                          <span>Attach Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileUpload(e, (url) => setGalleryForm({ ...galleryForm, image: url }))}
                          />
                        </label>
                      </div>
                    </div>

                    {galleryForm.image && (
                      <div className="mt-2 text-center">
                        <span className="block text-stone-500 text-[10px] font-mono mb-1">Asset Preview:</span>
                        <div className="h-40 max-w-sm mx-auto bg-stone-900 rounded-sm border border-stone-800 overflow-hidden">
                          <img
                            src={galleryForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3 justify-end pt-4 border-t border-stone-850">
                      <button
                        onClick={() => {
                          setIsAddingGallery(false);
                          setEditingGalleryId(null);
                        }}
                        className="px-4 py-2 bg-stone-850 hover:bg-stone-850 text-stone-300 text-xs font-mono uppercase tracking-wider rounded-sm border border-stone-750"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveGallery}
                        className="px-5 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                      >
                        <Save size={14} />
                        <span>Save Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* List Grid View of Gallery Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {gallery.map(photo => (
                    <div key={photo.id} className="bg-stone-950 border border-stone-850 rounded-sm overflow-hidden flex flex-col justify-between">
                      <div className="relative aspect-video bg-stone-900">
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-sand-50 line-clamp-1">{photo.title}</h4>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed min-h-[32px] mt-1">
                            {photo.caption || 'No description provided.'}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-stone-850 mt-4">
                          <button
                            onClick={() => handleEditGalleryClick(photo)}
                            className="p-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 rounded-sm transition-colors hover:text-coral-400"
                            title="Edit Title / Image"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryClick(photo.id)}
                            className="p-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 rounded-sm transition-colors hover:text-red-400"
                            title="Remove Photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Customer Reviews</h2>
                    <p className="text-xs sm:text-sm text-stone-400">Manage real guest feedback, edit ratings, or insert new recommendations manually.</p>
                  </div>

                  {!isAddingReview && !editingReviewId && (
                    <button
                      onClick={() => {
                        setIsAddingReview(true);
                        setReviewForm({ author: '', location: '', rating: 5, content: '' });
                      }}
                      className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Review</span>
                    </button>
                  )}
                </div>

                {/* Input review block */}
                {(isAddingReview || editingReviewId) && (
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-4">
                    <h3 className="font-serif text-md font-bold text-coral-400">
                      {editingReviewId ? 'Edit Review Data' : 'Insert Guest Recommendation'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Guest Name</label>
                        <input
                          type="text"
                          value={reviewForm.author}
                          onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })}
                          placeholder="e.g., Alexandra Jenkins"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Location / Country</label>
                        <input
                          type="text"
                          value={reviewForm.location}
                          onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })}
                          placeholder="e.g., Melbourne, Australia"
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Rating Rating (1-5 Star Selection)</label>
                        <select
                          value={reviewForm.rating}
                          onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) || 5 })}
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                        >
                          <option value={5}>5 Stars - Outstanding</option>
                          <option value={4}>4 Stars - Very Good</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Poor Quality</option>
                          <option value={1}>1 Star - Critical Concern</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Review Testimony Content</label>
                      <textarea
                        value={reviewForm.content}
                        onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })}
                        rows={3}
                        placeholder="Write out parent details or direct translations of client feedback..."
                        className="w-full bg-stone-900 border border-stone-750 p-2.5 text-sm text-stone-100 rounded-sm focus:outline-none focus:border-coral-500"
                      />
                    </div>

                    <div className="flex space-x-3 justify-end pt-4 border-t border-stone-850">
                      <button
                        onClick={() => {
                          setIsAddingReview(false);
                          setEditingReviewId(null);
                        }}
                        className="px-4 py-2 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-mono uppercase tracking-wider rounded-sm border border-stone-750"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveReview}
                        className="px-5 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                      >
                        <Save size={14} />
                        <span>Save Feedback</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* List Content */}
                <div className="space-y-4">
                  {testimonials.map(rev => (
                    <div key={rev.id} className="bg-stone-950 border border-stone-850 p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 bg-coral-500/10 border border-coral-500/20 text-coral-400 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0">
                          {rev.avatarLetter}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-serif font-bold text-sm text-sand-50">{rev.author}</h4>
                            <span className="text-[10px] text-stone-400">({rev.location})</span>
                          </div>
                          
                          {/* Rating Stars layout */}
                          <div className="flex space-x-0.5 text-coral-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={11} className="fill-coral-500" />
                            ))}
                          </div>

                          <p className="text-xs text-stone-300 leading-relaxed font-sans max-w-2xl pt-1">
                            &ldquo;{rev.content}&rdquo;
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col justify-end gap-2 border-t sm:border-t-0 p-2 sm:p-0 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditReviewClick(rev)}
                          className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1"
                        >
                          <Edit2 size={11} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteReviewClick(rev.id)}
                          className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-1 hover:text-red-400"
                        >
                          <Trash2 size={11} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CURATED ACTIVITIES TAB */}
            {activeTab === 'activities' && (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Local Activities Control</h2>
                    <p className="text-xs text-stone-400">Manage client adventures, safaris, and culture dances shown on the page.</p>
                  </div>
                  {!isAddingActivity && !editingActivityId && (
                    <button
                      onClick={handleAddActivityClick}
                      className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 font-mono text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 self-start transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Activity</span>
                    </button>
                  )}
                </div>

                {/* Adding / Editing Activity Form */}
                {(isAddingActivity || editingActivityId) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-stone-950 border border-stone-800 rounded-sm space-y-4"
                  >
                    <h3 className="font-serif text-md font-bold text-coral-400">
                      {editingActivityId ? 'Modify Activity Specifications' : 'Register New Chitwan Activity'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Activity Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Elephant Breeding Center Visit"
                            value={activityForm.name}
                            onChange={e => setActivityForm({ ...activityForm, name: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-800 focus:border-stone-700 text-sm p-2.5 rounded-sm text-stone-100 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Adventure Description</label>
                          <textarea
                            placeholder="Write comprehensive descriptions about this adventure..."
                            value={activityForm.description}
                            onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                            rows={3}
                            className="w-full bg-stone-900 border border-stone-800 focus:border-stone-700 text-sm p-2.5 rounded-sm text-stone-100 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-stone-400 text-xs font-mono uppercase mb-1">Activity Photo (Image URL or File Upload)</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Paste visual URL reference..."
                              value={activityForm.image}
                              onChange={e => setActivityForm({ ...activityForm, image: e.target.value })}
                              className="flex-1 bg-stone-900 border border-stone-800 focus:border-stone-700 text-sm p-2.5 rounded-sm text-stone-100 outline-none"
                            />
                            <label className="px-3 py-2 bg-stone-800 hover:bg-stone-700 cursor-pointer rounded-sm border border-stone-700 flex items-center gap-1.5 font-mono text-xs transition-colors text-stone-200">
                              <Upload size={14} />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileUpload(e, (url) => setActivityForm({ ...activityForm, image: url }))}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {activityForm.image && (
                          <div>
                            <span className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Visual Preview</span>
                            <div className="aspect-video relative rounded-sm overflow-hidden bg-stone-900 border border-stone-800">
                              <img
                                src={activityForm.image}
                                alt="Activity preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-900">
                      <button
                        onClick={() => {
                          setIsAddingActivity(false);
                          setEditingActivityId(null);
                          setActivityForm({ name: '', description: '', image: '' });
                        }}
                        className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-xs font-mono uppercase rounded-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveActivity}
                        className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-sand-50 font-mono text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save size={13} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* List of Registered Activities */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-stone-950 border border-stone-850 rounded-sm overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Img Banner */}
                        <div className="aspect-video bg-stone-900 overflow-hidden relative border-b border-stone-900">
                          <img
                            src={act.image}
                            alt={act.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Text */}
                        <div className="p-4 space-y-2 text-left">
                          <h4 className="font-serif text-base font-bold text-sand-50">
                            {act.name}
                          </h4>
                          <p className="text-xs text-stone-400 leading-relaxed font-sans line-clamp-3">
                            {act.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="border-t border-stone-900 p-3 bg-stone-950 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditActivityClick(act)}
                          className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-[10px] font-mono uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 size={10} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteActivityClick(act.id)}
                          className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-[10px] font-mono uppercase tracking-wider rounded-sm flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={10} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEET OUR OWNER TAB */}
            {activeTab === 'owner' && (
              <div className="space-y-6">
                <div className="space-y-1 text-left">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Meet Our Owner Section Control</h2>
                  <p className="text-xs sm:text-sm text-stone-400">
                    Update Jit Bahadur Tamang (Jitu)'s portfolio portrait photo, name, designation, biographical description, and change his historical timeline service cards.
                  </p>
                </div>

                <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-6 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Compass size={16} className="text-coral-500" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-sand-50">Primary Identity & Biography</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Portrait Image, Name, Role */}
                    <div className="lg:col-span-4 bg-stone-900/40 p-4 border border-stone-800 rounded-sm space-y-4">
                      <span className="block text-[10px] font-mono uppercase text-stone-400">Owner Profile Image</span>
                      
                      <div className="aspect-square w-full rounded-sm overflow-hidden border border-stone-750 bg-stone-900 relative">
                        {ownerInfo.photo ? (
                          <img 
                            src={ownerInfo.photo} 
                            alt="Owner Portrait" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-stone-600">
                            No Portrait Selected
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-sand-100">
                          Active Portrait
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-stone-400 text-[10px] font-mono uppercase mb-1">Owner Name</label>
                          <input 
                            type="text"
                            value={ownerInfo.name || ''}
                            onChange={(e) => updateOwnerInfo({ name: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 text-[10px] font-mono uppercase mb-1">Designation Title</label>
                          <input 
                            type="text"
                            value={ownerInfo.role || ''}
                            onChange={(e) => updateOwnerInfo({ role: e.target.value })}
                            className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Biography & Achievements Customizer */}
                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <label className="block text-stone-400 text-[10px] font-mono uppercase mb-1.5">Owner Photo URL</label>
                        <input
                          type="text"
                          value={ownerInfo.photo || ''}
                          onChange={(e) => updateOwnerInfo({ photo: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-750 p-2 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-mono"
                          placeholder="Or enter complete photo URL..."
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 text-xs font-mono uppercase mb-1.5">Or Upload Custom Portrait File (Auto-compressed to 600px)</label>
                        <div>
                          <label className="inline-flex px-4 py-2 bg-stone-800 hover:bg-stone-750 hover:text-sand-50 text-stone-200 text-xs font-mono rounded-sm border border-stone-700 cursor-pointer items-center gap-1.5 transition-colors">
                            <Upload size={14} className="text-coral-400" />
                            <span>Select Local Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(e, (url) => {
                                  updateOwnerInfo({ photo: url });
                                  showNotification("Owner portfolio portrait changed successfully!");
                                });
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-400 text-[10px] font-mono uppercase mb-1">Biography Narrative & Conservation Philosophy</label>
                        <textarea
                          rows={6}
                          value={ownerInfo.description || ''}
                          onChange={(e) => updateOwnerInfo({ description: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-750 p-2.5 text-xs text-stone-100 rounded-sm focus:outline-none focus:border-coral-500 font-sans leading-relaxed"
                          placeholder="Enter Chitwan conservation bio or owner biography info..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Achievements row customization */}
                  <div className="pt-6 border-t border-stone-850">
                    <span className="block text-xs font-mono uppercase text-coral-400 mb-4 font-bold">Historical Achievements Timeline Slider Cards (1 Row, 4 Cards)</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {(ownerInfo.achievements || []).map((ach, achIdx) => (
                        <div key={ach.id} className="bg-stone-900/60 p-3 border border-stone-800 rounded-sm space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                              <span className="text-[10px] font-mono text-stone-400">Card #{achIdx + 1}</span>
                              <span className="text-[10px] font-sans font-bold text-coral-500">Timeline State</span>
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-stone-400 uppercase mb-0.5">Service Period (e.g. 2074 to 2080)</label>
                              <input
                                type="text"
                                value={ach.period || ''}
                                onChange={(e) => {
                                  const nextAch = [...ownerInfo.achievements];
                                  nextAch[achIdx] = { ...nextAch[achIdx], period: e.target.value };
                                  updateOwnerInfo({ achievements: nextAch });
                                }}
                                className="w-full bg-stone-950 border border-stone-800 p-1.5 text-xs text-stone-100 rounded-sm focus:outline-none font-sans"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-stone-400 uppercase mb-0.5">Title / Association</label>
                              <input
                                type="text"
                                value={ach.title || ''}
                                onChange={(e) => {
                                  const nextAch = [...ownerInfo.achievements];
                                  nextAch[achIdx] = { ...nextAch[achIdx], title: e.target.value };
                                  updateOwnerInfo({ achievements: nextAch });
                                }}
                                className="w-full bg-stone-950 border border-stone-800 p-1.5 text-xs text-stone-100 rounded-sm focus:outline-none font-sans"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-stone-400 uppercase mb-0.5">Role Held (e.g. President)</label>
                              <input
                                type="text"
                                value={ach.role || ''}
                                onChange={(e) => {
                                  const nextAch = [...ownerInfo.achievements];
                                  nextAch[achIdx] = { ...nextAch[achIdx], role: e.target.value };
                                  updateOwnerInfo({ achievements: nextAch });
                                }}
                                className="w-full bg-stone-900 border border-stone-800 p-1.5 text-xs text-stone-100 rounded-sm focus:outline-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-stone-800">
                            <span className="block text-[9px] font-mono text-stone-500 uppercase">Card Background Image</span>
                            <div className="aspect-[4/3] w-full rounded-sm bg-stone-950 overflow-hidden border border-stone-850 relative">
                              {ach.image ? (
                                <img src={ach.image} alt={ach.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-600">
                                  No Image
                                </div>
                              )}
                            </div>

                            <input
                              type="text"
                              value={ach.image || ''}
                              placeholder="Photo URL"
                              onChange={(e) => {
                                const nextAch = [...ownerInfo.achievements];
                                nextAch[achIdx] = { ...nextAch[achIdx], image: e.target.value };
                                updateOwnerInfo({ achievements: nextAch });
                              }}
                              className="w-full bg-stone-950 border border-stone-850 p-1 text-[10px] text-stone-400 rounded-sm focus:outline-none font-mono"
                            />

                            <label className="w-full block text-center py-1 bg-stone-800 hover:bg-stone-750 text-stone-200 text-[10px] font-mono rounded-sm border border-stone-750 cursor-pointer transition-colors">
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  handleFileUpload(e, (url) => {
                                    const nextAch = [...ownerInfo.achievements];
                                    nextAch[achIdx] = { ...nextAch[achIdx], image: url };
                                    updateOwnerInfo({ achievements: nextAch });
                                    showNotification(`Achievement card #${achIdx + 1} photo uploaded!`);
                                  });
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CPANEL PORTABILITY TAB */}
            {activeTab === 'cpanel-info' && (
              <div className="space-y-8 text-left">
                <div className="space-y-1.5">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-50">Bisup Hosting cPanel Synchronization</h2>
                  <p className="text-xs sm:text-sm text-stone-400">Keep your dynamic data safe across development and production servers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Backup Card */}
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-4">
                    <div className="flex items-center space-x-2 text-coral-400">
                      <Download size={20} />
                      <h3 className="font-serif font-bold text-md text-sand-50">Backup Dynamic Envelope</h3>
                    </div>
                    <p className="text-xs text-stone-350 leading-relaxed">
                      Download the complete content payload (rooms, pricing models, gallery, ratings) as a structured <code>hotel_orchid_dynamic_config.json</code> file. You can back up this layout configuration or host it on your central servers.
                    </p>
                    <button
                      onClick={handleExportDataForcPanel}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-mono font-bold uppercase tracking-widest rounded-sm border border-stone-800 hover:border-stone-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      <span>Download config.json</span>
                    </button>
                  </div>

                  {/* Restore Card */}
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-sm space-y-4">
                    <div className="flex items-center space-x-2 text-amber-500">
                      <Save size={20} />
                      <h3 className="font-serif font-bold text-md text-sand-50">Restore Envelope Layout</h3>
                    </div>
                    <p className="text-xs text-stone-350 leading-relaxed">
                      Import a previously exported config database JSON. Uploading a valid config file replaces room photos, prices, reviews, and slides across all page structures immediately.
                    </p>
                    
                    <label className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-mono font-bold uppercase tracking-widest rounded-sm border border-stone-800 hover:border-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Upload size={14} />
                      <span>Upload config.json</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImportDataForcPanel}
                      />
                    </label>
                  </div>

                </div>

                <div className="bg-neutral-850 border border-neutral-800 p-6 rounded-sm space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-coral-400 text-sm mb-2">How to publish your changes on Vercel (Current setup):</h4>
                    <ol className="list-decimal pl-5 text-xs text-stone-300 space-y-2 leading-relaxed">
                      <li>Use the Admin panel controls above to visual-edit your rooms, reviews, activities, and layout details in your browser. (The updates will render on your screen instantly).</li>
                      <li>In the <strong>cPanel Synchronization</strong> tab (this section), click <strong className="text-coral-400">Download config.json</strong> to save your customized configuration file named <code className="bg-stone-900 px-1 py-0.5 rounded text-[11px] text-amber-400">hotel_orchid_dynamic_config.json</code>.</li>
                      <li>Place this downloaded file inside the <strong className="text-sand-100">/public</strong> folder of your React project code directory (so the final path is <code className="bg-stone-900 px-1 py-0.5 rounded text-[11px] text-amber-400">public/hotel_orchid_dynamic_config.json</code>).</li>
                      <li>Commit and push the file to your <strong className="text-sand-100">GitHub Repository</strong>.</li>
                      <li>Vercel will detect the new commit, build the app, and re-deploy. Your new rooms, pricing, ratings, and custom layouts will immediately load live for all visitors worldwide!</li>
                    </ol>
                  </div>

                  <div className="border-t border-neutral-800 pt-4">
                    <h4 className="font-serif font-bold text-amber-500 text-sm mb-2">How it works on Bisup Hosting / cPanel (Future setup):</h4>
                    <ol className="list-decimal pl-5 text-xs text-stone-305 space-y-2 leading-relaxed">
                      <li>Upload your static React website bundle (typically inside an archive like <code className="bg-stone-900 px-1 py-0.5 rounded text-[11px] text-amber-400">dist.zip</code>) directly to your cPanel's <strong className="text-sand-100">public_html</strong> directory and extract it there.</li>
                      <li>To update copy, pictures, or ratings on cPanel, simply access the Admin panel from any machine, click <strong className="text-amber-500">Restore Envelope Layout</strong> to upload your golden layout configuration file, or make changes directly on screen.</li>
                      <li>For instant automatic synchronization across all visitor browsers without committing code, you can use the File Manager in your Bisup Hosting cPanel dashboard to upload your updated <code className="bg-stone-900 px-1 py-0.5 rounded text-[11px]">hotel_orchid_dynamic_config.json</code> file straight to the root of your public folder.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </motion.div>

    </div>
  );
}
