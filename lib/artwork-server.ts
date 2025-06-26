import fs from 'fs';
import path from 'path';
import { ArtworkItem, Category, CATEGORIES } from './artwork';

export function getArtworkData(): Category[] {
  const artworkDir = path.join(process.cwd(), 'public/artwork');
  
  return CATEGORIES.map(categoryName => {
    const categoryPath = path.join(artworkDir, categoryName);
    // Create clean slug from the display name (remove number prefix)
    const displayName = categoryName.replace(/^\d+\.\s*/, '');
    const slug = displayName.toLowerCase().replace(/\s+/g, '-');
    
    let artworks: ArtworkItem[] = [];
    
    try {
      const files = fs.readdirSync(categoryPath);
      artworks = files
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .sort()
        .map((filename, index) => ({
          id: `${slug}-${index + 1}`,
          category: categoryName,
          filename,
          alt: `Artwork from the ${displayName} series, number ${index + 1}`,
        }));
    } catch (error) {
      console.warn(`Could not read directory for ${categoryName}:`, error);
    }
    
    return {
      name: displayName, // Use clean display name without number prefix
      slug,
      artworks,
    };
  });
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getArtworkData();
  return categories.find(cat => cat.slug === slug);
}