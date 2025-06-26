'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ThumbnailProps {
  category: string;
  slug: string;
  imageSrc: string;
  alt: string;
}

export default function Thumbnail({ category, slug, imageSrc, alt }: ThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group w-full"
    >
      <Link 
        href={`/gallery/${slug}`}
        className="block relative aspect-[3/4] overflow-hidden"
      >
        {!hasError ? (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className={`object-cover transform-gpu transition-transform transition-opacity duration-500 ease-out will-change-transform ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EACQQAAIBAwMEAwEAAAAAAAAAAAECAwAEEQUSITFBUWETInGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAAAAQIRAf/aAAwDAQACEQMRAD8A2bK2jtraOCJdqRqFUewqSo7aXzbeOTGNyg4qSgAooooAKKKKACiiigD/2Q=="
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 text-sm text-center p-4">
              <div className="mb-2">Image not found</div>
              <div className="text-xs opacity-75">{category}</div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
      </Link>
    </motion.div>
  );
}