'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@/lib/artwork';

interface GalleryNavigationProps {
  currentCategory: string;
}

export default function GalleryNavigation({ currentCategory }: GalleryNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const otherCategories = CATEGORIES.filter(cat => cat !== currentCategory);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Current Category Display */}
      <div className="font-inter font-medium text-sm tracking-widest text-black/90 cursor-pointer">
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
                key={category}
                href={`/gallery/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-3 text-sm font-medium tracking-wider text-black/80 hover:text-black hover:bg-black/10 transition-colors duration-100 first:rounded-t-sm last:rounded-b-sm"
              >
                {category}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}