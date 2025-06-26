'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [lastNavigationTime, setLastNavigationTime] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(initialIndex);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const [mouseTimer, setMouseTimer] = useState<NodeJS.Timeout | null>(null);
  
  const currentArtwork = artworks[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === artworks.length - 1;

  const navigateToImage = useCallback((newIndex: number, dir: number) => {
    if (newIndex >= 0 && newIndex < artworks.length) {
      const now = Date.now();
      const timeSinceLastNav = now - lastNavigationTime;
      
      // If navigating too rapidly (less than 100ms), skip animation
      const shouldSkipAnimation = timeSinceLastNav < 100;
      setSkipAnimation(shouldSkipAnimation);
      setLastNavigationTime(now);
      
      setImageLoading(true);
      setDirection(dir);
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [artworks.length, onIndexChange, lastNavigationTime]);

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
      setDisplayIndex(initialIndex);
    }
  }, [initialIndex, currentIndex]);

  // Debounced display index update to prevent number flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayIndex(currentIndex);
    }, skipAnimation ? 0 : 30); // Immediate for rapid nav, slight delay for smooth nav

    return () => clearTimeout(timer);
  }, [currentIndex, skipAnimation]);

  // Mouse movement and click detection for nav button visibility
  useEffect(() => {
    const handleMouseActivity = () => {
      // Show buttons immediately on mouse movement or click
      setShowNavButtons(true);
      
      // Clear existing timer
      if (mouseTimer) {
        clearTimeout(mouseTimer);
      }
      
      // Set new timer to hide buttons after 1 second of no activity
      const newTimer = setTimeout(() => {
        setShowNavButtons(false);
      }, 1000);
      
      setMouseTimer(newTimer);
    };

    // Add both mouse move and click listeners to the document
    document.addEventListener('mousemove', handleMouseActivity);
    document.addEventListener('click', handleMouseActivity);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseActivity);
      document.removeEventListener('click', handleMouseActivity);
      if (mouseTimer) {
        clearTimeout(mouseTimer);
      }
    };
  }, [mouseTimer]);

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

  // Scroll wheel navigation
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      // Determine scroll direction
      if (event.deltaY > 0) {
        // Scrolling down/away = next image
        goToNext();
      } else if (event.deltaY < 0) {
        // Scrolling up/towards = previous image
        goToPrevious();
      }
    };

    // Add wheel listener to the document
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
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

  // Optimized variants for fast navigation - no blur, just opacity
  const slideVariants = {
    enter: () => ({
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: () => ({
      zIndex: 0,
      opacity: 0,
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
        {/* HOME Link - with mouse activity visibility */}
        <Link
          href="/"
          className={`font-inter font-medium text-sm tracking-widest text-black/90 hover:text-black hover:bg-black/10 px-3 py-2 rounded transition-all duration-300 ${
            showNavButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          HOME
        </Link>
        
        {/* Category Navigation - always visible */}
        <GalleryNavigation currentCategory={categoryName} />
      </div>

      {/* Image Counter - positioned above category navigation */}
      <div className="absolute top-0 right-6 z-20 -mb-4 flex justify-center">
        <span className="font-inter font-medium text-sm tracking-widest text-black/90 transition-none">
          {displayIndex + 1} / {artworks.length}
        </span>
      </div>

      {/* Main Image Container - Framer Motion with rapid navigation handling */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="sync">
          <motion.div
            key={`${currentArtwork.category}-${currentArtwork.filename}`}
            variants={slideVariants}
            initial={skipAnimation ? "center" : "enter"}
            animate="center"
            exit={skipAnimation ? "center" : "exit"}
            transition={{
              duration: skipAnimation ? 0 : 0.05,
              ease: "linear",
            }}
            className="w-full h-full flex items-center justify-center absolute inset-0"
          >
            <Image
              src={`/artwork/${currentArtwork.category}/${currentArtwork.filename}`}
              alt={currentArtwork.alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
              priority
              quality={85}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Hidden on mobile, show/hide based on mouse activity */}
      {!isFirst && (
        <button
          onClick={goToPrevious}
          className={`hidden md:block absolute z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200 transition-opacity duration-300 ${
            categoryName === 'Artist Monologues' 
              ? 'left-[25%] top-6' 
              : 'left-6 top-1/2 -translate-y-1/2'
          } ${showNavButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7 drop-shadow-md" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))' }} />
        </button>
      )}

      {!isLast && (
        <button
          onClick={goToNext}
          className={`hidden md:block absolute z-20 p-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full text-black/80 hover:text-black shadow-lg border border-gray-200 transition-opacity duration-300 ${
            categoryName === 'Artist Monologues' 
              ? 'left-[75%] top-6' 
              : 'right-6 top-1/2 -translate-y-1/2'
          } ${showNavButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7 drop-shadow-md" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))' }} />
        </button>
      )}

    </div>
  );
}