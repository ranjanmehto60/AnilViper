export interface GalleryItem {
  id: string;
  title: string;
  category: "Tournaments" | "Dojangs" | "Behind The Scenes";
  imageUrl: string;
  location: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "National Taekwondo Championship 2026",
    category: "Tournaments",
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop",
    location: "Indira Gandhi Arena, New Delhi"
  },
  {
    id: "gal-2",
    title: "Elite Black Belt Sparring Camp",
    category: "Dojangs",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    location: "Viper Training Hub, Chattarpur Delhi"
  },
  {
    id: "gal-3",
    title: "Precision Stitching & Fabric Testing",
    category: "Behind The Scenes",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    location: "Manufacturing Unit, Chattarpur, Delhi"
  },
  {
    id: "gal-4",
    title: "All-India Junior Poomsae Cup",
    category: "Tournaments",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    location: "Bangalore Indoor Stadium"
  },
  {
    id: "gal-5",
    title: "Viper Champions Academy Group Photo",
    category: "Dojangs",
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop",
    location: "South Delhi Academy"
  },
  {
    id: "gal-6",
    title: "Laser Cutting & Quality Inspection",
    category: "Behind The Scenes",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    location: "Chattarpur Workshop, Delhi"
  }
];
