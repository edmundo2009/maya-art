export interface ArtworkItem {
  id: string;
  category: string;
  filename: string;
  alt: string;
}

export interface Category {
  name: string;
  slug: string;
  artworks: ArtworkItem[];
}

export const CATEGORIES = [
  'ARTIST MONOLOGUES',
  'QUEST FOR INFINITY',
  'BUBBLE MOON',
  'WEATHER REPORT'
];