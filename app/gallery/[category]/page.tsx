import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/artwork-server';
import ArtworkViewer from '@/components/ArtworkViewer';

interface GalleryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    image?: string;
  };
}

export default function GalleryPage({ params, searchParams }: GalleryPageProps) {
  const category = getCategoryBySlug(params.category);
  
  if (!category || category.artworks.length === 0) {
    notFound();
  }

  // Determine initial image index
  let initialIndex = 0;
  if (searchParams.image) {
    const imageIndex = parseInt(searchParams.image) - 1;
    if (imageIndex >= 0 && imageIndex < category.artworks.length) {
      initialIndex = imageIndex;
    }
  }

  return (
    <ArtworkViewer
      artworks={category.artworks}
      initialIndex={initialIndex}
      categoryName={category.name}
    />
  );
}

export async function generateStaticParams() {
  const categories = ['artist-monologues', 'quest-for-infinity', 'bubble-moon', 'weather-report'];
  return categories.map((category) => ({
    category,
  }));
}