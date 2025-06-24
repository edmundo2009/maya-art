// import { getArtworkData } from '@/lib/artwork-server';
// import Thumbnail from '@/components/Thumbnail';

// export default function HomePage() {
//   const categories = getArtworkData();

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-8 md:p-16 lg:p-24">
//       <div className="w-full max-w-7xl">
//         {/* Block 1: Artist Name */}
//         <h1 className="font-playfair text-4xl font-light tracking-[0.35em] text-gray-900 md:text-5xl lg:text-6xl">
//           MAYA LAMA
//         </h1>
        
//         {/* Block 2: Content Row */}
//         <div className="mt-24 flex flex-col lg:mt-32 lg:flex-row lg:items-start lg:gap-16">
//           {/* Part A: THEMES Label */}
//           <h2 className="mb-8 font-playfairi text-base font-semibold tracking-widest text-gray-500 lg:mb-0">
//             THEMES
//           </h2>
          
//           {/* Part B: Thumbnail Grid */}
//           <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             {categories.map((category) => (
//               <Thumbnail
//                 key={category.slug}
//                 category={category.name}
//                 slug={category.slug}
//                 imageSrc={`/artwork/thumbnail-placeholder.jpg`} // Ensure this is the correct placeholder
//                 alt={`${category.name} collection thumbnail`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ---------------
import { getArtworkData } from '@/lib/artwork-server';
import Thumbnail from '@/components/Thumbnail';

export default function HomePage() {
  const categories = getArtworkData();

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-neutral-100 p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-7xl">
        {/* Block 1: Artist Name */}
        <h1 className="font-playfair text-4xl font-light tracking-[0.2em] text-gray-800 md:text-5xl lg:text-6xl">
          MAYA LAMA
        </h1>
        
        {/* Block 2: Content Row */}
        <div className="mt-8 flex flex-col lg:mt-24 lg:flex-row lg:items-start lg:gap-16">
          {/* Part A: THEMES Label */}
          <h2 className="mb-8 font-playfair text-2xl font-normal tracking-widest text-black lg:mb-0">
            THEMES
          </h2>
          
          {/* Part B: Thumbnail Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Thumbnail
                key={category.slug}
                category={category.name}
                slug={category.slug}
                imageSrc={`/artwork/thumbnail-placeholder.jpg`}
                alt={`${category.name} collection thumbnail`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}