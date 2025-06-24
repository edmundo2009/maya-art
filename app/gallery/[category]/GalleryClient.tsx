'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ArtworkViewer from '@/components/ArtworkViewer';
import type { ArtworkItem } from '@/lib/artwork';

interface GalleryClientProps {
  artworks: ArtworkItem[];
  categoryName: string;
  categorySlug: string;
}

export default function GalleryClient({ artworks, categoryName, categorySlug }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Determine initial image index from URL params
  const initialIndex = useMemo(() => {
    const imageParam = searchParams.get('image');
    if (imageParam) {
      const imageIndex = parseInt(imageParam) - 1;
      if (imageIndex >= 0 && imageIndex < artworks.length) {
        return imageIndex;
      }
    }
    return 0;
  }, [searchParams, artworks.length]);

  // Update URL when image changes
  const handleIndexChange = useCallback((newIndex: number) => {
    const imageNumber = newIndex + 1;
    const newURL = `/gallery/${categorySlug}?image=${imageNumber}`;
    router.replace(newURL, { scroll: false });
  }, [categorySlug, router]);

  return (
    <ArtworkViewer
      artworks={artworks}
      initialIndex={initialIndex}
      categoryName={categoryName}
      onIndexChange={handleIndexChange}
    />
  );
}