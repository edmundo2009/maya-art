'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import GalleryNavigation from './GalleryNavigation';
import type { ArtworkItem } from '@/lib/artwork';

interface ArtworkViewerProps {
  artworks: ArtworkItem[];
  initialIndex: number;
  categoryName: string;
}

export default function ArtworkViewer({ artworks, initialIndex, categoryName }: ArtworkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  
  const currentArtwork = artworks[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === artworks.length - 1;

  const navigateToImage = useCallback((newIndex: number, dir: number) => {
    if (newIndex >= 0 && newIndex < artworks.length) {
      setDirection(dir);
      setCurrentIndex(newIndex);
    }
  }, [artworks.length]);

  const goToPrevious = useCallback(() => {
    if (!isFirst) {
      navigateToImage(currentIndex - 1, -1);
    }
  }, [currentIndex, isFirst, navigateToImage]);

  const goToNext = useCallback(() => {
    if (!isLast) {
      navigateToImage(currentIndex + 1, 1);
    }
  }, [currentIndex, isLast, navigateToImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Preload adjacent images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    // Preload previous image
    if (currentIndex > 0) {
      const prevArtwork = artworks[currentIndex - 1];
      preloadImage(`/artwork/${prevArtwork.category}/${prevArtwork.filename}`);
    }

    // Preload next image
    if (currentIndex < artworks.length - 1) {
      const nextArtwork = artworks[currentIndex + 1];
      preloadImage(`/artwork/${nextArtwork.category}/${nextArtwork.filename}`);
    }
  }, [currentIndex, artworks]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-6">
        {/* HOME Link */}
        <Link
          href="/"
          className="font-inter font-medium text-sm tracking-widest text-black/90 hover:text-black hover:bg-black/10 px-3 py-2 rounded transition-colors duration-200"
        >
          HOME
        </Link>
        
        {/* Category Navigation */}
        <GalleryNavigation currentCategory={categoryName} />
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={`/artwork/${currentArtwork.category}/${currentArtwork.filename}`}
            alt={currentArtwork.alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain"
            priority
            quality={95}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {!isFirst && (
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {!isLast && (
        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50">
        <span className="text-black/70 text-xs font-normal tracking-wide">
          {currentIndex + 1} / {artworks.length}
        </span>
      </div>
    </div>
  );
}