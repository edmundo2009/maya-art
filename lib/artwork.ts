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
  '1. Artist Monologues',
  '2. Quest for Infinity', 
  '3. Weather Report',
  '4. Bubble Moon'
];