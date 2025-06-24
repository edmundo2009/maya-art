'use client';

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
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-white/85 backdrop-blur-sm flex items-center justify-center
          group-hover:bg-white/60
          transition-colors duration-300 ease-in-out
        ">
          <p className="text-xs font-medium tracking-widest text-gray-700 text-center px-2">
            {category}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}


// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// interface ThumbnailProps {
//   category: string;
//   slug: string;
//   imageSrc: string;
//   alt: string;
// }

// export default function Thumbnail({ category, slug, imageSrc, alt }: ThumbnailProps) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       transition={{ duration: 0.2, ease: 'easeOut' }}
//       className="group w-full"
//     >
//       <Link 
//         href={`/gallery/${slug}`}
//         className="block relative aspect-[3/4] overflow-hidden"
//       >
//         <Image
//           src={imageSrc}
//           alt={alt}
//           fill
//           className="object-cover"
//           sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
//         />
        
//         {/* Text Overlay */}
//         {/* <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-white/85 backdrop-blur-sm flex items-center justify-center">
//           <p className="text-center font-medium text-gray-700 px-2 text-[11px] tracking-wider md:text-xs lg:text-sm lg:tracking-widest">
//             {category}
//           </p>
//         </div> */}
//         <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-white/85 backdrop-blur-sm flex items-center justify-center">
//           {/*
//             THE FIX IS HERE: We are using specific classes for each breakpoint.
//             This gives us absolute control and prevents wrapping.
//           */}
//           <p className="
//             text-center font-medium text-gray-700 px-2
            
//             /* Base size for mobile (and default) */
//             text-[11px] tracking-wider
            
//             /* Tablet size (2x2 grid) */
//             md:text-sm
            
//             /* Large Desktop size (4-col grid) */
//             lg:text-[14px] lg:tracking-widest
//           ">
//             {category}
//           </p>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }