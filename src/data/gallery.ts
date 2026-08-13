export type GalleryCategory = "Lookbook" | "Details" | "Belts";

export interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/gallery/gallery-02.webp",
    alt: "Front view of a taekwondo uniform on an athlete",
    title: "Competition front",
    category: "Lookbook",
  },
  {
    src: "/images/gallery/gallery-01.webp",
    alt: "Back view of a taekwondo uniform on an athlete",
    title: "India on the back",
    category: "Lookbook",
  },
  {
    src: "/images/gallery/gallery-03.webp",
    alt: "Full-length side view of a taekwondo uniform",
    title: "Full-length fit",
    category: "Lookbook",
  },
  {
    src: "/images/gallery/gallery-07.webp",
    alt: "Athlete demonstrating movement in a taekwondo uniform",
    title: "Made to move",
    category: "Lookbook",
  },
  {
    src: "/images/gallery/gallery-04.webp",
    alt: "Athlete wearing a taekwondo uniform in a ready stance",
    title: "Ready stance",
    category: "Lookbook",
  },
  {
    src: "/images/gallery/gallery-05.webp",
    alt: "Close-up of a taekwondo uniform collar and chest detail",
    title: "Collar detail",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-06.webp",
    alt: "Back construction detail of a taekwondo uniform",
    title: "Back construction",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-08.webp",
    alt: "Taekwondo uniform laid out as a complete set",
    title: "The complete set",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-09.webp",
    alt: "Front detail of a lightweight taekwondo uniform",
    title: "Lightweight build",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-10.webp",
    alt: "White taekwondo trousers hanging for display",
    title: "Trouser detail",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-11.webp",
    alt: "Close-up of a taekwondo uniform neckline",
    title: "Clean finish",
    category: "Details",
  },
  {
    src: "/images/gallery/gallery-12.webp",
    alt: "Black taekwondo belts arranged for display",
    title: "Belt texture",
    category: "Belts",
  },
  {
    src: "/images/gallery/gallery-13.webp",
    alt: "Close-up of a black taekwondo belt",
    title: "Reinforced weave",
    category: "Belts",
  },
  {
    src: "/images/gallery/gallery-14.webp",
    alt: "Close-up of a black taekwondo belt label",
    title: "Built for the grade",
    category: "Belts",
  },
];
