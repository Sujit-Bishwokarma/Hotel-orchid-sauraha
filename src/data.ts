/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Room, Testimonial, AmenityItem, Activity, OwnerInfo } from './types';

// Static assets using direct premium Unsplash URLs for high performance and stability
const heroImg = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920";
const roomDeluxeImg = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200";
const roomSuiteImg = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200";
const restaurantImg = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200";
const logoImg = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300";

export const HOTEL_INFO = {
  name: "Hotel Orchid",
  subName: "Sauraha, Chitwan",
  tagline: "Your peaceful retreat in the heart of Sauraha",
  location: "Ratnanagar 44200, Chitwan, Nepal",
  address: "Ratnanagar 44200, Sauraha, Chitwan, Nepal",
  phone: "985-5080337",
  email: "hotelorchid2017@gmail.com",
  about: "We are a simple, nature-friendly hotel in Sauraha offering clean, comfortable rooms and friendly local service close to Chitwan National Park.",
  images: {
    hero: heroImg,
    logo: logoImg,
    roomDeluxe: roomDeluxeImg,
    roomSuite: roomSuiteImg,
    restaurant: restaurantImg
  }
};

export const HOTEL_HIGHLIGHTS = [
  {
    id: "h1",
    title: "Prime Sauraha Location",
    description: "Nestled in the peaceful, scenic heart of Sauraha, we are just a short walk away from the tranquil Rapti River and the entrance to Chitwan National Park.",
    icon: "MapPin"
  },
  {
    id: "h2",
    title: "Attentive Hospitality",
    description: "Experience genuine, warm Nepalese hospitality from our dedicated local staff who are always here to make you feel right at home.",
    icon: "Heart"
  },
  {
    id: "h3",
    title: "Wildlife Adventure",
    description: "We easily arrange exciting jungle walks, canoe rides, and guided safaris right from our front desk.",
    icon: "Leaf"
  }
];

export const ROOMS_DATA: Room[] = [
  {
    id: "deluxe-double",
    name: "Deluxe Garden Sanctuary",
    description: "Perfect for couples seeking a refined, tranquil retreat. Spacious air-conditioned layout with artisan solid teak timber accents, a cozy write-up desk, private balcony, and state-of-the-art secure entrance, looking onto our beautiful orchid gardens.",
    image: HOTEL_INFO.images.roomDeluxe,
    basePriceNPR: 2097,
    capacity: 2,
    amenities: [
      "Secured Smart Code lock",
      "Premium Orthopedic Mattress",
      "24/7 Fire & Security Surveillance",
      "Solid Teakwood Sound-Dampened Doors",
      "Double Glazed Noise-Reducing Windows",
      "Free Wi-Fi",
      "Hot and cold shower 24/7"
    ],
    bedType: "1 Queen Size Bed",
    size: "26 m²"
  },
  {
    id: "family-suite",
    name: "Orchid Gold Family Suite",
    description: "An incredibly spacious haven designed for families or travel companions. Boasts highly-secured triple bedding installations, robust safety fixtures, elegant seating space, full glass window view of beautiful national park trees, and curated local art.",
    image: HOTEL_INFO.images.roomSuite,
    basePriceNPR: 2317,
    capacity: 3,
    amenities: [
      "Secured Smart Code lock",
      "Double Premium Orthopedic Mattresses",
      "24/7 Fire & Security Surveillance",
      "Solid Teakwood Sound-Dampened Doors",
      "Enhanced Safe & Privacy Guard Systemed Balcony",
      "Free Wi-Fi",
      "Hot and cold shower 24/7"
    ],
    bedType: "1 Double Bed & 1 Single Bed",
    size: "38 m²"
  }
];

export const KEY_AMENITIES: AmenityItem[] = [
  {
    id: "am-security",
    name: "Premium Comfort & Absolute Security",
    description: "We focus on a tranquil experience by prioritizing your deep sleep and complete peace of mind.",
    iconName: "Shield"
  }
];

export const FREE_AMENITIES: AmenityItem[] = [
  {
    id: "pk",
    name: "Free Parking",
    description: "Free and safe parking space for your motorbikes and cars.",
    iconName: "Car",
    isFree: true
  },
  {
    id: "bf",
    name: "Warm Breakfast",
    description: "Delicious warm breakfast served fresh every morning.",
    iconName: "Coffee",
    isFree: false
  },
  {
    id: "wf",
    name: "Free Fast Wi-Fi",
    description: "Free fast internet in all rooms and the garden.",
    iconName: "Wifi",
    isFree: true
  },
  {
    id: "ap",
    name: "Airport & Bus Pickup",
    description: "Easy pickup and drop-off service from the airport or bus station.",
    iconName: "Plane",
    isFree: false
  }
];

export const GALLERY_SLIDES = [
  {
    id: "gal-1",
    image: HOTEL_INFO.images.hero,
    title: "Hotel Orchid Exterior",
    caption: "A peaceful retreat seamlessly blending modern luxury with traditional Nepalese architecture, surrounded by lush landscaped gardens."
  },
  {
    id: "gal-2",
    image: HOTEL_INFO.images.roomDeluxe,
    title: "Deluxe Sanctuaries",
    caption: "Meticulously designed interior layout curated with natural woods and sound-insulating comfort barriers."
  },
  {
    id: "gal-3",
    image: HOTEL_INFO.images.restaurant,
    title: "Elegant Dining Experience",
    caption: "Our restaurant combines serene garden vistas with a wide range of artisanal multi-cuisine selections."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Elena Petrova",
    location: "Sofia, Bulgaria",
    rating: 5,
    content: "The best stay in Nepal! Hotel Orchid Sauraha is extremely safe and stylish. The wood interiors are gorgeous, security is state-of-the-art, and the bed made us sleep like babies. Very near to the main safari bookings too!",
    avatarLetter: "E"
  },
  {
    id: "t2",
    author: "Rajesh Shrestha",
    location: "Kathmandu, Nepal",
    rating: 5,
    content: "I regularly travel to Sauraha for work and stay. This has become my absolute favorite base. Exceptional warmth from the staff, the smart room lock was super convenient, and the high-speed wifi allowed me to take zoom calls flawlessly from the garden.",
    avatarLetter: "R"
  },
  {
    id: "t3",
    author: "Clara & Tom",
    location: "Munich, Germany",
    rating: 5,
    content: "We felt incredibly pampered here. The airport transfer service was seamless, and the warm breakfast was cooked to perfection. Orchid is an absolute peace haven in Sauraha!",
    avatarLetter: "C"
  },
  {
    id: "t4",
    author: "Aarav Mehta",
    location: "Mumbai, India",
    rating: 5,
    content: "A truly magical stay at Hotel Orchid Sauraha! The level of hospitality is outstanding, and the rooms are modern and comfortable. Getting to the jungle safari point was incredibly convenient. We highly recommend this gem!",
    avatarLetter: "A"
  },
  {
    id: "t5",
    author: "Anjali Thapa",
    location: "Pokhara, Nepal",
    rating: 5,
    content: "Simply fantastic! Elegant designs, pristine cleanliness, and highly professional local service. The serene garden area is perfect for winding down after a day of spotting rhinos in the wild.",
    avatarLetter: "A"
  },
  {
    id: "t6",
    author: "Chen Wei",
    location: "Beijing, China",
    rating: 5,
    content: "Very clean, quiet, and peaceful. The staff was extremely helpful in arranging our local safari tours. Secure room access and perfect service. Five stars!",
    avatarLetter: "C"
  }
];

export const ACTIVITIES_DATA: Activity[] = [
  {
    id: "act-1",
    name: "Jungle Walk",
    description: "Explore the deep forests of Chitwan National Park on foot with our expert local naturalists. Get up close with exotic bird species, monkeys, flora, and possibly observe the rare One-Horned Rhinoceros from a safe distance.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "act-2",
    name: "Jeep Safari",
    description: "Embark on an exciting 4x4 offroad adventure deep into the heart of the jungle. Our structured safari routes offer high-probability wildlife viewings, including wild boar, deer, leopards, and the majestic Bengal Tiger.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "act-3",
    name: "Tharu Culture Dance",
    description: "Experience the colorful heritage of the indigenous Tharu community. Enjoy a vibrant evening of traditional music, spectacular stick dances, and fire performances that portray their deep cultural connection to nature.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200"
  }
];

export const DEFAULT_OWNER_INFO: OwnerInfo = {
  name: "Jit Bahadur Tamang (jitu)",
  role: "Founder & Passionate Owner",
  photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
  description: "Jit Bahadur Tamang (lovingly known as Jitu) is the founder of Hotel Orchid and a dedicated pioneer in Sauraha's wildlife conservation and community tourism.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  twitterUrl: "https://twitter.com",
  tripadvisorUrl: "https://tripadvisor.com",
  youtubeUrl: "https://youtube.com",
  achievements: [
    {
      id: "ach-1",
      period: "2062 to 2066",
      title: "Nature Guide Association, Chitwan",
      role: "President",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "ach-2",
      period: "2068 to 2069",
      title: "Tiger Conservation Sub-committee",
      role: "President",
      image: "https://images.unsplash.com/photo-1602491453977-14a022988d21?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "ach-3",
      period: "2074 to 2080",
      title: "Baghmara Bufferzone Community Forest",
      role: "President",
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "ach-4",
      period: "2080 to Now",
      title: "Regional Hotel Association Nepal, Chitwan",
      role: "Active Member",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "ach-5",
      period: "2082 to Now",
      title: "Sauraha Community Development & Youth Education",
      role: "Advisor & Primary Sponsor",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=300"
    }
  ]
};


