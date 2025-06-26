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
  onIndexChange?: (index: number) => void;
}

export default function ArtworkViewer({ artworks, initialIndex, categoryName, onIndexChange }: ArtworkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const currentArtwork = artworks[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === artworks.length - 1;

  const navigateToImage = useCallback((newIndex: number, dir: number) => {
    if (newIndex >= 0 && newIndex < artworks.length) {
      setImageLoading(true); // Set loading state when changing images
      setDirection(dir);
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [artworks.length, onIndexChange]);

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

  // Touch/swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Sync currentIndex when initialIndex changes (URL navigation)
  useEffect(() => {
    if (initialIndex !== currentIndex) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, currentIndex]);

  // Enhanced keyboard navigation (left/right/up/down arrows)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Enhanced preloading strategy with cache warming
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const preloadAdjacentImages = async () => {
      const preloadPromises: Promise<any>[] = [];
      const preloadRange = 5; // Preload 5 images in each direction

      // Preload previous images (up to 5)
      for (let i = 1; i <= preloadRange && currentIndex - i >= 0; i++) {
        const prevArtwork = artworks[currentIndex - i];
        preloadPromises.push(
          preloadImage(`/artwork/${prevArtwork.category}/${prevArtwork.filename}`)
        );
      }

      // Preload next images (up to 5)
      for (let i = 1; i <= preloadRange && currentIndex + i < artworks.length; i++) {
        const nextArtwork = artworks[currentIndex + i];
        preloadPromises.push(
          preloadImage(`/artwork/${nextArtwork.category}/${nextArtwork.filename}`)
        );
      }

      try {
        await Promise.allSettled(preloadPromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadAdjacentImages();
  }, [currentIndex, artworks]);

  // Cache warming: Preload first 8 images on gallery entry
  useEffect(() => {
    const cacheWarmingCount = 8;
    
    const warmCache = async () => {
      const warmingPromises: Promise<any>[] = [];
      
      for (let i = 0; i < Math.min(cacheWarmingCount, artworks.length); i++) {
        const artwork = artworks[i];
        warmingPromises.push(
          new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = `/artwork/${artwork.category}/${artwork.filename}`;
          })
        );
      }

      try {
        await Promise.allSettled(warmingPromises);
        console.log(`Cache warmed: ${Math.min(cacheWarmingCount, artworks.length)} images preloaded`);
      } catch (error) {
        console.warn('Cache warming failed for some images:', error);
      }
    };

    // Only warm cache once when component mounts
    warmCache();
  }, [artworks]); // Only depend on artworks, not currentIndex

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
    <div 
      className="fixed inset-0 bg-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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

      {/* Image Counter - positioned above category navigation */}
      <div className="absolute top-0 right-6 z-20 -mb-4 flex justify-center">
        <span className="text-black/70 text-[16.8px] font-normal tracking-wide">
          {currentIndex + 1} / {artworks.length}
        </span>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={`/artwork/${currentArtwork.category}/${currentArtwork.filename}`}
            alt={currentArtwork.alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain transform-gpu transition-transform transition-opacity duration-500 ease-out will-change-transform"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EACQQAAIBAwMEAwEAAAAAAAAAAAECAwAEEQUSITFBUWETInGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAAAAQIRAf/aAAwDAQACEQMRAD8A2bK2jtraOCJdqRqFUewqSo7aXzbeOTGNyg4qSgAooooAKKKKACiiigD/2Q=="
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile, category-specific positioning on larger screens */}
      {!isFirst && (
        <button
          onClick={goToPrevious}
          className={`hidden md:block absolute z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200 ${
            categoryName === 'Artist Monologues' 
              ? 'left-[25%] top-6' 
              : 'left-6 top-1/2 -translate-y-1/2'
          }`}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {!isLast && (
        <button
          onClick={goToNext}
          className={`hidden md:block absolute z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200 ${
            categoryName === 'Artist Monologues' 
              ? 'left-[75%] top-6' 
              : 'right-6 top-1/2 -translate-y-1/2'
          }`}
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

    </div>
  );
}