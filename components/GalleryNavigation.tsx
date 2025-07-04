'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryNavigationProps {
  currentCategory: string;
}

// Static category data for client-side navigation
const NAVIGATION_CATEGORIES = [
  { name: 'Artist Monologues', slug: 'artist-monologues' },
  { name: 'Quest for Infinity', slug: 'quest-for-infinity' },
  { name: 'Weather Report', slug: 'weather-report' },
  { name: 'Bubble Moon', slug: 'bubble-moon' }
];

export default function GalleryNavigation({ currentCategory }: GalleryNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const otherCategories = NAVIGATION_CATEGORIES.filter(cat => cat.name !== currentCategory);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 150); // Small delay to prevent flickering
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current Category Display */}
      <div className="font-inter font-medium text-sm tracking-widest text-black/90 hover:text-black hover:bg-black/10 px-3 py-2 rounded transition-colors duration-200 cursor-pointer">
        {currentCategory}
      </div>

      {/* Expanded Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 bg-white/90 backdrop-blur-sm rounded-sm min-w-48 shadow-lg border border-gray-200"
          >
            {otherCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/gallery/${category.slug}`}
                className="block px-4 py-3 text-sm font-medium tracking-wider text-black/80 hover:text-black hover:bg-black/10 transition-colors duration-100 first:rounded-t-sm last:rounded-b-sm"
              >
                {category.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}