import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/artwork-server';
import GalleryClient from './GalleryClient';

interface GalleryPageProps {
  params: {
    category: string;
  };
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const category = getCategoryBySlug(params.category);
  
  if (!category || category.artworks.length === 0) {
    notFound();
  }

  return (
    <GalleryClient
      artworks={category.artworks}
      categoryName={category.name}
      categorySlug={category.slug}
    />
  );
}

export async function generateStaticParams() {
  const categories = ['artist-monologues', 'quest-for-infinity', 'bubble-moon', 'weather-report'];
  return categories.map((category) => ({
    category,
  }));
}