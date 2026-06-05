/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Room, Testimonial, AmenityItem } from './types';

export const HOTEL_INFO = {
  name: "Hotel Orchid",
  subName: "Sauraha, Chitwan",
  tagline: "Your peaceful retreat in the heart of Sauraha",
  location: "Ratnanagar 44200, Chitwan, Nepal",
  address: "Ratnanagar 44200, Sauraha, Chitwan, Nepal",
  phone: "984-5523412",
  email: "stay@hotelorchidsauraha.com",
  about: "Discover the charm of Chitwan at Hotel Orchid Sauraha, where elegant comfort meets natural beauty. Enjoy spacious rooms, attentive hospitality, and a prime location close to the region's most popular attractions, creating the perfect base for your unforgettable Nepal adventure.",
  images: {
    hero: "/src/assets/images/hero_orchid_1780650357754.png",
    roomDeluxe: "/src/assets/images/room_deluxe_1780650380249.png",
    roomSuite: "/src/assets/images/room_suite_1780650397324.png",
    restaurant: "/src/assets/images/restaurant_orchid_1780650414208.png"
  }
};

export const HOTEL_HIGHLIGHTS = [
  {
    id: "h1",
    title: "Prime Sauraha Location",
    description: "Nestled quietly just minutes walking from the Sauraha Rapti riverbank, beautiful tourist streets, and Chitwan National Park main entrance.",
    icon: "MapPin"
  },
  {
    id: "h2",
    title: "Attentive Hospitality",
    description: "Our dedicated local team treats you like family, ensuring customized itinerary suggestions and professional care around the clock.",
    icon: "Heart"
  },
  {
    id: "h3",
    title: "Eco-Luxe Comfort",
    description: "Immerse in nature without sacrificing comfort. Our architectural design blends high-end solid woodwork with cooling ventilation systems.",
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
      "Double Glazed Noise-Reducing Windows"
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
      "Enhanced Safe & Privacy Guard Systemed Balcony"
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
    name: "Free Secure Parking",
    description: "Spacious on-site secure parking for motorbikes and private tourist coaches.",
    iconName: "Car"
  },
  {
    id: "bf",
    name: "Complimentary Breakfast",
    description: "Chef-curated warm buffet and custom ordered Nepalese structure breakfast each morning.",
    iconName: "Coffee"
  },
  {
    id: "wf",
    name: "High-Speed Wi-Fi",
    description: "Blazing fast fiber internet coverage available both inside rooms and in public gardens.",
    iconName: "Wifi"
  },
  {
    id: "ap",
    name: "Airport Transfer",
    description: "Free pickup and drop assistance from Bharatpur Airport or Sauraha Tourist Bus Park.",
    iconName: "Plane"
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
    content: "We felt incredibly pampered here. The airport transfer was seamless, and the complimentary breakfast was cooked to perfection. Orchid is an absolute peace haven in Sauraha!",
    avatarLetter: "C"
  }
];
