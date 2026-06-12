/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  basePriceNPR: number;
  capacity: number;
  amenities: string[];
  bedType: string;
  size: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  content: string;
  avatarLetter: string;
}

export interface AmenityItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isFree?: boolean;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface BookingDetails {
  name: string;
  emailOrPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequests: string;
}

export interface OwnerAchievement {
  id: string;
  period: string;
  title: string;
  role: string;
  image: string;
}

export interface OwnerInfo {
  name: string;
  role: string;
  photo: string;
  description: string;
  achievements: OwnerAchievement[];
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
}
